// import Researcher from "../models/Researcher.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import path from "path";

// // ---------------- Login ----------------
// export const loginResearcher = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const researcher = await Researcher.findOne({ email: email.toLowerCase().trim() });
//     if (!researcher) return res.status(404).json({ success: false, message: "Researcher not found" });

//     const isMatch = await bcrypt.compare(password, researcher.password);
//     if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password" });

//     const token = jwt.sign({ id: researcher._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//     res.json({
//       success: true,
//       token,
//       data: {
//         _id: researcher._id,
//         name: researcher.name,
//         email: researcher.email,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ---------------- Get Profile ----------------
// export const getResearcherProfile = async (req, res) => {
//   try {
//     const researcher = await Researcher.findById(req.user.id).select("-password");
//     if (!researcher) return res.status(404).json({ success: false, message: "Researcher not found" });

//     res.json({ success: true, data: researcher });
//   } catch (err) {
//     console.error("Get profile error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ---------------- Update Profile ----------------
// export const updateResearcherProfile = async (req, res) => {
//   try {
//     const researcher = await Researcher.findById(req.user.id);
//     if (!researcher) return res.status(404).json({ success: false, message: "Researcher not found" });

//     const updates = { ...req.body };

//     if (req.files?.profileImage) {
//       updates.profileImage = `/uploads/researcher/profile/${req.files.profileImage[0].filename}`;
//     }
//     if (req.files?.cvFile) {
//       updates.cvFile = `/uploads/researcher/cv/${req.files.cvFile[0].filename}`;
//     }
//     if (req.files?.transcripts) {
//       const transcriptsMap = {};
//       req.files.transcripts.forEach((file) => {
//         const key = path.parse(file.originalname).name;
//         transcriptsMap[key] = `/uploads/researcher/transcripts/${file.filename}`;
//       });
//       updates.transcripts = transcriptsMap;
//     }

//     Object.assign(researcher, updates);
//     await researcher.save();

//     res.json({ success: true, message: "Profile updated successfully", data: researcher });
//   } catch (err) {
//     console.error("Update profile error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


// import Researcher from "../models/Researcher.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import path from "path";

// // ---------------- Login ----------------
// export const loginResearcher = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const researcher = await Researcher.findOne({ email: email.toLowerCase().trim() });
//     if (!researcher)
//       return res.status(404).json({ success: false, message: "Researcher not found" });

//     const isMatch = await bcrypt.compare(password, researcher.password);
//     if (!isMatch)
//       return res.status(401).json({ success: false, message: "Incorrect password" });

//     const token = jwt.sign({ id: researcher._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//     res.json({
//       success: true,
//       token,
//       data: {
//         _id: researcher._id,
//         fullName: researcher.fullName,
//         email: researcher.email,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ---------------- Get Researcher Profile ----------------
// export const getResearcherProfile = async (req, res) => {
//   try {
//     const researcherId = req.user?._id || req.params.id;

//     if (!researcherId) {
//       return res.status(400).json({ message: "Researcher ID not found" });
//     }

//     const researcher = await Researcher.findById(researcherId)
//       .populate("researches")
//       .populate({
//         path: "supervisions",
//         populate: { path: "supervisor", select: "name email domain" },
//       })
//       .lean();

//     if (!researcher) {
//       return res.status(404).json({ message: "Researcher not found" });
//     }

//     res.status(200).json({
//       success: true,
//       data: researcher,
//     });
//   } catch (error) {
//     console.error("Error fetching researcher profile:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // ---------------- Placeholder: register & update ----------------
// // (You may already have these in your file. If not, keep these placeholders.)

// export const registerResearcher = async (req, res) => {
//   res.status(501).json({ message: "Register researcher not implemented here" });
// };

// export const updateResearcherProfile = async (req, res) => {
//   res.status(501).json({ message: "Update researcher profile not implemented here" });
// };




// import Researcher from "../models/Researcher.js";
// import Research from "../models/Research.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// // ---------------- Login ----------------
// export const loginResearcher = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const researcher = await Researcher.findOne({ email: email.toLowerCase().trim() });
//     if (!researcher)
//       return res.status(404).json({ success: false, message: "Researcher not found" });

//     const isMatch = await bcrypt.compare(password, researcher.password);
//     if (!isMatch)
//       return res.status(401).json({ success: false, message: "Incorrect password" });

//     const token = jwt.sign({ id: researcher._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//     res.json({
//       success: true,
//       token,
//       data: {
//         _id: researcher._id,
//         fullName: researcher.fullName,
//         email: researcher.email,
//         profileImage: researcher.profileImage,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ---------------- Get Researcher Profile ----------------
// export const getResearcherProfile = async (req, res) => {
//   try {
//     const researcher = await Researcher.findById(req.user._id)
//       .populate("researches")
//       .lean();

//     if (!researcher)
//       return res.status(404).json({ success: false, message: "Researcher not found" });

//     res.status(200).json({ success: true, data: researcher });
//   } catch (err) {
//     console.error("Get profile error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ---------------- Update Researcher Profile ----------------
// export const updateResearcherProfile = async (req, res) => {
//   try {
//     const researcher = await Researcher.findById(req.user._id);
//     if (!researcher)
//       return res.status(404).json({ success: false, message: "Researcher not found" });

//     // Update basic fields
//     researcher.fullName = req.body.fullName || researcher.fullName;
//     researcher.degree = req.body.degree || researcher.degree;
//     researcher.domains = req.body.domains || researcher.domains;

//     // Handle uploaded files
//     if (req.files?.profileImage) researcher.profileImage = req.files.profileImage[0].path;
//     if (req.files?.cvFile) researcher.cvFile = req.files.cvFile[0].path;
//     if (req.files?.transcripts)
//       researcher.transcripts = req.files.transcripts.map(file => file.path);

//     await researcher.save();
//     res.status(200).json({ success: true, data: researcher });
//   } catch (err) {
//     console.error("Update profile error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


// // GET /api/researchers/projects
// // GET /researchers/projects
// export const getResearcherProjects = async (req, res) => {
//   try {
//     const researcher = await Researcher.findById(req.user._id)
//       .populate("researches")
//       .lean();

//     if (!researcher) {
//       return res.status(404).json({ success: false, message: "Researcher not found" });
//     }

//     res.json({ success: true, data: researcher.researches || [] });
//   } catch (err) {
//     console.error("Get projects error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

import Researcher from "../models/Researcher.js";

// ✅ Get Researcher Profile
export const getResearcherProfile = async (req, res) => {
  try {
    const researcher = await Researcher.findById(req.user.id).select("-password");
    if (!researcher)
      return res.status(404).json({ message: "Researcher not found" });
    res.json(researcher);
  } catch (error) {
    console.error("Get Researcher Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Researcher Profile (including CV/transcripts)
export const updateResearcherProfile = async (req, res) => {
  try {
    const researcher = await Researcher.findById(req.user.id);
    if (!researcher)
      return res.status(404).json({ message: "Researcher not found" });

    const updates = { ...req.body };

    if (req.files?.cvFile) {
      updates.cvFile = `/uploads/researcher/cv/${req.files.cvFile[0].filename}`;
    }

    if (req.files?.transcripts) {
      const transcriptMap = {};
      req.files.transcripts.forEach((file) => {
        const key = file.originalname.split(".")[0];
        transcriptMap[key] = `/uploads/researcher/transcripts/${file.filename}`;
      });
      updates.transcripts = transcriptMap;
    }

    Object.assign(researcher, updates);
    await researcher.save();

    res.json({ message: "Profile updated successfully", researcher });
  } catch (error) {
    console.error("Update Researcher Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Upload Other Research Files (proposal/documents)
export const uploadResearchFiles = async (req, res) => {
  try {
    const researcher = await Researcher.findById(req.user.id);
    if (!researcher)
      return res.status(404).json({ message: "Researcher not found" });

    researcher.uploadedFiles = req.files?.map((f) => f.path) || [];
    await researcher.save();

    res.json({ message: "Files uploaded successfully", files: researcher.uploadedFiles });
  } catch (error) {
    console.error("File Upload Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

