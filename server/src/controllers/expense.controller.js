import Expense from "../models/expense.model.js";
import Department from "../models/department.model.js";
import { Activity } from "../models/activity.model.js";

/* =====================================================
   CREATE EXPENSE
   - Updates department.budgetUsed
===================================================== */
export const createExpense = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      departmentId,
      title,
      description,
      category,
      amount,
      currency,
      expenseType,
      billingCycle,
      expenseDate,
      vendorName,
      invoiceNumber
    } = req.body;

    if (!departmentId || !title || !category || !amount || !expenseDate) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0"
      });
    }

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    // Organization safety
    if (
      department.organizationId.toString() !==
      req.user.organizationId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized department access"
      });
    }

    // Budget check
    if (department.budgetUsed + amount > department.budgetAllocated) {
      return res.status(400).json({
        success: false,
        message: "Budget exceeded for this department"
      });
    }

    const expense = await Expense.create({
      organizationId: req.user.organizationId,
      departmentId,
      title,
      description,
      category,
      amount,
      currency: currency || "INR",
      expenseType,
      billingCycle: billingCycle || null,
      expenseDate,
      vendorName,
      invoiceNumber,
      createdBy: req.user._id
    });

    // Update department budget
    department.budgetUsed += amount;
    await department.save();

    const activityexpense = await Activity.create({
      organizationId: req.user.organizationId,
      description: `Expense of ${amount} generated !!! `
    })

    console.log(activityexpense);

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense
    });

  } catch (error) {
    console.error("Create Expense Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* =====================================================
   UPDATE EXPENSE
   - Adjusts department budget correctly
===================================================== */
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    if (
      expense.organizationId.toString() !==
      req.user.organizationId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const department = await Department.findById(expense.departmentId);

    // If amount is being updated → adjust budget
    if (req.body.amount !== undefined) {
      const difference = req.body.amount - expense.amount;

      if (department.budgetUsed + difference > department.budgetAllocated) {
        return res.status(400).json({
          success: false,
          message: "Budget exceeded"
        });
      }

      department.budgetUsed += difference;
      await department.save();
    }

    Object.keys(req.body).forEach(key => {
      expense[key] = req.body[key];
    });

    await expense.save();

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense
    });

  } catch (error) {
    console.error("Update Expense Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* =====================================================
   DELETE EXPENSE (Soft Delete + Budget Rollback)
===================================================== */
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    const department = await Department.findById(expense.departmentId);

    // Rollback budget
    department.budgetUsed -= expense.amount;
    await department.save();

    expense.isActive = false;
    await expense.save();

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully"
    });

  } catch (error) {
    console.error("Delete Expense Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* =====================================================
   GET EXPENSES (Filtered)
===================================================== */
export const getExpenses = async (req, res) => {
  try {
    const { departmentId, startDate, endDate, category } = req.query;

    const filter = {
      organizationId: req.user.organizationId,
      isActive: true
    };

    if (departmentId) filter.departmentId = departmentId;
    if (category) filter.category = category;

    if (startDate || endDate) {
      filter.expenseDate = {};
      if (startDate) filter.expenseDate.$gte = new Date(startDate);
      if (endDate) filter.expenseDate.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter)
      .populate("departmentId", "name")
      .sort({ expenseDate: -1 });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });

  } catch (error) {
    console.error("Get Expenses Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* =====================================================
   ANALYTICS
===================================================== */

export const getTotalExpense = async (req, res) => {
  const result = await Expense.aggregate([
    { $match: { organizationId: req.user.organizationId, isActive: true } },
    { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
  ]);

  return res.json({
    success: true,
    totalExpense: result[0]?.totalExpense || 0
  });
};

export const getExpenseByDepartment = async (req, res) => {
  const result = await Expense.aggregate([
    { $match: { organizationId: req.user.organizationId, isActive: true } },
    { $group: { _id: "$departmentId", total: { $sum: "$amount" } } }
  ]);

  return res.json({ success: true, data: result });
};

export const getExpenseByCategory = async (req, res) => {
  const result = await Expense.aggregate([
    { $match: { organizationId: req.user.organizationId, isActive: true } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } }
  ]);

  return res.json({ success: true, data: result });
};

export const getExpenseTrend = async (req, res) => {
  const result = await Expense.aggregate([
    { $match: { organizationId: req.user.organizationId, isActive: true } },
    {
      $group: {
        _id: { $month: "$expenseDate" },
        total: { $sum: "$amount" }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  return res.json({ success: true, data: result });
};

export const getExpensesByOrganization = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const expenses = await Expense.find({
      organizationId: req.user.organizationId,
      isActive: true
    })
      .populate("departmentId", "name")
      .populate("createdBy", "name email role")
      .sort({ expenseDate: -1 });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });

  } catch (error) {
    console.error("Get Organization Expenses Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

