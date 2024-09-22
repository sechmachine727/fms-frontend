// stores/traineeStore.js
import { defineStore } from "pinia";
import traineeApi from "@/api/trainee_api";

export const useTraineeStore = defineStore("traineeStore", {
    state: () => ({
        trainees: [],
        trainee: null,
        result: null
    }),

    actions: {
        async fetchTrainees(params) {
            try {
                this.trainees = await traineeApi.get(params);
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchTraineeDetail(params) {
            try {
                this.trainee = await traineeApi.getDetail(params);
            } catch (error) {
                console.error("Failed to fetch trainee detail", error);
            } finally {
                this.isLoading = false;
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

