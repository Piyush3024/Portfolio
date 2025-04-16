import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../lib/axios';
import { API_ENDPOINTS } from '../lib/types.js';

const useProjectStore = create(
  persist(
    (set, get) => ({
      // State
      projects: [],
      selectedProject: null,
      isLoading: false,
      error: null,

      // Actions
      fetchProjects: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.get(API_ENDPOINTS.PROJECTS);

          if (response.data.success && response.data.data) {
            set({
              projects: response.data.data,
              isLoading: false
            });
          } else {
            throw new Error(response.data.error || 'Failed to fetch projects');
          }
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message || 'Failed to fetch projects',
            isLoading: false
          });
          
          // If unauthorized, handle appropriately
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            // Handle unauthorized access
            console.error('Unauthorized access to projects');
          }
          
          return Promise.reject(error);
        }
      },

      fetchProjectById: async (id) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.get(
            API_ENDPOINTS.PROJECT(id)
          );

          if (response.data.success && response.data.data) {
            set({
              selectedProject: response.data.data,
              isLoading: false
            });
          } else {
            throw new Error(response.data.error || 'Failed to fetch project');
          }
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message || 'Failed to fetch project',
            isLoading: false
          });
          
          return Promise.reject(error);
        }
      },

      // Add this to your actions in useProjectStore.js if it doesn't exist
      
      createProject: async (projectData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post(API_ENDPOINTS.PROJECTS, projectData);

          if (response.data.success) {
            // Fetch projects again to update the list
            await get().fetchProjects();
            set({ isLoading: false });
            return response.data.data;
          } else {
            throw new Error(response.data.error || 'Failed to create project');
          }
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message || 'Failed to create project',
            isLoading: false
          });
          return Promise.reject(error);
        }
      },

      updateProject: async (id, data) => {
        set({ isLoading: true, error: null });

        try {
          // For file uploads we need FormData
          const formData = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
              formData.append(key, value);
            }
          });

          const response = await axios.put(
            API_ENDPOINTS.PROJECT(id),
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          if (response.data.success && response.data.data) {
            // Update the project in the projects array
            set((state) => ({
              projects: state.projects.map(project => 
                project.id === id ? response.data.data : project
              ),
              selectedProject: response.data.data,
              isLoading: false
            }));
            
            return Promise.resolve();
          } else {
            throw new Error(response.data.error || 'Failed to update project');
          }
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message || 'Failed to update project',
            isLoading: false
          });
          
          return Promise.reject(error);
        }
      },

      deleteProject: async (id) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.delete(
            API_ENDPOINTS.PROJECT(id)
          );

          if (response.data.success) {
            // Remove the deleted project from the projects array
            set((state) => ({
              projects: state.projects.filter(project => project.id !== id),
              isLoading: false
            }));
            
            // If the deleted project is currently selected, clear the selection
            if (get().selectedProject?.id === id) {
              set({ selectedProject: null });
            }
            
            return Promise.resolve();
          } else {
            throw new Error(response.data.error || 'Failed to delete project');
          }
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message || 'Failed to delete project',
            isLoading: false
          });
          
          return Promise.reject(error);
        }
      }
    }),
    {
      name: 'project-storage', // storage key
      getStorage: () => (typeof window !== 'undefined' ? localStorage : undefined),
      partialize: (state) => ({
        // We don't persist the full project data to avoid localStorage bloat
        // Only persist IDs of selected project if needed
        selectedProject: state.selectedProject ? { id: state.selectedProject.id } : null,
      })
    }
  )
);

export default useProjectStore;