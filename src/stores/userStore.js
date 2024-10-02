// stores/traineeStore.js
import userApi from "@/api/userApi";
import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
    state: () => ({
        users: [],
        classAdmins: [],
        user: null,
    }),

    actions: {
        async fetchUserList(params) {
            try {
                this.users = await userApi.get(params);
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },
        async fetchClassAdmins() {
            try {
                this.classAdmins = await userApi.getAllClassAdmins();
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
        },
         async fetchUpdateUser(id, data) {
            try {
                const result = await userApi.put(id,data); 
                return result.data; 
            } catch (error) {
                console.error("Error fetching trainees:", error);
                throw error; 
            }
        },
         
        async fetchUpdateStatus(id) {
            try {
                const result = await userApi.putUpdateStatus(id); 
                return result.data; 
            } catch (error) {
                console.error("Error fetching trainees:", error);
                throw error; 
            }
        }, 
         
         async fetchUserDetail(id) {
            try {
                this.user = await userApi.getDetail(id); 
            } catch (error) {
                console.error("Error fetching trainees:", error);
                throw error; 
            }
        }
    },

    getters: {


    }
});

