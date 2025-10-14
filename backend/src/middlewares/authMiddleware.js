// import jwt from "jsonwebtoken";
// import Supervisor from "../models/Supervisor.js";
// import Researcher from "../models/Researcher.js";

// export const protect = async (req, res, next) => {
//   try {
//     let token;

//     if (req.headers.authorization?.startsWith("Bearer")) {
//       token = req.headers.authorization.split(" ")[1];
//       console.log("Token received:", token.substring(0, 20) + "...");
//     }

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized, no token",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded token:", decoded);

//     const supervisor = await Supervisor.findById(decoded.id || decoded.supervisorId)
//       .select("-password")
//       .populate("supervisions");

//     if (!supervisor) {
//       console.log("No supervisor found for ID:", decoded.id || decoded.supervisorId);
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized, supervisor not found",
//       });
//     }

//     req.user = supervisor;
//     next();

//   } catch (error) {
//     console.error("Auth middleware error:", error);
//     return res.status(401).json({
//       success: false,
//       message: "Not authorized, token failed",
//       error: error.message,
//     });
//   }
// };

import jwt from "jsonwebtoken";
import Supervisor from "../models/Supervisor.js";
import Researcher from "../models/Researcher.js";

export const protect = async (req, res, next) => {
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

    const supervisor = await Supervisor.findById(decoded.id || decoded.supervisorId)
      .select("-password")
      .populate("supervisions");

    if (!supervisor) {
      console.log("No supervisor found for ID:", decoded.id || decoded.supervisorId);
      return res.status(401).json({
        success: false,
        message: "Not authorized, supervisor not found",
      });
    }

    req.user = supervisor;
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
