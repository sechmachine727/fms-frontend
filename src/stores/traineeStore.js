// stores/traineeStore.js
import traineeApi from '@/api/traineeApi'
import { defineStore } from 'pinia'

export const useTraineeStore = defineStore("traineeStore", {
    state: () => ({
        trainees: [],
        trainee: null,
        filterTrainees: [],
        result: null
    }),

    actions: {
        async fetchTrainees() {
            try {
                this.trainees = await traineeApi.get()
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchTraineeDetail(params) {
            try {
                this.trainee = await traineeApi.getDetail(params)
            } catch (error) {
                console.error("Failed to fetch trainee detail", error);
            }
        },

        async fetchDeleteTrainee(params) {
            try {
                this.result = await traineeApi.delete(params);
            } catch (error) {
                console.error("Failed to fetch trainee detail", error);
            }
        },

        async fetchAddTrainee(data) {
            try {
                this.result = await traineeApi.post(data);
            } catch (error) {
                console.error("Failed to fetch trainee detail", error);
            }
        },

        async fetchUpdateTrainee(id, data) {
            try {
                const result = await traineeApi.put(id, data)
                return result.data
            } catch (error) {
                console.error('Failed to fetch trainee detail', error)
                throw error
            }
        },

        fetchFilterTrainee(criteria) {
            const searchQuery = criteria.searchQuery.toLowerCase() === '' ? null : criteria.searchQuery.trim().toLowerCase()
            // const statusSearchQuery = criteria.statusOptions.map(status => status.id.toLowerCase());
            this.filterTrainees = this.trainees.filter((trainee) => {
                const matchesSearchQuery = searchQuery
                    ? trainee.name.toLowerCase().includes(searchQuery)
                    || trainee.email.toLowerCase().includes(searchQuery)
                    || trainee.university.toLowerCase().includes(searchQuery)
                    : true

                // const matchStatusSearch = statusSearchQuery.length > 0
                //     ? statusSearchQuery.includes(trainee.status.toLowerCase())
                //     : true;

                return matchesSearchQuery
            })
        }
    },

    getters: {


    }
});

