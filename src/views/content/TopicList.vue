
<script setup>
import { ref, onMounted } from 'vue';
import { TopicStore } from '@/stores/topicStore';


const op = ref();
const topics = ref();
const selectedTopic = ref();

const toggle = (event) => {
    op.value.toggle(event);
}

const hidePopover = () => {
    op.value.hide();
}

onMounted(() => {
    TopicStore.getTopicsMedium().then((data) => (topics.value = data));
});

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
</script>

<template>
    <div class="card">
        <DataTable :value="topics" paginator :rows="6" :rowsPerPageOptions="[6, 12, 20, 50]" tableStyle="min-width: 50rem"
                   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                   currentPageReportTemplate="{first} to {last} of {totalRecords}">
            <div class="flex items-center justify-between">
                <h1 class="text-2xl">Topic Configuration</h1>
                <Button icon="pi pi-plus" label="Import Topic"  @click="importTopic" />
            </div>
            <Column field="id" header="No." style="width: 5%"></Column>
            <Column field="TopicCode" header="Topic Code" style="width: 15%"></Column>
            <Column field="TopicName" header="Topic Name" style="width: 25%"></Column>
            <Column field="TechnicalGroup" header="Technical Group" style="width: 25%"></Column>
            <Column field="status" header="Status" style="width: 10%">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getStatusLabel(slotProps.data.status)" />
                </template>
            </Column>
            <Column field="LastModifiedDate" header="Last Modified Date" style="width: 20%"></Column>
            <Column field="LastModifiedBy" header="Last Modified By" style="width: 20%"></Column>

            <Column :exportable="false" header="Action"  style="width: 5%">
                <template #body="slotProps">
                    <Button icon="pi pi-ellipsis-v" @click="toggle" outlined rounded class="mr-2" />
                </template>
            </Column>
        </DataTable>

        <Popover ref="op">
            <div v-if="selectedTopic" class="rounded flex flex-col">
                <div class="pt-4">
                    <div class="flex gap-2">
                        <Button icon="pi pi-shopping-cart" :label="`Buy Now | \$${selectedTopic.name}`" :disabled="selectedTopic.status === 'ACTIVE'" class="flex-auto whitespace-nowrap" @click="hidePopover"></Button>
                        <Button icon="pi pi-download" outlined @click="hidePopover"></Button>
                    </div>
                </div>
            </div>
        </Popover>

<!--        <Popover ref="op">-->
<!--            <div v-if="selectedProduct" class="rounded flex flex-col">-->
<!--                    <div class="flex gap-2">-->
<!--                        <Button icon="pi pi-shopping-cart" :label="`Buy Now | \$${selectedProduct.price}`" :disabled="selectedProduct.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto whitespace-nowrap" @click="hidePopover"></Button>-->
<!--                        <Button icon="pi pi-heart" outlined @click="hidePopover"></Button>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </Popover>-->

    </div>
</template>
<style>
.text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
}
</style>

