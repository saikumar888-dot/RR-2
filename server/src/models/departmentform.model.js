import mongoose from "mongoose";

const departmentFormSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  },

  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },

  title: String,

  metrics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "MetricDefinition"
  }],

  frequency: {
    type: String,
    enum: ["Monthly", "Quarterly", "Yearly"]
  }

}, { timestamps: true });

export default mongoose.model("DepartmentForm", departmentFormSchema);