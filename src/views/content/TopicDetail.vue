<script setup>
import { useTopicStore } from '@/stores/topicStore';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';


const topicStore = useTopicStore()
const topic = ref()
const assessmentScheme = ref([])
const units = ref([])
const unitSections = ref([])
// Map General Info data into a displayable format for DataTable
const generalInfo = computed(() => {
    if (topicStore.topic) {
        return [
            { label: 'Code', value: topicStore.topic.code },
            { label: 'Name', value: topicStore.topic.name },
            { label: 'Technical Group', value: topicStore.topic.technicalGroupCode },
            { label: 'Pass Criteria', value: topicStore.topic.passCriteria },
        ]
    } else {
        return []
    }
})

onMounted(() => {
    const route = useRoute()
    const topicId = route.params.id
    topicStore.fetchTopicDetail(topicId).then(() => {
        topic.value = topicStore.topic
        assessmentScheme.value = topicStore.topic.topicAssessments
        units.value = topicStore.topic.units
        unitSections.value = topicStore.topic.units[0].unitSections
    })
})
</script>

<template>
    <div class="card">
        <div class="p-4">
            <!-- Topic Detail Header -->
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-2xl font-bold">Topic Detail</h1>
            </div>

            <!-- TabView for Syllabus and Schedule Details -->
            <TabView>
                <TabPanel header="Syllabus Detail">
                    <!-- General Info and Time Allocation Section -->
                    <div class="grid">
                        <!-- General Info Table -->
                        <div class="general-info mb-8">
                            <h2 class="text-xl font-semibold mb-2">1. General Info</h2>
                            <div></div>
                            <DataTable :value="generalInfo" class="general-info-table" responsiveLayout="scroll">
                                <Column field="label" class="highlight-label-column"></Column>
                                <Column field="value"></Column>
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
                        <DataTable :value="assessmentScheme" class="assessment-scheme-table" responsiveLayout="scroll">
                            <!-- Highlighting Label Column -->
                            <Column field="assessmentName" header="Assessment Name"></Column>
                            <Column field="quantity" header="Quantity"></Column>
                            <Column field="weightedNumber" header="Weighted Number"></Column>
                            <Column field="note" header="Note"></Column>
                        </DataTable>
                    </div>
                </TabPanel>

                <TabPanel header="Schedule Detail">
                    <Accordion value="0" v-for="unit in units" :key="unit.unitName">
                        <AccordionPanel value="0">
                            <AccordionHeader>{{ unit.unitName }}</AccordionHeader>
                            <AccordionContent>
                                <DataTable :value="unit.unitSections" responsiveLayout="scroll">
                                    <Column field="title" header="Content"></Column>
                                    <Column field="deliveryType" header="Delivery Type"></Column>
                                    <Column field="duration" header="Duration"></Column>
                                    <Column field="trainingFormat" header="Training Format"></Column>
                                    <Column field="note" header="Training Materials / Logistics & General Notes">
                                    </Column>
                                </DataTable>
                            </AccordionContent>
                        </AccordionPanel>
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

.assessment-scheme-table .p-datatable-tbody>tr>td {
    padding: 0.5rem 1rem;
}

.assessment-scheme-table .p-datatable-thead>tr>th {
    padding: 0.75rem 1rem;
}
</style>
