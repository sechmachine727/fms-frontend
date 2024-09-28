<script setup>
import { computed, onMounted, ref } from 'vue'
import { useTrainingProgramStore } from '@/stores/trainingProgramStore'
import { useRoute } from 'vue-router'


const trainingProgramStore = useTrainingProgramStore()
const trainingProgram = ref()
const topicInfo = ref([])

const generalInfo = computed(() => {
    if (trainingProgramStore.trainingProgram) {
        return [
            { label: 'Course Code', value: trainingProgramStore.trainingProgram.code },
            { label: 'Name', value: trainingProgramStore.trainingProgram.trainingProgramName },
            { label: 'Region', value: trainingProgramStore.trainingProgram.region },
            { label: 'Version', value: trainingProgramStore.trainingProgram.version },
            { label: 'Technical Group', value: trainingProgramStore.trainingProgram.technicalGroupCode },
            { label: 'Description', value: trainingProgramStore.trainingProgram.description }
        ]
    } else {
        return []
    }
})

onMounted(() => {
    const route = useRoute()
    const trainingProgramId = route.params.id
    trainingProgramStore.fetchTrainingProgramDetail(trainingProgramId).then(() => {
        trainingProgram.value = trainingProgramStore.trainingProgram
        console.log(trainingProgram.value)
        topicInfo.value = trainingProgramStore.trainingProgram.topicInfoList
        console.log(topicInfo.value)
    })
})


</script>

<template>
    <div class="card">
        <div class="p-4">
            <!-- Topic Detail Header -->
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-2xl font-bold">Training Program Detail</h1>
            </div>
                    <div class="grid">
                        <div class="general-info mb-8">
                            <h2 class="text-xl font-semibold mb-2">1. Training Program Info</h2>
                            <DataTable :value="generalInfo" class="training-program-info-table"
                                       responsiveLayout="scroll">
                                <Column class="highlight-label-column" field="label"></Column>
                                <Column field="value" ></Column>
                            </DataTable>
                        </div>
                    </div>

                    <!-- Assessment Scheme Table -->
                    <div class="assessment-scheme mb-8">
                        <h2 class="text-xl font-semibold mb-2">2. Topic Info</h2>
                        <DataTable :value="topicInfo" class="assessment-scheme-table" responsiveLayout="scroll">
                            <!-- Highlighting Label Column -->
                            <Column header="No." style="width: 5%">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>
                            <Column field="topicCode" header="Topic Code " style="width: 15%"></Column>
                            <Column field="version" header="Version" style="width: 10%"></Column>
                            <Column field="topicName" header="Total Section/Day" style="width: 10%"></Column>
                            <Column field="note" header="Training Time" style="width: 5%"></Column>
                        </DataTable>
                    </div>
        </div>
    </div>

</template>
<style>
.highlight-label-column {
    background-color: #f0f4ff;
    font-weight: bold;
    color: #2c3e50;
    width: 20%;
}
.assessment-scheme-table .p-datatable-tbody > tr > td {
    padding: 0.5rem 1rem;
}

.assessment-scheme-table .p-datatable-thead > tr > th {
    padding: 0.75rem 1rem;
}
</style>
