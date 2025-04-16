import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/auth.middleware.js";

const prisma = new PrismaClient();

// Submit contact form
export const submitContactForm = async (req, res) => {
  try {
    const { full_name, email, title,phone, message } = req.body;

    // Validate required fields
    if (!full_name || !email || !message) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    // Create contact submission
    const contact = await prisma.contact.create({
      data: {
        full_name,
        email,
        title,
        phone,
        message
      }
    });

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: contact
    });
  } catch (error) {
    console.error("Error in submitContactForm controller:", error);
    res.status(500).json({ 
      success: false,
      message: "Error submitting contact form",
      error: error.message 
    });
  }
};

// Get all contact submissions (admin only)
export const getAllContacts = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role.name !== 'ADMIN') {
      return res.status(403).json({ 
        success: false,
        message: "Access denied. Admin privileges required." 
      });
    }

    const contacts = await prisma.contact.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error("Error in getAllContacts controller:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching contact submissions",
      error: error.message 
    });
  }
};

// Get single contact submission (admin only)
export const getContactById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role.name !== 'ADMIN') {
      return res.status(403).json({ 
        success: false,
        message: "Access denied. Admin privileges required." 
      });
    }

    const { id } = req.params;
    const contact = await prisma.contact.findUnique({
      where: { contact_id: parseInt(id) }
    });

    if (!contact) {
      return res.status(404).json({ 
        success: false,
        message: "Contact submission not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error("Error in getContactById controller:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching contact submission",
      error: error.message 
    });
  }
};

// Delete contact submission (admin only)
export const deleteContact = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role.name !== 'ADMIN') {
      return res.status(403).json({ 
        success: false,
        message: "Access denied. Admin privileges required." 
      });
    }

    const { id } = req.params;
    const contact = await prisma.contact.delete({
      where: { contact_id: parseInt(id) }
    });

    res.status(200).json({
      success: true,
      message: "Contact submission deleted successfully",
      data: contact
    });
  } catch (error) {
    console.error("Error in deleteContact controller:", error);
    res.status(500).json({ 
      success: false,
      message: "Error deleting contact submission",
      error: error.message 
    });
  }
};
