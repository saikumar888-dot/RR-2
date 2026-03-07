import organizationModel from "../models/organization.model.js"

export const createOrganization = async (req, res) => {
  try {
    const { name, industry } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Organization name is required"
      });
    }

    const existingOrg = await organizationModel.findOne({ name });

    if (existingOrg) {
      return res.status(409).json({
        success: false,
        message: "Organization with this name already exists"
      });
    }

    const organization = await organizationModel.create({
      name: name.trim(),
      industry
    });

    return res.status(201).json({
      success: true,
      message: "Organization createdeeee successfully",
      data: organization
    });

  } catch (error) {
    console.error("Create Organization Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating organization"
    });
  }
};

export const editOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, industry, isActive } = req.body;

    const organization = await organizationModel.findById(id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found"
      });
    }

    if (name) organization.name = name.trim();
    if (industry !== undefined) organization.industry = industry;
    if (isActive !== undefined) organization.isActive = isActive;

    await organization.save();

    return res.status(200).json({
      success: true,
      message: "Organization updated successfully",
      data: organization
    });

  } catch (error) {
    console.error("Edit Organization Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating organization"
    });
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const organization = await organizationModel.findById(id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found"
      });
    }

    organization.isActive = false;
    await organization.save();

    return res.status(200).json({
      success: true,
      message: "Organization deactivated successfully"
    });

  } catch (error) {
    console.error("Delete Organization Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting organization"
    });
  }
};

export const getAllOrganizations = async (req, res) => {
  try {
    const { includeInactive } = req.query;

    let filter = {};

    if (includeInactive !== "true") {
      filter.isActive = true;
    }

    const organizations = await organizationModel
      .find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations
    });

  } catch (error) {
    console.error("Get All Organizations Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching organizations"
    });
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;

    const organization = await organizationModel.findById(id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: organization
    });

  } catch (error) {
    console.error("Get Organization By ID Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID format"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while fetching organization"
    });
  }
};