import mongoose from "mongoose";

const researchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    // Optional: path or URL to the research paper file
    paperUrl: {
      type: String,
      trim: true
    },
    domains: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0 && arr.length <= 3;
        },
        message: "A research must have between 1 and 3 domains"
      }
    },
    researcher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Researcher",
      required: true
    },
    // Status used by dashboard grouping
    status: {
      type: String,
      enum: ["Pending", "Current", "Finished"],
      default: "Pending",
    },
    // Optional feasibility for funding flow
    feasibility: {
      type: String,
      enum: ["Feasible", "Not Feasible", null],
      default: null,
    },
    // Co-actors (other researchers in same project)
    coResearchers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Researcher" }],
    // Supervisor assigned to this research
    supervisor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Supervisor",
      default: null
    },
    supervisorStatus: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    // Optional reference to supervision if linked
    supervisionRef: { type: mongoose.Schema.Types.ObjectId, ref: "Supervision" },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add text index for search
researchSchema.index({ title: 'text', description: 'text', domains: 'text' });

// Virtual for research's URL
researchSchema.virtual('url').get(function() {
  return `/api/researches/${this._id}`;
});

export default mongoose.model("Research", researchSchema);
