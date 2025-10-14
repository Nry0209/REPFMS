// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import Supervisor from "../models/Supervisor.js";
// import Researcher from "../models/Researcher.js";
// import Admin from "../models/Admin.js";

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
// };

// // Supervisor Registration
// export const registerSupervisor = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       phone,
//       address,
//       title,
//       affiliation,
//       experience,
//       domains,
//       studies,
//     } = req.body;

//     const exists = await Supervisor.findOne({ email });
//     if (exists) return res.status(400).json({ message: "Email already registered" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const transcriptsMap = {
//       "Bachelor's Degree": req.files["transcripts_bachelor"]?.[0]?.path || null,
//       "Master's Degree": req.files["transcripts_master"]?.[0]?.path || null,
//       "Postgraduate Diploma": req.files["transcripts_postgraduate"]?.[0]?.path || null,
//       "Doctoral Degree": req.files["transcripts_doctoral"]?.[0]?.path || null,
//     };

//     const supervisor = await Supervisor.create({
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       address,
//       title,
//       affiliation,
//       experience,
//       domains: Array.isArray(domains) ? domains : [domains],
//       studies: Array.isArray(studies) ? studies : [studies],
//       cvFile: req.files["cvFile"] ? req.files["cvFile"][0].path : null,
//       transcripts: transcriptsMap,
//     });

//     res.status(201).json({
//       _id: supervisor._id,
//       name: supervisor.name,
//       email: supervisor.email,
//       role: "supervisor",
//       token: generateToken(supervisor._id),
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ Common Login for all roles
// export const loginUser = async (req, res) => {
//   const { email, password, role } = req.body;

//   try {
//     let user;

//     if (role === "supervisor") user = await Supervisor.findOne({ email });
//     else if (role === "researcher") user = await Researcher.findOne({ email });
//     else if (role === "admin") user = await Admin.findOne({ email });
//     else return res.status(400).json({ message: "Invalid role" });

//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role,
//       token: generateToken(user._id, role),
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Server error during login" });
//   }
// };

// // Supervisor Login
// export const loginSupervisor = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const supervisor = await Supervisor.findOne({ email });
//     if (!supervisor) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, supervisor.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     res.json({
//       _id: supervisor._id,
//       name: supervisor.name,
//       email: supervisor.email,
//       token: generateToken(supervisor._id),
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Supervisor from "../models/Supervisor.js";
import Researcher from "../models/Researcher.js";
import Admin from "../models/Admin.js";

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

// ✅ Supervisor Registration
export const registerSupervisor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      title,
      affiliation,
      experience,
      domains,
      studies,
    } = req.body;

    const exists = await Supervisor.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const transcriptsMap = {
      "Bachelor's Degree": req.files["transcripts_bachelor"]?.[0]?.path || null,
      "Master's Degree": req.files["transcripts_master"]?.[0]?.path || null,
      "Postgraduate Diploma":
        req.files["transcripts_postgraduate"]?.[0]?.path || null,
      "Doctoral Degree":
        req.files["transcripts_doctoral"]?.[0]?.path || null,
    };

    const supervisor = await Supervisor.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      title,
      affiliation,
      experience,
      domains: Array.isArray(domains) ? domains : [domains],
      studies: Array.isArray(studies) ? studies : [studies],
      cvFile: req.files["cvFile"] ? req.files["cvFile"][0].path : null,
      transcripts: transcriptsMap,
    });

    res.status(201).json({
      _id: supervisor._id,
      name: supervisor.name,
      email: supervisor.email,
      role: "supervisor",
      token: generateToken(supervisor._id, "supervisor"),
    });
  } catch (err) {
    console.error("Supervisor Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Common Login for Admin, Researcher, Supervisor
export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;

    if (role === "supervisor") user = await Supervisor.findOne({ email });
    else if (role === "researcher") user = await Researcher.findOne({ email });
    else if (role === "admin") user = await Admin.findOne({ email });
    else return res.status(400).json({ message: "Invalid role" });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role,
      token: generateToken(user._id, role),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

