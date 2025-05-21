

import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware to verify access token and attach user to request
export const verifyToken = async (req, res, next) => {
  try {
    // Try to get token from cookie first
    const accessToken = req.cookies.accessToken;
    
    // If no token in cookie, check authorization header
    let token = accessToken;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: "Authentication required. Please log in.",
        });
      }
      token = authHeader.split(' ')[1];
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
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
          res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            domain: process.env.NODE_ENV === "production" ? ".piyushbhul.com.np" : undefined,
          });
          
          res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            domain: process.env.NODE_ENV === "production" ? ".piyushbhul.com.np" : undefined,
          });

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
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      
      // Handle expired token
      if (tokenError.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Authentication token has expired. Please log in again.",
          tokenExpired: true
        });
      }
      
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }
  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};

// Middleware to check if user is super admin
export const isSuperAdmin = (req, res, next) => {
  if (!req.user || !req.user.role || req.user.role.name !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
  }
  next();
};

// Middleware to check if user is a regular user or admin
export const isUser = (req, res, next) => {
  if (
    !req.user ||
    !req.user.role ||
    !["USER", "ADMIN"].includes(req.user.role.name)
  ) {
    return res.status(403).json({
      success: false,
      message: "Access denied. User privileges required.",
    });
  }
  next();
};