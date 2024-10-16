// stores/traineeStore.js
import trainingProgramApi from '@/api/trainingProgramApi'
import { defineStore } from 'pinia'

export const useTrainingProgramStore = defineStore('trainingProgramStore', {
    state: () => ({
        trainingPrograms: [],
        trainingProgram: null,
        trainingProgramsByTecnicalGroups: [],
        result: null,
        filterTrainingPrograms: []
    }),

    actions: {
        async fetchTrainingPrograms() {
            try {
                this.trainingPrograms = await trainingProgramApi.get()
            } catch (error) {
                console.error('Failed to fetch trainees', error)
            }
        },

         async fetchTrainingProgramsByTechnicalGroup(id) {
            try {
                this.trainingProgramsByTecnicalGroups = await trainingProgramApi.getAllByTechnicalGroupId(id);
            } catch (error) {
                console.error("Failed to fetch trainees", error);
            }
        },

        async fetchTrainingProgramDetail(params) {
            try {
                this.trainingProgram = await trainingProgramApi.getDetail(params)
            } catch (error) {
                console.error('Failed to fetch trainee detail', error)
            }
        },

        async fetchDeleteTrainingProgram(params) {
            try {
                this.result = await trainingProgramApi.delete(params)
            } catch (error) {
                console.error('Failed to fetch trainee detail', error)
            }
        },

        async fetchAddTrainingProgram(data) {
            try {
                const result = await trainingProgramApi.post(data)
                return result.data
            } catch (error) {
                console.error('Failed to fetch trainee detail', error)
                throw error
            }
        },

        async fetchUpdateTrainingProgram(id, data) {
            try {
                const result = await trainingProgramApi.put(id, data)
                return result.data
            } catch (error) {
                console.error('Failed to fetch trainee detail', error)
                throw error
            }
        },

        // async fetchUpdateStatus(id) {
        //     try {
        //         const result = await trainingProgramApi.putUpdateStatus(id)
        //         return result.data
        //     } catch (error) {
        //         console.error('Error fetching status:', error)
        //         throw error
        //     }
        // },

        // Toggle to Active (FA Manager)
        async fetchToggleToActive(id) {
            try {
                const result = await trainingProgramApi.putUpdateStatus(id)
                return result.data
            } catch (error) {
                console.error('Error toggling to active:', error)
                throw error
            }
        },

        // Toggle to Declined from Reviewing (FA Manager)
        async fetchToggleReviewingToDeclined(id, reason) {
            try {
                const result = await trainingProgramApi.putToggleReviewingToDeclined(id, reason)
                return result.data
            } catch (error) {
                console.error('Error toggling to declined:', error)
                throw error
            }
        },

        // Toggle between Active/Inactive
        async fetchToggleActivate(id) {
            try {
                const result = await trainingProgramApi.putToggleActivate(id)
                return result.data
            } catch (error) {
                console.error('Error toggling active/inactive status:', error)
                throw error
            }
        },

        fetchFilterTrainingPrograms(criteria) {
            const departmentNames = criteria.departmentOptionsSearch.map(department => department.departmentName.toLowerCase())
            const searchQuery = criteria.searchQuery.toLowerCase() === '' ? null : criteria.searchQuery.trim().toLowerCase()
            const statusSearchQuery = criteria.statusOptions.id === 'All' ? null : criteria.statusOptions
            console.log(statusSearchQuery)
            this.filterTrainingPrograms = this.trainingPrograms.filter((trainingProgram) => {
                // Kiểm tra điều kiện lọc theo phòng ban
                const matchesDepartment = departmentNames.length
                    ? departmentNames.includes(trainingProgram.department.departmentName.toLowerCase())
                    : true

                const matchesSearchQuery = searchQuery
                    ? trainingProgram.trainingProgramName.toLowerCase().includes(searchQuery) ||
                    trainingProgram.code.toLowerCase().includes(searchQuery)
                    : true

                const matchStatusSearch = statusSearchQuery
                    ? trainingProgram.status.toLowerCase() === statusSearchQuery.id.toLowerCase()
                    : true

                return matchesDepartment && matchesSearchQuery && matchStatusSearch
            })
        }
    },

    getters: {}
})

