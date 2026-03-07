import mongoose from "mongoose";

const cashFlowSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  },

  periodType: {
    type: String,
    enum: ["Daily", "Monthly", "Quarterly", "Yearly"],
    required: true
  },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  totalRevenue: { type: Number, required: true },
  totalExpense: { type: Number, required: true },

  grossProfit: { type: Number, default: 0 },
  netProfit: { type: Number, default: 0 },

  burnRate: { type: Number, default: 0 },
  runwayMonths: { type: Number, default: 0 },

  cashInBank: { type: Number, required: true },

  previousRevenue: Number,
  revenueGrowthPercent: Number,

  previousExpense: Number,
  expenseGrowthPercent: Number

}, { timestamps: true });

export default mongoose.model("CashFlow", cashFlowSchema);