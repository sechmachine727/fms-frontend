<script setup>
import { useClassStore } from "@/stores/classStore"; // Correct the import to use `useTraineeStore`
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const classes = ref([]);
const classStore = useClassStore();
const router = useRouter();

onMounted(() => {
    classes.value = classStore.classes;
})
const getStatusLabel = (status) => {
    switch (status) {
        case 'Active':
            return 'success';
        case 'Planning':
            return 'secondary';
        case 'Assign':
            return 'info';
        case 'Pending':
            return 'warn';
        case 'Close':
            return 'danger';
        case 'Reviewing':
            return 'warn';
        case 'In Progress':
            return 'info';
        case 'Closed':
            return 'contrast';
        default:
            return null;
    }
};

const navigateToAdd = () => {
    router.push('/class-management/add');
};
</script>

<template>
    <div class="card">
        <div class="text-xl mb-4 flex justify-between items-center">
            <span class="font-semibold text-2xl">Class List</span>
            <Button label="Add" class="bg-slate-500 text-white" icon="pi pi-plus" iconPos="right"
                @click="navigateToAdd" />
        </div>
        <Divider />
        <DataTable :value="classes" scrollable scrollHeight="500px" class="mt-6">
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
            <Column field="status" frozen alignFrozen="right" header="Status" style="min-width: 130px">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getStatusLabel(slotProps.data.status)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
