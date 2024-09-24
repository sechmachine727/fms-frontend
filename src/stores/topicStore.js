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
    }
};
