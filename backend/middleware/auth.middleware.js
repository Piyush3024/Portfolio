import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware to verify access token and attach user to request
export const verifyToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token not found",
      });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: { user_id: decoded.userId },
      include: {
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is blocked
    if (user.is_blocked) {
      // If block duration has expired, unblock the user
      if (user.blocked_until && new Date() > user.blocked_until) {
        await prisma.user.update({
          where: { user_id: user.user_id },
          data: {
            is_blocked: false,
            blocked_until: null,
          },
        });
      } else {
        // Clear tokens and force logout
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(403).json({
          success: false,
          message: "Your account is temporarily blocked",
          blocked_until: user.blocked_until,
          forceLogout: true,
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Middleware to check if user is super admin
export const isSuperAdmin = (req, res, next) => {
  if (!req.user || !req.user.role || req.user.role.name !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super admin role required.",
    });
  }
  next();
};


// Middleware to check if user is student
export const isUser = (req, res, next) => {
  if (
    !req.user ||
    !["USER", "ADMIN"].includes(req.user.role.name)
  ) {
    return res.status(403).json({
      success: false,
      message: "Access denied. User privileges required.",
    });
  }
  next();
};



export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    return res.json({ message: "Access Denied- Admin Only" });
  }
};
