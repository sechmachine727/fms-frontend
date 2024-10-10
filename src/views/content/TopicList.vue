<script setup>
import { onMounted, ref } from 'vue'
import { useTopicStore } from '@/stores/topicStore'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import { useConfirm } from 'primevue/useconfirm'

const confirm = useConfirm()
const topics = ref()
const selectedItem = ref(null)
const route = useRoute()
const searchQuery = ref('')
const toast = useToast()
const statusOptions = ref('')
const overlay = ref(null)
const statuses = ref([
    { id: 'All', name: 'All' },
    { id: 'Active', name: 'Active' },
    { id: 'Inactive', name: 'Inactive' }
])

const querySearchFromUrl = () => {
    const getQueryFromUrl = ref(route.query.q || '')
    const getQueryActiveFromUrl = ref(route.query.active || '')
    if (getQueryFromUrl.value !== '' || getQueryActiveFromUrl.value !== '') {
        if (getQueryFromUrl.value !== '') {
            searchQuery.value = getQueryFromUrl.value
        }

        if (getQueryActiveFromUrl.value !== '') {
            const value = getQueryActiveFromUrl.value
            statusOptions.value = { id: value, name: value }
        }

        applyFilters()
    }
}
const buildQueryObject = () => {
    const query = {}

    if (searchQuery.value) {
        query.q = searchQuery.value
    }
    if (statusOptions.value && statusOptions.value.id !== 'All') {
        query.active = statusOptions.value.name // Adjust this to match your status logic
    }

    return query
}
const applyFilters = () => {
    const criteria = {
        searchQuery: searchQuery.value,
        statusOptions: statusOptions.value
    }
    topicStore.fetchFilterTopics(criteria)
    topics.value = topicStore.filterTopics
}

const updateQueryParams = () => {
    // Push the constructed query object to the router
    const query = buildQueryObject()
    router.push({
        path: '/topic-management/topic',
        query: query
    })
    applyFilters()
}

const handleSearch = () => {
    updateQueryParams()
}

const handleStatusChange = () => {
    updateQueryParams()
}

const topicStore = useTopicStore()

const showOptions = (event, item) => {
    selectedItem.value = item // Lưu đối tượng hiện tại khi mở Popover
    overlay.value.toggle(event) // Mở Popover
}
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

const handleActive = () => {
    if (selectedItem.value) {
        confirmActive(selectedItem.value)
    }
}

const handleDeactive = () => {
    if (selectedItem.value) {
        confirmDeactive(selectedItem.value)
    }
}

const confirmActive = (value) => {
    confirm.require({
        group: 'templating',
        message: 'Are you sure you want to activate this Topic.' + value.code,
        header: 'Activate Topic',
        acceptProps: {
            label: 'Save',
            outlined: true
        },
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        accept: () => {
            topicStore.fetchUpdateStatus(selectedItem.value.id).then(() => {
                toast.add({ severity: 'success', summary: 'Topic successfully activated', life: 3000 })
                topicStore.fetchTopics().then(() => {
                    topics.value = topicStore.topics
                })
            }).catch((errors) => {
                if (errors.status === 400) {
                    toast.add({ severity: 'error', summary: errors.response.data, life: 3000 })
                }
            })
        }
    })
}

const confirmDeactive = (value) => {
    confirm.require({
        group: 'templating',
        message: 'Are you sure you want to deactivate this Topic.' + value.code,
        header: 'Deactivate Topic',
        acceptProps: {
            label: 'Save',
            outlined: true
        },
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        accept: () => {
            topicStore.fetchUpdateStatus(selectedItem.value.id).then(() => {
                topicStore.fetchTopics().then(() => {
                    topics.value = topicStore.topics
                })
                toast.add({ severity: 'success', summary: 'Topics successfully deactivated', life: 3000 })
            }).catch((errors) => {
                if (errors.status === 400) {
                    toast.add({ severity: 'error', summary: errors.response.data, life: 3000 })
                }
            })
        }
    })

}

const showDialog = ref(false)
const selectedFile = ref(null)

const onFileSelect = (event) => {
    const file = event.files[0] // Capture the selected file
    console.log('File selected:', selectedFile.value)
    selectedFile.value = file
}

const importFile = () => {
    if (selectedFile.value) {
        // Simulate a successful file upload
        setTimeout(() => {
            // Simulate storing the file (you can replace this with actual upload logic)
            console.log('Storing file:', selectedFile.value)

            // Display success message using Toast
            toast.value.add({
                severity: 'success',
                summary: 'Success',
                detail: 'File uploaded successfully!',
                life: 3000
            })

            // After success, you can either reset the file or keep it
            selectedFile.value = null

            // Close the dialog after showing success message
            showDialog.value = false
        }, 1000) // Simulate 1-second upload delay
    } else {
        alert('Please choose a valid file before importing.')
    }
}

onMounted(() => {
    topicStore.fetchTopics().then(() => {
        topics.value = topicStore.topics
        querySearchFromUrl()
    })
})

</script>

<template>
    <div class="card">
        <div class="flex items-center justify-between mb-2">
            <h1 class="text-2xl">Topic Configuration</h1>
            <Button label="Import Topic" @click="showDialog = true" />
        </div>
        <Divider />
        <!-- Toast for success message -->
        <Toast ref="toast" />

        <div>
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col w-60 mt-1 gap-2">
                    <label class="w-60" for="contractType">Active</label>
                    <Select id="contractType" v-model="statusOptions" :options="statuses" class="w-full"
                            optionLabel="name" placeholder="Filter status" @change="handleStatusChange"></Select>
                </div>
                <div class="flex flex-wrap w-60 gap-2">
                    <label for="search">Search</label>
                    <InputText id="search" v-model="searchQuery" class="h-11 w-full"
                               placeholder="Enter to Code, Name ..."
                               type="text" @keyup.enter="handleSearch" />
                </div>
            </div>

            <DataTable :rows="6" :rowsPerPageOptions="[6, 12, 20, 50]" :value="topics"
                       currentPageReportTemplate="{first} to {last} of {totalRecords}" paginator
                       paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                       tableStyle="min-width: 50rem">
                <div class="flex items-center justify-between">
                    <!-- Dialog -->
                    <Dialog :style="{ top: '100px' }" :visible="showDialog" class="w-1/3" header="Import Topic" modal
                            @visible="showDialog = false">
                        <div class="p-4">
                            <!-- File type and size rules -->
                            <ul class="list-disc ml-4">
                                <li><strong>Allowed file types: xls, xlsx</strong></li>
                                <li><strong>File size must be less than or equal to 5MB.</strong></li>
                            </ul>

                            <!-- Download Template Links -->
                            <ul class="mt-4">
                                Download template:
                                <li><a class="ml-4 text-blue-500" href="#">Topic</a></li>
                            </ul>

                            <!-- File upload component -->
                            <div class="flex items-center mt-4">
                                <!-- Text and FileUpload aligned horizontally using Flexbox -->
                                <p class="mr-4">Select a file to upload:</p>
                                <FileUpload :auto="false" :maxFileSize="5000000" accept=".xls,.xlsx"
                                            chooseLabel="Choose file..." customUpload mode="basic" name="file"
                                            @select="onFileSelect" />
                            </div>

                        </div>

                        <!-- Dialog footer buttons -->
                        <template #footer>
                            <Button class="p-button-text" icon="pi pi-times" label="Cancel"
                                    @click="showDialog = false" />
                            <Button class="p-button-primary" icon="pi pi-check" label="Import" @click="importFile" />
                        </template>
                    </Dialog>
                </div>
                <Column field="code" header="Topic Code" style="width: 20%">
                    <template #body="slotProps">
                        <router-link :to="{ name: 'topic-detail', params: { id: slotProps.data.id } }"
                                     class="router-link-active">{{ slotProps.data.name }}
                        </router-link>
                    </template>
                </Column>

                <Column field="name" header="Topic Name" style="width: 25%">
                    <template #body="slotProps">
                        <router-link :to="{ name: 'topic-detail', params: { id: slotProps.data.id } }"
                                     class="router-link-active">{{ slotProps.data.name }}
                        </router-link>
                    </template>
                </Column>
                <Column field="technicalGroup.code" header="Technical Group" style="width: 25%"></Column>
                <Column field="status" header="Status" style="width: 15%">
                    <template #body="slotProps">
                        <Tag :severity="getStatusLabel(slotProps.data.status)" :value="slotProps.data.status" />
                    </template>
                </Column>
                <Column field="modifiedDate" header="Last Modified Date" style="width: 20%"></Column>
                <Column field="lastModifiedBy" header="Last Modified By" style="width: 20%"></Column>

                <Column :exportable="false" alignFrozen="right" frozen header="Action" style="min-width: 80px">
                    <template #body="slotProps">
                        <Button class="mr-2" icon="pi pi-ellipsis-v" outlined rounded
                                @click="showOptions($event, slotProps.data)" />

                        <Popover ref="overlay">
                            <div class="flex flex-col gap-4 w-[8rem]">
                                <ul>
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
                                </ul>
                            </div>
                        </Popover>
                    </template>
                </Column>
            </DataTable>
        </div>
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
.text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
}

.router-link-active {
    color: #2196F3;
}
</style>
