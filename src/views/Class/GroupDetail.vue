<script setup>
import ButtonComponent from "@/components/ButtonComponent.vue";
import router from "@/router";
import { useClassStore } from "@/stores/groupStore"; // Correct the import to use `useTraineeStore`
import { getStatusLabel } from "@/utils/status";
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
    })
})


const navigateToBack = () => {
    router.push('/group-management/list');
};

const handleCancel = () => {
    console.log("object");
};
const navigateToEdit = (id) => {
    console.log(id);
};
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
                    <div class="grid grid-cols-1 md:grid-cols-3  pt-2">
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="font-semibold highlight-label-column h-full w-2/5 flex items-center justify-start pl-1">
                                Group Name
                            </div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 ">
                                {{ classe?.groupName }}
                            </div>
                        </div>

                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold highlight-label-column h-full w-2/5 flex items-center justify-start pl-1">
                                Delivery Type
                            </div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 ">{{
                                classe?.deliveryTypeName }}</div>
                        </div>
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold highlight-label-column h-full w-2/5 flex items-center justify-start pl-1">
                                Trainee Type</div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 border-r">{{
                                classe?.traineeTypeName }}</div>
                        </div>
                        <!-- <---!--->
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold highlight-label-column h-full w-2/5 flex items-center justify-start pl-1">
                                Format Type
                            </div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 ">
                                {{ classe?.formatTypeName }}
                            </div>
                        </div>
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold highlight-label-column h-full w-2/5 flex items-center justify-start pl-1">
                                Technical Group
                            </div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 ">{{
                                classe?.technicalGroupCode }}
                            </div>
                        </div>
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold highlight-label-column h-full w-2/5 flex items-center justify-start pl-1">
                                Training Program</div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 border-r">{{
                                classe?.trainingProgramName }}</div>
                        </div>

                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold highlight-label-column h-full w-2/5 flex items-center justify-start pl-1">
                                Site
                            </div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 ">
                                {{ classe?.siteName }}
                            </div>
                        </div>


                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold highlight-label-column h-full w-2/5 flex items-center justify-start pl-1">
                                Location
                            </div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 ">
                                {{ classe?.locationName }}
                            </div>
                        </div>
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold highlight-label-column h-full w-2/5 flex items-center justify-start pl-1">
                                Scope
                            </div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 border-r">{{
                                classe?.scopeName }}
                            </div>
                        </div>
                        <div class="flex items-center  h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold highlight-label-column h-full w-2/5 flex items-center justify-start pl-1">
                                Planned Trainee No</div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 border-r">{{
                                classe?.traineeNumber }}</div>
                        </div>

                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold highlight-label-column h-full w-2/5 flex items-center justify-start pl-1">
                                Planned Revenue</div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 ">{{
                                classe?.planRevenue }}</div>
                        </div>

                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold highlight-label-column h-full w-2/5 flex items-center justify-start pl-1">
                                Key Program</div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 border-r">{{
                                classe?.keyProgramName
                            }}</div>
                        </div>
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold highlight-label-column h-full w-2/5 flex items-center justify-start pl-1">
                                Expected Start Date</div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 border-r">{{
                                classe?.expectedStartDate
                            }}</div>
                        </div>
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold highlight-label-column h-full w-2/5 flex items-center justify-start pl-1">
                                Expected End Date</div>
                            <div class=" h-full flex items-center ml-1 w-3/5 p-0 border-r">{{
                                classe?.expectedEndDate
                            }}</div>
                        </div>
                        <div class="flex items-center h-14 border-t border-b border-l">
                            <div
                                class="border-r font-semibold highlight-label-column h-full w-2/5 flex items-center justify-start pl-1">
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
                    <div class="mt-4 flex justify-between">
                        <div>
                            <ButtonComponent text="Back to Group List" bgColor="bg-white" hoverColor="hover:bg-gray-200"
                                activeColor="active:bg-gray-300" màu đen :onClick="navigateToBack" />
                            <ButtonComponent text="Cancel Group" bgColor="bg-white text-red-500"
                                hoverColor="hover:bg-gray-200" activeColor="active:bg-gray-300"
                                :onClick="handleCancel" />
                        </div>
                        <div class="flex gap-2">
                            <button type="submit" @click="navigateToEdit(classe.id)"
                                class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                                Edit Group
                            </button>
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
    background-color: #f0f4ff;
    font-weight: bold;
    color: #2c3e50;
}
</style>
