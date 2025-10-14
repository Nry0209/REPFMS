// import express from "express";
// import Supervision from "../models/Supervision.js";
// import Supervisor from "../models/Supervisor.js";
// import Researcher from "../models/Researcher.js";
// import jwt from "jsonwebtoken";

// const router = express.Router();

// // ------------------- Token Verification -------------------
// const verifyToken = (req, res, next) => {
//   const authHeader = req.header("Authorization");
//   if (!authHeader)
//     return res.status(401).json({ message: "No token provided" });

//   const token = authHeader.replace("Bearer ", "");
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.id || decoded.supervisorId;
//     req.role = decoded.role;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };
// // ------------------- Supervisor / Researcher profile -------------------
// router.get("/profile", verifyToken, async (req, res) => {
//   try {
//     let profile;

//     if (req.role === "Supervisor") {
//       profile = await Supervisor.findById(req.userId).select("-password");
//     } else if (req.role === "Researcher") {
//       profile = await Researcher.findById(req.userId).select("-password");
//     } else {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     if (!profile) {
//       return res.status(404).json({ message: "Profile not found" });
//     }

//     res.json({ profile });
//   } catch (err) {
//     console.error("GET /supervision/profile error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ------------------- Researcher sends supervision request -------------------
// router.post("/request", verifyToken, async (req, res) => {
//   const { supervisorId, projectTitle, durationMonths } = req.body;

//   try {
//     // Ensure the requester is a researcher
//     const researcher = await Researcher.findById(req.userId);
//     if (!researcher)
//       return res.status(404).json({ message: "Researcher not found" });

//     // Ensure supervisor exists
//     const supervisor = await Supervisor.findById(supervisorId);
//     if (!supervisor)
//       return res.status(404).json({ message: "Supervisor not found" });

//     // Prevent multiple current supervisions
//     const existing = await Supervision.findOne({
//       researcher: researcher._id,
//       status: { $in: ["Pending", "Current"] },
//     });
//     if (existing)
//       return res.status(400).json({
//         message: "You already have a pending or current supervision request.",
//       });

//     // Create a new supervision
//     const supervision = new Supervision({
//       researcher: researcher._id,
//       supervisor: supervisor._id,
//       projectTitle,
//       durationMonths,
//       status: "Pending",
//     });

//     await supervision.save();

//     res.status(201).json({
//       message: "Supervision request submitted successfully.",
//       supervision,
//     });
//   } catch (err) {
//     console.error("POST /supervision/request error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ------------------- Supervisor views all supervision requests -------------------
// router.get("/requests", verifyToken, async (req, res) => {
//   try {
//     if (req.role !== "Supervisor")
//       return res.status(403).json({ message: "Access denied" });

//     const requests = await Supervision.find({ supervisor: req.userId })
//       .populate("researcher", "name email field")
//       .sort({ createdAt: -1 });

//     res.json({ requests });
//   } catch (err) {
//     console.error("GET /supervision/requests error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ------------------- Supervisor updates request (approve/deny/feedback) -------------------
// router.put("/update/:id", verifyToken, async (req, res) => {
//   const { status, feedback } = req.body;

//   try {
//     const supervision = await Supervision.findById(req.params.id);
//     if (!supervision)
//       return res.status(404).json({ message: "Supervision not found" });

//     if (status) supervision.status = status;

//     if (feedback) {
//       supervision.feedbacks.push({
//         comment: feedback,
//         date: new Date(),
//       });
//     }

//     await supervision.save();

//     res.json({ message: "Supervision updated successfully.", supervision });
//   } catch (err) {
//     console.error("PUT /supervision/update error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ------------------- Researcher views their supervision(s) -------------------
// router.get("/my-supervisions", verifyToken, async (req, res) => {
//   try {
//     if (req.role !== "Researcher")
//       return res.status(403).json({ message: "Access denied" });

//     const supervisions = await Supervision.find({ researcher: req.userId })
//       .populate("supervisor", "name email department")
//       .sort({ createdAt: -1 });

//     res.json({ supervisions });
//   } catch (err) {
//     console.error("GET /supervision/my-supervisions error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;

// import express from "express";
// import {
//   getAvailableSupervisors,
//   requestSupervision,
//   getResearcherSupervisions,
//   requestFunding,
// } from "../controllers/supervisionController.js";
// import { protectResearcher } from "../middlewares/researcherAuth.js";

// const router = express.Router();

// // Researcher routes
// router.get("/available-supervisors", protectResearcher, getAvailableSupervisors);
// router.post("/request", protectResearcher, requestSupervision);
// router.get("/my-supervisions", protectResearcher, getResearcherSupervisions);
// router.post("/funding-request", protectResearcher, requestFunding);

// export default router;

import express from "express";
import Supervision from "../models/Supervision.js";
import Supervisor from "../models/Supervisor.js";
import Researcher from "../models/Researcher.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ------------------- Token Verification -------------------
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id || decoded.supervisorId;
    req.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
// ------------------- Supervisor / Researcher profile -------------------
router.get("/profile", verifyToken, async (req, res) => {
  try {
    let profile;

    if (req.role === "Supervisor") {
      profile = await Supervisor.findById(req.userId).select("-password");
    } else if (req.role === "Researcher") {
      profile = await Researcher.findById(req.userId).select("-password");
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ profile });
  } catch (err) {
    console.error("GET /supervision/profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Researcher sends supervision request -------------------
router.post("/request", verifyToken, async (req, res) => {
  const { supervisorId, projectTitle, durationMonths } = req.body;

  try {
    // Ensure the requester is a researcher
    const researcher = await Researcher.findById(req.userId);
    if (!researcher)
      return res.status(404).json({ message: "Researcher not found" });

    // Ensure supervisor exists
    const supervisor = await Supervisor.findById(supervisorId);
    if (!supervisor)
      return res.status(404).json({ message: "Supervisor not found" });

    // Prevent multiple current supervisions
    const existing = await Supervision.findOne({
      researcher: researcher._id,
      status: { $in: ["Pending", "Current"] },
    });
    if (existing)
      return res.status(400).json({
        message: "You already have a pending or current supervision request.",
      });

    // Create a new supervision
    const supervision = new Supervision({
      researcher: researcher._id,
      supervisor: supervisor._id,
      projectTitle,
      durationMonths,
      status: "Pending",
    });

    await supervision.save();

    res.status(201).json({
      message: "Supervision request submitted successfully.",
      supervision,
    });
  } catch (err) {
    console.error("POST /supervision/request error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Supervisor views all supervision requests -------------------
router.get("/requests", verifyToken, async (req, res) => {
  try {
    if (req.role !== "Supervisor")
      return res.status(403).json({ message: "Access denied" });

    const requests = await Supervision.find({ supervisor: req.userId })
      .populate("researcher", "name email field")
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (err) {
    console.error("GET /supervision/requests error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Supervisor updates request (approve/deny/feedback) -------------------
router.put("/update/:id", verifyToken, async (req, res) => {
  const { status, feedback } = req.body;

  try {
    const supervision = await Supervision.findById(req.params.id);
    if (!supervision)
      return res.status(404).json({ message: "Supervision not found" });

    if (status) supervision.status = status;

    if (feedback) {
      supervision.feedbacks.push({
        comment: feedback,
        date: new Date(),
      });
    }

    await supervision.save();

    res.json({ message: "Supervision updated successfully.", supervision });
  } catch (err) {
    console.error("PUT /supervision/update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Researcher views their supervision(s) -------------------
router.get("/my-supervisions", verifyToken, async (req, res) => {
  try {
    if (req.role !== "Researcher")
      return res.status(403).json({ message: "Access denied" });

    const supervisions = await Supervision.find({ researcher: req.userId })
      .populate("supervisor", "name email department")
      .sort({ createdAt: -1 });

    res.json({ supervisions });
  } catch (err) {
    console.error("GET /supervision/my-supervisions error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
