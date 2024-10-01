// stores/traineeStore.js
import siteApi from "@/api/siteApi";
import { defineStore } from "pinia";

export const useSiteStore = defineStore("siteStore", {
    state: () => ({
        sites: []
    }),

    actions: {
        async fetchSites() {
            try {
                this.sites = await siteApi.get();
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },
    },

    getters: {

    }
});
