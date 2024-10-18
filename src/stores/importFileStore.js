// stores/importFileStore.js
import importFileApi from '@/api/importFileApi'
import { defineStore } from 'pinia'

export const useImportFileStore = defineStore('importFileStore', {
    state: () => ({
        files: [],
        result: null
    }),

    actions: {
        async fetchImportFile(fileData, confirm) {
            try {
                // Initial request with the provided file and confirm flag
                const result = await importFileApi.post(fileData, confirm)
                this.result = result
                return result
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    console.error(error)
                    throw error
                }
            }
        },
    },

    getters: {}
})
