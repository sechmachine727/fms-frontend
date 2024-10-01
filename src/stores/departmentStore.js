import deparmentApi from "@/api/departmentApi";
import { defineStore } from "pinia";

export const useDepartmentStore = defineStore("departmentStore", {
    state: () => ({
        departments: []
    }),

    actions: {
        async fetchDepartments() {
            try {
                this.departments = await deparmentApi.get();
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },
    },

    getters: {

    }
});