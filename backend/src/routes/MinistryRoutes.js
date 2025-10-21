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

// ---------------- Ministry: Verify domain overlap for a supervision ----------------
router.post("/supervisions/:id/verify-domain", async (req, res) => {
  try {
    const supervision = await Supervision.findById(req.params.id);
    if (!supervision) return res.status(404).json({ success: false, message: "Supervision not found" });

    const supervisor = await Supervisor.findById(supervision.supervisor).select("domains");
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
    const approved = overlap.length > 0;

    if (approved) {
      supervision.verifiedByMinistry = true;
      await supervision.save();
    }

    return res.json({
      success: true,
      approved,
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
