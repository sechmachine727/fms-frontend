<script setup>
import router from '@/router'
import { useTraineeStore } from '@/stores/traineeStore'
import { getStatusLabel } from '@/utils/status'
// import { getUserInfo } from '@/utils/token'
import Toast from 'primevue/toast'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const trainees = ref()
const traineeStore = useTraineeStore()

const route = useRoute()
const searchQuery = ref('')
const statusOptions = ref('')

// const statuses = ref([
//     { id: 'All', name: 'All' },
//     { id: 'Reviewing', name: 'Reviewing' },
//     { id: 'Declined', name: 'Declined' },
//     { id: 'Active', name: 'Active' },
//     { id: 'Inactive', name: 'Inactive' }
// ])
const querySearchFromUrl = () => {
    const getQueryFromUrl = ref(route.query.q || '')
    // const getQueryActiveFromUrl = ref(route.query.active || '' )
    if (getQueryFromUrl.value !== '') {
        if (getQueryFromUrl.value !== '') {
            searchQuery.value = getQueryFromUrl.value
        }

        // if (getQueryActiveFromUrl.value !== '') {
        //     const value = getQueryActiveFromUrl.value
        //     statusOptions.value = { id: value, name: value }
        // }
        applyFilters()
    }
}

const buildQueryObject = () => {
    const query = {}

    if (searchQuery.value) {
        query.q = searchQuery.value
    }
    // if (statusOptions.value && statusOptions.value.id !== 'All') {
    //     query.active = statusOptions.value.name // Adjust this to match your status logic
    // }

    return query
}
const applyFilters = () => {
    const criteria = {
        searchQuery: searchQuery.value,
        // statusOptions: statusOptions.value,
    }
    traineeStore.fetchFilterTrainee(criteria)
    trainees.value = traineeStore.filterTrainees
}

const updateQueryParams = () => {
    // Push the constructed query object to the router
    const query = buildQueryObject()
    router.push({
        path: '/trainee-management/trainees',
        query: query
    })
    applyFilters()
}

const handleSearch = () => {
    updateQueryParams()
}

const clearSearch = () => {
    searchQuery.value = ''
    // statusOptions.value = { id: 'All', name: 'All' }
    updateQueryParams()
}

// const handleStatusChange = () => {
//     updateQueryParams()
// }


// const userRoles = getUserInfo()
// const rolesForAccess = ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_CONTENT_MANAGER', 'ROLE_DELIVERABLES_MANAGER']

onMounted(() => {
    traineeStore.fetchTrainees().then(() => {
        trainees.value = traineeStore.trainees
        querySearchFromUrl()
    })

})
</script>

<template>
    <div class="card">
        <div class="flex items-center justify-between mb-2">
            <h1 class="text-2xl">Trainee List ({{ trainees?.length }})</h1>
            <!--            <Button label="Add Training Program" v-if="userRoles.roles.includes('ROLE_CONTENT_MANAGER')"-->
            <!--                    @click="navigateToAdd" />-->
        </div>
        <Divider />

        <Toast />
        <div>
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col w-50 mt-1 gap-2">
                    <label class="w-32" for="contractType">Status</label>
                    <Select id="contractType" v-model="statusOptions" :options="statuses" class="w-full"
                            optionLabel="name" placeholder="Filter status" @change="handleStatusChange"></Select>
                </div>
                <div class="flex flex-wrap w-96 gap-2">
                    <label for="search">Search</label>
                    <InputText id="search" v-model="searchQuery" class="h-10.5 w-full"
                               placeholder="Enter to Code, Name ..." type="text" @keyup.enter="handleSearch" />
                </div>
                <Button class="mt-8" label="Reset" severity="secondary" @click="clearSearch" />
            </div>

            <DataTable :rows="10" :rowsPerPageOptions="[10, 20, 30, 50]" :value="trainees"
                       class="mt-4" currentPageReportTemplate="{first} to {last} of {totalRecords}"
                       paginator
                       paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" scrollHeight="400px" scrollable tableStyle="min-width: 50rem">

                <Column header="No." style="min-width: 70px">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </Column>
                <Column field="name" header="Full Name" style="min-width: 130px">
                    <template #body="slotProps">
                        <router-link :to="{ name: 'trainee-detail', params: { id: slotProps.data.id } }"
                                     class="router-link-active hover:underline">{{ slotProps.data.name }}
                        </router-link>
                    </template>
                </Column>
                <Column field="email" header="Email" style="min-width: 250px"></Column>
                <Column field="phone" header="Phone" style="min-width: 10px"></Column>
                <Column field="gender" header="Gender" style="min-width: 100px"></Column>
                <Column field="dob" header="D.O.B" style="min-width: 150px"></Column>
                <Column field="university" header="University" style="min-width: 400px"></Column>
                <Column alignFrozen="right" field="status" frozen header="Status" style="min-width: 100px">
                    <template #body="slotProps">
                        <Tag :severity="getStatusLabel(slotProps.data.status)" :value="slotProps.data.status" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
<style>
.text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
}

.router-link-active {
    color: #2196F3;
}
</style>

