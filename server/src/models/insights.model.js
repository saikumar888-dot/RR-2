import mongoose from "mongoose";

const insightSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  },

  metricId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MetricDefinition"
  },

  summary: String,
  trend: String,
  recommendation: String,

  periodType: String,
  periodStart: Date,
  periodEnd: Date

}, { timestamps: true });

export default mongoose.model("Insight", insightSchema);