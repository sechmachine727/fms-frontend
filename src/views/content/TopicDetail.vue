<script setup>
import { ref, onMounted } from 'vue';
import { TopicStore,generalInfo, sessions, assessmentScheme   } from '@/stores/topicStore';

onMounted(() => {
    TopicStore.getTopics().then((data) => (topics.value = data));
});

// Reference the assessment scheme data from the store
const assessmentSchemeData = ref(assessmentScheme);

const topics = ref();

// Map General Info data into a displayable format for DataTable
const generalInfoData = ref([
    { label: 'Code', value: generalInfo.code },
    { label: 'Name', value: generalInfo.name },
    { label: 'Technical Group', value: generalInfo.technicalGroup },
    { label: 'Total Session/Day', value: generalInfo.totalSession },
    { label: 'Pass Criteria', value: generalInfo.passCriteria },
    { label: 'Re-Test Number', value: generalInfo.reTestNumber || '-' },
]);





</script>

<template>
    <div class="card">
        <div class="p-4">
            <!-- Topic Detail Header -->
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-2xl font-bold">Topic Detail</h1>
                <Button label="Download" icon="pi pi-download" class="p-button-primary" />
            </div>

            <!-- TabView for Syllabus and Schedule Details -->
            <TabView>
                <TabPanel header="Syllabus Detail">
                    <!-- General Info and Time Allocation Section -->
                    <div class="grid">
                        <!-- General Info Table -->
                        <div class="general-info mb-8">
                            <h2 class="text-xl font-semibold mb-2">1. General Info</h2>
                            <DataTable :value="generalInfoData" class="general-info-table" responsiveLayout="scroll">
                                <Column field="label" header="Label" class="highlight-label-column"></Column>
                                <Column field="value" header="Value"></Column>
                            </DataTable>
                        </div>

                        <!-- Time Allocation Pie Chart -->
                        <!--                    <div class="col-6">-->
                        <!--                        <h2 class="text-lg font-bold mb-4">2. Time Allocation</h2>-->
                        <!--                        <Chart type="pie" :data="chartData" :options="chartOptions"></Chart>-->
                        <!--                    </div>-->
                    </div>

                    <!-- Assessment Scheme Table -->
                    <div class="assessment-scheme mb-8">
                        <h2 class="text-xl font-semibold mb-2">2. Assessment Scheme</h2>
                        <DataTable :value="assessmentSchemeData" class="assessment-scheme-table" responsiveLayout="scroll">
                            <!-- Highlighting Label Column -->
                            <Column field="assessmentName" header="Assessment Name" ></Column>
                            <Column field="quantity" header="Quantity"></Column>
                            <Column field="weightedNumber" header="Weighted Number"></Column>
                            <Column field="note" header="Note"></Column>
                        </DataTable>
                    </div>
                </TabPanel>

                <TabPanel header="Schedule Detail">
                    <!-- Accordion for each session -->
                    <Accordion>
                        <AccordionTab v-for="session in sessions" :key="session.session" :header="'Session ' + session.session">
                            <!-- PrimeVue DataTable inside each Accordion Tab -->
                            <DataTable :value="session.details" responsiveLayout="scroll">
                                <Column field="content" header="Content"></Column>
                                <Column field="learningObjectives" header="Learning Objectives"></Column>
                                <Column field="deliveryType" header="Delivery Type"></Column>
                                <Column field="duration" header="Duration"></Column>
                                <Column field="trainingFormat" header="Training Format"></Column>
                                <Column field="notes" header="Training Materials / Logistics & General Notes"></Column>
                            </DataTable>
                        </AccordionTab>
                    </Accordion>
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
    width: 20%;
}
.assessment-scheme-table .p-datatable-tbody > tr > td {
    padding: 0.5rem 1rem;
}

.assessment-scheme-table .p-datatable-thead > tr > th {
    padding: 0.75rem 1rem;
}
</style>
