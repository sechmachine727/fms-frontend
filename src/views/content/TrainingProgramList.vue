<script setup>
import { onMounted, ref } from 'vue'
import { useTrainingProgramStore } from '@/stores/trainingProgramStore'
import router from '@/router'


const trainingPrograms = ref()
const trainingProgramStore = useTrainingProgramStore()

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

const searchQuery = ref()
const handleSearch = (event) => {
    searchQuery.value = event.target.value
    console.log('Input value:', searchQuery.value)
    router.push({
        path: '/topic-management/training-program',
        query: { q: searchQuery.value }
    })
};
const overlay = ref(null)
const selectedItem = ref(null) // Khai báo selectedItem sử dụng ref

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
        topicInfoList.value = trainingProgramStore.trainingPrograms.topicInfoList
    })
})
</script>

<template>
    <div class="card">

        <DataTable :rows="6" :rowsPerPageOptions="[8, 12, 20, 50]" :value="trainingPrograms" paginator
                   tableStyle="min-width: 50rem"
                   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                   currentPageReportTemplate="{first} to {last} of {totalRecords}"
                   scrollable scrollHeight="400px">

            <template #header>
                <div class="flex items-center justify-between mb-2">
                    <h1 class="text-2xl">Training Program List</h1>
                    <Button icon="pi pi-plus" label="Add" @click="navigateToAdd" />
                </div>
                <div class="flex items-center gap-2">
                    <Dropdown v-model="searchQuery" class="w-40" placeholder="Status">
                        <!--                        <DropdownItem value="status">Status</DropdownItem>-->
                        <!--                        <DropdownItem value="region">Region</DropdownItem>-->
                    </Dropdown>
                    <Dropdown v-model="searchQuery" class="w-40" placeholder="Region">
                        <!--                        <DropdownItem value="status">Status</DropdownItem>-->
                        <!--                        <DropdownItem value="region">Region</DropdownItem>-->
                    </Dropdown>
                    <IconField class="w-1/4 mt-3 mb-3" iconPosition="left">
                        <InputText v-model="searchQuery" class="w-full" placeholder="Search" type="text"
                                   @keyup.enter="handleSearch" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>
            </template>

            <Column header="No." style="min-width: 70px">
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>
            <Column field="code" header="Course Code" style="min-width: 130px">
                <template #body="slotProps">
                    <router-link :to="{ name: 'training-program-detail', params: { id: slotProps.data.id}}"
                                 class="router-link-active hover:underline">{{ slotProps.data.code }}
                    </router-link>
                </template>
            </Column>
            <Column field="version" header="Version" style="min-width: 10px"></Column>
            <Column field="trainingProgramName" header="Training Name" style="min-width: 190px">
                <template #body="slotProps">
                    <router-link :to="{ name: 'training-program-detail', params: { id: slotProps.data.id}}"
                                 class="router-link-active hover:underline">{{ slotProps.data.trainingProgramName }}
                    </router-link>
                </template>
            </Column>
            <Column field="region" header="Region" style="min-width: 100px"></Column>
            <Column field="technicalGroupCode" header="Technical Group" style="min-width: 150px"></Column>
            <Column field="topicInfoList" header="Topic" style="min-width: 150px"></Column>

            <Column field="modifiedDate" header="Last Modified Date" style="min-width: 160px"></Column>
            <Column field="lastModifiedBy" header="Last Modified By" style="min-width: 160px"></Column>
            <Column field="status" header="Status" style="min-width: 100px" frozen alignFrozen="right">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getStatusLabel(slotProps.data.status)" />
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
                                    severity="secondary"
                                    @click="handleEdit(slotProps.data)">
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
                                    severity="danger"
                                    @click="handleDeactive(slotProps.data)">

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

