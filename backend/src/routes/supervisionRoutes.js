    try {
      const payload = { supervisionId: String(supervision._id) };
      if (status === "Current") {
        // Accepted by supervisor
        await Notification.create([
          {
            forRole: "researcher",
            forRoleRef: "Researcher",
            forUser: supervision.researcher,
            type: "supervision_accepted",
            message: "Your supervision request has been accepted",
            payload,
          },
          {
            forRole: "admin",
            forRoleRef: "Admin",
            type: "supervision_accepted",
            message: "A supervision request was accepted by supervisor",
            payload,
          },
        ]);
      } else if (status === "Finished") {
        await Notification.create({
          forRole: "researcher",
          forRoleRef: "Researcher",
          forUser: supervision.researcher,
          type: "supervision_finished",
          message: "Your supervision has been marked as finished",
          payload,
        });
      } else if (status === "Pending") {
        // No-op
      }
    } catch (e) {
      console.error("Supervision update notifications error:", e);
    }



import express from "express";
import Supervision from "../models/Supervision.js";
import Supervisor from "../models/Supervisor.js";
import Researcher from "../models/Researcher.js";
import Notification from "../models/Notification.js";
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

    if (String(req.role).toLowerCase() === "supervisor") {
      profile = await Supervisor.findById(req.userId).select("-password");
    } else if (String(req.role).toLowerCase() === "researcher") {
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

// ------------------- Researcher requests supervision for a specific research -------------------
router.post("/research/:id/request-supervision", verifyToken, async (req, res) => {
  try {
    const { supervisorId } = req.body;
    const researchId = req.params.id;

    if (!supervisorId) {
      return res.status(400).json({ 
        success: false, 
        message: "supervisorId is required" 
      });
    }

    // Ensure the requester is a researcher
    const researcher = await Researcher.findById(req.userId);
    if (!researcher) {
      return res.status(404).json({ success: false, message: "Researcher not found" });
    }

    // Ensure supervisor exists
    const supervisor = await Supervisor.findById(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ success: false, message: "Supervisor not found" });
    }

    // Ensure research exists and belongs to requester
    const Research = (await import("../models/Research.js")).default;
    const research = await Research.findById(researchId);
    if (!research) {
      return res.status(404).json({ success: false, message: "Research not found" });
    }
    if (String(research.researcher) !== String(req.userId)) {
      return res.status(403).json({ success: false, message: "Not your research" });
    }

    // Prevent multiple current/pending supervisions
    const existing = await Supervision.findOne({
      researcher: req.userId,
      status: { $in: ["Pending", "Current"] },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending or current supervision request.",
      });
    }

    // Create supervision with explicit status and ministry flag
    const supervision = new Supervision({
      supervisor: supervisorId,
      researcher: req.userId,
      projectTitle: research.title,
      status: "Pending",
      verifiedByMinistry: false,
    });

    await supervision.save();
    console.log("Created supervision:", supervision);

    return res.status(201).json({
      success: true,
      message: "Supervision request submitted successfully.",
      supervision,
    });
  } catch (err) {
    console.error("Request supervision error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to request supervision" 
    });
  }
});

// ------------------- Supervisor views all supervision requests -------------------
router.get("/requests", verifyToken, async (req, res) => {
  try {
    if (String(req.role).toLowerCase() !== "supervisor") {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    // Do not force verifiedByMinistry; allow all for supervisor
    const requests = await Supervision.find({ supervisor: req.userId })
      .populate("researcher", "fullName email department")
      .sort({ createdAt: -1 });

    console.log(`Found ${requests.length} requests for supervisor ${req.userId}`);

    // Attach linked research details if available
    const Research = (await import("../models/Research.js")).default;
    const withResearch = await Promise.all(
      requests.map(async (r) => {
        const obj = r.toObject();
        const research = await Research.findOne({ supervisionRef: r._id }).select("_id title status");
        obj.researchId = research?._id || null;
        obj.researchTitle = research?.title || obj.projectTitle;
        obj.researchStatus = research?.status || null;
        return obj;
      })
    );

    return res.json({ 
      success: true, 
      data: withResearch, 
      requests: withResearch,
      count: withResearch.length
    });
  } catch (err) {
    console.error("GET /supervision/requests error:", err);
    return res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message
    });
  }
});

// ------------------- Supervisor updates request (approve/deny/feedback) -------------------
router.put("/update/:id", verifyToken, async (req, res) => {
  const { status, feedback, feasibility, reason, removeFeedbackIndex } = req.body;

  try {
    const supervision = await Supervision.findById(req.params.id);
    if (!supervision)
      return res.status(404).json({ message: "Supervision not found" });

    // If attempting to approve to Current, enforce capacity limit of 5
    if (status === "Current") {
      const activeCount = await Supervision.countDocuments({
        supervisor: supervision.supervisor,
        status: "Current",
      });
      if (activeCount >= 5) {
        return res.status(400).json({ message: "Supervisor has reached maximum active supervisions (5)." });
      }
    }

    if (status) supervision.status = status;

    // Optional feasibility update (used by supervisor to indicate funding viability)
    if (typeof feasibility !== 'undefined' && feasibility !== null) {
      const allowed = ["Feasible", "Not Feasible", null];
      if (!allowed.includes(feasibility)) {
        return res.status(400).json({ message: "Invalid feasibility value" });
      }
      supervision.feasibility = feasibility;
      // Optionally record a note as feedback when a reason is provided
      if (reason && typeof reason === 'string' && reason.trim()) {
        supervision.feedbacks.push({ comment: `Funding decision: ${feasibility}. ${reason.trim()}`, date: new Date() });
      }
      // Notify both researcher and admin immediately about feasibility decision
      try {
        const payload = { supervisionId: String(supervision._id), feasibility, reason: reason || "" };
        await Notification.create([
          {
            forRole: "researcher",
            forRoleRef: "Researcher",
            forUser: supervision.researcher,
            type: feasibility === 'Feasible' ? "supervision_viable" : "supervision_not_viable",
            message: feasibility === 'Feasible' ? "Your project is marked feasible by the supervisor" : "Your project is marked not feasible by the supervisor",
            payload,
          },
          {
            forRole: "admin",
            forRoleRef: "Admin",
            type: feasibility === 'Feasible' ? "supervision_viable" : "supervision_not_viable",
            message: feasibility === 'Feasible' ? "A project was marked feasible by supervisor" : "A project was marked not feasible by supervisor",
            payload,
          },
        ]);
      } catch (e) {
        console.error("Feasibility notification error:", e);
      }
    }

    if (typeof removeFeedbackIndex === 'number') {
      if (removeFeedbackIndex >= 0 && removeFeedbackIndex < (supervision.feedbacks?.length || 0)) {
        supervision.feedbacks.splice(removeFeedbackIndex, 1);
      }
    }

    if (feedback) {
      supervision.feedbacks.push({
        comment: feedback,
        date: new Date(),
      });
    }

    await supervision.save();

    // After update, adjust supervisor availability based on active current count
    try {
      const currentCount = await Supervision.countDocuments({
        supervisor: supervision.supervisor,
        status: "Current",
      });
      const sup = await Supervisor.findById(supervision.supervisor);
      if (sup) {
        const desired = currentCount >= 5 ? "Unavailable" : "Available";
        if (sup.availability !== desired) {
          sup.availability = desired;
          await sup.save();
        }
      }
    } catch (e) {
      console.error("Availability update error:", e);
    }

    res.json({ message: "Supervision updated successfully.", supervision });
  } catch (err) {
    console.error("PUT /supervision/update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Supervisor declines a pending request -------------------
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    if (req.role !== "Supervisor") {
      return res.status(403).json({ message: "Access denied" });
    }
    const supervision = await Supervision.findById(req.params.id);
    if (!supervision) return res.status(404).json({ message: "Supervision not found" });
    if (String(supervision.supervisor) !== String(req.userId)) {
      return res.status(403).json({ message: "Not your supervision" });
    }
    if (supervision.status !== "Pending") {
      return res.status(400).json({ message: "Only pending requests can be declined" });
    }
    await supervision.deleteOne();
    // Notify researcher and admin of decline
    try {
      const payload = { supervisionId: String(supervision._id) };
      await Notification.create([
        {
          forRole: "researcher",
          forRoleRef: "Researcher",
          forUser: supervision.researcher,
          type: "supervision_rejected",
          message: "Your supervision request was declined by the supervisor",
          payload,
        },
        {
          forRole: "admin",
          forRoleRef: "Admin",
          type: "supervision_rejected",
          message: "A supervision request was declined by the supervisor",
          payload,
        },
      ]);
    } catch (e) {
      console.error("Supervision decline notifications error:", e);
    }
    return res.json({ message: "Supervision request declined and removed" });
  } catch (err) {
    console.error("DELETE /supervisions/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Researcher views their supervision(s) -------------------
router.get("/my-supervisions", verifyToken, async (req, res) => {
  try {
    if (String(req.role).toLowerCase() !== "researcher")
      return res.status(403).json({ message: "Access denied" });

    const supervisions = await Supervision.find({ researcher: req.userId })
      .populate("supervisor", "name email department")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: supervisions, supervisions });
  } catch (err) {
    console.error("GET /supervision/my-supervisions error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
