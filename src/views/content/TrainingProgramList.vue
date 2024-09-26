<script setup>
import { ref, onMounted } from 'vue';
import { TrainingProgramStore } from '@/stores/topicStore';

onMounted(() => {
    TrainingProgramStore.getTrainingProgramsSmall().then((data) => (trainingProgram.value = data));
});

const op = ref();
const trainingProgram = ref();

const getStatusLabel = (status) => {
    switch (status) {
        case 'Active':
            return 'success'; // Change color to green for active status

        case 'Inactive':
            return 'warn'; // Change color to red for inactive status

        default:
            return null;
    }
};

const showDialog = ref(false);

const toggle = (event) => {
    op.value.toggle(event);

}
const toggleStatus = (event, topic) => {
    op.value.toggle(event);
    topic.status = topic.status === 'Active' ? 'Inactive' : 'Active';
}

</script>

<template>
    <div class="card">
        <DataTable :value="trainingProgram" paginator :rows="6" :rowsPerPageOptions="[8, 12, 20, 50]" tableStyle="min-width: 50rem"
                   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                   currentPageReportTemplate="{first} to {last} of {totalRecords}"
                   scrollable scrollHeight="400px">
            <div class="flex items-center justify-between mb-2">
                <h1 class="text-2xl">Training Program List</h1>
                <Button icon="pi pi-plus" label="Add"  @click="showDialog = true" />
            </div>

            <Column field="id" header="No." style="min-width: 70px"></Column>
            <Column field="CourseCode" header="Course Code" style="min-width: 130px">
<!--                <template #body="slotProps">-->
<!--                    <router-link :to="{ name: 'topic-detail', params: { id: slotProps.data.id }}">{{ slotProps.data.TopicCode }}</router-link>-->
<!--                </template>-->
            </Column>
            <Column field="TrainingName" header="Training Name" style="min-width: 190px">
<!--                <template #body="slotProps">-->
<!--                    <router-link :to="{ name: 'topic-detail', params: { id: slotProps.data.id }}">{{ slotProps.data.TopicName }}</router-link>-->
<!--                </template>-->
            </Column>
            <Column field="Region" header="Region" style="min-width: 100px"></Column>
            <Column field="TechnicalGroup" header="Technical Group" style="min-width: 150px"></Column>
            <Column field="Topic" header="Topic" style="min-width: 150px"></Column>

            <Column field="LastModifiedDate" header="Last Modified Date" style="min-width: 160px"></Column>
            <Column field="LastModifiedBy" header="Last Modified By" style="min-width: 160px" ></Column>
            <Column field="status" header="Status" style="min-width: 100px" frozen alignFrozen="right">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getStatusLabel(slotProps.data.status)" />
                </template>
            </Column>
            <Column :exportable="false" header="Action"  style="min-width: 80px" frozen alignFrozen="right">
                <template #body="slotProps">
                    <Button icon="pi pi-ellipsis-v" @click="toggle" outlined rounded class="mr-2" />

                    <Popover ref="op">
                        <div class="flex flex-col gap-4 w-[8rem]">
                            <div>
                                <Button label="Clone" severity="secondary" class="mb-1" icon="pi pi-clone" text  />
                                <Button label="Edit" severity="secondary" class="mb-1" icon="pi pi-pencil" text  />
                                <InputGroup class="mb-1">
                                    <Button :label="slotProps.data.status === 'Active' ? 'Deactivate' : 'Activate'"
                                            :severity="slotProps.data.status === 'Active' ? 'warn' : 'success'"
                                            @click="toggleStatus($event, slotProps.data)"
                                            :icon="slotProps.data.status === 'Active' ? 'pi pi-times' : 'pi pi-check'" text  />
                                </InputGroup>
                                <Button label="Delete" class="mb-1" severity="danger" icon="pi pi-trash" text  />
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
</style>

