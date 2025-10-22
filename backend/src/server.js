import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Import routes
import supervisorRoutes from "./routes/supervisorRoutes.js";
import researcherRoutes from "./routes/researcherRoutes.js";
import supervisionRoutes from "./routes/supervisionRoutes.js";
import ministryRoutes from "./routes/MinistryRoutes.js";
import fundingRoutes from "./routes/fundingRoutes.js";
import researchRoutes from "./routes/researchRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables
dotenv.config();
const app = express();

// File and directory name helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware: Request logging
app.use((req, res, next) => {
  console.log(`🟢 ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ CORS setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Body parsers
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// ✅ Create uploads directory structure if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
const uploadsDirs = [
  path.join(uploadsDir, "researcher/cv"),
  path.join(uploadsDir, "researcher/transcripts"),
  path.join(uploadsDir, "supervisor/cv"),
  path.join(uploadsDir, "supervisor/transcripts"),
  path.join(uploadsDir, "research"),
  path.join(uploadsDir, "funding"),
];

uploadsDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// ✅ Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ Connect MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

// ✅ Health check route
app.get("/", (req, res) => {
  res.json({
    message: "Research Expert Pooling System API",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ✅ API Routes
app.use("/api/supervisors", supervisorRoutes);
app.use("/api/researchers", researcherRoutes);
app.use("/api/supervisions", supervisionRoutes);
// Alias to support clients using singular base path
app.use("/api/supervision", supervisionRoutes);
app.use("/api/ministry", ministryRoutes);
app.use("/api/funding", fundingRoutes);
app.use("/api/researches", researchRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Global Error Handling
app.use((error, req, res, next) => {
  console.error("❌ Error Handler:", error);

  // Validation errors
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: Object.values(error.errors).map((e) => e.message),
    });
  }

  // Duplicate key errors
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate entry detected",
    });
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // Multer errors (file upload)
  if (error.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: `File upload error: ${error.message}`,
    });
  }

  // Default error response
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// ✅ Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      supervisors: "/api/supervisors",
      researchers: "/api/researchers",
      supervisions: "/api/supervisions",
      ministry: "/api/ministry",
      funding: "/api/funding",
      health: "/api/health",
    },
  });
});

// ✅ Graceful shutdown handlers
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("👋 SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("\n" + "=".repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📡 API Base: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log("=".repeat(50) + "\n");
});

export default app;
