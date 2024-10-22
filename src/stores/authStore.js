// stores/traineeStore.js
import authApi from '@/api/authApi'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', {
  state: () => ({}),

  actions: {
    async fetchLogin(data) {
      try {
        const result = await authApi.post(data) // Assuming authApi.post is an axios instance or similar
        return result.data // Return the data from the response
      } catch (error) {
        console.error('Error fetching trainees:', error)
        throw error // Optionally rethrow the error to handle it in the component
      }
    }
  },

  getters: {}
})
