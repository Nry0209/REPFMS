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
import { loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

// POST /api/admin/login
router.post("/login", loginAdmin);

export default router;
