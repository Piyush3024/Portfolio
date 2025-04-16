import { create } from 'zustand';
import axios from '../lib/axios';
import { API_ENDPOINTS } from '../lib/types.js';

const useUserStore = create((set, get) => ({
  // State
  users: [],
  blockedUsers: [],
  currentUser: null,
  isLoading: false,
  error: null,

  // Get all users
  getAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_ENDPOINTS.USERS);
      if (response.data.success) {
        set({ users: response.data.data, isLoading: false });
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error fetching users',
        isLoading: false
      });
      return Promise.reject(error);
    }
  },

  // Get blocked users
  getBlockedUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ENDPOINTS.USERS}/blocked`);
      if (response.data.success) {
        set({ blockedUsers: response.data.data, isLoading: false });
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch blocked users');
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error fetching blocked users',
        isLoading: false
      });
      return Promise.reject(error);
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ENDPOINTS.USERS}/${userId}`);
      if (response.data.success) {
        set({ currentUser: response.data.data, isLoading: false });
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch user');
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error fetching user',
        isLoading: false
      });
      return Promise.reject(error);
    }
  },

  // Get user by email
  getUserByEmail: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ENDPOINTS.USERS}/email/${email}`);
      if (response.data.success) {
        set({ currentUser: response.data.data, isLoading: false });
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch user by email');
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error fetching user by email',
        isLoading: false
      });
      return Promise.reject(error);
    }
  },

  // Get user by username
  getUserByUsername: async (username) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ENDPOINTS.USERS}/username/${username}`);
      if (response.data.success) {
        set({ currentUser: response.data.data, isLoading: false });
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch user by username');
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error fetching user by username',
        isLoading: false
      });
      return Promise.reject(error);
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_ENDPOINTS.USERS}/${userId}`);
      if (response.data.success) {
        // Remove the deleted user from the users array
        const updatedUsers = get().users.filter(user => user.user_id !== parseInt(userId));
        set({ users: updatedUsers, isLoading: false });
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to delete user');
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error deleting user',
        isLoading: false
      });
      return Promise.reject(error);
    }
  },

  // Block user
  blockUser: async (userId, blockDuration) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_ENDPOINTS.USERS}/${userId}/block`, { blockDuration });
      if (response.data.success) {
        // Update user in the users array
        const updatedUsers = get().users.map(user => 
          user.user_id === parseInt(userId) ? { ...user, is_blocked: true, blocked_until: response.data.data.blocked_until } : user
        );
        set({ users: updatedUsers, isLoading: false });
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to block user');
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error blocking user',
        isLoading: false
      });
      return Promise.reject(error);
    }
  },

  // Unblock user
  unblockUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_ENDPOINTS.USERS}/${userId}/unblock`);
      if (response.data.success) {
        // Update user in the users array
        const updatedUsers = get().users.map(user => 
          user.user_id === parseInt(userId) ? { ...user, is_blocked: false, blocked_until: null } : user
        );
        
        // Remove from blocked users if present
        const updatedBlockedUsers = get().blockedUsers.filter(user => user.user_id !== parseInt(userId));
        
        set({ 
          users: updatedUsers, 
          blockedUsers: updatedBlockedUsers,
          isLoading: false 
        });
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to unblock user');
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error unblocking user',
        isLoading: false
      });
      return Promise.reject(error);
    }
  },

  // Clear current user
  clearCurrentUser: () => {
    set({ currentUser: null });
  },

  // Reset error state
  clearError: () => {
    set({ error: null });
  }
}));

export default useUserStore;