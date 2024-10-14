// stores/traineeStore.js
import downloadFileAPI from '@/api/downloadFileApi'
import { defineStore } from 'pinia'

export const useDownloadFileStore = defineStore('downloadFileStore', {
    state: () => ({
        files: [],
        result: null
    }),

    actions: {
        async fetchDownloadFile(fileData) {
            try {
                const result = await downloadFileAPI.get(fileData)
                this.result = result
                return result
            } catch (error) {
                console.error('Failed to download file', error)
                throw error
            }
        }
    },

    getters: {}
})

