import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    category: {
      type: String,
      enum: [
        "Salary",
        "Marketing",
        "Operations",
        "Software",
        "Infrastructure",
        "Travel",
        "Utilities",
        "Miscellaneous"
      ],
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    currency: {
      type: String,
      default: "INR"
    },

    expenseType: {
      type: String,
      enum: ["Recurring", "OneTime"],
      required: true
    },

    billingCycle: {
      type: String,
      enum: ["Monthly", "Quarterly", "Yearly", null],
      default: null
    },

    expenseDate: {
      type: Date,
      required: true,
      index: true
    },

    vendorName: {
      type: String,
      trim: true
    },

    invoiceNumber: {
      type: String
    },

    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// 🔹 Compound index for analytics performance
expenseSchema.index({ organizationId: 1, departmentId: 1 });

// 🔹 Index for faster date-based reports
expenseSchema.index({ expenseDate: -1 });

export default mongoose.model("Expense", expenseSchema);