import express from 'express';
import { 
  createPosts,
  getAllPublishedPosts, 
  getAllPosts, 
  getPostById, 
  updatePost, 
  deletePost 
} from '../controllers/post.controller.js';
import { verifyToken, isSuperAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();



// Public routes
router.get('/',verifyToken,isSuperAdmin, getAllPosts);
router.get('/published', getAllPublishedPosts);
router.get('/:id', getPostById);

// Protected routes (admin only)
router.post('/', verifyToken, isSuperAdmin, createPosts);
router.put('/:id', verifyToken, isSuperAdmin, updatePost);
router.delete('/:id', verifyToken, isSuperAdmin, deletePost);

export default router; 