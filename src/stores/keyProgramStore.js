import keyProgramApi from '@/api/keyProgramApi'
import { defineStore } from 'pinia'

export const useKeyProgramStore = defineStore('keyProgramStore', {
  state: () => ({
    keyPrograms: []
  }),

  actions: {
    async fetchPrograms() {
      try {
        this.keyPrograms = await keyProgramApi.get()
      } catch (error) {
        console.error('Failed to fetch trainees', error)
      }
    }
  },

  getters: {}
})
