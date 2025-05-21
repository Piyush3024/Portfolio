
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";
import bcrypt from "bcrypt";
import SibApiV3Sdk from 'sib-api-v3-sdk';

const prisma = new PrismaClient();
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 15 * 60 * 1000,
    domain: process.env.NODE_ENV === "production" ? ".piyushbhul.com.np" : undefined,
  });
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: process.env.NODE_ENV === "production" ? ".piyushbhul.com.np" : undefined,
  });
};

// Existing signup, login, refreshToken, logout, getProfile, deleteUser unchanged
export const signup = async (req, res) => {
  try {
    const { username, email, password, full_name, phone, role_id } = req.body;

    if (!username || !email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        full_name,
        phone,
        role_id: role_id || 2,
      },
      include: {
        role: true,
      },
    });

    const { accessToken, refreshToken } = generateTokens(user.user_id);
    await storeRefreshToken(user.user_id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    const userData = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      token: accessToken,
    };

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: userData,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Error during registration",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.is_blocked) {
      if (user.blocked_until && new Date() > user.blocked_until) {
        await prisma.user.update({
          where: { user_id: user.user_id },
          data: { is_blocked: false, blocked_until: null },
        });
      } else {
        return res.status(403).json({
          success: false,
          message: "Your account is temporarily blocked",
          blocked_until: user.blocked_until,
        });
      }
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "Use OAuth login (Google/GitHub) for this account",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { accessToken, refreshToken } = generateTokens(user.user_id);
    await storeRefreshToken(user.user_id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        token: accessToken,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          success: false,
          message: "No refresh token provided" 
        });
      }
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const userId = decoded.userId;
      
      const storedToken = await redis.get(`refresh_token:${userId}`);
      
      if (!storedToken || storedToken !== refreshToken) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid refresh token" 
        });
      }
      
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(userId);
      await storeRefreshToken(userId, newRefreshToken);
      setCookies(res, newAccessToken, newRefreshToken);
      
      res.json({ 
        success: true,
        message: "Token refreshed successfully",
        data: { token: newAccessToken }
      });
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return res.status(401).json({ 
        success: false,
        message: "Invalid or expired token" 
      });
    }
  } catch (error) {
    console.error("Error in refreshToken controller:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        await redis.del(`refresh_token:${decoded.userId}`);
      } catch (tokenError) {
        console.log("Error verifying refresh token during logout:", tokenError.message);
      }
    }

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

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error in logout controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    
    let token = accessToken;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: "No access token provided",
        });
      }
      token = authHeader.split(' ')[1];
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await prisma.user.findUnique({
        where: { user_id: decoded.userId },
        select: {
          user_id: true,
          username: true,
          email: true,
          full_name: true,
          phone: true,
          role_id: true,
          created_at: true,
          updated_at: true,
          role: { select: { name: true } },
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Profile fetched successfully",
        data: user,
      });
    } catch (tokenError) {
      if (tokenError.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Access token has expired",
        });
      }
      throw tokenError;
    }
  } catch (error) {
    console.error("Error in getProfile controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required",
      });
    }
    await prisma.user.delete({
      where: { user_id: userId },
    });
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// New OAuth and Forgot Password controllers
export const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const { accessToken, refreshToken } = generateTokens(user.user_id);
    await storeRefreshToken(user.user_id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    const userData = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      token: accessToken,
    };

    // Redirect to frontend with token
    const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google callback error:", error);
    res.status(500).json({
      success: false,
      message: "Error during Google authentication",
      error: error.message,
    });
  }
};

export const githubCallback = async (req, res) => {
  try {
    const user = req.user;
    const { accessToken, refreshToken } = generateTokens(user.user_id);
    await storeRefreshToken(user.user_id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    const userData = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      token: accessToken,
    };

    const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("GitHub callback error:", error);
    res.status(500).json({
      success: false,
      message: "Error during GitHub authentication",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.user_id },
      process.env.RESET_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    // Store reset token in database
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        reset_token: resetToken,
        reset_token_expiry: new Date(Date.now() + 3600000), // 1 hour
      },
    });

    // Initialize Brevo API client correctly
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    // Setup API instance
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    // Configure email using Brevo's SendSmtpEmail model
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: 'Portfolio App',
      email: 'no-reply@piyushbhul.com.np',
    };
    sendSmtpEmail.to = [{ email: user.email }];
    sendSmtpEmail.subject = 'Password Reset Request';
    sendSmtpEmail.htmlContent = `
      <p>Dear ${user.full_name || user.username},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}">
        Reset Password
      </a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>Portfolio App Team</p>
    `;

    // Send email
    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return res.status(200).json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send reset email',
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const user = await prisma.user.findUnique({
      where: { user_id: decoded.userId },
    });

    if (!user || user.reset_token !== token || !user.reset_token_expiry || new Date() > user.reset_token_expiry) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
      },
    });

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
};