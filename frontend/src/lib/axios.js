import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",
    withCredentials: true, //send cookies to the server

})

export default axiosInstance

// import axios from "axios";
// import { useAuthStore } from "../stores/useAuthStore.js"; // Import your auth store

// const instance = axios.create({
//   baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api"
// });

// // Add a response interceptor
// instance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const authStore = useAuthStore.getState(); // Access the auth store
//         const refreshToken = authStore.refreshToken;

//         if (!refreshToken) {
//           authStore.logout(); // Log out the user if no refresh token is available
//           return Promise.reject(error);
//         }

//         // Attempt to refresh the token
//         const response = await axios.post("/auth/refresh-token", {
//           refreshToken,
//         });

//         const newAccessToken = response.data.accessToken;
//         authStore.setAccessToken(newAccessToken); // Update the access token in the store

//         // Retry the original request with the new access token
//         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//         return axios(originalRequest);
//       } catch (refreshError) {
//         useAuthStore.logout(); // Log out the user if the refresh token is invalid
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default instance;