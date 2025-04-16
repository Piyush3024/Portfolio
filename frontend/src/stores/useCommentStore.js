// import { create } from 'zustand';
// import axios from '../lib/axios';
// import { API_ENDPOINTS } from '../lib/types';

// const useCommentStore = create((set, get) => ({
//   comments: [],
//   currentComment: null,
//   isLoading: false,
//   error: null,

//   // Fetch all comments (irrespective of post ID)
//   fetchComments: async () => {
//     console.log("Fetching all the comments")
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.get("/comment/all");
//       // console.log("Comments :", response.data.data)
//       // Store the data array from the response
//       set({ comments: response.data.data , isLoading: false });
//       return response.data.data;
//     } catch (error) {
//       set({ 
//         error: error.response?.data?.message || 'Failed to fetch comments', 
//         isLoading: false 
//       });
//     }
//   },

//   // Get comment by ID
//   getCommentById: async (commentId) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.get(`${API_ENDPOINTS.COMMENT(commentId)}`);
//       set({ currentComment: response.data, isLoading: false });
//       return response.data;
//     } catch (error) {
//       set({ 
//         error: error.response?.data?.message || 'Failed to fetch comment', 
//         isLoading: false 
//       });
//       throw error;
//     }
//   },

//   // Update a comment
//   updateComment: async (commentId, commentData) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.put(`${API_ENDPOINTS.COMMENT(commentId)}`, commentData);
      
//       // Update the comment in the comments array
//       set((state) => ({
//         comments: state.comments.map(comment => 
//           comment.id === commentId ? response.data : comment
//         ),
//         currentComment: response.data,
//         isLoading: false
//       }));
      
//       return response.data;
//     } catch (error) {
//       set({ 
//         error: error.response?.data?.message || 'Failed to update comment', 
//         isLoading: false 
//       });
//       throw error;
//     }
//   },

//   // Fetch comments for a specific post
//   fetchCommentsByPost: async (postId) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.get(`${API_ENDPOINTS.POST_COMMENTS(postId)}`);
//       set({ comments: response.data, isLoading: false });
//     } catch (error) {
//       set({ 
//         error: error.response?.data?.message || 'Failed to fetch comments', 
//         isLoading: false 
//       });
//     }
//   },

//   // Add a new comment
//   addComment: async (commentData) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.post(API_ENDPOINTS.COMMENTS, commentData);
//       set((state) => ({
//         comments: [...state.comments, response.data],
//         isLoading: false
//       }));
//       return response.data;
//     } catch (error) {
//       set({ 
//         error: error.response?.data?.message || 'Failed to add comment', 
//         isLoading: false 
//       });
//       throw error;
//     }
//   },

//   // Delete a comment
//   deleteComment: async (commentId) => {
//     set({ isLoading: true, error: null });
//     try {
//       await axios.delete(`${API_ENDPOINTS.COMMENT(commentId)}`);
//       set((state) => ({
//         comments: state.comments.filter(comment => comment.id !== commentId),
//         currentComment: state.currentComment?.id === commentId ? null : state.currentComment,
//         isLoading: false
//       }));
//     } catch (error) {
//       set({ 
//         error: error.response?.data?.message || 'Failed to delete comment', 
//         isLoading: false 
//       });
//       throw error;
//     }
//   },

//   // Clear current comment
//   clearCurrentComment: () => {
//     set({ currentComment: null });
//   }
// }));

// export default useCommentStore;

import { create } from 'zustand';
import axios from '../lib/axios';
import { API_ENDPOINTS } from '../lib/types';

const useCommentStore = create((set, get) => ({
  comments: [],
  currentComment: null,
  isLoading: false,
  error: null,

  // Fetch all comments
  fetchComments: async () => {
    console.log("Fetching all the comments");
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/comment/all");
      // Handle the case when response.data.data might be undefined
      const commentsData = response.data.data || [];
      set({ comments: commentsData, isLoading: false });
      return commentsData;
    } catch (error) {
      console.error("Error fetching all comments:", error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch comments', 
        isLoading: false 
      });
      return [];
    }
  },

  // Get comment by ID
  getCommentById: async (commentId) => {
    set({ isLoading: true, error: null });
    try {
      // Ensure commentId is a valid number
      const id = parseInt(commentId);
      if (isNaN(id)) {
        throw new Error("Invalid comment ID format");
      }
      
      const response = await axios.get(`/comment/${id}`);
      const commentData = response.data.data || response.data;
      set({ currentComment: commentData, isLoading: false });
      return commentData;
    } catch (error) {
      console.error("Error fetching comment by ID:", error);
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to fetch comment', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Update a comment
  updateComment: async (commentId, commentData) => {
    set({ isLoading: true, error: null });
    try {
      // Ensure commentId is a valid number
      const id = parseInt(commentId);
      if (isNaN(id)) {
        throw new Error("Invalid comment ID format");
      }
      
      const response = await axios.put(`/comment/${id}`, commentData);
      const updatedComment = response.data.data || response.data;
      
      // Update the comment in the comments array
      set((state) => ({
        comments: state.comments.map(comment => 
          comment.id === id ? updatedComment : comment
        ),
        currentComment: updatedComment,
        isLoading: false
      }));
      
      return updatedComment;
    } catch (error) {
      console.error("Error updating comment:", error);
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to update comment', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Fetch comments for a specific post
  fetchCommentsByPost: async (postId) => {
    set({ isLoading: true, error: null });
    try {
      // Ensure postId is a valid number
      const id = parseInt(postId);
      if (isNaN(id)) {
        throw new Error("Invalid post ID format");
      }
      
      // Using proper API endpoint format
      const response = await axios.get(`/comment/post/${id}`);
      const commentsData = response.data.data || [];
      set({ comments: commentsData, isLoading: false });
      return commentsData;
    } catch (error) {
      console.error("Error fetching comments by post:", error);
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to fetch comments for post', 
        isLoading: false 
      });
      return [];
    }
  },

  // Add a new comment
  addComment: async (commentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/comment', commentData);
      const newComment = response.data.data || response.data;
      
      set((state) => ({
        comments: [...state.comments, newComment],
        isLoading: false
      }));
      
      return newComment;
    } catch (error) {
      console.error("Error adding comment:", error);
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to add comment', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    set({ isLoading: true, error: null });
    try {
      // Ensure commentId is a valid number
      const id = parseInt(commentId);
      if (isNaN(id)) {
        throw new Error("Invalid comment ID format");
      }
      
      await axios.delete(`/comment/${id}`);
      
      set((state) => ({
        comments: state.comments.filter(comment => comment.id !== id),
        currentComment: state.currentComment?.id === id ? null : state.currentComment,
        isLoading: false
      }));
    } catch (error) {
      console.error("Error deleting comment:", error);
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to delete comment', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Clear current comment
  clearCurrentComment: () => {
    set({ currentComment: null });
  }
}));

export default useCommentStore;