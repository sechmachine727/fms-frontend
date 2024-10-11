// stores/traineeStore.js
import importFileApi from '@/api/importFileApi'
import { defineStore } from 'pinia'

export const useImportFileStore = defineStore('importFileStore', {
    state: () => ({
        files: [],
        result: null
    }),

    actions: {
        async fetchImportFile(fileData) {
            try {
                const result = await importFileApi.post(fileData)
                this.result = result
                return result
            } catch (error) {
                console.error('Failed to import file', error)
                throw error
            }
        }
    },

    getters: {}
})

