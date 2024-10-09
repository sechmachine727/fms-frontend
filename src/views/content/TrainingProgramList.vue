<script setup>
import { onMounted, ref } from 'vue'
import { useTrainingProgramStore } from '@/stores/trainingProgramStore'
import { useDepartmentStore } from '@/stores/departmentStore'
import router from '@/router'
import { useRoute } from 'vue-router'


const trainingPrograms = ref()
const trainingProgramStore = useTrainingProgramStore()
const departmentStore = useDepartmentStore()

const getStatusLabel = (status) => {
    switch (status) {
        case 'Active':
            return 'success' // Change color to green for active status

        case 'Inactive':
            return 'warn' // Change color to red for inactive status

        default:
            return null
    }
}

const route = useRoute()
const overlay = ref(null)
const selectedItem = ref(null)
const searchQuery = ref('')
const departmentOptionsSearch = ref([])
const statusOptions = ref('')
const departments = ref([])
const statuses = ref([
    { id: 'All', name: 'All' },
    { id: 'Active', name: 'Active' },
    { id: 'Inactive', name: 'Inactive' }
])
const querySearchFromUrl = () => {
    const getQueryFromUrl = ref(route.query.q || '')
    const getQueryActiveFromUrl = ref(route.query.active || '')
    const getQueryDepartmentFromUrl = ref(route.query.department || '')
    if (getQueryFromUrl.value !== '' || getQueryActiveFromUrl.value !== ''
        || getQueryDepartmentFromUrl.value !== '') {
        if (getQueryFromUrl.value !== '') {
            searchQuery.value = getQueryFromUrl.value
        }

        if (getQueryActiveFromUrl.value !== '') {
            const value = getQueryActiveFromUrl.value
            statusOptions.value = { id: value, name: value }
        }

        if (getQueryDepartmentFromUrl.value !== '') {
            const values = getQueryDepartmentFromUrl.value.split(',').map(department => ({ departmentName: department }))
            const filteredDepartment = departments.value.filter(item1 => values.some(item2 => item1.departmentName === item2.departmentName))
            departmentOptionsSearch.value = filteredDepartment
        }
        applyFilters()
    }
}
const buildQueryObject = () => {
    const query = {}

    if (searchQuery.value) {
        query.q = searchQuery.value
    }
    if (departmentOptionsSearch.value.length > 0) {
        const departmentNames = departmentOptionsSearch.value.map(department => department.departmentName)
        query.department = departmentNames.join(',')
    }
    if (statusOptions.value && statusOptions.value.id !== 'All') {
        query.active = statusOptions.value.name // Adjust this to match your status logic
    }

    return query
}
const applyFilters = () => {
    const criteria = {
        searchQuery: searchQuery.value,
        departmentOptionsSearch: departmentOptionsSearch.value,
        statusOptions: statusOptions.value
    }
    trainingProgramStore.fetchFilterTrainingPrograms(criteria)
    trainingPrograms.value = trainingProgramStore.filterTrainingPrograms
}

const updateQueryParams = () => {
    // Push the constructed query object to the router
    const query = buildQueryObject()
    router.push({
        path: '/topic-management/training-program',
        query: query
    });
    applyFilters()
};

const handleSearch = () => {
    updateQueryParams()
}

const handleDepartmentChange = () => {
    updateQueryParams()
}

const handleStatusChange = () => {
    updateQueryParams()
}

const showOptions = (event, item) => {
    selectedItem.value = item // Lưu đối tượng hiện tại khi mở Popover
    overlay.value.toggle(event) // Mở Popover
}

const handleActive = () => {
    if (selectedItem.value) {
        // Kích hoạt đối tượng
        console.log('Activating:', selectedItem.value)
    }
}

const handleDeactive = () => {
    if (selectedItem.value) {
        selectedItem.value.isActive = false // Hủy kích hoạt đối tượng
        console.log('Deactivating:', selectedItem.value)
    }
}

const handleEdit = () => {
    if (selectedItem.value) {
        router.push('/topic-management/training-program/edit/' + selectedItem.value.id)
        console.log('Editing:', selectedItem.value)
    }
}

const handleDelete = () => {
    if (selectedItem.value) {
        console.log('Delete training program', selectedItem.value)
        // Thực hiện các hành động với selectedItem
    }
}

const navigateToAdd = () => {
    router.push('/topic-management/training-program/add')
}

const topicInfoList = ref()
onMounted(() => {
    trainingProgramStore.fetchTrainingPrograms().then(() => {
        trainingPrograms.value = trainingProgramStore.trainingPrograms
        console.log(trainingProgramStore.trainingPrograms)
        topicInfoList.value = trainingProgramStore.trainingPrograms.map(program => {
            return program.topicInfoList.map(topic => {
                return {
                    topicCode: topic.topicCode,
                    version: topic.version,
                    topicName: topic.topicName
                }
            })
        }).flat()
        querySearchFromUrl()
    })
    departmentStore.fetchDepartments().then(() => {
        departments.value = departmentStore.departments
    })
})
</script>

<template>
    <div class="card">
        <div class="flex items-center justify-between mb-2">
            <h1 class="text-2xl">Training Program List</h1>
            <Button label="Add Training Program" @click="navigateToAdd" />
        </div>
        <Divider />
        <div>
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col w-60 mt-1 gap-2">
                    <label class="w-60" for="contractType">Active</label>
                    <Select id="contractType" v-model="statusOptions" :options="statuses" class="w-full"
                        optionLabel="name" placeholder="Filter status" @change="handleStatusChange"></Select>
                </div>
                <div class="flex flex-wrap w-60 gap-2">
                    <label for="department">Region</label>
                    <MultiSelect id="department" v-model="departmentOptionsSearch" :maxSelectedLabels="3"
                        :options="departments" class="w-full" filter optionLabel="departmentName"
                        placeholder="Filter Region" @change="handleDepartmentChange" />
                </div>
                <div class="flex flex-wrap w-60 gap-2">
                    <label for="search">Search</label>
                    <InputText id="search" v-model="searchQuery" class="h-11 w-full" placeholder="Enter to Search ..."
                        type="text" @keyup.enter="handleSearch" />
                </div>
            </div>

            <DataTable :rows="6" :rowsPerPageOptions="[8, 12, 20, 50]" :value="trainingPrograms"
                currentPageReportTemplate="{first} to {last} of {totalRecords}" paginator
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                scrollHeight="400px" scrollable tableStyle="min-width: 50rem">

                <Column header="No." style="min-width: 70px">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </Column>
                <Column field="code" header="Course Code" style="min-width: 130px">
                    <template #body="slotProps">
                        <router-link :to="{ name: 'training-program-detail', params: { id: slotProps.data.id } }"
                            class="router-link-active hover:underline">{{ slotProps.data.code }}
                        </router-link>
                    </template>
                </Column>
                <Column field="version" header="Version" style="min-width: 10px"></Column>
                <Column field="trainingProgramName" header="Training Name" style="min-width: 190px">
                    <template #body="slotProps">
                        <router-link :to="{ name: 'training-program-detail', params: { id: slotProps.data.id } }"
                            class="router-link-active hover:underline">{{ slotProps.data.trainingProgramName }}
                        </router-link>
                    </template>
                </Column>
                <Column field="departmentName" header="Region" style="min-width: 100px"></Column>
                <Column field="technicalGroup.code" header="Technical Group" style="min-width: 150px"></Column>
                <Column field="topicInfoList" header="Topic" style="min-width: 150px">
                    <template #body="slotProps">
                        <div v-for="topic in slotProps.data.topicInfoList" :key="topic.topicCode">
                            {{ topic.topicName }}
                        </div>
                    </template>
                </Column>

                <Column field="modifiedDate" header="Last Modified Date" style="min-width: 160px"></Column>
                <Column field="lastModifiedBy" header="Last Modified By" style="min-width: 160px"></Column>
                <Column alignFrozen="right" field="status" frozen header="Status" style="min-width: 100px">
                    <template #body="slotProps">
                        <Tag :severity="getStatusLabel(slotProps.data.status)" :value="slotProps.data.status" />
                    </template>
                </Column>
                <Column :exportable="false" alignFrozen="right" frozen header="Action" style="min-width: 80px">
                    <template #body="slotProps">
                        <Button class="mr-2" icon="pi pi-ellipsis-v" outlined rounded
                            @click="showOptions($event, slotProps.data)" />

                        <Popover ref="overlay">
                            <div class="flex flex-col gap-4 w-[8rem]">
                                <ul>
                                    <li class="flex items-center gap-2 px-2 py-3  cursor-pointer rounded-border
                                    text-zinc-500 hover:bg-zinc-100 active:bg-zinc-100 focus:outline-none focus:ring focus:ring-zinc-100"
                                        severity="secondary" @click="handleEdit(slotProps.data)">
                                        <i class="pi pi-pencil"></i>
                                        Edit
                                    </li>
                                    <li v-if="selectedItem.status === 'Inactive'"
                                        class="flex items-center gap-2 px-2 py-3  cursor-pointer rounded-border
                                    text-green-500 hover:bg-green-100 active:bg-green-100 focus:outline-none focus:ring focus:ring-green-100"
                                        severity="slotProps.data.status === 'Active' ? 'warn' : 'success'"
                                        @click="handleActive(slotProps.data)">

                                        <i class="pi pi-check"></i>
                                        Activate
                                    </li>
                                    <li v-if="selectedItem.status === 'Active'"
                                        class="flex items-center gap-2 px-2 py-3 cursor-pointer rounded-border
                                    text-orange-500 hover:bg-orange-100 active:bg-orange-100 focus:outline-none focus:ring focus:ring-orange-100"
                                        severity="danger" @click="handleDeactive(slotProps.data)">

                                        <i class="pi pi-times"></i>
                                        Deactive
                                    </li>
                                    <li class="flex items-center gap-2 px-2 py-3 cursor-pointer rounded-border
                                    text-red-600 hover:bg-red-100 active:bg-red-100 focus:outline-none focus:ring focus:ring-red-100"
                                        @click="handleDelete(slotProps.data)">
                                        <i class="pi pi-trash"></i>
                                        Delete
                                    </li>
                                </ul>
                            </div>
                        </Popover>
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
