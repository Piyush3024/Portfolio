import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import { API_ENDPOINTS } from "../lib/types.js";

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useAuthStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      checkingAuth: true,

      // Add the token validation function inside the store
      // Modified isTokenValid function in useAuthStore.js
      isTokenValid: () => {
        const token = get().token;
        if (!token) return false;

        try {
          // Split the token into parts
          const parts = token.split(".");
          if (parts.length !== 3) return false;

          // Base64 decode and parse the payload
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            window
              .atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );

          const payload = JSON.parse(jsonPayload);

          // Check if exp exists in the payload
          if (!payload.exp) return true; // If no expiration, consider valid

          const expirationTime = payload.exp * 1000; // Convert to milliseconds
          const currentTime = Date.now();

          // Add a buffer of 5 minutes (300000 ms) to prevent premature logouts
          const bufferTime = 300000; // 5 minutes in milliseconds

          // Return true if token is valid (with buffer), false if expired
          return currentTime < expirationTime - bufferTime;
        } catch (error) {
          console.error("Error checking token expiration:", error);
          // If we can't decode the token, assume it's valid to prevent immediate logouts
          return true;
        }
      },

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post(API_ENDPOINTS.LOGIN, credentials);

          const userDt = response.data.data;

          if (response.data.success && response.data.data) {
            const { user, token } = response.data.data;

            // Update axios default headers for subsequent requests
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            set({
              user: userDt,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            return userDt;
          } else {
            throw new Error(response.data.error || "Login failed");
          }
        } catch (err) {
          set({
            error: err.response?.data?.message || "Login failed",
            isLoading: false,
          });
          return Promise.reject(err);
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post(API_ENDPOINTS.REGISTER, userData);

          if (response.data.success && response.data.data) {
            const { user, token } = response.data.data;

            // Update axios default headers
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Registration failed");
          }
        } catch (error) {
          set({
            error: error.message || "Registration failed",
            isLoading: false,
          });
        }
      },

      logout: async () => {
        try {
          // Call logout endpoint
          await axios.post(API_ENDPOINTS.LOGOUT);
        } catch (error) {
          // Proceed with logout even if server-side logout fails
          console.error("Logout error:", error);
        } finally {
          // Remove auth header
          delete axios.defaults.headers.common["Authorization"];

          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      checkAuth: async () => {
        set({ checkingAuth: true });

        // If no token exists, user is not authenticated
        if (!get().token) {
          set({
            checkingAuth: false,
            user: null,
            isAuthenticated: false,
          });
          return;
        }

        try {
          // Set authorization header with the stored token
          if (get().token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${
              get().token
            }`;
          }

          // Attempt to fetch the user profile
          const response = await axios.get(API_ENDPOINTS.PROFILE);

          if (response.data.success && response.data.data) {
            // User is authenticated
            set({
              user: response.data.data,
              checkingAuth: false,
              isAuthenticated: true,
            });
          } else {
            // Something went wrong
            throw new Error(
              response.data.error || "Authentication check failed"
            );
          }
        } catch (error) {
          console.error("Authentication check error:", error.message);

          // Clear authentication state
          delete axios.defaults.headers.common["Authorization"];

          set({
            checkingAuth: false,
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      fetchUser: async () => {
        console.log("Fetching user profile...");
        if (!get().token) return;

        set({ isLoading: true, error: null });

        try {
          // Make sure we're using the right authentication method
          // Include credentials to ensure cookies are sent with the request
          const response = await axios.get(API_ENDPOINTS.PROFILE, {
            withCredentials: true,
          });
          console.log("Response :", response);

          if (response.data.success && response.data.data) {
            set({
              user: response.data.data,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(
              response.data.error || "Failed to fetch user profile"
            );
          }
        } catch (error) {
          set({
            error: error.message || "Failed to fetch user profile",
            isLoading: false,
          });

          // If unauthorized, clear auth state
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            get().logout();
          }
        }
      },

      refreshToken: async () => {
        // Prevent multiple simultaneous refresh attempts
        if (get().checkingAuth) return;

        set({ checkingAuth: true });
        try {
          const response = await axios.post(API_ENDPOINTS.REFRESH_TOKEN);

          if (response.data.success && response.data.data?.token) {
            // Update the token
            const newToken = response.data.data.token;

            // Update axios default headers with new token
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;

            // Update store with new token
            set({
              token: newToken,
              isAuthenticated: true,
              checkingAuth: false,
            });

            return response.data;
          } else {
            throw new Error(response.data.error || "Token refresh failed");
          }
        } catch (error) {
          // Clear user state on refresh token failure
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            checkingAuth: false,
          });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage", // storage key
      getStorage: () =>
        typeof window !== "undefined" ? localStorage : undefined,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }), // only store these values
    }
  )
);

export default useAuthStore;
