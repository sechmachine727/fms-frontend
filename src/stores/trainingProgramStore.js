// stores/traineeStore.js
import trainingProgramApi from '@/api/trainingProgramApi'
import { defineStore } from 'pinia'

export const useTrainingProgramStore = defineStore('trainingProgramStore', {
    state: () => ({
        trainingPrograms: [],
        trainingProgram: null,
        trainingProgramsByTecnicalGroups: [],
        result: null
    }),

    actions: {
        async fetchTrainingPrograms() {
            try {
                this.trainingPrograms = await trainingProgramApi.get()
            } catch (error) {
                console.error('Failed to fetch trainees', error)
            }
        },

         async fetchTrainingProgramsByTechnicalGroup(id) {
            try {
                this.trainees = await trainingProgramApi.getAllByTechnicalGroupId(id);
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },

        async fetchTrainingProgramDetail(params) {
            try {
                this.trainingProgram = await trainingProgramApi.getDetail(params)
            } catch (error) {
                console.error('Failed to fetch trainee detail', error)
            }
        },

        async fetchDeleteTrainingProgram(params) {
            try {
                this.result = await trainingProgramApi.delete(params)
            } catch (error) {
                console.error('Failed to fetch trainee detail', error)
            }
        },

        async fetchAddTrainingProgram(data) {
            try {
                this.result = await trainingProgramApi.post(data)
            } catch (error) {
                console.error('Failed to fetch trainee detail', error)
            }
        },

        async fetchUpdateTrainingProgram(id, data) {
            try {
                this.result = await trainingProgramApi.put(id, data)
            } catch (error) {
                console.error('Failed to fetch trainee detail', error)
            }
        }
    },

    getters: {}
})

