// // backend/routes/researcherRoutes.js
// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import fs from "fs";
// import path from "path";
// import Researcher from "../models/Researcher.js";
// import Supervision from "../models/Supervision.js";
// import multer from "multer";

// const router = express.Router();

// // ✅ Ensure folders exist
// ["uploads/researcher/cv", "uploads/researcher/transcripts"].forEach((dir) => {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// });

// // ✅ Multer configuration for CV & transcripts
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (file.fieldname === "cvFile") cb(null, "uploads/researcher/cv");
//     else if (file.fieldname === "transcripts") cb(null, "uploads/researcher/transcripts");
//     else cb(null, "uploads/researcher");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage });

// // ✅ JWT helper
// const generateToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// // ✅ Middleware to verify token
// const verifyToken = (req, res, next) => {
//   const authHeader = req.header("Authorization");
//   if (!authHeader)
//     return res.status(401).json({ message: "No token provided" });

//   const token = authHeader.replace("Bearer ", "");
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.id;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
//   cb(new Error("Only PDF and DOC files are allowed"));
// };

// const upload = multer({ 
//   storage,
//   fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 } // 10MB
// });

// // ✅ JWT helper
// const generateToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// // ✅ Middleware to verify token
// const verifyToken = (req, res, next) => {
//   const authHeader = req.header("Authorization");
//   if (!authHeader)
//     return res.status(401).json({ 
//       success: false,
//       message: "No token provided" 
//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     res.json({
//       _id: researcher._id,
//       name: researcher.fullName,
//       email: researcher.email,
//       token: generateToken(researcher._id),
//       researches: researcher.researches,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Get Researcher Profile
// router.get("/profile", verifyToken, async (req, res) => {
//   try {
//     const researcher = await Researcher.findById(req.userId).populate({
//       path: "researches",
//       populate: { path: "supervision" },
//     });

//     if (!researcher)
//       return res.status(404).json({ message: "Researcher not found" });

//     const currentSupervision = await Supervision.findOne({
//       researcher: researcher._id,
//       status: "Current",
//     }).populate("supervisor");

//     res.json({
//       researcher,
//       currentSupervision: currentSupervision || null,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Update Researcher Profile (CV & transcripts)
// router.put(
//   "/update",
//   verifyToken,
//   upload.fields([
//     { name: "cvFile", maxCount: 1 },
//     { name: "transcripts", maxCount: 5 },
//   ]),
//   async (req, res) => {
//     try {
//       const updates = { ...req.body };

//       if (req.files.cvFile) {
//         updates.cvFile = `/uploads/researcher/cv/${req.files.cvFile[0].filename}`;
//       }

//       if (req.files.transcripts) {
//         const transcriptMap = {};
//         req.files.transcripts.forEach((file) => {
//           const key = path.parse(file.originalname).name;
//           transcriptMap[key] = `/uploads/researcher/transcripts/${file.filename}`;
//         });
//         updates.transcripts = transcriptMap;
//       }

//       const researcher = await Researcher.findByIdAndUpdate(req.userId, updates, { new: true });

//       if (!researcher)
//         return res.status(404).json({ message: "Researcher not found" });

//       res.json({
//         message: "Profile updated successfully",
//         researcher,
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// export default router;

// // backend/routes/researcherRoutes.js
// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import fs from "fs";
// import path from "path";
// import Researcher from "../models/Researcher.js";
// import Supervision from "../models/Supervision.js";
// import Research from "../models/Research.js";
// import multer from "multer";

// const router = express.Router();

// // ✅ Ensure folders exist
// ["uploads/researcher/cv", "uploads/researcher/transcripts"].forEach((dir) => {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// });

// // ✅ Multer configuration for CV & transcripts
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (file.fieldname === "cvFile") cb(null, "uploads/researcher/cv");
//     else if (file.fieldname === "transcripts") cb(null, "uploads/researcher/transcripts");
//     else cb(null, "uploads/researcher");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /pdf|doc|docx/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   if (extname) {
//     return cb(null, true);
//   }
//   cb(new Error("Only PDF and DOC files are allowed"));
// };

// const upload = multer({ 
//   storage,
//   fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 } // 10MB
// });

// // ✅ JWT helper
// const generateToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// // ✅ Middleware to verify token
// const verifyToken = (req, res, next) => {
//   const authHeader = req.header("Authorization");
//   if (!authHeader)
//     return res.status(401).json({ 
//       success: false,
//       message: "No token provided" 
//     });

//   const token = authHeader.replace("Bearer ", "");
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.id;
//     next();
//   } catch (err) {
//     return res.status(401).json({ 
//       success: false,
//       message: "Invalid token" 
//     });
//   }
// };

// // ✅ Researcher Login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Please provide email and password" 
//       });
//     }

//     const researcher = await Researcher.findOne({ email })
//       .select('+password')
//       .populate("researches");

//     if (!researcher)
//       return res.status(401).json({ 
//         success: false,
//         message: "Invalid credentials" 
//       });

//     const isMatch = await bcrypt.compare(password, researcher.password);
//     if (!isMatch)
//       return res.status(401).json({ 
//         success: false,
//         message: "Invalid credentials" 
//       });

//     res.json({
//       success: true,
//       data: {
//         _id: researcher._id,
//         name: researcher.fullName,
//         email: researcher.email,
//         token: generateToken(researcher._id),
//         researches: researcher.researches,
//         domains: researcher.domains,
//       }
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Server error" 
//     });
//   }
// });

// // ✅ Get Researcher Profile
// router.get("/profile", verifyToken, async (req, res) => {
//   try {
//     const researcher = await Researcher.findById(req.userId)
//       .select("-password")
//       .populate({
//         path: "researches",
//         populate: {
//           path: "supervision",
//           populate: { path: "supervisor", select: "-password" }
//         }
//       });

//     if (!researcher)
//       return res.status(404).json({ 
//         success: false,
//         message: "Researcher not found" 
//       });

//     const currentSupervision = await Supervision.findOne({
//       researcher: researcher._id,
//       status: "Current",
//     }).populate("supervisor", "-password").populate("research");

//     res.json({
//       success: true,
//       data: {
//         researcher,
//         currentSupervision: currentSupervision || null,
//       }
//     });
//   } catch (err) {
//     console.error("Get profile error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Server error" 
//     });
//   }
// });

// // ✅ Update Researcher Profile (CV & transcripts)
// router.put(
//   "/profile",
//   verifyToken,
//   upload.fields([
//     { name: "cvFile", maxCount: 1 },
//     { name: "transcripts", maxCount: 5 },
//   ]),
//   async (req, res) => {
//     try {
//       const updates = { ...req.body };

//       // Handle array fields from FormData
//       if (req.body.domains) {
//         updates.domains = Array.isArray(req.body.domains) 
//           ? req.body.domains 
//           : [req.body.domains];
//       }

//       if (req.files?.cvFile) {
//         updates.cvFile = `/uploads/researcher/cv/${req.files.cvFile[0].filename}`;
//       }

//       if (req.files?.transcripts) {
//         const transcriptMap = {};
//         req.files.transcripts.forEach((file) => {
//           const key = path.parse(file.originalname).name;
//           transcriptMap[key] = `/uploads/researcher/transcripts/${file.filename}`;
//         });
//         updates.transcripts = transcriptMap;
//       }

//       const researcher = await Researcher.findByIdAndUpdate(
//         req.userId, 
//         updates, 
//         { new: true, runValidators: true }
//       ).select("-password");

//       if (!researcher)
//         return res.status(404).json({ 
//           success: false,
//           message: "Researcher not found" 
//         });

//       res.json({
//         success: true,
//         message: "Profile updated successfully",
//         data: researcher,
//       });
//     } catch (err) {
//       console.error("Update profile error:", err);
//       res.status(500).json({ 
//         success: false,
//         message: "Server error",
//         error: err.message 
//       });
//     }
//   }
// );

// // ✅ Get All Researchers (for viewing other researchers)
// router.get("/all", verifyToken, async (req, res) => {
//   try {
//     const researchers = await Researcher.find()
//       .select("-password")
//       .populate("researches");

//     res.json({
//       success: true,
//       data: researchers
//     });
//   } catch (err) {
//     console.error("Get all researchers error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Server error" 
//     });
//   }
// });

// // ✅ Get Researcher by ID
// router.get("/:id", verifyToken, async (req, res) => {
//   try {
//     const researcher = await Researcher.findById(req.params.id)
//       .select("-password")
//       .populate("researches");

//     if (!researcher)
//       return res.status(404).json({ 
//         success: false,
//         message: "Researcher not found" 
//       });

//     res.json({
//       success: true,
//       data: researcher
//     });
//   } catch (err) {
//     console.error("Get researcher by ID error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Server error" 
//     });
//   }
// });

// // ✅ Get Researcher's Researches
// router.get("/my/researches", verifyToken, async (req, res) => {
//   try {
//     const researches = await Research.find({ researcher: req.userId })
//       .populate("supervision")
//       .populate("coResearchers", "fullName email");

//     res.json({
//       success: true,
//       data: researches
//     });
//   } catch (err) {
//     console.error("Get researches error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Server error" 
//     });
//   }
// });

// export default router;

// import express from "express";
// import multer from "multer";
// import path from "path";
// import { loginResearcher, getResearcherProfile, updateResearcherProfile } from "../controllers/researcherController.js";
// import { protectResearcher } from "../middlewares/researcherAuth.js";

// const router = express.Router();

// // ---------------- Multer Setup ----------------
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === "profileImage") cb(null, "uploads/researcher/profile");
//     else if (file.fieldname === "cvFile") cb(null, "uploads/researcher/cv");
//     else if (file.fieldname === "transcripts") cb(null, "uploads/researcher/transcripts");
//     else cb(null, "uploads/researcher");
//   },
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
// });

// const fileFilter = (req, file, cb) => {
//   const imageTypes = /jpeg|jpg|png/;
//   const docTypes = /pdf|doc|docx/;

//   if (file.fieldname === "profileImage") {
//     imageTypes.test(path.extname(file.originalname).toLowerCase())
//       ? cb(null, true)
//       : cb(new Error("Only images allowed for profileImage"));
//   } else {
//     docTypes.test(path.extname(file.originalname).toLowerCase())
//       ? cb(null, true)
//       : cb(new Error("Only PDF/DOC files allowed for CV or transcripts"));
//   }
// };

// const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// // ---------------- Public Routes ----------------
// router.post("/login", loginResearcher);

// // ---------------- Protected Routes ----------------
// router.get("/profile", protectResearcher, getResearcherProfile);
// router.put(
//   "/profile",
//   protectResearcher,
//   upload.fields([
//     { name: "profileImage", maxCount: 1 },
//     { name: "cvFile", maxCount: 1 },
//     { name: "transcripts", maxCount: 5 },
//   ]),
//   updateResearcherProfile
// );

// export default router;

// import express from "express";
// import multer from "multer";
// import path from "path";
// import {
//   loginResearcher,
//   registerResearcher,
//   updateResearcherProfile,
//   getResearcherProfile,
// } from "../controllers/researcherController.js";
// import { protectResearcher } from "../middlewares/researcherAuth.js";

// const router = express.Router();

// // ---------------- Multer setup ----------------
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === "profileImage") cb(null, "uploads/researcher/profile");
//     else if (file.fieldname === "cvFile") cb(null, "uploads/researcher/cv");
//     else if (file.fieldname === "transcripts") cb(null, "uploads/researcher/transcripts");
//     else cb(null, "uploads/researcher");
//   },
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = /\.(jpg|jpeg|png|pdf|doc|docx)$/i.test(file.originalname);
//   allowed ? cb(null, true) : cb(new Error("Invalid file type"));
// };

// const upload = multer({ storage, fileFilter });

// // ---------------- Routes ----------------

// // Public login
// router.post("/login", loginResearcher);

// // Protected profile routes
// router.get("/profile", protectResearcher, getResearcherProfile);
// router.put(
//   "/profile",
//   protectResearcher,
//   upload.fields([
//     { name: "profileImage", maxCount: 1 },
//     { name: "cvFile", maxCount: 1 },
//     { name: "transcripts", maxCount: 5 },
//   ]),
//   updateResearcherProfile
// );

// export default router;



// import express from "express";
// import multer from "multer";
// import {
//   loginResearcher,
//   getResearcherProfile,
//   updateResearcherProfile,
//   getResearcherProjects
// } from "../controllers/researcherController.js";
// import { protectResearcher } from "../middlewares/researcherAuth.js";

// const router = express.Router();

// // ---------------- Multer setup ----------------
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === "profileImage") cb(null, "uploads/researcher/profile");
//     else if (file.fieldname === "cvFile") cb(null, "uploads/researcher/cv");
//     else if (file.fieldname === "transcripts") cb(null, "uploads/researcher/transcripts");
//     else cb(null, "uploads/researcher");
//   },
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = /\.(jpg|jpeg|png|pdf|doc|docx)$/i.test(file.originalname);
//   allowed ? cb(null, true) : cb(new Error("Invalid file type"));
// };

// const upload = multer({ storage, fileFilter });

// // ---------------- Routes ----------------

// // Only login for registered researchers
// router.post("/login", loginResearcher);

// // Protected profile routes
// router.get("/profile", protectResearcher, getResearcherProfile);
// router.put(
//   "/profile",
//   protectResearcher,
//   upload.fields([
//     { name: "profileImage", maxCount: 1 },
//     { name: "cvFile", maxCount: 1 },
//     { name: "transcripts", maxCount: 5 },
//   ]),
//   updateResearcherProfile
// );

// // NEW: Get researcher's projects
// router.get("/projects", protectResearcher, getResearcherProjects);

// export default router;


// backend/routes/researcherRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import Researcher from "../models/Researcher.js";
import Supervision from "../models/Supervision.js";
import Research from "../models/Research.js";
import Supervisor from "../models/Supervisor.js";
import multer from "multer";

const router = express.Router();

// ✅ Ensure folders exist
["uploads/researcher", "uploads/researcher/cv", "uploads/researcher/transcripts", "uploads/researcher/profile"].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ✅ Multer configuration for CV & transcripts
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "cvFile") cb(null, "uploads/researcher/cv");
    else if (file.fieldname === "transcripts") cb(null, "uploads/researcher/transcripts");
    else if (file.fieldname === "profilePhoto") cb(null, "uploads/researcher/profile");
    else cb(null, "uploads/researcher");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const docTypes = /pdf|doc|docx/;
  const imageTypes = /jpg|jpeg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const isDoc = docTypes.test(ext);
  const isImg = imageTypes.test(ext);
  if (isDoc || isImg) return cb(null, true);
  cb(new Error("Only PDF, DOC, DOCX, JPG, JPEG, PNG, WEBP are allowed"));
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// ✅ JWT helper
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ✅ Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res.status(401).json({ 
      success: false,
      message: "No token provided" 
    });

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false,
      message: "Invalid token" 
    });
  }
};

// ✅ Get Supervisors by domains (for researcher view)
router.get("/supervisors/by-domains", verifyToken, async (req, res) => {
  try {
    const raw = req.query.domains;
    const domains = Array.isArray(raw)
      ? raw
      : (typeof raw === 'string' 
          ? raw.split(',').map(s => s.trim()).filter(Boolean) 
          : []);
    const filter = domains.length ? { domains: { $in: domains } } : {};
    const sups = await Supervisor.find(filter)
      .select("_id name email domains availability")
      .limit(50);
    const mapped = sups.map(s => ({
      _id: s._id,
      fullName: s.name,
      email: s.email,
      domain: (s.domains || [])[0] || '',
      available: s.availability === 'Available',
    }));
    res.json({ success: true, data: mapped });
  } catch (err) {
    console.error("Get supervisors by domains error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Researcher Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide email and password" 
      });
    }

    const researcher = await Researcher.findOne({ email })
      .select('+password')
      .populate("researches");

    if (!researcher)
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });

    const isMatch = await bcrypt.compare(password, researcher.password);
    if (!isMatch)
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });

    res.json({
      success: true,
      data: {
        _id: researcher._id,
        name: researcher.fullName,
        email: researcher.email,
        token: generateToken(researcher._id),
        researches: researcher.researches,
        domains: researcher.domains,
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

// ✅ Discover Pending Projects (filtered by current researcher's domains)
router.get("/pending-projects", verifyToken, async (req, res) => {
  try {
    const me = await Researcher.findById(req.userId).select("domains");
    const filter = { status: "Pending" };
    if (me?.domains?.length) {
      filter.domains = { $in: me.domains };
    }
    const projects = await Research.find(filter)
      .populate("researcher", "fullName email");
    res.json({ success: true, data: projects });
  } catch (err) {
    console.error("Get pending-projects error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get Research by ID
router.get("/research/:id", verifyToken, async (req, res) => {
  try {
    const research = await Research.findById(req.params.id)
      .populate("researcher", "fullName email");
    if (!research) return res.status(404).json({ success: false, message: "Research not found" });
    res.json({ success: true, data: research });
  } catch (err) {
    console.error("Get research by ID error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get compatible supervisors for a research (by domains)
router.get("/research/:id/supervisors", verifyToken, async (req, res) => {
  try {
    const research = await Research.findById(req.params.id);
    if (!research) return res.status(404).json({ success: false, message: "Research not found" });

    const supervisors = await Supervisor.find({
      domains: { $in: research.domains || [] },
    })
      .select("name email domains profileImage googleScholar scopus availability")
      .limit(50)
      .lean();

    const mapped = supervisors.map((s) => ({
      _id: s._id,
      name: s.name,
      email: s.email,
      domain: (s.domains || [])[0] || "",
      profileImage: s?.profileImage?.path || "/profile-placeholder.png",
      googleScholar: s.googleScholar || "",
      scopus: s.scopus || "",
      available: s.availability === "Available",
    }));

    return res.json({ success: true, data: mapped });
  } catch (err) {
    console.error("Get research supervisors error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get Ongoing Projects (filtered by researcher's domains)
router.get("/ongoing-projects", verifyToken, async (req, res) => {
  try {
    const me = await Researcher.findById(req.userId).select("domains");
    const filter = { status: "Current" };
    if (me?.domains?.length) {
      filter.domains = { $in: me.domains };
    }
    const projects = await Research.find(filter)
      .populate("researcher", "fullName email");
    res.json({ success: true, data: projects });
  } catch (err) {
    console.error("Get ongoing-projects error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Request Supervision for a Research
// If the research doesn't belong to the requester, clone a new research under the requester with Pending status
router.post("/research/:id/request-supervision", verifyToken, async (req, res) => {
  try {
    const { supervisorId } = req.body || {};
    if (!supervisorId) return res.status(400).json({ success: false, message: "supervisorId is required" });

    const base = await Research.findById(req.params.id);
    if (!base) return res.status(404).json({ success: false, message: "Research not found" });

    let target = base;
    if (String(base.researcher) !== String(req.userId)) {
      // Create a new research entry under the requesting user
      target = new Research({
        title: base.title,
        description: base.description,
        domains: base.domains,
        researcher: req.userId,
        status: "Pending",
        feasibility: base.feasibility || null,
      });
      await target.save();
      await Researcher.findByIdAndUpdate(req.userId, { $addToSet: { researches: target._id } });
    } else {
      // Ensure status is Pending if user is requesting supervision for their own research
      if (target.status !== "Pending") {
        target.status = "Pending";
        await target.save();
      }
    }

    // Create a supervision entry in Pending status
    const supervision = new Supervision({
      supervisor: supervisorId,
      researcher: req.userId,
      projectTitle: target.title,
      status: "Pending",
    });
    await supervision.save();

    // Link supervision back to research
    target.supervisionRef = supervision._id;
    await target.save();

    return res.json({ success: true, data: { researchId: target._id, supervisionId: supervision._id } });
  } catch (err) {
    console.error("Request supervision error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get Researcher's Pending Supervision Requests
router.get("/my/pending-requests", verifyToken, async (req, res) => {
  try {
    const requests = await Supervision.find({
      researcher: req.userId,
      status: "Pending",
    }).populate("supervisor", "name email googleScholar scopus profileImage");

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error("Get pending requests error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get Researcher's All Supervision Requests
router.get("/my/requests", verifyToken, async (req, res) => {
  try {
    const requests = await Supervision.find({
      researcher: req.userId,
    }).populate("supervisor", "fullName email");

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error("Get requests error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get Researcher's Active Researches
router.get("/my/active-research", verifyToken, async (req, res) => {
  try {
    const items = await Research.find({ researcher: req.userId, status: "Current" })
      .populate({
        path: "coResearchers",
        select: "fullName email googleScholar scopus profilePhoto",
      })
      .populate({
        path: "supervisionRef",
        populate: { path: "supervisor", select: "name email googleScholar scopus profileImage" },
      });

    const mapped = items.map((r) => ({
      _id: r._id,
      title: r.title,
      startDate: r.createdAt,
      researchPaper: r.paperUrl || null,
      supervisor: r.supervisionRef?.supervisor
        ? {
            _id: r.supervisionRef.supervisor._id,
            name: r.supervisionRef.supervisor.name,
            email: r.supervisionRef.supervisor.email,
            profileImage: r.supervisionRef.supervisor?.profileImage?.path || "/profile-placeholder.png",
            googleScholar: r.supervisionRef.supervisor.googleScholar || "",
            scopus: r.supervisionRef.supervisor.scopus || "",
          }
        : null,
      coResearchers: (r.coResearchers || []).map((c) => ({
        _id: c._id,
        name: c.fullName,
        email: c.email,
        profilePhoto: c.profilePhoto || null,
        googleScholar: c.googleScholar || "",
        scopus: c.scopus || "",
      })),
      comments: (r.supervisionRef?.feedbacks || []).slice().reverse(),
    }));

    res.json({ success: true, data: mapped });
  } catch (err) {
    console.error("Get active research error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get a Co-actor's current supervision (read-only supervisor details)
router.get("/coactor/:id/supervision-current", verifyToken, async (req, res) => {
  try {
    const supervision = await Supervision.findOne({
      researcher: req.params.id,
      status: "Current",
    }).populate("supervisor", "fullName email degree");

    if (!supervision) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: supervision });
  } catch (err) {
    console.error("Get coactor supervision error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get Researcher Profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const researcher = await Researcher.findById(req.userId)
      .select("-password")
      // Populate only existing path from Researcher schema
      .populate("researches");

    if (!researcher)
      return res.status(404).json({ 
        success: false,
        message: "Researcher not found" 
      });

    const currentSupervision = await Supervision.findOne({
      researcher: researcher._id,
      status: "Current",
    })
      // Only populate existing path from Supervision schema
      .populate("supervisor", "-password");

    res.json({
      success: true,
      data: {
        researcher,
        currentSupervision: currentSupervision || null,
      }
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

// ✅ Update Researcher Profile (CV & transcripts)
router.put(
  "/profile",
  verifyToken,
  upload.fields([
    { name: "cvFile", maxCount: 1 },
    { name: "transcripts", maxCount: 5 },
    { name: "profilePhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const updates = { ...req.body };

      // Handle array fields from FormData
      if (req.body.domains) {
        updates.domains = Array.isArray(req.body.domains) 
          ? req.body.domains 
          : [req.body.domains];
      }

      // Handle skills from CSV or array
      if (req.body.skills) {
        updates.skills = Array.isArray(req.body.skills)
          ? req.body.skills
          : String(req.body.skills)
              .split(',')
              .map(s => s.trim())
              .filter(Boolean);
      }

      // Handle awards and qualifications (CSV or array)
      if (req.body.awards) {
        updates.awards = Array.isArray(req.body.awards)
          ? req.body.awards
          : String(req.body.awards)
              .split(',')
              .map(s => s.trim())
              .filter(Boolean);
      }

      if (req.body.qualifications) {
        updates.qualifications = Array.isArray(req.body.qualifications)
          ? req.body.qualifications
          : String(req.body.qualifications)
              .split(',')
              .map(s => s.trim())
              .filter(Boolean);
      }

      if (req.files?.cvFile) {
        updates.cvFile = `/uploads/researcher/cv/${req.files.cvFile[0].filename}`;
      }

      if (req.files?.transcripts) {
        const transcriptMap = {};
        req.files.transcripts.forEach((file) => {
          const key = path.parse(file.originalname).name;
          transcriptMap[key] = `/uploads/researcher/transcripts/${file.filename}`;
        });
        updates.transcripts = transcriptMap;
      }

      if (req.files?.profilePhoto) {
        updates.profilePhoto = `/uploads/researcher/profile/${req.files.profilePhoto[0].filename}`;
      }

      const researcher = await Researcher.findByIdAndUpdate(
        req.userId, 
        updates, 
        { new: true, runValidators: true }
      ).select("-password");

      if (!researcher)
        return res.status(404).json({ 
          success: false,
          message: "Researcher not found" 
        });

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: researcher,
      });
    } catch (err) {
      console.error("Update profile error:", err);
      res.status(500).json({ 
        success: false,
        message: "Server error",
        error: err.message 
      });
    }
  }
);

// ✅ Delete current Researcher profile (and related data)
router.delete("/profile", verifyToken, async (req, res) => {
  try {
    await Research.deleteMany({ researcher: req.userId });
    await Supervision.deleteMany({ researcher: req.userId });
    const deleted = await Researcher.findByIdAndDelete(req.userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Researcher not found" });
    }
    return res.json({ success: true, message: "Profile deleted" });
  } catch (err) {
    console.error("Delete researcher profile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get All Researchers (for viewing other researchers)
router.get("/all", verifyToken, async (req, res) => {
try {
const researchers = await Researcher.find()
  .select("-password")
  .populate("researches");

res.json({
  success: true,
  data: researchers
});
} catch (err) {
console.error("Get all researchers error:", err);
res.status(500).json({ 
  success: false,
  message: "Server error" 
});
}
});

// ✅ Get Researcher by ID
router.get("/:id", verifyToken, async (req, res) => {
try {
const researcher = await Researcher.findById(req.params.id)
  .select("-password")
  .populate("researches");

if (!researcher)
  return res.status(404).json({ 
    success: false,
    message: "Researcher not found" 
  });

res.json({
  success: true,
  data: researcher
});
} catch (err) {
console.error("Get researcher by ID error:", err);
res.status(500).json({ 
  success: false,
  message: "Server error" 
});
}
});

// ✅ Get Researcher's Researches
router.get("/my/researches", verifyToken, async (req, res) => {
try {
const researches = await Research.find({ researcher: req.userId })
  .populate("coResearchers", "fullName email");

    res.json({
      success: true,
      data: researches
    });
  } catch (err) {
    console.error("Get researches error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

export default router;