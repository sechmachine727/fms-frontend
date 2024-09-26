export const TopicStore = {
    getData() {
        return[
            {
                id: 1,
                TopicCode: 'FR_CP-KS',
                TopicName: 'Capstone Project FU KS',
                TechnicalGroup:'Others',
                status: 'Active',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 2,
                TopicCode: 'FR_JS_FED',
                TopicName: 'Front-End Development Overview',
                TechnicalGroup:'Front-end',
                status: 'Inactive',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 3,
                TopicCode: 'FR_JS_JSA',
                TopicName: 'JavaScript Advanced',
                TechnicalGroup:'Front-end',
                status: 'Active',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 4,
                TopicCode: 'Kafka-DNA',
                TopicName: 'Kafka',
                TechnicalGroup:'Data Engineering',
                status: 'Inactive',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 5,
                TopicCode: 'FR_CP-KS',
                TopicName: 'Capstone Project FU KS',
                TechnicalGroup:'Front-end',
                status: 'Active',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 6,
                TopicCode: 'FR_CP-KS',
                TopicName: 'Capstone Project FU KS',
                TechnicalGroup:'Others',
                status: 'Active',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 7,
                TopicCode: 'FR_CP-KS',
                TopicName: 'Capstone Project FU KS',
                TechnicalGroup:'Others',
                status: 'Inactive',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 8,
                TopicCode: 'FR_JS_HTMLE',
                TopicName: 'HTML Essentials',
                TechnicalGroup:'Front-end',
                status: 'Active',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 9,
                TopicCode: 'FR_CP-KS',
                TopicName: 'Capstone Project FU KS',
                TechnicalGroup:'Others',
                status: 'Active',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
            {
                id: 10,
                TopicCode: 'FR_CP-KS',
                TopicName: 'Capstone Project FU KS',
                TechnicalGroup:'Others',
                status: 'Inactive',
                LastModifiedDate: '2015-09-13',
                LastModifiedBy: 'KhanhNN44',
            },
        ]
    },

    getTopicsSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getTopicsMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getTopicsLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getTopicsXLarge() {
        return Promise.resolve(this.getData());
    },

    getTopics(params) {
        const queryParams = params
            ? Object.keys(params)
                .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&')
            : '';

        return fetch('https://www.primefaces.org/data/customers?' + queryParams).then((res) => res.json());
    },
    getTopicDetail(id) {
        return Promise.resolve(this.getData().find((topic) => topic.id === id));
    },
};

export const sessions = [
    {
        session: 1,
        details: [
            {
                content: "Kick off project meeting",
                learningObjectives: "CPFU-KS",
                deliveryType: "Class Meeting",
                duration: "2h",
                trainingFormat: "Offline",
                notes: ""
            },
            {
                content: "Discussing in order to choose the subject of the project",
                learningObjectives: "CPFU-KS",
                deliveryType: "Guides/Review",
                duration: "4h",
                trainingFormat: "Offline",
                notes: ""
            }
        ]
    },
    {
        session: 2,
        details: [
            {
                content: "Daily scrum",
                learningObjectives: "CPFU-KS",
                deliveryType: "Class Meeting",
                duration: "15m",
                trainingFormat: "Offline",
                notes: ""
            },
            {
                content: "Discussing in order to choose the subject of the project",
                learningObjectives: "CPFU-KS",
                deliveryType: "Product Increment",
                duration: "4h 45m",
                trainingFormat: "Offline",
                notes: ""
            },
            {
                content: "Trainer review and support",
                learningObjectives: "CPFU-KS",
                deliveryType: "Guides/Review",
                duration: "1h",
                trainingFormat: "Offline",
                notes: "Trainer/Mentor guide solutions & resolve issues if need"
            }
        ]
    },
    // Add more sessions as needed
];

export const generalInfo = {
    code: 'FR_CP-KS',
    name: 'Capstone Project FU KS',
    technicalGroup: 'Others',
    totalSession: 70,
    passCriteria: 'Total topic GPA >= 6/10',
    reTestNumber: ''
};

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
