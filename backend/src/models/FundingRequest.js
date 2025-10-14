import mongoose from "mongoose";

const FundingRequestSchema = new mongoose.Schema(
  {
    researcher: { type: mongoose.Schema.Types.ObjectId, ref: "Researcher", required: true },
    projectTitle: { type: String, required: true },
    supervisorApproval: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    ministryApproval: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    reason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("FundingRequest", FundingRequestSchema);
