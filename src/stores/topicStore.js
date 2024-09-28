import { defineStore } from 'pinia'
import topicApi from '@/api/topicApi'

export const useTopicStore = defineStore('topicStore', {
    state: () => ({
        topics: [],
        topic: null,
        result: null
    }),

    actions: {
        async fetchTopics() {
            try {
                this.topics = await topicApi.get()
            } catch (error) {
                console.error('Failed to fetch topics', error)
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
        }
    },

    getters: {}
})
