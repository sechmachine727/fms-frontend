<script setup>
import { useClassStore } from "@/stores/groupStore"; // Correct the import to use `useTraineeStore`
import { getStatusArray, getStatusLabel } from "@/utils/status";
import { getUserInfo } from "@/utils/token";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const classes = ref([]);
const classStore = useClassStore();
const router = useRouter();
const toast = useToast();
const route = useRoute();

onMounted(() => {
    classStore.fetchClassList().then(() => {
        classes.value = classStore.classes;
        querySearchFromUrl();
    })

    const toastMessage = sessionStorage.getItem('toastMessage');
    if (toastMessage) {
        const toastData = JSON.parse(toastMessage);
        toast.add(toastData);
        sessionStorage.removeItem('toastMessage');
    }


})

const querySearchFromUrl = () => {
    const getQueryFromUrl = ref(route.query.q || "");
    const getQueryStatusFromUrl = ref(route.query.status || "");
    if (getQueryFromUrl.value !== "" || getQueryStatusFromUrl.value !== "") {
        if (getQueryFromUrl.value !== "") {
            searchQuery.value = getQueryFromUrl.value;
        }

        if (getQueryStatusFromUrl.value !== "") {
            const values = getQueryStatusFromUrl.value.split(',').map(status => ({ id: status }));
            const filteredStatus = getStatusArray().filter(item1 => values.some(item2 => item1.id === item2.id));
            statusOptions.value = filteredStatus;
        }
        applyFilters()
    }
}

const statusValues = getStatusArray();
const searchQuery = ref("")
const statusOptions = ref([]);
const buildQueryObject = () => {
    const query = {};

    if (searchQuery.value) {
        query.q = searchQuery.value;
    }
    if (statusOptions.value.length > 0) {
        const statusNames = statusOptions.value.map(status => status.id);
        query.status = statusNames.join(',');
    }
    return query;
};

const applyFilters = () => {
    const criteria = {
        searchQuery: searchQuery.value,
        statusOptions: statusOptions.value,
    };
    classStore.fetchFilterClass(criteria)
    classes.value = classStore.filterClasses
};


const updateQueryParams = () => {
    // Push the constructed query object to the router
    const query = buildQueryObject();
    router.replace({
        path: '/group-management/list',
        query: query,
    })
    applyFilters()
};


const handleStatusChange = () => {
    updateQueryParams();
}



const handleSearch = () => {
    updateQueryParams();
};


const navigateToAdd = () => {
    router.push('/group-management/add');
};

const userRoles = getUserInfo();
console.log(userRoles.roles);
</script>

<template>
    <div class="card">
        <Toast />
        <div class=" mb-4 flex justify-between items-center">
            <span class="font-semibold text-2xl">Group List ({{ classes?.length }})</span>
            <Button label="Add Group" @click="navigateToAdd"
                v-if="userRoles.roles.includes('ROLE_DELIVERABLES_MANAGER')" />
        </div>
        <Divider />
        <div class="flex flex-col md:flex-row gap-4">
            <div class="flex flex-wrap w-60 gap-2">
                <label for="department">Status</label>
                <MultiSelect v-model="statusOptions" @change="handleStatusChange" :options="statusValues"
                    optionLabel="name" filter placeholder="Filter Status" id="department" :maxSelectedLabels="3"
                    class="w-full" />
            </div>
            <div class="flex flex-wrap w-60 gap-2">
                <label for="search">Search</label>
                <InputText class="h-10 w-full" v-model="searchQuery" type="text" id="search"
                    placeholder="Enter name, account ..." @keyup.enter="handleSearch" />
            </div>
        </div>
        <DataTable :value="classes" :rows="10" scrollable scrollHeight="300px" :rowsPerPageOptions="[10, 20, 30, 50]"
            currentPageReportTemplate="{first} to {last} of {totalRecords}" paginator
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            tableStyle="min-width: 50rem" class="mt-4">
            <Column field="no" header="No" style="min-width: 50px">
                <template #body="slotProps">
                    {{ classes.indexOf(slotProps.data) + 1 }}
                </template>
            </Column>
            <Column header="Class Code" style="min-width: 100px">
                <template #body="slotProps">
                    <router-link :to="{ name: 'group-detail', params: { id: slotProps.data.id } }"
                        class="router-link-active hover:underline text-blue-400">{{ slotProps.data.groupCode }}
                    </router-link>
                </template>
            </Column>
            <Column field="traineeTypeName" header="Trainee Type" style="min-width: 150px"></Column>
            <Column header="Group Admin" style="min-width: 150px">
                <template #body="slotProps">
                    <span v-if="slotProps.data.classAdminAccount && slotProps.data.classAdminAccount.length">
                        <span v-for="(name, index) in slotProps.data.classAdminAccount" :key="index">
                            {{ name }}
                            <span v-if="index < slotProps.data.classAdminAccount.length - 1">, </span>
                        </span>
                    </span>
                </template>
            </Column>
            <Column field="technicalGroupCode" header="Technical Group" style="min-width: 150px"></Column>
            <Column header="Training Program" style="min-width: 150px">
                <template #body="slotProps">
                    <router-link
                        :to="{ name: 'training-program-detail', params: { id: slotProps.data.trainingProgramId } }"
                        class="router-link-active hover:underline text-blue-400">{{ slotProps.data.trainingProgramName
                        }}
                    </router-link>
                </template>
            </Column>
            <Column field="siteName" header="Site" style="min-width: 100px"></Column>
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
            <template #empty>
                <tr>
                    <td colspan="12" class="text-center py-4">
                        <span class="text-gray-500">No content available</span>
                    </td>
                </tr>
            </template>
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
