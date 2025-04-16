import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../lib/axios';
import { API_ENDPOINTS } from '../lib/types.js';

const useContactStore = create(
  persist(
    (set, get) => ({
      // State
      contacts: [],
      selectedContact: null,
      isLoading: false,
      error: null,

      // Actions
      fetchContacts: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.get(API_ENDPOINTS.CONTACTS);

          if (response.data.success && response.data.data) {
            set({
              contacts: response.data.data,
              isLoading: false
            });
          } else {
            throw new Error(response.data.error || 'Failed to fetch contacts');
          }
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message || 'Failed to fetch contacts',
            isLoading: false
          });
          
          // If unauthorized, handle appropriately
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            // Handle unauthorized access
            console.error('Unauthorized access to contacts');
          }
          
          return Promise.reject(error);
        }
      },

      submitContactForm: async (data) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post(
            API_ENDPOINTS.CONTACTS,
            data
          );

          if (response.data.success && response.data.data) {
            // Optionally update the contacts list if needed
            set({
              isLoading: false
            });
            
            return Promise.resolve();
          } else {
            throw new Error(response.data.error || 'Failed to submit contact form');
          }
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message || 'Failed to submit contact form',
            isLoading: false
          });
          
          return Promise.reject(error);
        }
      },

      getContactById: async (id) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.get(
            API_ENDPOINTS.CONTACT(id)
          );

          if (response.data.success && response.data.data) {
            set({
              selectedContact: response.data.data,
              isLoading: false
            });
          } else {
            throw new Error(response.data.error || 'Failed to fetch contact');
          }
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message || 'Failed to fetch contact',
            isLoading: false
          });
          
          return Promise.reject(error);
        }
      },

      deleteContact: async (id) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.delete(
            API_ENDPOINTS.CONTACT(id)
          );

          if (response.data.success) {
            // Remove the deleted contact from the contacts array
            set((state) => ({
              contacts: state.contacts.filter(contact => contact.contact_id !== id),
              isLoading: false
            }));
            
            // If the deleted contact is currently selected, clear the selection
            if (get().selectedContact?.contact_id === id) {
              set({ selectedContact: null });
            }
            
            return Promise.resolve();
          } else {
            throw new Error(response.data.error || 'Failed to delete contact');
          }
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message || 'Failed to delete contact',
            isLoading: false
          });
          
          return Promise.reject(error);
        }
      }
    }),
    {
      name: 'contact-storage', // storage key
      getStorage: () => (typeof window !== 'undefined' ? localStorage : undefined),
      partialize: (state) => ({
        // We might not want to persist contacts in local storage for privacy reasons
        // or we can choose to persist only necessary data
        // Leaving this empty means we don't persist any contact store data
      })
    }
  )
);

export default useContactStore;