import express from 'express';
import multer from 'multer';
import { 
  createProject, 
  getAllProjects, 
  getProjectById, 
  updateProject, 
  deleteProject 
} from '../controllers/project.controller.js';
import { verifyToken, isSuperAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Public routes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// Protected routes (admin only)
router.post('/', verifyToken, isSuperAdmin, upload.single('image'), createProject);
router.put('/:id', verifyToken, isSuperAdmin, upload.single('image'), updateProject);
router.delete('/:id', verifyToken, isSuperAdmin, deleteProject);

export default router; 