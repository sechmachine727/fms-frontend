<script setup>
import { useClassStore } from '@/stores/groupStore'
import { useSiteStore } from '@/stores/siteStore'
import { useTechnicalGroupStore } from '@/stores/technicalGroupStore'
import { getStatusArray, getStatusLabel } from '@/utils/status'
import { getUserInfo } from '@/utils/token'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const classes = ref([]);
const classStore = useClassStore();
const router = useRouter();
const toast = useToast();
const route = useRoute();
const technicalGroupStore = useTechnicalGroupStore()
const siteStore = useSiteStore()

const technicalGroupOptionsSearch = ref([])
const siteOptionsSearch = ref([])
const technicalGroups = ref([])
const sites = ref([])


const querySearchFromUrl = () => {
    const getQueryFromUrl = ref(route.query.q || "");
    const getQueryStatusFromUrl = ref(route.query.status || "");
    const getQuerySiteFromUrl = ref(route.query.site || '')
    const getQueryTechnicalGroupFromUrl = ref(route.query.technicalGroup || '')
    if (getQueryFromUrl.value !== '' || getQueryStatusFromUrl.value !== '' ||
        getQueryTechnicalGroupFromUrl.value !== '' || getQuerySiteFromUrl.value !== '') {
        if (getQueryFromUrl.value !== "") {
            searchQuery.value = getQueryFromUrl.value;
        }

        if (getQueryTechnicalGroupFromUrl.value !== '') {
            const values = getQueryTechnicalGroupFromUrl.value.split(',').map(technical => ({ code: technical }))
            technicalGroupOptionsSearch.value = technicalGroups.value.filter(item1 => values.some(item2 => item1.technicalGroupCode === item2.technicalGroupCode))
        }

        if (getQuerySiteFromUrl.value !== '') {
            const values = getQuerySiteFromUrl.value.split(',').map(site => ({ code: site }))
            siteOptionsSearch.value = sites.value.filter(item1 => values.some(item2 => item1.site === item2.site))
        }

        if (getQueryStatusFromUrl.value !== "") {
            const values = getQueryStatusFromUrl.value.split(',').map(status => ({ id: status }));
            statusOptions.value = getStatusArray().filter(item1 => values.some(item2 => item1.id === item2.id))
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
    if (technicalGroupOptionsSearch.value.length > 0) {
        const technicalGroupCode = technicalGroupOptionsSearch.value.map(technical => technical.technicalGroupCode)
        query.technical = technicalGroupCode.join(',')
    }
    if (siteOptionsSearch.value.length > 0) {
        const site = siteOptionsSearch.value.map(site => site.siteName)
        query.site = site.join(',')
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
        technicalGroupOptionsSearch: technicalGroupOptionsSearch.value,
        siteOptionsSearch: siteOptionsSearch.value
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

const clearSearch = () => {
    searchQuery.value = ''
    technicalGroupOptionsSearch.value = []
    siteOptionsSearch.value = []
    statusOptions.value = []
    updateQueryParams()
}

const handleStatusChange = () => {
    updateQueryParams();
}

const handleTechnicalGroupChange = () => {
    updateQueryParams()
}

const handleSiteChange = () => {
    updateQueryParams()
}

const handleSearch = () => {
    updateQueryParams();
};


const navigateToAdd = () => {
    router.push('/group-management/add');
};

const userRoles = getUserInfo();

onMounted(() => {
    classStore.fetchClassList().then(() => {
        classes.value = classStore.classes
        querySearchFromUrl()
    })

    const toastMessage = sessionStorage.getItem('toastMessage')
    if (toastMessage) {
        const toastData = JSON.parse(toastMessage)
        toast.add(toastData)
        sessionStorage.removeItem('toastMessage')
    }

    technicalGroupStore.fetchTechnicalGroup().then(() => {
        technicalGroups.value = technicalGroupStore.technicalGroups
    })

    siteStore.fetchSites().then(() => {
        sites.value = siteStore.sites
    })
})
</script>

<template>
    <div class="card">
        <Toast />
        <div class=" mb-4 flex justify-between items-center">
            <span class="font-semibold text-2xl">Group List ({{ classes?.length }})</span>
            <Button v-if="userRoles.roles.includes('ROLE_DELIVERABLES_MANAGER')" label="Add Group"
                @click="navigateToAdd" />
        </div>
        <Divider />
        <div class="flex flex-col md:flex-row gap-4">
            <div class="flex flex-wrap w-60 gap-2">
                <label for="department">Status</label>
                <MultiSelect id="department" v-model="statusOptions" :maxSelectedLabels="3"
                    :options="statusValues" class="w-full" filter optionLabel="name" placeholder="Filter Status"
                    @change="handleStatusChange" />
            </div>
            <div class="flex flex-wrap w-52 gap-2">
                <label for="technical">Technical Group</label>
                <MultiSelect id="technical" v-model="technicalGroupOptionsSearch" :maxSelectedLabels="2"
                    :options="technicalGroups" class="w-full" filter optionLabel="code"
                    placeholder="Filter Technical Group" @change="handleTechnicalGroupChange" />
            </div>
            <div class="flex flex-wrap w-52 gap-2">
                <label for="site">Site</label>
                <MultiSelect id="site" v-model="siteOptionsSearch" :maxSelectedLabels="2" :options="sites"
                    class="w-full" filter optionLabel="siteName" placeholder="Filter Site" @change="handleSiteChange" />
            </div>
            <div class="flex flex-wrap w-72 gap-2">
                <label for="search">Search</label>
                <InputText id="search" v-model="searchQuery" class="h-10 w-full" placeholder="Enter code, name, training program"
                    type="text" @keyup.enter="handleSearch" />
            </div>
            <Button class="mt-8" label="Reset" severity="secondary" @click="clearSearch" />

        </div>
        <DataTable :rows="10" :rowsPerPageOptions="[10, 20, 30, 50]" :value="classes"
            class="mt-1" currentPageReportTemplate="{first} to {last} of {totalRecords}"
            paginator
                   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" scrollable tableStyle="min-width: 50rem">
            <Column field="no" header="No" style="min-width: 50px">
                <template #body="slotProps">
                    {{ classes.indexOf(slotProps.data) + 1 }}
                </template>
            </Column>
            <Column header="Group Code" style="min-width: 100px">
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
            <Column alignFrozen="right" field="status" frozen header="Status" style="min-width: 130px">
                <template #body="slotProps">
                    <Tag :severity="getStatusLabel(slotProps.data.status)" :value="slotProps.data.status" />
                </template>
            </Column>
            <template #empty>
                <tr>
                    <td class="text-center py-4" colspan="12">
                        <span class="text-gray-500">No content available</span>
                    </td>
                </tr>
            </template>
        </DataTable>
    </div>
</template>

<style>
.p-datatable-table-container {
    height: calc(100vh - 23.1rem);
}
</style>
