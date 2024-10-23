import technicalGroupApi from '@/api/technicalGroup'
import { defineStore } from 'pinia'

export const useTechnicalGroupStore = defineStore('technicalGroup', {
  state: () => ({
    technicalGroups: []
  }),

  actions: {
    async fetchTechnicalGroup() {
      try {
        this.technicalGroups = await technicalGroupApi.get()
      } catch (error) {
        console.error('Failed to fetch trainees', error)
      }
    }
  },

  getters: {}
})
