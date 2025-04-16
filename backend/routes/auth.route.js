import express from "express";
import rateLimit from 'express-rate-limit'
import { 
  signup, 
  login,
  logout,
  getProfile,
  refreshToken,
  deleteUser,



} from "../controllers/auth.controller.js";
import { verifyToken, isSuperAdmin } from "../middleware/auth.middleware.js";


const router = express.Router();
//Rate Limmiting middlewae

const limiter = rateLimit({
  windowMs : 0,
  limit : 5,
  message: { success: false, message: 'Too many login attempts. Please try again later.' }
})
// Auth routes
router.post("/signup", limiter, signup);
router.post("/login",limiter, login);
router.post("/logout", logout);
router.get("/profile", getProfile);
router.post("/refresh-token", refreshToken);
router.delete("/delete-user",verifyToken, isSuperAdmin, deleteUser);





export default router;