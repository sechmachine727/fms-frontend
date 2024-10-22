import formatTypeApi from '@/api/formatTypeApi'
import { defineStore } from 'pinia'

export const useFormatTypeStore = defineStore('formatTypeStore', {
  state: () => ({
    formatTypes: []
  }),

  actions: {
    async fetchformatTypes() {
      try {
        this.formatTypes = await formatTypeApi.get()
      } catch (error) {
        console.error('Failed to fetch trainees', error)
      }
    }
  },

  getters: {}
})
