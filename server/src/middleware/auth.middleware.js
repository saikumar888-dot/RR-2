import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ First check cookies (since you're using httpOnly cookies)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2️⃣ Fallback to Authorization header (optional support)
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided."
      });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4️⃣ Fetch user from DB
    const user = await userModel.findById(decoded.userId).select("-passwordHash");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found."
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive."
      });
    }

    // 5️⃣ Attach user to request
    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Invalid token."
    });
  }
};