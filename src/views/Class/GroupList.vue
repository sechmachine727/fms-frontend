<script setup>
import { useClassStore } from "@/stores/groupStore"; // Correct the import to use `useTraineeStore`
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const classes = ref([]);
const classStore = useClassStore();
const router = useRouter();
const token = localStorage.getItem("token");
const toast = useToast();

const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1]; // Extract the payload
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload); // Return parsed JSON payload
    } catch (e) {
        console.error('Invalid token');
        return null;
    }
}
const tokenInfo = parseJwt(token);

if (tokenInfo) {
    // Extract and display the relevant data
    console.log("Username (sub):", tokenInfo.sub);
    console.log("Authorities (roles):", tokenInfo.authorities.split(',')); // Split into an array
    console.log("Expiration (exp):", new Date(tokenInfo.exp * 1000)); // Convert from seconds to date
} else {
    console.log("Unable to parse token.");
}
onMounted(() => {
    classStore.fetchClassList().then(() => {
        classes.value = classStore.classes;
    })

    const toastMessage = sessionStorage.getItem('toastMessage');
    if (toastMessage) {
        const toastData = JSON.parse(toastMessage);
        toast.add(toastData);
        sessionStorage.removeItem('toastMessage');
    }

})
const getStatusLabel = (status) => {
    switch (status) {
        case 'Active':
            return '!bg-green-500 !text-white'; // Success color
        case 'Planning':
            return '!bg-gray-500 !text-white'; // Secondary color
        case 'Assigned':
        case 'Pending':
        case 'Reviewing':
            return '!bg-yellow-500 !text-white'; // Warn color
        case 'Close':
            return '!bg-red-500 !text-white'; // Danger color
        case 'In Progress':
            return '!bg-blue-500 !text-white'; // Info color
        case 'Closed':
            return '!bg-black !text-white'; // Contrast color
        default:
            return '!bg-gray-200 !text-black'; // Default color
    }
};


const navigateToAdd = () => {
    router.push('/group-management/add');
};
</script>

<template>
    <div class="card">
        <Toast />
        <div class="text-xl mb-4 flex justify-between items-center">
            <span class="!font-semibold text-2xl">Training Group List</span>
            <Button label="Add" icon="pi pi-plus" iconPos="right" @click="navigateToAdd" />
        </div>
        <Divider />
        <DataTable :value="classes" scrollable scrollHeight="500px" class="mt-6">
            <Column field="no" header="No" style="min-width: 100px">
                <template #body="slotProps">
                    {{ classes.indexOf(slotProps.data) + 1 }}
                </template>
            </Column>
            <Column field="groupCode" header="Class Code" style="min-width: 100px"></Column>
            <Column field="traineetype" header="Trainee Type" style="min-width: 150px"></Column>
            <Column header="Class Admin" style="min-width: 150px">
                <template #body="slotProps">
                    <span v-if="slotProps.data.classAdminAccount && slotProps.data.classAdminAccount.length">
                        <span v-for="(name, index) in slotProps.data.classAdminAccount" :key="index">
                            {{ name }}
                            <span v-if="index < slotProps.data.classAdminAccount.length - 1">, </span>
                        </span>
                    </span>
                </template>
            </Column>
            <Column field="technicalGroup" header="Technical Group" style="min-width: 150px"></Column>
            <Column field="trainingProgramName" header="Training Program" style="min-width: 150px">

            </Column>
            <Column field="siteName" header="Site" style="min-width: 50px"></Column>
            <Column field="traineeNumber" header="Trainee number" style="min-width: 150px"></Column>
            <Column field="expectedStartDate" header="Expected Start Date" style="min-width: 160px"></Column>
            <Column field="actualStartDate" header="Actual Start Date" style="min-width: 150px"></Column>
            <Column field="expectedEndDate" header="Expected End Date" style="min-width: 150px"></Column>
            <Column field="actualEndDate" header="Actual End Date" style="min-width: 150px"></Column>
            <Column field="status" frozen alignFrozen="right" header="Status" style="min-width: 130px">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :class="getStatusLabel(slotProps.data.status)" />
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
