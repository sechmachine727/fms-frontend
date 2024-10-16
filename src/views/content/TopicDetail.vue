<script setup>
import { useTopicStore } from '@/stores/topicStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'


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
            { label: 'Technical Group', value: topicStore.topic.technicalGroup.code },
            { label: 'Pass Criteria', value: topicStore.topic.passCriteria },
        ]
    } else {
        return []
    }
})

const formatNote = (note) => {
    if (!note) return ''
    return note
        .replace(/\\n/g, '<br>')
}


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
                    <div class="general-info mb-8">
                        <h2 class="text-xl font-semibold mb-2">1. Training Program Info</h2>
                        <table class="w-full border-collapse">
                            <tbody>
                                <tr v-for="info in generalInfo" :key="info.label">
                                    <td class="highlight-label-column">{{ info.label }}</td>
                                    <td>{{ info.value }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Assessment Scheme Table -->
                    <div class="assessment-scheme mb-8">
                        <h2 class="text-xl font-semibold mb-2">2. Assessment Scheme</h2>
                        <DataTable :value="assessmentScheme" class="assessment-scheme-table" responsiveLayout="scroll">
                            <!-- Highlighting Label Column -->
                            <Column field="assessmentName" header="Assessment Name"></Column>
                            <Column field="quantity" header="Quantity"></Column>
                            <Column field="weightedNumber" header="Weighted Number"></Column>
                            <Column field="note" header="Note">
                                <template #body="slotProps">
                                    <span v-html="formatNote(slotProps.data.note)"></span>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </TabPanel>

                <TabPanel header="Schedule Detail">
                    <Accordion value={null} v-for="unit in units" :key="unit.unitName">
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
    width: 15%;
}

.assessment-scheme-table .p-datatable-tbody>tr>td {
    padding: 0.5rem 1rem;
}

.assessment-scheme-table .p-datatable-thead>tr>th {
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

th,
td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #ccc;
}
</style>
