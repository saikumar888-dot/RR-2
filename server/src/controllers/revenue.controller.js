import Revenue from '../models/revenue.model.js';
import Department from '../models/department.model.js';
import { Activity } from '../models/activity.model.js';

/**
 * ======================================
 * CREATE REVENUE
 * ======================================
 */
export const createRevenue = async (req, res) => {
  try {

    // Ensure user exists (safety check)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login."
      });
    }

    const {
      departmentId,
      source,
      clientName,
      amount,
      currency,
      type,
      billingCycle,
      region,
      receivedDate,
      invoiceNumber
    } = req.body;

    // 1️⃣ Basic validation
    if (!departmentId || !amount || !type || !receivedDate) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Revenue amount must be greater than 0"
      });
    }

    // 2️⃣ Check if department exists
    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    // 3️⃣ Organization safety check
    if (
      department.organizationId.toString() !==
      req.user.organizationId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized department access"
      });
    }

    // 4️⃣ Role restriction for HOD
    if (req.user.role === "HOD") {
      if (
        !req.user.departmentId ||
        req.user.departmentId.toString() !== departmentId
      ) {
        return res.status(403).json({
          success: false,
          message: "HOD can only create revenue for their department"
        });
      }
    }

    // 5️⃣ Create revenue properly
    const revenue = await Revenue.create({
      organizationId: req.user.organizationId,
      departmentId,
      source,
      clientName,
      amount,
      currency: currency || "USD",
      type,
      billingCycle: billingCycle || null,
      region,
      receivedDate,
      invoiceNumber,
      createdBy: req.user._id
    });

    const activityrevenue = await Activity.create({
      organizationId: req.user.organizationId,
      description: `Revenue of ${amount} generated !!! :)`
    })

    return res.status(201).json({
      success: true,
      message: "Revenue created successfully",
      data: revenue
    });

  } catch (error) {
    console.error("Create Revenue Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while creating revenue"
    });
  }
};

export const updateRevenue = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login."
      });
    }


    // yeh ID revenue document ki hai 
    const { id } = req.params;

    const revenue = await Revenue.findById(id);

    if (!revenue) {
      return res.status(404).json({
        success: false,
        message: "Revenue not found"
      });
    }

    // Organization safety
    if (
      revenue.organizationId.toString() !==
      req.user.organizationId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    // HOD restriction
    if (req.user.role === "HOD") {
      if (
        !req.user.departmentId ||
        req.user.departmentId.toString() !== revenue.departmentId.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "HOD can only update revenue of their department"
        });
      }
    }

    // Update allowed fields
    const allowedFields = [
      "source",
      "clientName",
      "amount",
      "currency",
      "type",
      "billingCycle",
      "region",
      "receivedDate",
      "invoiceNumber"
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        revenue[field] = req.body[field];
      }
    });

    await revenue.save();

    return res.status(200).json({
      success: true,
      message: "Revenue updated successfully",
      data: revenue
    });

  } catch (error) {
    console.error("Update Revenue Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating revenue"
    });
  }
};

export const deleteRevenue = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login."
      });
    }

    const { id } = req.params;

    const revenue = await Revenue.findById(id);

    if (!revenue) {
      return res.status(404).json({
        success: false,
        message: "Revenue not found"
      });
    }

    // Organization protection
    if (
      revenue.organizationId.toString() !==
      req.user.organizationId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    // HOD restriction
    if (req.user.role === "HOD") {
      if (
        !req.user.departmentId ||
        req.user.departmentId.toString() !== revenue.departmentId.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "HOD can only delete their department revenue"
        });
      }
    }

    revenue.isActive = false;
    await revenue.save();

    return res.status(200).json({
      success: true,
      message: "Revenue deleted successfully"
    });

  } catch (error) {
    console.error("Delete Revenue Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting revenue"
    });
  }
};

export const getRevenues = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login."
      });
    }

    const { departmentId, startDate, endDate, type } = req.query;

    const filter = {
      organizationId: req.user.organizationId,
      isActive: true
    };

    // HOD only sees their department
    if (req.user.role === "HOD") {
      filter.departmentId = req.user.departmentId;
    }

    // CEO / Admin can filter department
    if (departmentId && req.user.role !== "HOD") {
      filter.departmentId = departmentId;
    }

    if (type) {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.receivedDate = {};
      if (startDate) filter.receivedDate.$gte = new Date(startDate);
      if (endDate) filter.receivedDate.$lte = new Date(endDate);
    }

    const revenues = await Revenue.find(filter)
      .populate("departmentId", "name")
      .sort({ receivedDate: -1 });

    return res.status(200).json({
      success: true,
      count: revenues.length,
      data: revenues
    });

  } catch (error) {
    console.error("Get Revenues Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching revenues"
    });
  }
};

export const getRevenueByDepartment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login."
      });
    }

    const { departmentId } = req.params;

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: "Department ID is required"
      });
    }

    const filter = {
      organizationId: req.user.organizationId,
      departmentId,
      isActive: true
    };

    // HOD safety
    if (req.user.role === "HOD") {
      if (req.user.departmentId.toString() !== departmentId) {
        return res.status(403).json({
          success: false,
          message: "HOD can only view their department revenue"
        });
      }
    }

    const revenues = await Revenue.find(filter)
      .sort({ receivedDate: -1 });

    return res.status(200).json({
      success: true,
      count: revenues.length,
      data: revenues
    });

  } catch (error) {
    console.error("Get Revenue By Department Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching department revenue"
    });
  }
};

export const getTotalRevenue = async (req , res) => {
    try {
        if(!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const result = await Revenue.aggregate([
            {
                $match: {
                    organizationId: req.user.organizationId,
                    isActive: true
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount" }
                }
            }
        ])

        return res.status(200).json({
            success: true,
            totalRevenue: result[0]?.totalRevenue || 0
        })

    } catch (error) {
        console.error("Total Revenue Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}