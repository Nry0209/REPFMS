import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    forRole: { type: String, enum: ["admin", "researcher", "supervisor"], required: true },
    forUser: { type: mongoose.Schema.Types.ObjectId, refPath: "forRoleRef", default: null },
    // optional: which collection for forUser (Researcher, Supervisor, Admin)
    forRoleRef: { type: String, enum: ["Admin", "Researcher", "Supervisor"], default: null },
    type: { type: String, required: true },
    message: { type: String, required: true },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);
