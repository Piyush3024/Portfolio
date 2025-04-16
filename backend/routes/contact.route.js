import express from 'express'
import { 
  submitContactForm, 
  getAllContacts, 
  getContactById, 
  deleteContact 
} from '../controllers/contact.controller.js'
import { verifyToken, isSuperAdmin } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public route for submitting contact form
router.post('/', submitContactForm)

// Admin routes (protected)
router.get('/', verifyToken,isSuperAdmin, getAllContacts)
router.get('/:id', verifyToken,isSuperAdmin, getContactById)
router.delete('/:id', verifyToken,isSuperAdmin, deleteContact)

export default router;