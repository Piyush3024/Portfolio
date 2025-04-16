import express from 'express';
import { 
  deleteUser,
  blockUser, 
  unblockUser, 
  getBlockedUsers, 
  getAllUsers,  
  getUserById, 
  getUserByEmail, 
  getUserByUsername,
} from '../controllers/user.controller.js';
import { verifyToken, isSuperAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// User management routes (super admin only)
router.get('/users', verifyToken, isSuperAdmin, getAllUsers);
router.get('/users/blocked', verifyToken, isSuperAdmin, getBlockedUsers);

// User lookup routes
router.get('/users/:userId', verifyToken, isSuperAdmin, getUserById);
router.get('/users/email/:email', verifyToken, isSuperAdmin, getUserByEmail);
router.get('/users/username/:username', verifyToken, isSuperAdmin, getUserByUsername);


router.delete('/users/:userId', verifyToken, isSuperAdmin, deleteUser);
router.post('/users/:userId/block', verifyToken, isSuperAdmin, blockUser);
router.post('/users/:userId/unblock', verifyToken, isSuperAdmin, unblockUser);

export default router; 