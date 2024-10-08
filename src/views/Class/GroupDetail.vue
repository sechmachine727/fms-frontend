<script setup>
import { useClassStore } from "@/stores/groupStore"; // Correct the import to use `useTraineeStore`
import { onMounted, ref } from 'vue';
import { useRoute } from "vue-router";

const classe = ref();
const classStore = useClassStore();
// const router = useRouter();

onMounted(() => {
    const route = useRoute()
    const groupId = route.params.id
    classStore.fetchClassDetail(groupId).then(() => {
        classe.value = classStore.classDetail
        generalInfo.value = [
            {
                label1: 'Group Name', value1: classe.value?.groupName || 'N/A',
                label2: 'Delivery Type', value2: classe.value?.deliveryTypeName || 'N/A',
                label3: 'Trainee Type', value3: classe.value?.traineeTypeName || 'N/A'
            },
            {
                label1: 'Format Type', value1: classe.value?.formatTypeName || 'N/A',
                label2: 'Technical Group', value2: classe.value?.technicalGroupCode || 'N/A',
                label3: 'Training Program', value3: classe.value?.trainingProgramName || 'N/A'
            },
            {
                label1: 'Site', value1: classe.value?.siteName || 'N/A',
                label2: 'Location', value2: classe.value?.locationName || 'N/A',
                label3: 'Scope', value3: classe.value?.scopeName || 'N/A'
            },

            {
                label1: 'Planned Trainee No.', value1: classe.value?.traineeNumber || 'N/A',
                label2: 'Planned Revenue', value2: classe.value?.planRevenue || 'N/A',
                label3: 'Key Program ', value3: classe.value?.keyProgramName || 'N/A'
            },


        ]
    })
})
const getStatusLabel = (status) => {
    switch (status) {
        case 'Active':
            return '!bg-green-500 !text-white'; // Success color
        case 'Planning':
            return '!bg-gray-500 !text-white'; // Secondary color
        case 'Assigned':
        case 'Pending':
        case 'Reviewing':
            return '!bg-yellow-500 !text-white'; // Warn color
        case 'Close':
            return '!bg-red-500 !text-white'; // Danger color
        case 'In Progress':
            return '!bg-blue-500 !text-white'; // Info color
        case 'Closed':
            return '!bg-black !text-white'; // Contrast color
        default:
            return '!bg-gray-200 !text-black'; // Default color
    }
};

const generalInfo = ref([])
// const navigateToAdd = () => {
//     router.push('/group-management/add');
// };
</script>

<template>
    <div class="card">
        <div class="p-4">
            <!-- Topic Detail Header -->
            <div class="flex justify-between items-center mb-4">
                <span class="font-semibold text-xl" v-if="classe">
                    Group Details : {{ classe.groupCode }}
                    <Tag :value="classe.status" :class="getStatusLabel(classe.statuss)" />
                </span>
            </div>
            <Divider />
            <TabView>
                <TabPanel header="Group Info">
                    <Accordion value="0">
                        <AccordionPanel value="0">
                            <AccordionHeader class="!font-bold">General Information</AccordionHeader>
                            <AccordionContent>
                                <div class="grid grid-cols-1 md:grid-cols-3 p-4">
                                    <div class="flex items-center border h-14">
                                        <div class="bg-gray-200 h-full w-2/5 flex items-center justify-center">
                                        </div>
                                        <span class="font-semibold w-3/5">21313</span>
                                    </div>
                                    <div class="flex items-center border h-14">
                                        <div class="bg-gray-200 h-full w-2/5 flex items-center justify-center">Class
                                            Name</div>
                                        <span class="font-semibold w-3/5">21313</span>
                                    </div>
                                    <div class="flex items-center border h-14">
                                        <div class="bg-gray-200 h-full w-2/5 flex items-center justify-center">Class
                                            Name</div>
                                        <span class="font-semibold w-3/5">21313</span>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>
                </TabPanel>

                <TabPanel header="Trainee List">

                </TabPanel>
                <TabPanel header="Calendar">

                </TabPanel>
                <TabPanel header="Activities">

                </TabPanel>
            </TabView>
        </div>
    </div>
</template>

<style>
.highlight-label-column {
    background-color: #f5f5f5;
    font-weight: bold;
    font-size: 13px;
    width: 15%;
}
</style>