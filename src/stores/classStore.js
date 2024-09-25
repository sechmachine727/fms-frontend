// stores/traineeStore.js
import { defineStore } from "pinia";

export const useClassStore = defineStore("classStore", {
    state: () => ({
        classes: []
    }),

    actions: {
        fetchClassList() {
            this.classes = [
            {
                no: 1,
                classCode: 'C001',
                traineetype: 'Fresher',
                classAdmin: 'John Doe',
                technicalGroup: 'Group A',
                trainingprogram: 'Java Development',
                status: 'Active',
                traineeNumber: 25,
                expectedStartDate: '2024-10-01',
                actualStartDate: '2024-10-01',
                expectedEndDate: '2024-12-31',
                actualEndDate: '2024-12-30',
                representative: { name: 'Jane Smith' },
            },
            {
                no: 2,
                classCode: 'C002',
                traineetype: 'Fresher',
                classAdmin: 'Alice Johnson',
                technicalGroup: 'Group B',
                trainingprogram: 'Web Development',
                status: 'In Progress',
                traineeNumber: 20,
                expectedStartDate: '2024-11-01',
                actualStartDate: '2024-11-01',
                expectedEndDate: '2025-01-31',
                actualEndDate: '2025-01-30',
                representative: { name: 'Bob Brown' },
            },
            {
                no: 3,
                classCode: 'C003',
                traineetype: 'Fresher',
                classAdmin: 'Michael Lee',
                technicalGroup: 'Group C',
                trainingprogram: 'Data Science',
                status: 'Planning',
                traineeNumber: 30,
                expectedStartDate: '2024-12-01',
                actualStartDate: '',
                expectedEndDate: '2025-02-28',
                actualEndDate: '',
                representative: { name: 'Sara White' },
            },
            {
                no: 4,
                classCode: 'C004',
                traineetype: 'Fresher',
                classAdmin: 'Emily Davis',
                technicalGroup: 'Group D',
                trainingprogram: 'Cybersecurity',
                status: 'Reviewing',
                traineeNumber: 18,
                expectedStartDate: '2024-12-10',
                actualStartDate: '2024-12-12',
                expectedEndDate: '2025-03-10',
                actualEndDate: '2025-03-08',
                representative: { name: 'Tom Walker' },
            },
            {
                no: 5,
                classCode: 'C005',
                traineetype: 'Fresher',
                classAdmin: 'Chris Green',
                technicalGroup: 'Group E',
                trainingprogram: 'Cloud Computing',
                status: 'In Progress',
                traineeNumber: 28,
                expectedStartDate: '2024-09-01',
                actualStartDate: '2024-09-03',
                expectedEndDate: '2024-11-30',
                actualEndDate: '2024-11-28',
                representative: { name: 'Sophie Brown' },
            },
            {
                no: 5,
                classCode: 'C005',
                traineetype: 'Fresher',
                classAdmin: 'Chris Green',
                technicalGroup: 'Group E',
                trainingprogram: 'Cloud Computing',
                status: 'ClIn Progressosed',
                traineeNumber: 28,
                expectedStartDate: '2024-09-01',
                actualStartDate: '2024-09-03',
                expectedEndDate: '2024-11-30',
                actualEndDate: '2024-11-28',
                representative: { name: 'Sophie Brown' },
            },
            {
                no: 5,
                classCode: 'C005',
                traineetype: 'Full-time',
                classAdmin: 'Chris Green',
                technicalGroup: 'Group E',
                trainingprogram: 'Cloud Computing',
                status: 'In Progress',
                traineeNumber: 28,
                expectedStartDate: '2024-09-01',
                actualStartDate: '2024-09-03',
                expectedEndDate: '2024-11-30',
                actualEndDate: '2024-11-28',
                representative: { name: 'Sophie Brown' },
            },
            {
                no: 5,
                classCode: 'C005',
                traineetype: 'Full-time',
                classAdmin: 'Chris Green',
                technicalGroup: 'Group E',
                trainingprogram: 'Cloud Computing',
                status: 'Closed',
                traineeNumber: 28,
                expectedStartDate: '2024-09-01',
                actualStartDate: '2024-09-03',
                expectedEndDate: '2024-11-30',
                actualEndDate: '2024-11-28',
                representative: { name: 'Sophie Brown' },
            },
      ]
        },
        fetchInprogressClassList() {
            this.classes = this.classes.filter(c => c.status === 'In Progress');
        }
    },

    getters: {


    }
});

