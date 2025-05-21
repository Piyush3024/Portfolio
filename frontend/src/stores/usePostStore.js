import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import { API_ENDPOINTS } from "../lib/types";

const usePostStore = create(
  persist(
    (set, get) => ({
      // State
      posts: [],
      selectedPost: null,
      isLoading: false,
      error: null,

      // Actions
      fetchPosts: async (params) => {
        if (get().posts.length === 0) {
          set({ isLoading: true, error: null });

          try {
            const response = await axios.get(API_ENDPOINTS.POSTS, { params });

            if (response.data.success && response.data.data) {
              set({
                posts: response.data.data,
                isLoading: false,
              });
            } else {
              throw new Error(response.data.error || "Failed to fetch posts");
            }
          } catch (error) {
            set({
              error:
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch posts",
              isLoading: false,
            });

            // If unauthorized, handle appropriately
            if (axios.isAxiosError(error) && error.response?.status === 401) {
              console.error("Unauthorized access to posts");
            }

            return Promise.reject(error);
          }
        }
      },

      refreshPosts: async (params) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.get(API_ENDPOINTS.POSTS, { params });

          if (response.data.success && response.data.data) {
            set({
              posts: response.data.data,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch posts");
          }
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Failed to fetch posts",
            isLoading: false,
          });

          // If unauthorized, handle appropriately
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.error("Unauthorized access to posts");
          }

          return Promise.reject(error);
        }
      },

      fetchAllPosts: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.get("/post/");

          if (response.data.success && response.data.data) {
            set({
              posts: response.data.data,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch all posts");
          }
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Failed to fetch posts",
            isLoading: false,
          });

          // If unauthorized, handle appropriately
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.error("Unauthorized access to posts");
          }

          return Promise.reject(error);
        }
      },

      fetchPostById: async (id) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.get(API_ENDPOINTS.POST(id));

          if (response.data.success && response.data.data) {
            set({
              selectedPost: response.data.data,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch post");
          }
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Failed to fetch post",
            isLoading: false,
          });

          return Promise.reject(error);
        }
      },

      fetchPostBySlug: async (slug) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.get(API_ENDPOINTS.POST_BY_SLUG(slug));

          if (response.data.success && response.data.data) {
            set({
              selectedPost: response.data.data,
              isLoading: false,
            });
          } else {
            throw new Error(
              response.data.error || "Failed to fetch post by slug"
            );
          }
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Failed to fetch post by slug",
            isLoading: false,
          });

          return Promise.reject(error);
        }
      },

      createPost: async (data) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post("/post", data);

          if (response.data.success && response.data.data) {
            // Add the new post to the posts array
            set((state) => ({
              posts: [response.data.data, ...state.posts],
              isLoading: false,
            }));

            return Promise.resolve();
          } else {
            throw new Error(response.data.error || "Failed to create post");
          }
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Failed to create post",
            isLoading: false,
          });

          return Promise.reject(error);
        }
      },

      updatePost: async (id, data) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.put(API_ENDPOINTS.POST(id), data);

          if (response.data.success && response.data.data) {
            // Update the post in the posts array
            set((state) => ({
              posts: state.posts.map((post) =>
                post.id === id ? response.data.data : post
              ),
              selectedPost: response.data.data,
              isLoading: false,
            }));

            return Promise.resolve();
          } else {
            throw new Error(response.data.error || "Failed to update post");
          }
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Failed to update post",
            isLoading: false,
          });

          return Promise.reject(error);
        }
      },

      deletePost: async (id) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.delete(API_ENDPOINTS.POST(id));

          if (response.data.success) {
            // Remove the deleted post from the posts array
            set((state) => ({
              posts: state.posts.filter((post) => post.id !== id),
              isLoading: false,
            }));

            // If the deleted post is currently selected, clear the selection
            if (get().selectedPost?.id === id) {
              set({ selectedPost: null });
            }

            return Promise.resolve();
          } else {
            throw new Error(response.data.error || "Failed to delete post");
          }
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Failed to delete post",
            isLoading: false,
          });

          return Promise.reject(error);
        }
      },

      addComment: async (data) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post(API_ENDPOINTS.COMMENTS, data);

          if (response.data.success && response.data.data) {
            // Optionally update the selected post to include the new comment
            // This assumes the selected post has a comments array
            if (get().selectedPost && get().selectedPost.id === data.postId) {
              set((state) => ({
                selectedPost: state.selectedPost
                  ? {
                      ...state.selectedPost,
                      comments: state.selectedPost.comments
                        ? [response.data.data, ...state.selectedPost.comments]
                        : [response.data.data],
                    }
                  : null,
                isLoading: false,
              }));
            } else {
              set({ isLoading: false });
            }

            return Promise.resolve();
          } else {
            throw new Error(response.data.error || "Failed to add comment");
          }
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Failed to add comment",
            isLoading: false,
          });

          return Promise.reject(error);
        }
      },

      deleteComment: async (id) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.delete(API_ENDPOINTS.COMMENT(id));

          if (response.data.success) {
            // If there's a selected post with comments, remove the deleted comment
            if (get().selectedPost && get().selectedPost.comments) {
              set((state) => ({
                selectedPost: state.selectedPost
                  ? {
                      ...state.selectedPost,
                      comments: state.selectedPost.comments
                        ? state.selectedPost.comments.filter(
                            (comment) => comment.id !== id
                          )
                        : [],
                    }
                  : null,
                isLoading: false,
              }));
            } else {
              set({ isLoading: false });
            }

            return Promise.resolve();
          } else {
            throw new Error(response.data.error || "Failed to delete comment");
          }
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Failed to delete comment",
            isLoading: false,
          });

          return Promise.reject(error);
        }
      },
    }),
    {
      name: "blog-storage", // storage key
      getStorage: () =>
        typeof window !== "undefined" ? localStorage : undefined,
      partialize: (state) => ({
        // Only persist the ID of selected post to avoid localStorage bloat
        selectedPost: state.selectedPost ? { id: state.selectedPost.id } : null,
      }),
    }
  )
);

export default usePostStore;
