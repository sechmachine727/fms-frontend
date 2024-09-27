<script setup>
import { ref, onMounted } from 'vue';
import { assessmentScheme, useTopicStore } from '@/stores/topicStore'


onMounted(() => {
    // topicStore.fetchTopicDetail().then((data) => (topics.value = data));
});

// Reference the assessment scheme data from the store
const assessmentSchemeData = ref(assessmentScheme);
const generalInfo = ref()

// Map General Info data into a displayable format for DataTable
const generalInfoData = ref([
    { label: 'Course Code', value: generalInfo.code },
    { label: 'Name', value: generalInfo.name },
    { label: 'Region', value: generalInfo.passCriteria },
    { label: 'Technical Group', value: generalInfo.technicalGroup },
    { label: 'Content Link', value: generalInfo.totalSession },
    { label: 'Description', value: generalInfo.reTestNumber || '-' },
]);


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
                            <DataTable :value="generalInfoData" class="training-program-info-table" responsiveLayout="scroll">
                                <Column field="label"  class="highlight-label-column"></Column>
                                <Column field="value" ></Column>
                            </DataTable>
                        </div>
                    </div>

                    <!-- Assessment Scheme Table -->
                    <div class="assessment-scheme mb-8">
                        <h2 class="text-xl font-semibold mb-2">2. Topic Info</h2>
                        <DataTable :value="assessmentSchemeData" class="assessment-scheme-table" responsiveLayout="scroll">
                            <!-- Highlighting Label Column -->
                            <Column  header="No." style="width: 5%"></Column>
                            <Column field="assessmentName" header="Topic Code - Version" style="width: 20%"></Column>
                            <Column field="quantity" header="Topic Name" style="width: 20%"></Column>
                            <Column field="weightedNumber" header="Total Section/Day" style="width: 10%"></Column>
                            <Column field="note" header="Training Time" style="width: 5%"></Column>
                            <Column :exportable="false" header="Action" style="width: 5%">
                                <template #body>
                                    <Button icon="pi pi-download" outlined rounded class="mr-2" />
                                </template>
                            </Column>
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
