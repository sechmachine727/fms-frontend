import trainingCalendarApi from "@/api/trainingCalendarApi";
import { defineStore } from "pinia";

export const useTrainingCalendarStore = defineStore("trainingCalendarStore", {
    state: () => ({
        topicByGroups: [],
        presets: [],
        trainers: [],
        calendars: [],
        topics: [],
    }),

    actions: {
        async fectchCalendarByGroupId(id) {
            try {
                this.calendars = await trainingCalendarApi.getAllCalendarByGroupId(id);
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },

        async fectchTrainingTopics(id) {
            try {
                this.topicByGroups = await trainingCalendarApi.getAllTopicsByGroupId(id);
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },
        async fectchPresets() {
            try {
                this.presets = await trainingCalendarApi.getAllPresets();
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },

        async fectchTrainers() {
            try {
                this.trainers = await trainingCalendarApi.getAllTrainers();
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },


        async fectchGenerateCalender(data) {
            try {
                const result = await trainingCalendarApi.post(data)
                return result.data
            } catch (error) {
                console.error("Error fetching trainees:", error);
                throw error
            }
        },

        async fectchTopics() {
            try {
                this.topics = await trainingCalendarApi.getAllTopics();
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },
    },

    getters: {

    }
});
