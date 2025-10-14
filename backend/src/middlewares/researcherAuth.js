// import jwt from "jsonwebtoken";
// import Researcher from "../models/Researcher.js";

// export const protectResearcher = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ success: false, message: "Not authorized" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await Researcher.findById(decoded.id).select("-password");
//     if (!req.user) return res.status(401).json({ success: false, message: "User not found" });

//     next();
//   } catch (err) {
//     console.error("Protect middleware error:", err);
//     res.status(401).json({ success: false, message: "Token invalid or expired" });
//   }
// };

// backend/middleware/researcherAuth.js
import jwt from "jsonwebtoken";
import Researcher from "../models/Researcher.js";

export const protectResearcher = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token.substring(0, 20) + "...");
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const researcher = await Researcher.findById(decoded.id || decoded.researcherId)
      .select("-password")
      .populate("researches");

    if (!researcher) {
      console.log("No researcher found for ID:", decoded.id || decoded.researcherId);
      return res.status(401).json({
        success: false,
        message: "Not authorized, researcher not found",
      });
    }

    req.user = researcher;
    next();

  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
      error: error.message,
    });
  }
};