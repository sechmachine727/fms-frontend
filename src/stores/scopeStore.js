import scopeApi from '@/api/scopeApi'
import { defineStore } from 'pinia'

export const useScopeStore = defineStore('scopeStore', {
  state: () => ({
    scopes: []
  }),

  actions: {
    async fetchScopes() {
      try {
        this.scopes = await scopeApi.get()
      } catch (error) {
        console.error('Failed to fetch trainees', error)
      }
    }
  },

  getters: {}
})
