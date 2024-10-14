<script setup>
import ButtonComponent from '@/components/ButtonComponent.vue'
import router from '@/router'
import { useImportFileStore } from '@/stores/importFileStore'
import { useDownloadFileStore } from '@/stores/downloadFileStore'
import { useTopicStore } from '@/stores/topicStore'
import { getUserInfo } from '@/utils/token'
import Toast from 'primevue/toast'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const topicStore = useTopicStore()
const importFileStore = useImportFileStore()
const downloadFileStore = useDownloadFileStore()

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
        path: '/content-management/topic',
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
        },
        rejectProps: {
            label: 'Cancel',
            severity: 'error',
            className: 'button-custom'
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
        },
        rejectProps: {
            label: 'Cancel',
            severity: 'error',
            className: 'button-custom'
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
const selectedFileName = ref('')
const MAX_FILENAME_LENGTH = 28 // Độ dài tối đa của tên file trước khi thêm dấu "..."

const onFileSelect = (event) => {
    const file = event.files[0] // Capture the selected file
    if (file) {
        selectedFile.value = file // Store the actual file object

        // Get the file name for display
        let fileName = file.name

        // Truncate the file name if it's too long
        if (fileName.length > MAX_FILENAME_LENGTH) {
            fileName = fileName.substring(0, MAX_FILENAME_LENGTH) + '...'
        }
        selectedFileName.value = fileName // Store the display name
    }
};

const importFile = async () => {
    if (selectedFile.value) {
        const formData = new FormData()
        formData.append('file', selectedFile.value)

        try {
            await importFileStore.fetchImportFile(formData)

            // Success toast notification
            toast.add({
                severity: 'success',
                summary: 'Import Successful',
                detail: 'Topics imported successfully!',
                life: 3000
            })

            // Fetch the updated topics
            await topicStore.fetchTopics()
            topics.value = topicStore.topics

            // Reset the file and close the dialog
            selectedFile.value = null
            showDialog.value = false
        } catch (error) {
            let messageError = error.response.data.split(':')[2];
            toast.add({
                severity: 'error',
                summary: 'Import Failed',
                detail: messageError,
                life: 5000
            })
        }
    } else {
        // Notify user to select a file
        toast.add({
            severity: 'warn',
            summary: 'No File Selected',
            detail: 'Please choose a valid file before importing.',
            life: 3000
        })
    }
}

const cancelUpload = () => {
    selectedFile.value = null // Xóa file đã chọn
    showDialog.value = false // Đóng dialog
}

const downloadFile = async () => {
    try {
        const fileData = { type: 'topic' }
        const response = await downloadFileStore.fetchDownloadFile(fileData)

        // Check if response.data is a Blob
        if (response instanceof Blob) {
            const url = window.URL.createObjectURL(response)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'topic_template.xlsx') // File name for download
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } else {
            console.error('Did not receive a valid file.')
            toast.add({
                severity: 'error',
                summary: 'Download Failed',
                detail: 'Did not receive a valid file.',
                life: 3000
            })
        }
    } catch (error) {
        console.error('Download error:', error)
        toast.add({
            severity: 'error',
            summary: 'Download Failed',
            detail: error.message || 'Could not download the file.',
            life: 3000
        })
    }
}

onMounted(() => {
    topicStore.fetchTopics().then(() => {
        topics.value = topicStore.topics
        querySearchFromUrl()
    })
})

const rolesForAccess = ['ROLE_CONTENT_MANAGER', 'ROLE_FA_MANAGER'];

const userRoles = getUserInfo();
</script>

<template>
    <div class="card">
        <div class="flex items-center justify-between mb-2">
            <h1 class="text-2xl">Topic Configuration ({{ topics?.length }})</h1>
            <Button label="Import Topic" v-if="userRoles.roles.includes('ROLE_CONTENT_MANAGER')"
                @click="showDialog = true" />
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
                <div class="flex flex-wrap w-60 gap-2 mt-1">
                    <label for="search">Search</label>
                    <InputText id="search" v-model="searchQuery" class="h-10 w-full"
                        placeholder="Enter to Code, Name ..." type="text" @keyup.enter="handleSearch" />
                </div>
            </div>

            <DataTable :rows="6" :rowsPerPageOptions="[6, 12, 20, 50]" :value="topics"
                currentPageReportTemplate="{first} to {last} of {totalRecords}" paginator
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                class="mt-4" tableStyle="min-width: 50rem">
                <div class="flex items-center justify-between">
                    <!-- Dialog -->
                    <Dialog v-model:visible="showDialog" class="w-1/3" header="Import Topic" modal
                        @hide="showDialog = false">
                        <div class="p-4">
                            <ul class="list-disc ml-4">
                                <li><strong>Allowed file types: xls, xlsx</strong></li>
                                <li><strong>File size must be less than or equal to 5MB.</strong></li>
                            </ul>

                            <p class="mt-2">Download template:</p>
                            <ul>
                                <li><a href="#" style="color:blue" @click.prevent="downloadFile">Topic</a></li>
                            </ul>

                            <!-- File upload component -->
                            <div class="flex flex-wrap gap-2 w-full mt-2">
                                <p class="mr-4">Select a file to upload:</p>
                                <FileUpload :auto="true" :maxFileSize="5000000" accept=".xls,.xlsx"
                                    chooseLabel="Choose file..." customUpload mode="basic" @select="onFileSelect" />
                                <span v-if="selectedFile"
                                    class="text-gray-700 truncate flex flex-wrap gap-2 w-full"><strong>Current file:
                                    </strong>{{ selectedFileName }}</span>
                            </div>
                        </div>

                        <template #footer>
                            <ButtonComponent text="Cancel" bgColor="bg-white text-red-500"
                                hoverColor="hover:bg-gray-200" activeColor="active:bg-gray-300"
                                :onClick="cancelUpload" />
                            <ButtonComponent text="Import" bgColor="bg-emerald-500 text-white"
                                hoverColor="hover:bg-emerald-600" activeColor="active:bg-emerald-700"
                                :onClick="importFile" />
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
                <Column field="technicalGroup.code" header="Technical Group" style="width: 15%"></Column>
                <Column field="status" header="Status" style="width: 10%">
                    <template #body="slotProps">
                        <Tag :severity="getStatusLabel(slotProps.data.status)" :value="slotProps.data.status" />
                    </template>
                </Column>
                <Column field="modifiedDate" header="Last Modified Date" style="width: 15%"></Column>
                <Column field="lastModifiedBy" header="Last Modified By" style="width: 22%"></Column>

                <Column v-if="userRoles?.roles.some(role => rolesForAccess.includes(role))" :exportable="false"
                    alignFrozen="right" frozen header="Action" style="width: 5%">
                    <template #body="slotProps">
                        <Button class="mr-2" icon="pi pi-ellipsis-v" outlined rounded
                            @click="showOptions($event, slotProps.data)" />

                        <Popover ref="overlay">
                            <div class="flex flex-col gap-4 w-[8rem]">
                                <ul>
                                    <li v-if="selectedItem?.status === 'Inactive'"
                                        class="flex items-center gap-2 px-2 py-3  cursor-pointer rounded-border
                                    text-green-500 hover:bg-green-100 active:bg-green-100 focus:outline-none focus:ring focus:ring-green-100"
                                        severity="slotProps.data.status === 'Active' ? 'warn' : 'success'"
                                        @click="handleActive(slotProps.data)">

                                        <i class="pi pi-check"></i>
                                        Activate
                                    </li>
                                    <li v-if="selectedItem?.status === 'Active'"
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

.button-custom {
    background-color: white;
    color: red;
    border: 1px solid rgb(209, 213, 219);
    border-radius: 7px;
    transition: background-color 0.3s, color 0.3s;
    width: 56.36px;
    height: 38.6px;
}

.button-custom:hover {
    background-color: rgb(209, 213, 219);
}

.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
}
</style>
