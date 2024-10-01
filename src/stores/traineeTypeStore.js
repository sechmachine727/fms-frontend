import traineeTypeApi from "@/api/traineeType";
import { defineStore } from "pinia";

export const useTraineeTypeStore = defineStore("traineeTypeStore", {
    state: () => ({
        traineeTypes: []
    }),

    actions: {
        async fectchTraineeTypes() {
            try {
                this.traineeTypes = await traineeTypeApi.get();
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },
    },

    getters: {

    }
});
