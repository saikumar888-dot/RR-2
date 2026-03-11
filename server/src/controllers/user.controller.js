import userModel from "../models/user.model.js"
import departmentModel from '../models/department.model.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Activity } from "../models/activity.model.js"

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive"
      });
    }

    const isMatch = await bcryptjs.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔥 Save token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const logout = async (req, res) => {
  try {

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict"
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const register = async (req, res) => {
  try {
    const {
      organizationId,
      name,
      email,
      password,
      role,
      departmentId
    } = req.body;

    // Basic validation
    if (!organizationId || !name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // Check if email already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);

    // Create user
    const newUser = await userModel.create({
      organizationId,
      name,
      email,
      passwordHash,
      role,
      departmentId: departmentId || null
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Save token in cookie (auto login after register)
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    await Activity.create({
      organizationId,
      description: "A new User has been created !!! "
    })

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      name,
      role,
      departmentId,
      isActive,
      password
    } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update allowed fields only
    if (name) user.name = name;
    if (role) user.role = role;
    if (departmentId !== undefined) user.departmentId = departmentId;
    if (isActive !== undefined) user.isActive = isActive;

    // If password is provided → re-hash
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      user.passwordHash = await bcryptjs.hash(password, salt);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
        isActive: user.isActive
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * ===============================
 * GET ALL USERS BY ORGANIZATION
 * ===============================
 * @route GET /api/users?organizationId=xxx
 */
export const getUsersByOrganization = async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required"
      });
    }

    const users = await userModel
      .find({ organizationId })
      .select("-passwordHash") // exclude password
      .populate("departmentId", "name") // show department name only
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    console.error("Get Users By Organization Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID format"
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCurrentUser = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};