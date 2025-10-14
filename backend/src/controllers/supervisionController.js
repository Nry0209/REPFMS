import Supervision from "../models/Supervision.js";
import Researcher from "../models/Researcher.js";
import Supervisor from "../models/Supervisor.js";

// Get available supervisors for a researcher's domains
export const getAvailableSupervisors = async (req, res) => {
  try {
    const researcher = await Researcher.findById(req.user._id);
    if (!researcher) return res.status(404).json({ success: false, message: "Researcher not found" });

    // Get supervisors whose domains intersect with researcher's domains
    const supervisors = await Supervisor.find({
      domains: { $in: researcher.domains },
      $expr: { $lt: [{ $size: "$currentSupervisions" }, 5] }, // supervisor limit: 5
    }).lean();

    res.status(200).json({ success: true, data: supervisors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Request supervision
export const requestSupervision = async (req, res) => {
  try {
    const { supervisorId, projectId } = req.body;

    const researcher = await Researcher.findById(req.user._id);
    const supervisor = await Supervisor.findById(supervisorId);
    const project = await researcher.researches.find(r => r._id.toString() === projectId);

    if (!supervisor || !project)
      return res.status(404).json({ success: false, message: "Supervisor or project not found" });

    // Check if supervisor has availability
    const currentCount = await Supervision.countDocuments({ supervisor: supervisorId, status: "Current" });
    if (currentCount >= 5)
      return res.status(400).json({ success: false, message: "Supervisor has reached max supervision limit" });

    // Check if researcher has another current supervision
    const existing = await Supervision.findOne({ researcher: researcher._id, status: "Current" });
    if (existing) return res.status(400).json({ success: false, message: "You already have a current supervision" });

    // Create supervision request (Pending)
    const supervision = await Supervision.create({
      supervisor: supervisorId,
      researcher: researcher._id,
      projectTitle: project.title,
      status: "Pending",
    });

    res.status(201).json({ success: true, data: supervision, message: "Supervision request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Fetch researcher's supervisions
export const getResearcherSupervisions = async (req, res) => {
  try {
    const supervisions = await Supervision.find({ researcher: req.user._id })
      .populate("supervisor", "name email domains")
      .lean();

    res.status(200).json({ success: true, data: supervisions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Request funding (only if supervision finished & feasible)
export const requestFunding = async (req, res) => {
  try {
    const { supervisionId } = req.body;
    const supervision = await Supervision.findById(supervisionId);

    if (!supervision) return res.status(404).json({ success: false, message: "Supervision not found" });
    if (supervision.status !== "Finished" || supervision.feasibility !== "Feasible")
      return res.status(400).json({ success: false, message: "Funding not allowed for this supervision" });

    supervision.fundingRequested = true;
    await supervision.save();

    res.status(200).json({ success: true, message: "Funding request submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
