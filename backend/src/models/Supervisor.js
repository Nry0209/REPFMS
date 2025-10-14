import mongoose from "mongoose";

const supervisorSchema = new mongoose.Schema(
  {
    // ✅ Basic account fields
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?\d{7,15}$/, "Please enter a valid phone number"],
    },
    address: {
      type: String,
      trim: true,
    },

    // ✅ Academic & professional details
    title: {
      type: String,
      trim: true,
    },
    affiliation: {
      type: String,
      trim: true,
    },
    experience: {
      type: Number,
      min: 0,
      max: 70,
    },
    domains: {
      type: [String],
      default: [],
    },
    studies: {
      type: [String],
      default: [],
    },

    // ✅ Uploaded documents
    cvFile: {
      type: String,
      trim: true,
    },
    transcripts: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ✅ Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // ✅ Security tracking
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLogin: { type: Date },

    // ✅ Profile customization
    profileImage: {
      data: Buffer,
      contentType: String,
      path: { type: String, default: "/profile-placeholder.png" },
      filename: String,
    },
    institution: { type: String, trim: true },
    department: { type: String, trim: true },
    availability: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Unavailable",
    },
    skills: {
      type: [String],
      default: [],
    },
    qualifications: {
      type: [String],
      default: [],
    },
    awards: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: [],
    },
    researchInterests: {
      type: [String],
      default: [],
    },

    // ✅ Supervision data
    supervisions: {
      type: [
        {
          title: String,
          researcher: String,
          status: {
            type: String,
            enum: ["Active", "Completed", "Under Review", "Pending"],
          },
          coResearchers: { type: [String], default: [] },
          duration: String,
          startDate: Date,
          progress: { type: Number, min: 0, max: 100 },
          budget: String,
          description: String,
        },
      ],
      default: [],
    },

    // ✅ Statistics
    statistics: {
      totalSupervisions: { type: Number, default: 0 },
      completedProjects: { type: Number, default: 0 },
      activeProjects: { type: Number, default: 0 },
      underReviewProjects: { type: Number, default: 0 },
      totalFunding: { type: String, default: "₨ 0" },
      averageProjectDuration: { type: String, default: "0 months" },
      successRate: { type: String, default: "0%" },
    },

    // ✅ Metadata
    joinDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Virtual: Account lock status
supervisorSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// ✅ Methods
supervisorSchema.methods.setProfileImage = function (file) {
  if (file) {
    this.profileImage = {
      data: file.buffer,
      contentType: file.mimetype,
      filename: file.originalname,
      path: `/uploads/supervisors/profileImages/${file.filename}`,
    };
  }
};

supervisorSchema.methods.getProfileImageUrl = function () {
  return this.profileImage?.path || "/profile-placeholder.png";
};

supervisorSchema.methods.getPrivateProfile = function () {
  const obj = this.toObject();
  delete obj.password;
  if (obj.profileImage?.data) delete obj.profileImage.data;
  return obj;
};

supervisorSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    title: this.title,
    affiliation: this.affiliation,
    experience: this.experience,
    domains: this.domains,
    studies: this.studies,
    profileImage: this.getProfileImageUrl(),
    institution: this.institution,
    department: this.department,
  };
};

// ✅ Static helpers
supervisorSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() }).select("+password");
};

// ✅ Login attempts
supervisorSchema.methods.incLoginAttempts = async function () {
  const lockTime = 2 * 60 * 60 * 1000;
  if (this.lockUntil && this.lockUntil < Date.now()) {
    this.loginAttempts = 1;
    this.lockUntil = undefined;
  } else {
    this.loginAttempts += 1;
    if (this.loginAttempts >= 5 && !this.isLocked) {
      this.lockUntil = Date.now() + lockTime;
    }
  }
  await this.save();
};

supervisorSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  this.lastLogin = new Date();
  await this.save();
};

const Supervisor = mongoose.model("Supervisor", supervisorSchema);
export default Supervisor;
