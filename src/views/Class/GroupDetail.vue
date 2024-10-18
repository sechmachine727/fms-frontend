<script setup>
import ButtonComponent from '@/components/ButtonComponent.vue';
import router from '@/router';
import { useClassStore } from '@/stores/groupStore'; // Correct the import to use `useTraineeStore`
import { getStatusLabel } from '@/utils/status';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const classe = ref();
const classStore = useClassStore();
// const router = useRouter();

const groupInfo = computed(() => {
    if (classStore.classDetail) {
        return [
            {
                label1: 'Group Name', value1: classStore.classDetail.groupName,
                label2: 'Delivery Type', value2: classStore.classDetail.deliveryTypeName,
                label3: 'Trainee Type', value3: classStore.classDetail.traineeTypeName
            },
            {
                label1: 'Format Type', value1: classStore.classDetail.formatTypeName,
                label2: 'Technical Group', value2: classStore.classDetail.technicalGroupCode,
                label3: 'Training Program', value3: classStore.classDetail.trainingProgramName
            },
            {
                label1: 'Site', value1: classStore.classDetail.siteName,
                label2: 'Location', value2: classStore.classDetail.locationName,
                label3: 'Scope', value3: classStore.classDetail.scopeName
            },
            {
                label1: 'Planned Trainee No', value1: classStore.classDetail.traineeNumber,
                label2: 'Planned Budget', value2: classStore.classDetail.planRevenue,
                label3: 'Key Program', value3: classStore.classDetail.keyProgramName
            },
            {
                label1: 'Expected Start Date', value1: classStore.classDetail.expectedStartDate,
                label2: 'Expected End Date', value2: classStore.classDetail.expectedEndDate,
                label3: 'Group Admin', value3: classStore.classDetail.assignedUserAccounts.join(', ')
            }
        ]
    } else {
        return []
    }
})

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
                    <Tag :value="classe.status" :severity="getStatusLabel(classe?.status)" />
                </span>
            </div>
            <Divider />
            <TabView>
                <TabPanel header="Group Info">
                    <div class="general-info mb-8">
                        <table class="w-full border-collapse">
                            <tbody>
                                <tr v-for="classDetail in groupInfo" :key="classDetail.label">
                                    <td class="highlight-label-column">{{ classDetail.label1 }}</td>
                                    <td>{{ classDetail.value1 }}</td>
                                    <td class="highlight-label-column">{{ classDetail.label2 }}</td>
                                    <td>{{ classDetail.value2 }}</td>
                                    <td class="highlight-label-column">{{ classDetail.label3 }}</td>
                                    <td>{{ classDetail.value3 }}</td>
                                </tr>
                            </tbody>
                        </table>
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
    padding: 0.5rem;
}

table {
    width: 100%;
    border: 1px solid #ccc;
}

th,
td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #ccc;
}
</style>
