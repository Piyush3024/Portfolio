
import express from 'express';
import { verifyToken, isSuperAdmin } from '../middleware/auth.middleware.js';
import {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
  fetchComments,
} from '../controllers/comment.controller.js';

const router = express.Router();

// Public routes
router.get('/post/:postId',  fetchComments);
router.get('/all', verifyToken, isSuperAdmin, getAllComments);

// Fix: Added slash at beginning
router.get('/:id', getCommentById);

// Protected routes (admin only)
router.post('/', verifyToken, createComment);
router.put('/:id', verifyToken, isSuperAdmin, updateComment);
router.delete('/:id', verifyToken, isSuperAdmin, deleteComment);

// Add this new route to get all comments (admin only)


export default router;

