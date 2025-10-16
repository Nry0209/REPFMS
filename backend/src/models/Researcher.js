// import mongoose from "mongoose";

// const researcherSchema = new mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       required: [true, "Full name is required"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/.+\@.+\..+/, "Please enter a valid email address"],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters"],
//     },
//     degree: {
//       type: String,
//       trim: true,
//     },
//     domains: {
//       type: [String],
//       validate: {
//         validator: function (arr) {
//           return arr.length > 0 && arr.length <= 3;
//         },
//         message: "You must select between 1 and 3 domains",
//       },
//     },
//     grants: {
//       type: String,
//       trim: true,
//     },
//     collaborations: {
//       type: String,
//       trim: true,
//     },
//     degree: { type: String, required: true, trim: true },
//     domains: {
//       type: [String],
//       required: true,
//       validate: {
//         validator: function (arr) { return arr.length > 0 && arr.length <= 3; },
//         message: "A researcher must have between 1 and 3 domains",
//       },
//     },
//     grants: { type: String, trim: true },
//     collaborations: { type: String, trim: true },
//     cvFile: { type: String, trim: true },
//     linkedin: { type: String, trim: true },
//     scopus: { type: String, trim: true },
//     googleScholar: { type: String, trim: true },
//     transcripts: { type: Map, of: String },

//     profileImage: { type: String, default: "uploads/researcher/profile/default.jpg" },
//     skills: { type: [String], default: [] },
//     awards: { type: [String], default: [] },

//     researches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Research" }],
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Researcher", researcherSchema);

import mongoose from "mongoose";

const researcherSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    degree: {
      type: String,
      trim: true,
    },
    domains: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length > 0 && arr.length <= 3;
        },
        message: "You must select between 1 and 3 domains",
      },
    },
    grants: {
      type: String,
      trim: true,
    },
    collaborations: {
      type: String,
      trim: true,
    },
    profilePhoto: {
      type: String, // file path for uploaded profile photo
    },
    cvFile: {
      type: String, // file path for uploaded CV
    },
    transcripts: {
      type: Map,
      of: String, // qualification -> transcript file path
      default: {},
    },
    linkedin: {
      type: String,
      trim: true,
    },
    scopus: {
      type: String,
      trim: true,
    },
    googleScholar: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    awards: {
      type: [String],
      default: [],
    },
    qualifications: {
      type: [String],
      default: [],
    },
    researches: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Research" },
    ],
    currentResearch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Research",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Researcher", researcherSchema);
