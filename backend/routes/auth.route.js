


import express from "express";
import rateLimit from 'express-rate-limit';
import passport from 'passport'; 
import jwt from 'jsonwebtoken';
import { setCookies } from "../lib/cookies.js"; 
import { 
  signup, 
  login,
  logout,
  getProfile,
  refreshToken,
  deleteUser,
  googleCallback,
  githubCallback,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";
import { verifyToken, isSuperAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rate-limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  message: { success: false, message: 'Too many login attempts. Please try again later.' }
});

// Auth routes
router.post("/signup", limiter, signup);
router.post("/login", limiter, login);
router.post("/logout", logout);
router.get("/profile", getProfile);
router.post("/refresh-token", refreshToken);
router.delete("/delete-user", verifyToken, isSuperAdmin, deleteUser);

// Google OAuth routes
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user;
    const accessToken = jwt.sign(
      { userId: user.user_id, role: user.role.name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: user.user_id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    setCookies(res, accessToken, refreshToken);

    const type = req.query.type || 'login';
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}&type=${type}`);
  }
);

// GitHub OAuth routes
router.get("/github", passport.authenticate('github', { scope: ['user:email', 'profile'] }));
router.get(
  "/github/callback",
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user;
    const accessToken = jwt.sign(
      { userId: user.user_id, role: user.role.name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: user.user_id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    setCookies(res, accessToken, refreshToken);

    const type = req.query.type || 'login';
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}&type=${type}`);
  }
);

// Forgot password routes
router.post("/forgot-password", limiter, forgotPassword);
router.post("/reset-password", resetPassword);

export default router;