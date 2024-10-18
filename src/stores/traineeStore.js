// stores/traineeStore.js
import traineeApi from '@/api/traineeApi'
import { defineStore } from 'pinia'

export const useTraineeStore = defineStore("traineeStore", {
    state: () => ({
        trainees: [],
        trainee: null,
        result: null
    }),

    actions: {
        async fetchTrainees() {
            try {
                this.trainees = await traineeApi.get()
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchTraineeDetail(id) {
            try {
                this.trainee = await traineeApi.getDetail(id)
            } catch (error) {
                console.error("Failed to fetch trainee detail", error);
            }
        },

        async fetchDeleteTrainee(params) {
            try {
                this.result = await traineeApi.delete(params);
            } catch (error) {
                console.error("Failed to fetch trainee detail", error);
            }
        },

        async fetchAddTrainee(data) {
            try {
                this.result = await traineeApi.post(data);
            } catch (error) {
                console.error("Failed to fetch trainee detail", error);
            }
        },

        async fetchUpdateTrainee(id, data) {
            try {
                this.result = await traineeApi.put(id, data);
            } catch (error) {
                console.error("Failed to fetch trainee detail", error);
            }
        }
    },

    getters: {


    }
});

