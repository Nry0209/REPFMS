import express from "express";
const router = express.Router();

// Example funding route
router.get("/", (req, res) => {
  res.json({ message: "Funding routes working" });
});

export default router;
