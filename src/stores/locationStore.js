// stores/traineeStore.js
import locationApi from '@/api/locationApi'
import { defineStore } from 'pinia'

export const useLocationStore = defineStore('locationStore', {
  state: () => ({
    locations: []
  }),

  actions: {
    async fecthLocationsBySite(sid) {
      try {
        this.locations = await locationApi.getAllBySiteId(sid)
      } catch (error) {
        console.error('Failed to fetch trainees', error)
      }
    }
  },

  getters: {}
})
