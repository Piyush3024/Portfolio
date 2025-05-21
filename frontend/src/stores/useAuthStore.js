// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import axios from "../lib/axios";
// import { API_ENDPOINTS } from "../lib/types.js";

// // Axios interceptor for token refresh
// let refreshPromise = null;

// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // If a refresh is already in progress, wait for it to complete
//         if (refreshPromise) {
//           await refreshPromise;
//           return axios(originalRequest);
//         }

//         // Start a new refresh process
//         refreshPromise = useAuthStore.getState().refreshToken();
//         await refreshPromise;
//         refreshPromise = null;

//         // Update authorization header with new token
//         const newToken = useAuthStore.getState().token;
//         if (newToken) {
//           originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//         }

//         return axios(originalRequest);
//       } catch (refreshError) {
//         // If refresh fails, redirect to login or handle as needed
//         useAuthStore.getState().logout();
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// const useAuthStore = create(
//   persist(
//     (set, get) => ({
//       // State
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       isLoading: false,
//       error: null,
//       checkingAuth: true,

//       // Add the token validation function inside the store
//       isTokenValid: () => {
//         const token = get().token;
//         if (!token) return false;

//         try {
//           // Split the token into parts
//           const parts = token.split(".");
//           if (parts.length !== 3) return false;

//           // Base64 decode and parse the payload
//           const base64Url = parts[1];
//           const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//           const jsonPayload = decodeURIComponent(
//             window
//               .atob(base64)
//               .split("")
//               .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//               .join("")
//           );

//           const payload = JSON.parse(jsonPayload);

//           // Check if exp exists in the payload
//           if (!payload.exp) return true; // If no expiration, consider valid

//           const expirationTime = payload.exp * 1000; // Convert to milliseconds
//           const currentTime = Date.now();

//           // Add a buffer of 5 minutes (300000 ms) to prevent premature logouts
//           const bufferTime = 300000; // 5 minutes in milliseconds

//           // Return true if token is valid (with buffer), false if expired
//           return currentTime < expirationTime - bufferTime;
//         } catch (error) {
//           console.error("Error checking token expiration:", error);
//           // If we can't decode the token, assume it's invalid to prevent security issues
//           return false;
//         }
//       },

//       register: async (userData) => {
//         set({ isLoading: true, error: null });

//         try {
//           const response = await axios.post(API_ENDPOINTS.REGISTER, userData, {
//             withCredentials: true
//           });

//           if (response.data.success && response.data.data) {
//             const userData = response.data.data;

//             // Extract token from response if available
//             const token = userData.token || response.headers?.authorization?.split(' ')[1];

//             // Update axios default headers for subsequent requests
//             axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//             set({
//               user: userData,
//               token: token,
//               isAuthenticated: true,
//               isLoading: false,
//             });

//             return userData;
//           } else {
//             throw new Error(response.data.error || "Registration failed");
//           }
//         } catch (error) {
//           set({
//             error: error.response?.data?.message || error.message || "Registration failed",
//             isLoading: false,
//           });
//           return Promise.reject(error);
//         }
//       },

//       // Actions
//       login: async (credentials) => {
//         set({ isLoading: true, error: null });

//         try {
//           const response = await axios.post(API_ENDPOINTS.LOGIN, credentials, {
//             withCredentials: true
//           });

//           const userData = response.data.data;

//           if (response.data.success && userData) {
//             // Extract token from response if available
//             const token = userData.token || response.headers?.authorization?.split(' ')[1];

//             // Update axios default headers for subsequent requests
//             axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//             set({
//               user: userData,
//               token: token,
//               isAuthenticated: true,
//               isLoading: false,
//             });
//             return userData;
//           } else {
//             throw new Error(response.data.error || "Login failed");
//           }
//         } catch (err) {
//           set({
//             error: err.response?.data?.message || "Login failed",
//             isLoading: false,
//           });
//           return Promise.reject(err);
//         }
//       },

//       logout: async () => {
//         try {
//           // Call logout endpoint with credentials to ensure cookies are sent
//           await axios.post(API_ENDPOINTS.LOGOUT, {}, { withCredentials: true });
//         } catch (error) {
//           // Proceed with logout even if server-side logout fails
//           console.error("Logout error:", error);
//         } finally {
//           // Remove auth header
//           delete axios.defaults.headers.common["Authorization"];

//           set({
//             user: null,
//             token: null,
//             isAuthenticated: false,
//           });
//         }
//       },

//       checkAuth: async () => {
//         set({ checkingAuth: true });

//         // Get token from state
//         const token = get().token;

//         // If no token exists, user is not authenticated
//         if (!token) {
//           set({
//             checkingAuth: false,
//             user: null,
//             isAuthenticated: false,
//           });
//           return;
//         }

//         try {
//           // Set authorization header with the stored token
//           axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//           // Attempt to fetch the user profile
//           const response = await axios.get(API_ENDPOINTS.PROFILE, {
//             withCredentials: true  // Important: ensures cookies are sent
//           });

//           if (response.data.success && response.data.data) {
//             // User is authenticated
//             set({
//               user: response.data.data,
//               checkingAuth: false,
//               isAuthenticated: true,
//             });
//           } else {
//             // Something went wrong
//             throw new Error(
//               response.data.error || "Authentication check failed"
//             );
//           }
//         } catch (error) {
//           console.error("Authentication check error:", error.message);

//           // Clear authentication state
//           delete axios.defaults.headers.common["Authorization"];

//           // Try token refresh before giving up
//           try {
//             await get().refreshToken();
//             // If refresh succeeded, try checking auth again, but prevent infinite recursion
//             const freshToken = get().token;
//             if (freshToken) {
//               axios.defaults.headers.common["Authorization"] = `Bearer ${freshToken}`;
//               const response = await axios.get(API_ENDPOINTS.PROFILE, {
//                 withCredentials: true
//               });
//               if (response.data.success && response.data.data) {
//                 set({
//                   user: response.data.data,
//                   checkingAuth: false,
//                   isAuthenticated: true,
//                 });
//                 return;
//               }
//             }
//           } catch (refreshError) {
//             console.error("Token refresh failed:", refreshError);
//           }

//           set({
//             checkingAuth: false,
//             user: null,
//             token: null,
//             isAuthenticated: false,
//           });
//         }
//       },

//       fetchUser: async () => {
//         console.log("Fetching user profile...");
//         const token = get().token;
//         if (!token) return;

//         set({ isLoading: true, error: null });

//         try {
//           // Ensure we're using both token and cookies
//           axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//           const response = await axios.get(API_ENDPOINTS.PROFILE, {
//             withCredentials: true
//           });
//           console.log("Response:", response);

//           if (response.data.success && response.data.data) {
//             set({
//               user: response.data.data,
//               isAuthenticated: true,
//               isLoading: false,
//             });
//           } else {
//             throw new Error(
//               response.data.error || "Failed to fetch user profile"
//             );
//           }
//         } catch (error) {
//           set({
//             error: error.message || "Failed to fetch user profile",
//             isLoading: false,
//           });

//           // If unauthorized, try token refresh before giving up
//           if (axios.isAxiosError(error) && error.response?.status === 401) {
//             try {
//               await get().refreshToken();
//               // If refresh succeeded, try fetching user again
//               await get().fetchUser();
//             } catch (refreshError) {
//               console.error("Token refresh failed:", refreshError);
//               get().logout();
//             }
//           }
//         }
//       },

//       refreshToken: async () => {
//         // Prevent multiple simultaneous refresh attempts
//         if (get().checkingAuth) return;

//         set({ checkingAuth: true });
//         try {
//           const response = await axios.post(API_ENDPOINTS.REFRESH_TOKEN, {}, {
//             withCredentials: true // Important: ensures cookies are sent
//           });

//           if (response.data.success && response.data.data?.token) {
//             // Update the token
//             const newToken = response.data.data.token;

//             // Update axios default headers with new token
//             axios.defaults.headers.common[
//               "Authorization"
//             ] = `Bearer ${newToken}`;

//             // Update store with new token
//             set({
//               token: newToken,
//               isAuthenticated: true,
//               checkingAuth: false,
//             });

//             return response.data;
//           } else {
//             throw new Error(response.data.error || "Token refresh failed");
//           }
//         } catch (error) {
//           // Clear user state on refresh token failure
//           set({
//             user: null,
//             token: null,
//             isAuthenticated: false,
//             checkingAuth: false,
//           });
//           throw error;
//         }
//       },
//     }),
//     {
//       name: "auth-storage", // storage key
//       getStorage: () =>
//         typeof window !== "undefined" ? localStorage : undefined,
//       partialize: (state) => ({
//         user: state.user,
//         token: state.token,
//         isAuthenticated: state.isAuthenticated,
//       }), // only store these values
//     }
//   )
// );

// export default useAuthStore;

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
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }
        refreshPromise = useAuthStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;
        const newToken = useAuthStore.getState().token;
        if (newToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        }
        return axios(originalRequest);
      } catch (refreshError) {
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

      // Token validation
      isTokenValid: () => {
        const token = get().token;
        if (!token) return false;
        try {
          const parts = token.split(".");
          if (parts.length !== 3) return false;
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
          if (!payload.exp) return true;
          const expirationTime = payload.exp * 1000;
          const currentTime = Date.now();
          const bufferTime = 300000;
          return currentTime < expirationTime - bufferTime;
        } catch (error) {
          console.error("Error checking token expiration:", error);
          return false;
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(API_ENDPOINTS.REGISTER, userData, {
            withCredentials: true,
          });
          if (response.data.success && response.data.data) {
            const userData = response.data.data;
            const token =
              userData.token || response.headers?.authorization?.split(" ")[1];
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            set({
              user: userData,
              token: token,
              isAuthenticated: true,
              isLoading: false,
            });
            return userData;
          } else {
            throw new Error(response.data.error || "Registration failed");
          }
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(API_ENDPOINTS.LOGIN, credentials, {
            withCredentials: true,
          });
          const userData = response.data.data;
          if (response.data.success && userData) {
            const token =
              userData.token || response.headers?.authorization?.split(" ")[1];
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            set({
              user: userData,
              token: token,
              isAuthenticated: true,
              isLoading: false,
            });
            return userData;
          } else {
            throw new Error(response.data.error || "Login failed");
          }
        } catch (err) {
          set({
            error: err.response?.data?.message || "Login failed",
            isLoading: false,
          });
          throw err;
        }
      },

      // OAuth Login
      loginWithOAuth: async (token) => {
        set({ isLoading: true, error: null });
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get(API_ENDPOINTS.PROFILE, {
            withCredentials: true,
          });
          if (response.data.success && response.data.data) {
            set({
              user: response.data.data,
              token: token,
              isAuthenticated: true,
              isLoading: false,
            });
            return response.data.data;
          } else {
            throw new Error(response.data.error || "OAuth login failed");
          }
        } catch (error) {
          set({
            error: error.response?.data?.message || "OAuth login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      signUpWithOAuth: async (token) => {
        set({ isLoading: true, error: null });
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get(API_ENDPOINTS.PROFILE, {
            withCredentials: true,
          });
          if (response.data.success && response.data.data) {
            set({
              user: response.data.data,
              token: token,
              isAuthenticated: true,
              isLoading: false,
            });
            return response.data.data;
          }
          throw new Error(response.data.error || "OAuth signup failed");
        } catch (error) {
          set({
            error: error.response?.data?.message || "OAuth signup failed",
            isLoading: false,
          });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        try {
          await axios.post(API_ENDPOINTS.LOGOUT, {}, { withCredentials: true });
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          delete axios.defaults.headers.common["Authorization"];
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      // Check Auth
      checkAuth: async () => {
        set({ checkingAuth: true });
        const token = get().token;
        if (!token) {
          set({ checkingAuth: false, user: null, isAuthenticated: false });
          return;
        }
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get(API_ENDPOINTS.PROFILE, {
            withCredentials: true,
          });
          if (response.data.success && response.data.data) {
            set({
              user: response.data.data,
              checkingAuth: false,
              isAuthenticated: true,
            });
          } else {
            throw new Error(
              response.data.error || "Authentication check failed"
            );
          }
        } catch (error) {
          console.error("Authentication check error:", error.message);
          delete axios.defaults.headers.common["Authorization"];
          try {
            await get().refreshToken();
            const freshToken = get().token;
            if (freshToken) {
              axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${freshToken}`;
              const response = await axios.get(API_ENDPOINTS.PROFILE, {
                withCredentials: true,
              });
              if (response.data.success && response.data.data) {
                set({
                  user: response.data.data,
                  checkingAuth: false,
                  isAuthenticated: true,
                });
                return;
              }
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
          }
          set({
            checkingAuth: false,
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      // Fetch User
      fetchUser: async () => {
        const token = get().token;
        if (!token) return;
        set({ isLoading: true, error: null });
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get(API_ENDPOINTS.PROFILE, {
            withCredentials: true,
          });
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
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            try {
              await get().refreshToken();
              await get().fetchUser();
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              get().logout();
            }
          }
        }
      },

      // Forgot Password
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            API_ENDPOINTS.FORGOT_PASSWORD,
            { email },
            {
              withCredentials: true,
            }
          );
          if (response.data.success) {
            set({ isLoading: false });
            return response.data;
          } else {
            throw new Error(
              response.data.message || "Failed to send reset email"
            );
          }
        } catch (error) {
          set({
            error:
              error.response?.data?.message || "Failed to send reset email",
            isLoading: false,
          });
          throw error;
        }
      },

      // Reset Password
      resetPassword: async ({ token, newPassword }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            API_ENDPOINTS.RESET_PASSWORD,
            {
              token,
              newPassword,
            },
            {
              withCredentials: true,
            }
          );
          if (response.data.success) {
            set({ isLoading: false });
            return response.data;
          } else {
            throw new Error(
              response.data.message || "Failed to reset password"
            );
          }
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to reset password",
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () =>
        typeof window !== "undefined" ? localStorage : undefined,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
