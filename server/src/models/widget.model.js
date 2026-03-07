import mongoose from "mongoose";

const widgetSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  },

  title: String,

  type: {
    type: String,
    enum: ["card", "line_chart", "bar_chart", "table"]
  },

  metrics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "MetricDefinition"
  }],

  visibleToRoles: {
    type: [String],
    enum: ["CEO" , "HOD" , "FINANCE" , "ADMIN"],
    default: ["CEO"]
  } ,

  position: {
    row: Number,
    col: Number,
    width: Number,
    height: Number
  }

}, { timestamps: true });

export default mongoose.model("Widget", widgetSchema);