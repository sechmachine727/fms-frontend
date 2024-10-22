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
      { label: 'Region', value: trainingProgramStore.trainingProgram.department.departmentName },
      { label: 'Version', value: trainingProgramStore.trainingProgram.version },
      { label: 'Technical Group', value: trainingProgramStore.trainingProgram.technicalGroup.code },
      { label: 'Description', value: trainingProgramStore.trainingProgram.description }
    ]
  } else {
    return []
  }
})
const route = useRoute()
const trainingProgramId = route.params.id
onMounted(() => {
  trainingProgramStore.fetchTrainingProgramDetail(trainingProgramId).then(() => {
    trainingProgram.value = trainingProgramStore.trainingProgram
    topicInfo.value = trainingProgramStore.trainingProgram.topicInfoList
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
      <!-- Training Program Info -->
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
        <h2 class="text-xl font-semibold mb-2">2. Topic Info</h2>
        <DataTable :value="topicInfo" class="assessment-scheme-table" responsiveLayout="scroll">
          <Column header="No." style="width: 5%">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>
          <Column field="topicCode" header="Topic Code " style="width: 15%">
            <template #body="slotProps">
              <router-link
                :to="{ name: 'topic-detail', params: { id: slotProps.data.id } }"
                class="router-link-active"
              >
                {{ slotProps.data.topicCode }}
              </router-link>
            </template>
          </Column>
          <Column field="topicName" header="Topic Name" style="width: 20%">
            <template #body="slotProps">
              <router-link
                :to="{ name: 'topic-detail', params: { id: slotProps.data.id } }"
                class="router-link-active"
              >
                {{ slotProps.data.topicName }}
              </router-link>
            </template>
          </Column>
          <Column field="version" header="Version" style="width: 10%"></Column>
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

.router-link-active {
  color: #2196f3;
}
</style>
