// stores/traineeStore.js
import userApi from "@/api/userApi";
import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
    state: () => ({
        users: []
    }),

    actions: {
        async fetchUserList() {
            try {
                this.users = await userApi.get();
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },
         async fetchAddUser(data) {
            try {
                const result = await userApi.post(data); 
                return result.data; 
            } catch (error) {
                console.error("Error fetching trainees:", error);
                throw error; 
            }
        }
    },

    getters: {


    }
});

