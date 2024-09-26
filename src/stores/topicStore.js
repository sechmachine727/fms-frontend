import { defineStore } from "pinia";
import topicApi from "@/api/topicApi";

export const useTopicStore = defineStore("topicStore", {
    state: () => ({
        topics: [],
        topic: null,
        result: null
    }),

    actions: {
        async fetchTopics() {
            try {
                this.topics = await topicApi.get();
            } catch (error) {
                console.error("Failed to fetch topics", error);
            }
        },

        async fetchTopicDetail(params) {
            try {
                this.topics = await topicApi.getDetail(params);
            } catch (error) {
                console.error("Failed to fetch topic detail", error);
            }
        },

        async fetchDeactiveTopic(params) {
            try {
                this.result = await topicApi.delete(params);
            } catch (error) {
                console.error("Failed to fetch topic detail", error);
            }
        },

        async fetchAddTopic(data) {
            try {
                this.result = await topicApi.post(data);
            } catch (error) {
                console.error("Failed to fetch topic detail", error);
            }
        },
    },

    getters: {
    }
});

export const assessmentScheme = [
    { assessmentName: 'Final Report', quantity: 1, weightedNumber: 100, note: 'This is the final report submission.' },
    { assessmentName: 'Midterm Exam', quantity: 1, weightedNumber: 40, note: 'Midterm exam to evaluate progress.' },
    { assessmentName: 'Project', quantity: 1, weightedNumber: 30, note: 'Grading of the course project.' },
    { assessmentName: 'Participation', quantity: 1, weightedNumber: 10, note: 'Participation in class activities.' },
];

export const TrainingProgramStore = {
    getData() {
        return[
            {
                id: 1,
                CourseCode: 'FR_CP-KS',
                TrainingName: 'Capstone Project FU KS',
                Region:'FSA.HN',
                TechnicalGroup:'Others',
                Topic:'CPL_P-NET',
                status: 'Active',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 2,
                CourseCode: 'FR_CP-KS',
                TrainingName: 'Capstone Project FU KS',
                Region:'FSA.HN',
                TechnicalGroup:'Others',
                Topic:'CPL_P-NET',
                status: 'Active',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 3,
                CourseCode: 'FR_CP-KS',
                TrainingName: 'Capstone Project FU KS',
                Region:'FSA.HN',
                TechnicalGroup:'Others',
                Topic:'CPL_P-NET',
                status: 'Active',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 4,
                CourseCode: 'FR_CP-KS',
                TrainingName: 'Capstone Project FU KS',
                Region:'FSA.HN',
                TechnicalGroup:'Others',
                Topic:'CPL_P-NET',
                status: 'Active',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 5,
                CourseCode: 'FR_CP-KS',
                TrainingName: 'Capstone Project FU KS',
                Region:'FSA.HN',
                TechnicalGroup:'Others',
                Topic:'CPL_P-NET',
                status: 'Active',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 6,
                CourseCode: 'FR_CP-KS',
                TrainingName: 'Capstone Project FU KS',
                Region:'FSA.HN',
                TechnicalGroup:'Others',
                Topic:'CPL_P-NET',
                status: 'Active',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 7,
                CourseCode: 'FR_CP-KS',
                TrainingName: 'Capstone Project FU KS',
                Region:'FSA.HN',
                TechnicalGroup:'Others',
                Topic:'CPL_P-NET',
                status: 'Active',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 8,
                CourseCode: 'FR_CP-KS',
                TrainingName: 'Capstone Project FU KS',
                Region:'FSA.HN',
                TechnicalGroup:'Others',
                Topic:'CPL_P-NET',
                status: 'Active',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 9,
                CourseCode: 'FR_CP-KS',
                TrainingName: 'Capstone Project FU KS',
                Region:'FSA.HN',
                TechnicalGroup:'Others',
                Topic:'CPL_P-NET',
                status: 'Active',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 10,
                CourseCode: 'FR_CP-KS',
                TrainingName: 'Capstone Project FU KS',
                Region:'FSA.HN',
                TechnicalGroup:'Others',
                Topic:'CPL_P-NET',
                status: 'Active',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
        ]
    },

    getTrainingProgramsSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getTrainingProgramsMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getTrainingProgramsLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getTrainingProgramsXLarge() {
        return Promise.resolve(this.getData());
    },

    getTrainingPrograms(params) {
        const queryParams = params
            ? Object.keys(params)
                .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&')
            : '';

        return fetch('https://www.primefaces.org/data/customers?' + queryParams).then((res) => res.json());
    },
    getTrainingProgramsDetail(id) {
        return Promise.resolve(this.getData().find((topic) => topic.id === id));
    },
};
