import mongoose from "mongoose";

const metricDataSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  },

  metricId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MetricDefinition",
    required: true
  },

  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    default: null
  },

  value: mongoose.Schema.Types.Mixed,

  periodType: {
    type: String,
    enum: ["Daily", "Monthly", "Quarterly", "Yearly"]
  },

  periodStart: Date,
  periodEnd: Date,

  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  }

}, { timestamps: true });

export default mongoose.model("MetricData", metricDataSchema);