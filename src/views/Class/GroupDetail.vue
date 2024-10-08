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
                    Group Details : {{ classe?.groupCode }}
                    <Tag :value="classe.status" :class="getStatusLabel(classe?.statuss)" />
                </span>
            </div>
            <Divider />
            <TabView>
                <TabPanel header="Group Info">
                    <div class="grid grid-cols-1 md:grid-cols-3  p-4">
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="font-semibold border-r border-gray-200 bg-gray-50 h-full w-2/5 flex items-center justify-start pl-1">
                                Group Name
                            </div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 ">
                                {{ classe?.groupName }}
                            </div>
                        </div>

                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold border-gray-200 bg-gray-50 h-full w-2/5 flex items-center justify-start pl-1">
                                Delivery Type
                            </div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 ">{{
                                classe?.deliveryTypeName }}</div>
                        </div>
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold border-gray-200 bg-gray-50 h-full w-2/5 flex items-center justify-start pl-1">
                                Trainee Type</div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 border-r">{{
                                classe?.traineeTypeName }}</div>
                        </div>
                        <!-- <---!--->
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold border-gray-200 bg-gray-50 h-full w-2/5 flex items-center justify-start pl-1">
                                Format Type
                            </div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 ">
                                {{ classe?.formatTypeName }}
                            </div>
                        </div>
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold border-gray-200 bg-gray-50 h-full w-2/5 flex items-center justify-start pl-1">
                                Technical Group
                            </div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 ">{{
                                classe?.technicalGroupCode }}
                            </div>
                        </div>
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold border-gray-200 bg-gray-50 h-full w-2/5 flex items-center justify-start pl-1">
                                Training Program</div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 border-r">{{
                                classe?.trainingProgramName }}</div>
                        </div>

                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold border-gray-200 bg-gray-50 h-full w-2/5 flex items-center justify-start pl-1">
                                Site
                            </div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 ">
                                {{ classe?.siteName }}
                            </div>
                        </div>


                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold border-gray-200 bg-gray-50 h-full w-2/5 flex items-center justify-start pl-1">
                                Location
                            </div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 ">
                                {{ classe?.locationName }}
                            </div>
                        </div>
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold border-gray-200 bg-gray-50 h-full w-2/5 flex items-center justify-start pl-1">
                                Scope
                            </div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 border-r">{{
                                classe?.scopeName }}
                            </div>
                        </div>
                        <div class="flex items-center  h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold border-gray-200 bg-gray-50 h-full w-2/5 flex items-center justify-start pl-1">
                                Planned Trainee No</div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 border-r">{{
                                classe?.traineeNumber }}</div>
                        </div>

                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold border-gray-200 bg-gray-50 h-full w-2/5 flex items-center justify-start pl-1">
                                Planned Revenue</div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 ">{{
                                classe?.planRevenue }}</div>
                        </div>

                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold border-gray-200 bg-gray-50 h-full w-2/5 flex items-center justify-start pl-1">
                                Key Program</div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 border-r">{{
                                classe?.keyProgramName
                            }}</div>
                        </div>
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold border-gray-200 bg-gray-50 h-full w-2/5 flex items-center justify-start pl-1">
                                Expected Start Date</div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 border-r">{{
                                classe?.expectedStartDate
                            }}</div>
                        </div>
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold border-gray-200 bg-gray-50 h-full w-2/5 flex items-center justify-start pl-1">
                                Expected End Date</div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 border-r">{{
                                classe?.expectedEndDate
                            }}</div>
                        </div>
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold border-gray-200 bg-gray-50 h-full w-2/5 flex items-center justify-start pl-1">
                                Group Admin</div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 border-r">
                                <span v-for="(user, index) in classe?.assignedUserAccounts" :key="index">
                                    {{ user }}
                                    <!-- Thêm dấu phẩy giữa các phần tử, bỏ dấu phẩy cuối cùng -->
                                    <span v-if="index < classe.assignedUserAccounts.length - 1">, </span>
                                </span>
                            </div>
                        </div>
                    </div>
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
    background-color: #ffffff;
    font-weight: bold;
    font-size: 13px;
    width: 15%;
}
</style>
