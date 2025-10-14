import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const SupervisionSchema = new mongoose.Schema(
  {
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "Supervisor", required: true },
    researcher: { type: mongoose.Schema.Types.ObjectId, ref: "Researcher", required: true },
    projectTitle: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Current", "Finished"], default: "Pending" },
    feedbacks: [FeedbackSchema],
    durationMonths: { type: Number },
    fundingRequested: { type: Boolean, default: false }, // Add this
feasibility: { type: String, enum: ["Feasible", "Not Feasible", null], default: null },

  },
  { timestamps: true }
);

export default mongoose.model("Supervision", SupervisionSchema);
