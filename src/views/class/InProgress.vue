<script setup>
import { useClassStore } from '@/stores/groupStore' // Correct the import to use `useTraineeStore`
import { getStatusLabel } from '@/utils/status'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ButtonComponent from '@/components/ButtonComponent.vue'

const classes = ref([])
const classStore = useClassStore()
const router = useRouter()

onMounted(() => {
    classStore.fetchInprogressClassList()
    classes.value = classStore.classes
})

const navigateToAdd = () => {
    router.push('/group-management/add')
}
</script>

<template>
    <div class="card">
        <div class="mb-4 flex justify-between items-center">
            <span class="!font-semibold text-2xl">Group List ({{ classes?.length }})</span>
            <ButtonComponent :onClick="navigateToAdd" activeColor="active:bg-emerald-700"
                             bgColor="bg-emerald-500 text-white"
                             hoverColor="hover:bg-emerald-600" text="Add Group" />
        </div>
        <Divider />
        <DataTable :rows="10" :rowsPerPageOptions="[10, 20, 30, 50]" :value="classes"
                   currentPageReportTemplate="{first} to {last} of {totalRecords}" paginator
                   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                   scrollable tableStyle="min-width: 50rem">
            <Column field="no" header="No" style="min-width: 100px"></Column>
            <Column field="classCode" header="Class Code" style="min-width: 100px"></Column>
            <Column field="traineetype" header="Trainee Type" style="min-width: 150px"></Column>
            <Column field="classAdmin" header="Class Admin" style="min-width: 150px"></Column>
            <Column field="technicalGroup" header="Technical Group" style="min-width: 150px"></Column>
            <Column field="trainingprogram" header="Training Program" style="min-width: 150px"></Column>
            <Column field="status" header="Site" style="min-width: 50px"></Column>
            <Column field="traineeNumber" header="Trainee number" style="min-width: 150px"></Column>
            <Column field="expectedStartDate" header="Expected Start Date" style="min-width: 160px"></Column>
            <Column field="actualStartDate" header="Actual Start Date" style="min-width: 150px"></Column>
            <Column field="expectedEndDate" header="Expected End Date" style="min-width: 150px"></Column>
            <Column field="actualEndDate" header="Actual End Date" style="min-width: 150px"></Column>
            <Column alignFrozen="right" field="status" frozen header="Status" style="min-width: 130px">
                <template #body="slotProps">
                    <Tag :severity="getStatusLabel(slotProps.data.status)" :value="slotProps.data.status" />
                </template>
            </Column>
            <template #empty>
                <div class="flex justify-center items-center h-full">
                    <span class="text-gray-500">No content available</span>
                </div>
            </template>
        </DataTable>
    </div>
</template>

<style>
.p-datatable-table-container {
    height: calc(100vh - 18rem);
}
</style>
