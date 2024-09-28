// stores/traineeStore.js
import roleApi from "@/api/roleApi";
import { defineStore } from "pinia";

export const useRoleStore = defineStore("roleStore", {
    state: () => ({
        roles: []
    }),

    actions: {
        async fetchRoleList() {
            try {
                this.roles = await roleApi.get();
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },
    },

    getters: {


    }
});

