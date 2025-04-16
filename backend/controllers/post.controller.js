import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

// Create new project
export const createPosts = async (req, res) => {
  try {
    const { title, content, published } = req.body;
    const slug = slugify(title, { lower: true, strict: true });
    const authorId = req.user.user_id;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields (title, content, published)",
      });
    }

    // Create project
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        published: published || false,
        authorId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error in createPosts controller:", error);
    res.status(500).json({
      success: false,
      message: "Error creating post",
      error: error.message,
    });
  }
};

// Get all posts
export const getAllPublishedPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },

      include: {
        author: {
          select: {
            full_name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("Error in getAllPublishedPosts controller:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: error.message,
    });
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            full_name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("Error in getAllPosts controller:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: error.message,
    });
  }
};

// Get single project
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            full_name: true,
            username: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error in getPostById controller:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching post",
      error: error.message,
    });
  }
};

// Update project
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;
    const slug = slugify(title, { lower: true, strict:true})
    const authorId = req.user.user_id;

    // Check if project exists and belongs to user
    const existingPost = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (existingPost.authorId !== authorId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own post",
      });
    }


    // Update project
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
       title,
       content,
       published,
       slug,
       authorId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error in updatePost controller:", error);
    res.status(500).json({
      success: false,
      message: "Error updating post",
      error: error.message,
    });
  }
};

// Delete project
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user.user_id;

    // Check if project exists and belongs to user
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.authorId !== authorId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own posts",
      });
    }

    // Delete project
    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error in deletePost controller:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting post",
      error: error.message,
    });
  }
};
