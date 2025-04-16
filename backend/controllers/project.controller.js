import { PrismaClient } from "@prisma/client";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const prisma = new PrismaClient();

// Create new project
export const createProject = async (req, res) => {
  try {
    const { name, description, githubUrl, liveUrl,imageUrl, technologies } = req.body;
    const userId = req.user.user_id;


    // Validate required fields
    if (!name || !description || !githubUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (name, description, githubUrl)"
      });
    }

    // Handle image upload if provided
    // let imageUrl = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file);
      imageUrl = uploadResult.secure_url;
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name,
        description,
        githubUrl,
        liveUrl,
        technologies,
        imageUrl,
        userId
      }
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project
    });
  } catch (error) {
    console.error("Error in createProject controller:", error);
    res.status(500).json({
      success: false,
      message: "Error creating project",
      error: error.message
    });
  }
};

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: {
            full_name: true,
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error("Error in getAllProjects controller:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: error.message
    });
  }
};

// Get single project
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            full_name: true,
            username: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error("Error in getProjectById controller:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching project",
      error: error.message
    });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, githubUrl, liveUrl, technologies } = req.body;
    const userId = req.user.user_id;

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (existingProject.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own projects"
      });
    }

    // Handle image upload if new image is provided
    let imageUrl = existingProject.imageUrl;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file);
      imageUrl = uploadResult.secure_url;
    }

    // Update project
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        githubUrl,
        liveUrl,
        technologies,
        imageUrl
      }
    });

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project
    });
  } catch (error) {
    console.error("Error in updateProject controller:", error);
    res.status(500).json({
      success: false,
      message: "Error updating project",
      error: error.message
    });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    // Check if project exists and belongs to user
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (project.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own projects"
      });
    }

    // Delete project
    await prisma.project.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteProject controller:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting project",
      error: error.message
    });
  }
}; 