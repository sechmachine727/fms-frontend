<script setup>
import { computed, onMounted, ref } from 'vue'
import { useTraineeStore } from '@/stores/traineeStore'
import { useRoute } from 'vue-router'
import ButtonComponent from '@/components/ButtonComponent.vue'
import router from '@/router'


const traineeDetail = ref()
const traineeStore = useTraineeStore()

const generalInfo = computed(() => {
    if (traineeStore.trainee) {
        return [
            {
                label1: 'Full Name', value1: traineeStore.trainee.name,
                label2: 'Email', value2: traineeStore.trainee.email,
                label3: 'University GPA', value3: traineeStore.trainee.gpa
            },
            {
                label1: 'National ID', value1: traineeStore.trainee.nationalId,
                label2: 'Phone', value2: traineeStore.trainee.phone,
                label3: 'University Graduation Date', value3: traineeStore.trainee.universityGraduationDate
            },
            {
                label1: 'D.O.B', value1: traineeStore.trainee.dob,
                label2: 'Gender', value2: traineeStore.trainee.gender,
                label3: 'University', value3: traineeStore.trainee.university
            },
            {
                label1: 'Language', value1: traineeStore.trainee.language,
                label2: 'Address', value2: traineeStore.trainee.address
            }
        ]
    } else {
        return []
    }
})

const navigateToBack = () => {
    router.push('/trainee-management/trainees')
}

const navigateToEdit = (id) => {
    console.log(id)
}

onMounted(() => {
    const route = useRoute()
    const traineeId = route.params.id
    traineeStore.fetchTraineeDetail(traineeId).then(() => {
        traineeDetail.value = traineeStore.trainee
        console.log(traineeDetail.value)
    })
})


</script>

<template>
    <div class="card">
        <div class="p-4">
            <div class="flex justify-between items-center mb-4">
                <span v-if="traineeDetail" class="font-semibold text-xl">
                    Trainee Details : {{ traineeDetail?.name }}
                </span>
            </div>

            <Divider />
            <TabView>
                <TabPanel header="Trainee Information">
                    <div class="general-info mb-8">
                        <table class="w-full border-collapse">
                            <tbody>
                            <tr v-for="trainee in generalInfo" :key="trainee.label">
                                <td class="highlight-label-column">{{ trainee.label1 }}</td>
                                <td>{{ trainee.value1 }}</td>
                                <td class="highlight-label-column">{{ trainee.label2 }}</td>
                                <td>{{ trainee.value2 }}</td>
                                <td class="highlight-label-column">{{ trainee.label3 }}</td>
                                <td>{{ trainee.value3 }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="mt-4 flex justify-between">
                        <div>
                            <ButtonComponent :onClick="navigateToBack" activeColor="active:bg-gray-300"
                                             bgColor="bg-white"
                                             hoverColor="hover:bg-gray-200" màu text="Back to Trainee List" đen />
                        </div>
                        <div class="flex gap-2">
                            <button class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out" type="submit"
                                    @click="navigateToEdit(traineeDetail.id)">
                                Edit Trainee
                            </button>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Training History">

                </TabPanel>
            </TabView>
        </div>
    </div>

</template>

<style>
.highlight-label-column {
    background-color: #f0f4ff;
    font-weight: bold;
    color: #2c3e50;
    width: 15%;
}

.assessment-scheme-table .p-datatable-tbody > tr > td {
    padding: 0.5rem 1rem;
}

.assessment-scheme-table .p-datatable-thead > tr > th {
    padding: 0.75rem 1rem;
}


.highlight-label-column {
    background-color: #f0f4ff;
    font-weight: bold;
    color: #2c3e50;
    padding: 0.5rem;
}

table {
    width: 100%;
    border: 1px solid #ccc;
}

th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #ccc;
}
</style>
