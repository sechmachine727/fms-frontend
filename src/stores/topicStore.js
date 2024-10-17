import { defineStore } from 'pinia'
import topicApi from '@/api/topicApi'

export const useTopicStore = defineStore('topicStore', {
    state: () => ({
        topics: [],
        topic: null,
        result: null,
        filterTopics: []
    }),

    actions: {
        async fetchTopics() {
            try {
                this.topics = await topicApi.get()
            } catch (error) {
                console.error('Failed to fetch topics', error)
            }
        },

        async fetchActiveTopics() {
            try {
                this.topics = await topicApi.getActiveTopics()
            } catch (error) {
                console.error('Failed to fetch active topics', error)
            }
        },

        async fetchTopicDetail(params) {
            try {
                this.topic = await topicApi.getDetail(params)
            } catch (error) {
                console.error('Failed to fetch topic detail', error)
            }
        },


        async fetchDeactiveTopic(params) {
            try {
                this.result = await topicApi.delete(params)
            } catch (error) {
                console.error('Failed to fetch topic detail', error)
            }
        },

        async fetchAddTopic(data) {
            try {
                this.result = await topicApi.post(data)
            } catch (error) {
                console.error('Failed to fetch topic detail', error)
            }
        },

        async fetchUpdateStatus(id) {
            try {
                const result = await topicApi.putUpdateStatus(id)
                return result.data
            } catch (error) {
                console.error('Error fetching status:', error)
                throw error
            }
        },

        fetchFilterTopics(criteria) {
            const searchQuery = criteria.searchQuery.toLowerCase() === '' ? null : criteria.searchQuery.trim().toLowerCase()
            const technicalGroup = criteria.technicalGroupOptionsSearch.map(technical => technical.code.toLowerCase())
            const statusSearchQuery = criteria.statusOptions.id === 'All' ? null : criteria.statusOptions
            console.log(statusSearchQuery)
            this.filterTopics = this.topics.filter((topic) => {

                const matchesSearchQuery = searchQuery
                    ? topic.name.toLowerCase().includes(searchQuery) ||
                    topic.code.toLowerCase().includes(searchQuery)
                    : true

                const matchesTechnicalGroup = technicalGroup.length
                    ? technicalGroup.includes(topic.technicalGroup.code.toLowerCase())
                    : true

                const matchStatusSearch = statusSearchQuery
                    ? topic.status.toLowerCase() === statusSearchQuery.id.toLowerCase()
                    : true

                return matchesSearchQuery && matchStatusSearch && matchesTechnicalGroup
            })
        }
    },

    getters: {}
})

