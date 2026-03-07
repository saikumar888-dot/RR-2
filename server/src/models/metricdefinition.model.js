import mongoose from "mongoose";

const metricDefinitionSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  },

  featureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feature",
    default: null
  },

  name: { type: String, required: true },
  key: { type: String, required: true },

  dataType: {
    type: String,
    enum: ["number", "currency", "percentage", "boolean", "string", "json"],
    required: true
  },

  departmentScoped: { type: Boolean, default: true },
  editableByCEO: { type: Boolean, default: true }

}, { timestamps: true });

metricDefinitionSchema.index({ organizationId: 1, key: 1 }, { unique: true });

export default mongoose.model("MetricDefinition", metricDefinitionSchema);