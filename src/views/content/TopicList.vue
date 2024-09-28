<script setup>
import { onMounted, ref } from 'vue'
import { useTopicStore } from '@/stores/topicStore'

const op = ref()
const topics = ref()

const toast = ref(null)
const topicStore = useTopicStore()

const getStatusLabel = (status) => {
    switch (status) {
        case 'ACTIVE':
            return 'success' // Change color to green for active status

        case 'INACTIVE':
            return 'warn' // Change color to red for inactive status

        default:
            return null
    }
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

const toggle = (event) => {
    op.value.toggle(event)

}
const toggleStatus = (event, topic) => {
    op.value.toggle(event)
    topic.status = topic.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
}

onMounted(() => {
    topicStore.fetchTopics().then(() => {
        topics.value = topicStore.topics
        console.log(topicStore.topics)
    })
})

</script>

<template>
    <div class="card">
        <DataTable :rows="6" :rowsPerPageOptions="[6, 12, 20, 50]" :value="topics" currentPageReportTemplate="{first} to {last} of {totalRecords}"
                   paginator
                   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                   tableStyle="min-width: 50rem">
            <div class="flex items-center justify-between">
                <h1 class="text-2xl">Topic Configuration</h1>
                <Button icon="pi pi-plus" label="Import Topic" @click="showDialog = true" />

                <!-- Toast for success message -->
                <Toast ref="toast" />

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
                            <li><a href="#" class="ml-4 text-blue-500">Topic</a></li>
                        </ul>

                        <!-- File upload component -->
                        <div class="flex items-center mt-4">
                            <!-- Text and FileUpload aligned horizontally using Flexbox -->
                            <p class="mr-4">Select a file to upload:</p>
                            <FileUpload :auto="false" :maxFileSize="5000000" accept=".xls,.xlsx" chooseLabel="Choose file..." customUpload
                                        mode="basic" name="file" @select="onFileSelect" />
                        </div>

                    </div>

                    <!-- Dialog footer buttons -->
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="showDialog = false" />
                        <Button label="Import" icon="pi pi-check" class="p-button-primary" @click="importFile" />
                    </template>
                </Dialog>
            </div>
            <Column field="code" header="Topic Code" style="width: 20%">
                <template #body="slotProps">
                    <router-link :to="{ name: 'topic-detail', params: { id: slotProps.data.id}}"
                                 class="router-link-active">{{ slotProps.data.name }}
                    </router-link>
                </template>
            </Column>

            <Column field="name" header="Topic Name" style="width: 25%">
                <template #body="slotProps">
                    <router-link :to="{ name: 'topic-detail', params: { id: slotProps.data.id}}"
                                 class="router-link-active">{{ slotProps.data.name }}
                    </router-link>
                </template>
            </Column>
            <Column field="technicalGroupCode" header="Technical Group" style="width: 25%"></Column>
            <Column field="status" header="Status" style="width: 15%">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getStatusLabel(slotProps.data.status)" />
                </template>
            </Column>
            <Column field="modifiedDate" header="Last Modified Date" style="width: 20%"></Column>
            <Column field="lastModifiedBy" header="Last Modified By" style="width: 20%"></Column>

            <Column :exportable="false" header="Action" style="width: 5%">
                <template #body="slotProps">
                    <Button icon="pi pi-ellipsis-v" @click="toggle" outlined rounded class="mr-2" />

                    <Popover ref="op">
                        <div class="flex flex-col gap-4 w-[8rem]">
                            <div>
                                <InputGroup>
                                    <Button :label="slotProps.data.status === 'Active' ? 'Deactivate' : 'Activate'"
                                            :severity="slotProps.data.status === 'Active' ? 'danger' : 'success'"
                                            @click="toggleStatus($event, slotProps.data)"
                                            :icon="slotProps.data.status === 'Active' ? 'pi pi-times' : 'pi pi-check'" />
                                </InputGroup>
                            </div>
                        </div>
                    </Popover>
                </template>
            </Column>
        </DataTable>
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

