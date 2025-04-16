import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create new project
export const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const authorId = req.user.user_id;

    // Validate required fields
    if (!postId || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (postId, content)",
      });
    }

    // Create project
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId,
        postId: parseInt(postId),
      },
    });

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Error in createComment controller:", error);
    res.status(500).json({
      success: false,
      message: "Error creating comment",
      error: error.message,
    });
  }
};

// Get all posts
export const fetchComments = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post Id is required",
      });
    }
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId) },
      include: {
        author: {
          select: {
            user_id: true,
            full_name: true,
            username: true,
          },
        },
        post: {
          // Include post information
          select: {
            title: true, // Fetch the post title
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error("Error in fetchComments controller:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comments",
      error: error.message,
    });
  }
};

// Get single comment
// In your comment.controller.js file, find the getCommentById function and update it:

export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Comment ID is required"
      });
    }

    // Convert the ID to an integer - add a check for valid ID format
    let commentId;
    try {
      commentId = parseInt(id, 10);
      if (isNaN(commentId)) {
        throw new Error("Invalid ID format");
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID format"
      });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        author: {
          select: {
            user_id: true,
            full_name: true,
            username: true
          }
        },
        post: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error("Error in getCommentById controller:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching comment",
      error: error.message
    });
  }
};

// Update project
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.user_id;

    // Check if project exists and belongs to user
    const existingComment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (existingComment.authorId !== userId && req.user.role.name !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this comment",
      });
    }

    // Update project
    const comment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: {
        content,
      },
    });

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Error in updateComment controller:", error);
    res.status(500).json({
      success: false,
      message: "Error updating comment",
      error: error.message,
    });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    // Check if comment exists and belongs to user
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.authorId !== userId && req.user.role.name !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this comment",
      });
    }
    // Delete project
    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error in comment controller:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting comment",
      error: error.message,
    });
  }
};

// Add this new function to get all comments
// export const getAllComments = async (req, res) => {
//   try {
//     const comments = await prisma.comment.findMany({
//       include: {
//         post: {
//           select: {
//             id: true,
//             title: true,
//             slug: true
//           }
//         },
//         user: {
//           select: {
//             id: true,
//             full_name: true,
//             email: true
//           }
//         }
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });

//     return res.status(200).json(comments);
//   } catch (error) {
//     console.error('Error fetching all comments:', error);
//     return res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
//   }
// };

export const getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        author: {
          select: {
            user_id: true,
            full_name: true,
            username: true,
          },
        },
        post: {
          // Include post information
          select: {
            title: true, // Fetch the post title
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error("Error in fetchComments controller:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comments",
      error: error.message,
    });
  }
};
