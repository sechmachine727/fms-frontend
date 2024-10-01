import deliveryTypeApi from "@/api/deliveryTypeApi";
import { defineStore } from "pinia";

export const useDeliveryTypeStore = defineStore("deliveryTypeStore", {
    state: () => ({
        deliveryTypes: []
    }),

    actions: {
        async fetchDeliveryTypes() {
            try {
                this.deliveryTypes = await deliveryTypeApi.get();
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },
    },

    getters: {

    }
});