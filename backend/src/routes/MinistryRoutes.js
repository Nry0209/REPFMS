// import express from "express";
// import Researcher from "../models/Researcher.js";
// import Supervisor from "../models/Supervisor.js";

// const router = express.Router();

// router.post("/verify-supervision", async (req, res) => {
//   const { researcherId, supervisorId } = req.body;

//   try {
//     const researcher = await Researcher.findById(researcherId);
//     const supervisor = await Supervisor.findById(supervisorId);

//     if (!researcher || !supervisor)
//       return res.status(404).json({ message: "Researcher or Supervisor not found" });

//     const domainMatch = researcher.domains.some((domain) =>
//       supervisor.domains.includes(domain)
//     );
//     if (!domainMatch)
//       return res.status(400).json({ message: "Domain mismatch — supervision request denied" });

//     res.json({ message: "Domain match confirmed — supervision can proceed" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;

import express from "express";
// Removed admin login import to avoid duplication; admin login is handled in adminRoutes
import Supervision from "../models/Supervision.js";
import Supervisor from "../models/Supervisor.js";
import Research from "../models/Research.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Admin login is managed by adminRoutes to avoid duplication

// ---------------- Ministry: List supervisions pending domain verification ----------------
router.get("/supervisions/pending-verification", async (req, res) => {
  try {
    const items = await Supervision.find({ status: "Pending", verifiedByMinistry: false })
      .populate("supervisor", "name email domains")
      .populate("researcher", "fullName email domains")
      .sort({ createdAt: -1 })
      .lean();

    // Attach research domains if available
    const ids = items.map(i => i._id);
    const researches = await Research.find({ supervisionRef: { $in: ids } })
      .select("domains supervisionRef title")
      .lean();
    const bySupRef = new Map(researches.map(r => [String(r.supervisionRef), r]));
    const data = items.map(i => ({
      ...i,
      research: bySupRef.get(String(i._id)) || null,
    }));

    return res.json({ success: true, data });
  } catch (err) {
    console.error("Ministry list pending verification error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- Ministry: Explicitly reject a supervision (manual decision) ----------------
router.post("/supervisions/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = "Rejected by ministry" } = req.body || {};

    const supervision = await Supervision.findById(id);
    if (!supervision) return res.status(404).json({ success: false, message: "Supervision not found" });

    supervision.verifiedByMinistry = false;
    supervision.ministryReviewed = true;
    supervision.ministryReason = reason;
    await supervision.save();

    // Notify researcher and admin of rejection
    try {
      await Notification.create([
        {
          forRole: "researcher",
          forRoleRef: "Researcher",
          forUser: supervision.researcher,
          type: "supervision_rejected_ministry",
          message: "Your supervision request was rejected by ministry",
          payload: { supervisionId: String(supervision._id), reason },
        },
        {
          forRole: "admin",
          forRoleRef: "Admin",
          type: "supervision_rejected_ministry",
          message: "A supervision request was rejected by ministry",
          payload: { supervisionId: String(supervision._id), reason },
        },
      ]);
    } catch (e) {
      console.error("Ministry rejection notification error:", e);
    }

    return res.json({ success: true, message: "Supervision rejected", supervision });
  } catch (err) {
    console.error("POST /ministry/supervisions/:id/reject error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- Ministry: Verify domain overlap for a supervision ----------------
router.post("/supervisions/:id/verify-domain", async (req, res) => {
  try {
    const supervision = await Supervision.findById(req.params.id);
    if (!supervision) return res.status(404).json({ success: false, message: "Supervision not found" });

    const supervisor = await Supervisor.findById(supervision.supervisor).select("domains availability");
    if (!supervisor) return res.status(404).json({ success: false, message: "Supervisor not found" });

    const research = await Research.findOne({ supervisionRef: supervision._id }).select("domains title");
    // Fallback: if no research found, try researcher's domains
    let candidateDomains = research?.domains || [];
    if (!candidateDomains.length) {
      // Warning: using researcher's domains as a fallback
      // Import Researcher lazily to avoid circular if needed
      const { default: Researcher } = await import("../models/Researcher.js");
      const researcher = await Researcher.findById(supervision.researcher).select("domains");
      candidateDomains = researcher?.domains || [];
    }

    const overlap = (candidateDomains || []).filter(d => (supervisor.domains || []).includes(d));
    // Ministry only validates domain match; availability/capacity will be enforced at supervisor decision time
    let approved = overlap.length > 0;
    let reason = approved ? "" : "No domain overlap between research and supervisor";

    if (approved) {
      supervision.verifiedByMinistry = true;
      supervision.ministryReviewed = true;
      supervision.ministryReason = "";
      await supervision.save();
      // Notify supervisor to accept/reject
      try {
        await Notification.create({
          forRole: "supervisor",
          forRoleRef: "Supervisor",
          forUser: supervision.supervisor,
          type: "supervision_pending_review",
          message: "A ministry-approved supervision request is awaiting your decision",
          payload: { supervisionId: String(supervision._id) },
        });
      } catch (e) {
        // log but don't fail the response
        console.error("Ministry approval notification error:", e);
      }
    } else {
      // Record explicit rejection decision
      supervision.ministryReviewed = true;
      supervision.ministryReason = reason || "No domain overlap";
      await supervision.save();
    }

    return res.json({
      success: true,
      approved,
      reason,
      overlap,
      supervisionId: supervision._id,
      researchTitle: research?.title || supervision.projectTitle,
    });
  } catch (err) {
    console.error("Ministry verify domain error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- Ministry: Set all supervisors available (testing utility) ----------------
router.post("/supervisors/availability/all", async (req, res) => {
  try {
    const result = await Supervisor.updateMany({}, { $set: { availability: "Available" } });
    return res.json({ success: true, matched: result.matchedCount ?? result.n, modified: result.modifiedCount ?? result.nModified });
  } catch (err) {
    console.error("Set all supervisors available error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
