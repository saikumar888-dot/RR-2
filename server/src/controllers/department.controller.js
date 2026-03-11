import departmentModel from '../models/department.model.js'
import userModel from '../models/user.model.js'
import Expense from '../models/expense.model.js';
import Revenue from '../models/revenue.model.js'
import { Activity } from '../models/activity.model.js';

export const createDepartment = async (req, res) => {
  try {
    const {
      organizationId,
      name,
      description,
      headId,
      budgetAllocated
    } = req.body;

    if (!organizationId || !name) {
      return res.status(400).json({
        success: false,
        message: "Organization ID and Department name are required"
      });
    }

    const existingDepartment = await departmentModel.findOne({
      organizationId,
      name: name.trim()
    });

    if (existingDepartment) {
      return res.status(409).json({
        success: false,
        message: "Department with this name already exists in this organization"
      });
    }

    const department = await departmentModel.create({
      organizationId,
      name: name.trim(),
      description,
      headId: headId || null,
      budgetAllocated: budgetAllocated || 0
    });

    const activitydepartment = await Activity.create({
      organizationId,
      description: "Department Added to the Organization !!!"
    })

    console.log(activitydepartment);

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department
    });

  } catch (error) {
    console.error("Create Department Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating department"
    });
  }
};

/**
 * @desc    Edit Department
 * @route   PUT /api/departments/:id
 */
export const editDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      headId,
      budgetAllocated,
      budgetUsed
    } = req.body;

    const department = await departmentModel.findById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    if (name) department.name = name.trim();
    if (description !== undefined) department.description = description;
    if (headId !== undefined) department.headId = headId;
    if (budgetAllocated !== undefined) department.budgetAllocated = budgetAllocated;
    if (budgetUsed !== undefined) department.budgetUsed = budgetUsed;

    await department.save();

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department
    });

  } catch (error) {
    console.error("Edit Department Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID format"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating department"
    });
  }
};

/**
 * @desc    Delete Department
 * @route   DELETE /api/departments/:id
 */
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await departmentModel.findById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    await department.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully"
    });

  } catch (error) {
    console.error("Delete Department Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID format"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while deleting department"
    });
  }
};

/**
 * @desc    Get All Departments (by organization)
 * @route   GET /api/departments?organizationId=xxx
 */
export const getAllDepartment = async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required"
      });
    }

    const departments = await departmentModel.find({ organizationId })
      .populate("headId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });

  } catch (error) {
    console.error("Get All Departments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching departments"
    });
  }
};

/**
 * @desc    Get Department By ID
 * @route   GET /api/departments/:id
 */
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await departmentModel.findById(id)
      .populate("headId", "name email");

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: department
    });

  } catch (error) {
    console.error("Get Department By ID Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID format"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while fetching department"
    });
  }
};

export const getDepartmentExpense = async (req , res) => {
  try {
    const { departmentId } = req.params;

    const expenses = await Expense.find({
      departmentId: departmentId,
      isActive: true
    })
    .sort({ expenseDate: -1 })
    .limit(7)
    .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching the departments",
      error: error.message
    })
  }
}

export const getDepartmentRevenue = async (req , res) => {
  try {
    const { departmentId } = req.params

    if(!departmentId) {
      return res.status(400).json({
        success: false,
        message: "Department ID is required"
      })
    }

    const revenues = await Revenue.find({
      departmentId: departmentId,
      isActive: true
    })
    .sort({ receivedDate: -1 }) // latest first
    .limit(7)
    .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      count: revenues.length,
      data: revenues
    })
  } catch (error) {
    console.error("Error fetching latest revenues:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
}

export const getCashFlow = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const { period } = req.query; // week | month | year

    let startDate = new Date();
    const now = new Date();

    if (period === "week") {
      startDate.setDate(now.getDate() - 7);
    } else if (period === "month") {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === "year") {
      startDate.setFullYear(now.getFullYear() - 1);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid period. Use week, month, or year."
      });
    }

    // Revenue aggregation
    const revenueResult = await Revenue.aggregate([
      {
        $match: {
          organizationId: req.user.organizationId,
          isActive: true,
          receivedDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);

    // Expense aggregation
    const expenseResult = await Expense.aggregate([
      {
        $match: {
          organizationId: req.user.organizationId,
          isActive: true,
          expenseDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" }
        }
      }
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const totalExpense = expenseResult[0]?.totalExpense || 0;

    const cashFlow = totalRevenue - totalExpense;

    return res.status(200).json({
      success: true,
      period,
      totalRevenue,
      totalExpense,
      cashFlow
    });

  } catch (error) {
    console.error("Cash Flow Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};