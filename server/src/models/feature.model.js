import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  },

  name: { type: String, required: true },
  key: { type: String, required: true },

  description: String,
  enabled: { type: Boolean, default: true },

  config: mongoose.Schema.Types.Mixed

}, { timestamps: true });

featureSchema.index({ organizationId: 1, key: 1 }, { unique: true });

export default mongoose.model("Feature", featureSchema);