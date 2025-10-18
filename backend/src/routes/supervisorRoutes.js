import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Supervisor from "../models/Supervisor.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getSupervisorProfile, updateSupervisorProfile, getAllSupervisors } from "../controllers/supervisorController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create directories
const uploadsDir = path.join(__dirname, "../../uploads/supervisors");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const profileImagesDir = path.join(__dirname, "../../uploads/supervisors/profileImages");
if (!fs.existsSync(profileImagesDir)) fs.mkdirSync(profileImagesDir, { recursive: true });

// Multer for non-image files (CVs/transcripts)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const fieldName = file.fieldname === "transcripts" ? "transcript" : file.fieldname;
    cb(null, `${fieldName}-${uniqueSuffix}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 12 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) cb(null, true);
    else cb(new Error(`Invalid file type: ${file.originalname}`));
  },
});
export const uploadFields = upload.fields([
  { name: "cvFile", maxCount: 1 },
  { name: "transcripts", maxCount: 10 },
]);

// Multer for profile image (single)
const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, profileImagesDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const uploadProfileImageMiddleware = multer({
  storage: profileImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Invalid image type. Only JPG/PNG/GIF allowed.'));
  }
}).single('profileImage');

// Helper cleanup
const cleanupFiles = (files) => {
  if (!files) return;
  Object.values(files).flat().forEach((file) => {
    if (file && file.path && fs.existsSync(file.path)) {
      try { fs.unlinkSync(file.path); } catch (err) { console.error("Cleanup failed:", err); }
    }
  });
};

const generateToken = (supervisor) =>
  jwt.sign(
    { id: supervisor._id, supervisorId: supervisor._id, email: supervisor.email, role: "supervisor" },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

// ---------- Public Routes ----------
router.get('/list', getAllSupervisors);

// ---------- Register ----------
router.post("/register", uploadFields, async (req, res) => {
  try {
    const { name, email, password, phone, address, title, affiliation, experience, domains, studies } = req.body;

    if (!name || !email || !password || !title || !affiliation || !experience) {
      cleanupFiles(req.files);
      return res.status(400).json({ message: "Missing required fields." });
    }

    const expNum = parseInt(experience);
    if (isNaN(expNum) || expNum < 0 || expNum > 70) {
      cleanupFiles(req.files);
      return res.status(400).json({ message: "Experience must be between 0 and 70 years." });
    }

    const parsedDomains = typeof domains === "string" ? JSON.parse(domains) : domains;
    const parsedStudies = typeof studies === "string" ? JSON.parse(studies) : studies;

    if (!parsedDomains?.length) { cleanupFiles(req.files); return res.status(400).json({ message: "At least one domain required." }); }
    if (!parsedStudies?.length) { cleanupFiles(req.files); return res.status(400).json({ message: "At least one study required." }); }
    if (!req.files?.cvFile?.length) { cleanupFiles(req.files); return res.status(400).json({ message: "CV is required." }); }
    if ((req.files.transcripts?.length || 0) !== parsedStudies.length) { cleanupFiles(req.files); return res.status(400).json({ message: "All transcripts required." }); }

    if (await Supervisor.findOne({ email: email.toLowerCase() })) {
      cleanupFiles(req.files);
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const transcriptsMap = {};
    req.files.transcripts?.forEach((file, i) => { transcriptsMap[parsedStudies[i]] = file.path; });

    const supervisor = new Supervisor({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone?.trim(),
      address: address?.trim(),
      title: title.trim(),
      affiliation: affiliation.trim(),
      experience: expNum,
      domains: parsedDomains,
      studies: parsedStudies,
      cvFile: req.files.cvFile[0].path,
      transcripts: transcriptsMap,
    });

    await supervisor.save();

    const token = generateToken(supervisor);
    res.status(201).json({ message: "Supervisor registered successfully", supervisor: supervisor.getPrivateProfile(), token });
  } catch (error) {
    cleanupFiles(req.files);
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message || String(error) });
  }
});

// ---------- Login ----------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required." });

    const supervisor = await Supervisor.findOne({ email: email.toLowerCase() }).select('+password');
    if (!supervisor) return res.status(400).json({ success: false, message: "Invalid credentials." });

    if (supervisor.isLocked) return res.status(423).json({ message: "Account locked. Try later." });
    if (!supervisor.isActive) return res.status(403).json({ message: "Account deactivated." });

    if (!supervisor.password) return res.status(500).json({ message: "Account not properly configured." });

    const isMatch = await bcrypt.compare(password, supervisor.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials." });

    const token = generateToken(supervisor);
    res.json({ success: true, message: "Login successful", supervisor: supervisor.getPrivateProfile(), token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
});

// ---------- Get profile ----------
router.get("/profile", protect, getSupervisorProfile);

// ---------- Update profile ----------
// router.put("/profile", protect, (req, res) => {
//   uploadProfileImageMiddleware(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ success: false, message: err.message || "File upload failed" });
//     }
//     try {
//       await updateSupervisorProfile(req, res);
//     } catch (error) {
//       console.error("Profile update error:", error);
//       res.status(500).json({ success: false, message: "Failed to update profile", error: error.message });
//     }
//   });
// });


router.put("/profile", protect, uploadProfileImageMiddleware, async (req, res) => {
  try {
    await updateSupervisorProfile(req, res);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile", error: error.message });
  }
});

// Serve profile image
router.get("/profile-image/:id", async (req, res) => {
  try {
    const sup = await Supervisor.findById(req.params.id);
    if (!sup || !sup.profileImage) return res.status(404).send("Not found");
    if (sup.profileImage.data) {
      res.set('Content-Type', sup.profileImage.contentType || 'image/jpeg');
      return res.send(sup.profileImage.data);
    }
    const imagePath = sup.profileImage.path ? path.join(__dirname, "../../", sup.profileImage.path.replace(/^\//,'')) : null;
    if (imagePath && fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    }
    return res.status(404).send("Image not found");
  } catch (err) {
    console.error("profile-image error:", err);
    return res.status(500).send("Error");
  }
});

export default router;
