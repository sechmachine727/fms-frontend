// stores/traineeStore.js
import classApi from "@/api/groupApi";
import { defineStore } from "pinia";

export const useClassStore = defineStore("classStore", {
    state: () => ({
        classes: []
    }),

    actions: {
       async fetchClassList(search) {
             try {
                this.classes = await classApi.get(search);
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },
        async fetchAddGroup(data) {
            try {
                console.log(data);
                const result = await classApi.post(data); 
                return result.data; 
            } catch (error) {
                console.error("Error fetching trainees:", error);
                throw error; 
            }
        },

        fetchInprogressClassList() {
            this.classes = this.classes.filter(c => c.status === 'In Progress');
        }
    },

    getters: {


    }
});

