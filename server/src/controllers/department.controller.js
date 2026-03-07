import departmentModel from '../models/department.model.js'
import userModel from '../models/user.model.js'

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