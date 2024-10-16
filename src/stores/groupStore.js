// stores/traineeStore.js
import classApi from '@/api/groupApi'
import { defineStore } from 'pinia'

export const useClassStore = defineStore("classStore", {
    state: () => ({
        classes: [],
        filterClasses: [],
        classDetail: null
    }),

    actions: {
       async fetchClassList(search) {
             try {
                this.classes = await classApi.get(search);
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },

        async fetchClassDetail(id) {
             try {
                this.classDetail = await classApi.getDetail(id);
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },

        async fetchAddGroup(data) {
            try {
                const result = await classApi.post(data)
                return result.data
            } catch (error) {
                console.error("Error fetching trainees:", error);
                throw error
            }
        },

        fetchInprogressClassList() {
            this.classes = this.classes.filter(c => c.status === 'In Progress');
        },

        fetchFilterClass(criteria) {
            const searchQuery = criteria.searchQuery.toLowerCase() === "" ? null : criteria.searchQuery.trim().toLowerCase()
            const statusSearchQuery = criteria.statusOptions.map(status => status.id.toLowerCase());
            this.filterClasses = this.classes.filter((c) => {
            const matchesSearchQuery = searchQuery
                ? c.groupCode.toLowerCase().includes(searchQuery)
                || c.groupName.toLowerCase().includes(searchQuery)
                || c.trainingProgramName.toLowerCase().includes(searchQuery)
            : true;


                const matchStatusSearch = statusSearchQuery.length > 0
            ? statusSearchQuery.includes(c.status.toLowerCase())
            : true; // Nếu không có status được chọn, cho phép tất cả


             return matchesSearchQuery && matchStatusSearch;
    });
        }
    },

    getters: {


    }
});

