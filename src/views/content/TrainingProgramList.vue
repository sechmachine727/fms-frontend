<script setup>
import router from '@/router'
import { useDepartmentStore } from '@/stores/departmentStore'
import { useTechnicalGroupStore } from '@/stores/technicalGroupStore'
import { useTrainingProgramStore } from '@/stores/trainingProgramStore'
import { getStatusLabel } from '@/utils/status'
import { getUserInfo } from '@/utils/token'
import Toast from 'primevue/toast'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const confirm = useConfirm()
const trainingPrograms = ref()
const trainingProgramStore = useTrainingProgramStore()
const departmentStore = useDepartmentStore()
const technicalGroupStore = useTechnicalGroupStore()

const toast = useToast()
const route = useRoute()
const overlay = ref(null)
const selectedItem = ref(null)
const searchQuery = ref('')
const departmentOptionsSearch = ref([])
const technicalGroupOptionsSearch = ref([])
const statusOptions = ref('')
const departments = ref([])
const technicalGroups = ref([])
const statuses = ref([
    { id: 'All', name: 'All' },
    { id: 'Reviewing', name: 'Reviewing' },
    { id: 'Declined', name: 'Declined' },
    { id: 'Active', name: 'Active' },
    { id: 'Inactive', name: 'Inactive' }
])
const querySearchFromUrl = () => {
    const getQueryFromUrl = ref(route.query.q || '')
    const getQueryActiveFromUrl = ref(route.query.active || '')
    const getQueryDepartmentFromUrl = ref(route.query.department || '')
    const getQueryTechnicalGroupFromUrl = ref(route.query.technicalGroup || '')
    if (getQueryFromUrl.value !== '' || getQueryActiveFromUrl.value !== ''
        || getQueryDepartmentFromUrl.value !== '' || getQueryTechnicalGroupFromUrl.value !== '') {
        if (getQueryFromUrl.value !== '') {
            searchQuery.value = getQueryFromUrl.value
        }

        if (getQueryActiveFromUrl.value !== '') {
            const value = getQueryActiveFromUrl.value
            statusOptions.value = { id: value, name: value }
        }

        if (getQueryDepartmentFromUrl.value !== '') {
            const values = getQueryDepartmentFromUrl.value.split(',').map(department => ({ departmentName: department }))
            departmentOptionsSearch.value = departments.value.filter(item1 => values.some(item2 => item1.departmentName === item2.departmentName))
        }

        if (getQueryTechnicalGroupFromUrl.value !== '') {
            const values = getQueryTechnicalGroupFromUrl.value.split(',').map(technical => ({ code: technical }))
            technicalGroupOptionsSearch.value = technicalGroups.value.filter(item1 => values.some(item2 => item1.code === item2.code))
        }
        applyFilters()
    }
}
const buildQueryObject = () => {
    const query = {}

    if (searchQuery.value) {
        query.q = searchQuery.value
    }
    if (technicalGroupOptionsSearch.value.length > 0) {
        const technicalGroupCode = technicalGroupOptionsSearch.value.map(technical => technical.code)
        query.technical = technicalGroupCode.join(',')
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
        technicalGroupOptionsSearch: technicalGroupOptionsSearch.value,
        statusOptions: statusOptions.value
    }
    trainingProgramStore.fetchFilterTrainingPrograms(criteria)
    trainingPrograms.value = trainingProgramStore.filterTrainingPrograms
}

const updateQueryParams = () => {
    // Push the constructed query object to the router
    const query = buildQueryObject()
    router.push({
        path: '/content-management/training-program',
        query: query
    });
    applyFilters()
};

const handleSearch = () => {
    updateQueryParams()
}

const clearSearch = () => {
    searchQuery.value = ''
    departmentOptionsSearch.value = []
    technicalGroupOptionsSearch.value = []
    statusOptions.value = { id: 'All', name: 'All' }
    updateQueryParams()
}

const handleDepartmentChange = () => {
    updateQueryParams()
}

const handleTechnicalGroupChange = () => {
    updateQueryParams()
}

const handleStatusChange = () => {
    updateQueryParams()
}

const showOptions = (event, item) => {
    selectedItem.value = item
    overlay.value.toggle(event)
}

const handleActive = () => {
    if (selectedItem.value) {
        confirmActive(selectedItem.value)
    }
};

const handleDeactive = () => {
    if (selectedItem.value) {
        confirmDeactive(selectedItem.value)
    }
};

const handleDecline = () => {
    if (selectedItem.value) {
        confirmReject(selectedItem.value)
    }
}
const userRoles = getUserInfo();
const rolesForAccess = ['ROLE_CONTENT_MANAGER', 'ROLE_FA_MANAGER'];
const confirmActive = (value) => {
    confirm.require({
        group: 'templating',
        message: 'Are you sure you want to activate this Training Program.' + value.code,
        header: 'Activate Training Program',
        acceptProps: {
            label: 'Save',
        },
        rejectProps: {
            label: 'Cancel',
            severity: 'error',
            className: 'button-custom'
        },
        accept: () => {
            trainingProgramStore.fetchToggleToActive(selectedItem.value.id).then(() => {
                toast.add({ severity: 'success', summary: 'Training Program successfully activated', life: 3000 })
                trainingProgramStore.fetchTrainingPrograms().then(() => {
                    trainingPrograms.value = trainingProgramStore.trainingPrograms
                })
            }).catch((errors) => {
                if (errors.status === 400) {
                    toast.add({ severity: 'error', summary: errors.response.data, life: 3000 })
                } else {
                    toast.add({ severity: 'error', summary: errors.response.data, life: 3000 })
                }
            })
        }
    })
}

const confirmDeactive = (value) => {
    confirm.require({
        group: 'templating',
        message: 'Are you sure you want to deactivate this Training Program.' + value.code,
        header: 'Deactivate Training Program',
        acceptProps: {
            label: 'Save',
        },
        rejectProps: {
            label: 'Cancel',
            className: 'button-custom'
        },
        accept: () => {
            trainingProgramStore.fetchToggleActivate(selectedItem.value.id).then(() => {
                trainingProgramStore.fetchTrainingPrograms().then(() => {
                    trainingPrograms.value = trainingProgramStore.trainingPrograms
                })
                toast.add({ severity: 'success', summary: 'Training Program successfully deactivated', life: 3000 })
            }).catch((errors) => {
                if (errors.status === 400) {
                    toast.add({ severity: 'error', summary: errors.response.data, life: 3000 })
                }
            })
        }
    })
}

const declineReason = ref('');
const confirmReject = (value) => {
    confirm.require({
        group: 'templatingReject',
        message: 'Are you sure you want to decline this Training Program.' + value.code,
        header: 'Decline Training Program',
        acceptProps: {
            label: 'Save'
        },
        rejectProps: {
            label: 'Cancel',
            className: 'button-custom'
        },
        accept: () => {
            trainingProgramStore.fetchToggleReviewingToDeclined(selectedItem.value.id, declineReason.value).then(() => {
                trainingProgramStore.fetchTrainingPrograms().then(() => {
                    trainingPrograms.value = trainingProgramStore.trainingPrograms
                })
                toast.add({ severity: 'success', summary: 'Training Program declined successfully', life: 3000 })
            }).catch((errors) => {
                if (errors.status === 400) {
                    toast.add({ severity: 'error', summary: errors.response.data, life: 3000 })
                }
                if (errors.status === 500) {
                    toast.add({
                        severity: 'error',
                        summary: 'Input reason to decline for this Training Program',
                        life: 5000
                    })
                }
            })
        }
    })
}

const handleEdit = () => {
    if (selectedItem.value) {
        router.push('/content-management/training-program/edit/' + selectedItem.value.id)
    }
}

const navigateToAdd = () => {
    router.push('/content-management/training-program/add')
}

const topicInfoList = ref()
onMounted(() => {
    trainingProgramStore.fetchTrainingPrograms().then(() => {
        trainingPrograms.value = trainingProgramStore.trainingPrograms
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
    technicalGroupStore.fetchTechnicalGroup().then(() => {
        technicalGroups.value = technicalGroupStore.technicalGroups
    })
})
</script>

<template>
    <div class="card">
        <div class="flex items-center justify-between mb-2">
            <h1 class="!font-semibold text-2xl">Training Program List ({{ trainingPrograms?.length }})</h1>
            <Button label="Add Training Program" v-if="userRoles.roles.includes('ROLE_CONTENT_MANAGER')"
                @click="navigateToAdd" />
        </div>
        <Divider />
        <Toast />
        <div>
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col w-50 mt-1 gap-2">
                    <label class="w-32" for="contractType">Active</label>
                    <Select id="contractType" v-model="statusOptions" :options="statuses" class="w-full"
                        optionLabel="name" placeholder="Filter status" @change="handleStatusChange"></Select>
                </div>
                <div class="flex flex-wrap w-50 gap-2">
                    <label for="department">Region</label>
                    <MultiSelect id="department" v-model="departmentOptionsSearch" :maxSelectedLabels="2"
                        :options="departments" class="w-full" filter optionLabel="departmentName"
                        placeholder="Filter Region" @change="handleDepartmentChange" />
                </div>
                <div class="flex flex-wrap w-52 gap-2">
                    <label for="technical">Technical Group</label>
                    <MultiSelect id="technical" v-model="technicalGroupOptionsSearch" :maxSelectedLabels="2"
                        :options="technicalGroups" class="w-full" filter optionLabel="code"
                        placeholder="Filter Technical Group" @change="handleTechnicalGroupChange" />
                </div>
                <div class="flex flex-wrap w-96 gap-2">
                    <label for="search">Search</label>
                    <InputText id="search" v-model="searchQuery" class="h-10.5 w-full"
                        placeholder="Enter to Code, Name ..." type="text" @keyup.enter="handleSearch" />
                </div>
                <Button class="mt-8" label="Reset" severity="secondary" @click="clearSearch" />
            </div>

            <DataTable :rows="10" :rowsPerPageOptions="[10, 20, 30, 50]" :value="trainingPrograms"
                currentPageReportTemplate="{first} to {last} of {totalRecords}" paginator
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                       class="mt-1" scrollable tableStyle="min-width: 50rem">

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
                <Column field="trainingProgramName" header="Training Name" style="min-width: 250px">
                    <template #body="slotProps">
                        <router-link :to="{ name: 'training-program-detail', params: { id: slotProps.data.id } }"
                            class="router-link-active hover:underline">{{ slotProps.data.trainingProgramName }}
                        </router-link>
                    </template>
                </Column>
                <Column field="version" header="Version" style="min-width: 10px"></Column>
                <Column field="department.departmentName" header="Region" style="min-width: 100px"></Column>
                <Column field="technicalGroup.code" header="Technical Group" style="min-width: 150px"></Column>
                <Column field="topicInfoList" header="Topic" style="min-width: 400px">
                    <template #body="slotProps">
                        <span class="w-full" v-for="(topic, index) in slotProps.data.topicInfoList"
                            :key="topic.topicCode">
                            {{ topic.topicCode }}<span v-if="index < slotProps.data.topicInfoList.length - 1">, </span>
                        </span>
                    </template>
                </Column>

                <Column field="modifiedDate" header="Last Modified Date" style="min-width: 160px"></Column>
                <Column field="lastModifiedBy" header="Last Modified By" style="min-width: 160px"></Column>
                <Column field="note" header="Note" style="min-width: 160px"></Column>
                <Column alignFrozen="right" field="status" frozen header="Status" style="min-width: 100px">
                    <template #body="slotProps">
                        <Tag :severity="getStatusLabel(slotProps.data.status)" :value="slotProps.data.status" />
                    </template>
                </Column>
                <Column v-if="userRoles?.roles.some(role => rolesForAccess.includes(role))" :exportable="false"
                    alignFrozen="right" frozen header="Action" style="min-width: 80px">
                    <template #body="slotProps">
                        <Button class="mr-2 p-button-text" icon="pi pi-ellipsis-v" severity="secondary"
                            @click="showOptions($event, slotProps.data)" />

                        <Popover ref="overlay">
                            <div class="flex flex-col gap-4 w-[8rem]">
                                <ul>
                                    <li v-if="userRoles?.roles.includes('ROLE_CONTENT_MANAGER')"
                                        class="flex items-center gap-2 px-2 py-3  cursor-pointer rounded-border
                                    text-zinc-500 hover:bg-zinc-100 active:bg-zinc-100 focus:outline-none focus:ring focus:ring-zinc-100" severity="secondary"
                                        @click="handleEdit(slotProps.data)">
                                        <i class="pi pi-pencil"></i>
                                        Edit
                                    </li>
                                    <li v-if="selectedItem?.status === 'Inactive'"
                                        class="flex items-center gap-2 px-2 py-3  cursor-pointer rounded-border
                                    text-green-500 hover:bg-green-100 active:bg-green-100 focus:outline-none focus:ring focus:ring-green-100"
                                        severity="slotProps.data.status === 'Active' ? 'warn' : 'success'"
                                        @click="handleActive(slotProps.data)">
                                        <i class="pi pi-check"></i>
                                        Activate
                                    </li>
                                    <li v-if="selectedItem?.status === 'Reviewing' || selectedItem?.status === 'Declined' && userRoles.roles.includes('ROLE_FA_MANAGER')"
                                        class="flex items-center gap-2 px-2 py-3  cursor-pointer rounded-border
                                    text-green-500 hover:bg-green-100 active:bg-green-100 focus:outline-none focus:ring focus:ring-green-100"
                                        severity="slotProps.data.status === 'Active' ? 'warn' : 'success'"
                                        @click="handleActive(slotProps.data)">

                                        <i class="pi pi-check"></i>
                                        Approve
                                    </li>
                                    <li v-if="selectedItem?.status === 'Active'"
                                        class="flex items-center gap-2 px-2 py-3 cursor-pointer rounded-border
                                    text-orange-500 hover:bg-orange-100 active:bg-orange-100 focus:outline-none focus:ring focus:ring-orange-100"
                                        severity="danger" @click="handleDeactive(slotProps.data)">

                                        <i class="pi pi-times"></i>
                                        Deactive
                                    </li>
                                    <li v-if="selectedItem?.status === 'Reviewing' && userRoles.roles.includes('ROLE_FA_MANAGER')"
                                        class="flex items-center gap-2 px-2 py-3 cursor-pointer rounded-border
                                    text-red-500 hover:bg-red-100 active:bg-red-100 focus:outline-none focus:ring focus:ring-red-100"
                                        severity="danger" @click="handleDecline(slotProps.data)">
                                        <i class="pi pi-times"></i>
                                        Decline
                                    </li>
                                </ul>
                            </div>
                        </Popover>
                    </template>
                </Column>
            </DataTable>
        </div>
        <ConfirmDialog group="templatingReject" @reject="handleDecline">
            <template #message="slotProps">
                <div
                    class="flex flex-col items-center w-full gap-4 border-b border-surface-200 dark:border-surface-700">
                    <i v-for="(line, index) in slotProps.message.message.split('.')" :key="index"
                        :class="{ 'text-red-500 font-bold': index === 1 }">
                        {{ line }}
                    </i>
                    <textarea v-model="declineReason" class="w-full p-2 border rounded border-gray-300"
                        placeholder="Please enter the reason for declining..." rows="4"></textarea>
                    <div v-if="!declineReason" class="text-red-500 text-sm">Reason is required</div>
                </div>
            </template>
        </ConfirmDialog>

        <ConfirmDialog group="templating">
            <template #message="slotProps">
                <div
                    class="flex flex-col items-center w-full gap-4 border-b border-surface-200 dark:border-surface-700">
                    <i v-for="(line, index) in slotProps.message.message.split('.')" :key="index"
                        :class="{ 'text-red-500 font-bold': index === 1 }">
                        {{ line }}
                    </i>
                </div>
            </template>
        </ConfirmDialog>
    </div>
</template>
<style>
.router-link-active {
    color: #2196F3;
}

.p-datatable-table-container {
    height: calc(100vh - 23.1rem);
}
</style>
