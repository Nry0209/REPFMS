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
      select: false,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: 'researcher',
      enum: ['researcher'],
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
      type: String,
      default: "uploads/researcher/profile/default.jpg"
    },
    cvFile: {
      type: String
    },
    transcripts: {
      type: Map,
      of: String,
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add any additional methods or pre-save hooks here if needed

const Researcher = mongoose.model("Researcher", researcherSchema);

export default Researcher;
