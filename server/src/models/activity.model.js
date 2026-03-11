import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Activity = mongoose.model("Activity", activitySchema);