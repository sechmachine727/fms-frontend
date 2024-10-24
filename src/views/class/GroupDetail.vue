<script setup>
import ButtonComponent from '@/components/ButtonComponent.vue';
import WorkFlow from '@/components/WorkFlow.vue';
import router from '@/router';
import { useClassStore } from '@/stores/groupStore'; // Correct the import to use `useTraineeStore`
import { getStatusLabel } from '@/utils/status';
import ViewActivity from '@/views/calendar/ViewActivity.vue';
import ViewCalendar from '@/views/calendar/ViewCalendar.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const classe = ref()
const classStore = useClassStore()
// const router = useRouter();

const groupInfo = computed(() => {
  if (classStore.classDetail) {
    return [
      {
        label1: 'Group Name',
        value1: classStore.classDetail.groupName,
        label2: 'Delivery Type',
        value2: classStore.classDetail.deliveryTypeName,
        label3: 'Trainee Type',
        value3: classStore.classDetail.traineeTypeName
      },
      {
        label1: 'Format Type',
        value1: classStore.classDetail.formatTypeName,
        label2: 'Technical Group',
        value2: classStore.classDetail.technicalGroupCode,
        label3: 'Training Program',
        value3: classStore.classDetail.trainingProgramName
      },
      {
        label1: 'Site',
        value1: classStore.classDetail.siteName,
        label2: 'Location',
        value2: classStore.classDetail.locationName,
        label3: 'Scope',
        value3: classStore.classDetail.scopeName
      },
      {
        label1: 'Planned Trainee No',
        value1: classStore.classDetail.traineeNumber,
        label2: 'Group Admin',
        value2: classStore.classDetail.assignedUserAccounts?.join(', '),
        label3: 'Key Program',
        value3: classStore.classDetail.keyProgramName
      },
      {
        label1: 'Expected Start Date',
        value1: classStore.classDetail.expectedStartDate,
        label2: 'Expected End Date',
        value2: classStore.classDetail.expectedEndDate,
      }
    ]
  } else {
    return []
  }
})
const getGroupId = ref(null)
const expectedStartDate = ref(null)
onMounted(() => {
  const route = useRoute()
  const groupId = route.params.id
  classStore.fetchClassDetail(groupId).then(() => {
    classe.value = classStore.classDetail
    getGroupId.value = parseInt(classe.value.id)
    expectedStartDate.value = classe.value.expectedStartDate
  })
})

const navigateToBack = () => {
  router.push('/group-management/list')
}

const handleCancel = () => {
  console.log('object')
}
const navigateToEdit = (id) => {
  router.push('/group-management/edit/' + id)
}

const events = ref([
  { status: 'Assign', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0' },
  { status: 'Planing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
  {
    status: 'Pending Close',
    date: '15/10/2020 16:15',
    icon: 'pi pi-shopping-cart',
    color: '#FF9800'
  },
  { status: 'Close', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' },
  { status: 'Assign', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0' },
  { status: 'Planing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
  {
    status: 'Pending Close',
    date: '15/10/2020 16:15',
    icon: 'pi pi-shopping-cart',
    color: '#FF9800'
  },
  { status: 'Close', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' },
  { status: 'Assign', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0' },
  { status: 'Planing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
  {
    status: 'Pending Close',
    date: '15/10/2020 16:15',
    icon: 'pi pi-shopping-cart',
    color: '#FF9800'
  },
  { status: 'Close', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
])
const visibleWorkFlow = ref(false)

const handleShowWorkFlow = () => {
  visibleWorkFlow.value = true
}

const isEdit = (data) => {
  return data !== 'Planning' || data !== 'Assigned' || data !== 'Reviewing'
}

</script>

<template>
  <div class="card">
    <div class="p-4">
      <!-- Topic Detail Header -->
      <div class="flex mb-4">
        <span v-if="classe" class="font-semibold text-xl">
          Group Details : {{ classe?.groupCode }}
          <Tag :severity="getStatusLabel(classe?.status)" :value="classe.status" />
        </span>
        <i v-if="classe" class="pi pi-question-circle ml-1 cursor-pointer mt-1" style="font-size: 1.7rem"
          @click="handleShowWorkFlow"></i>
      </div>
      <WorkFlow v-model:visible="visibleWorkFlow" />
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
                  <td class="highlight-label-column" v-if="classDetail.label3">{{ classDetail.label3 }}</td>
                  <td v-if="classDetail.value3">{{ classDetail.value3 }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 flex justify-between">
            <div>
              <ButtonComponent :onClick="navigateToBack" activeColor="active:bg-gray-300" bgColor="bg-white"
                hoverColor="hover:bg-gray-200" màu text="Back to Group List" đen />
              <ButtonComponent :onClick="handleCancel" activeColor="active:bg-gray-300" bgColor="bg-white text-red-500"
                hoverColor="hover:bg-gray-200" text="Cancel Group" />
            </div>
            <div class="flex gap-2">
              <button v-if="isEdit(classe?.status)"
                class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                type="submit" @click="navigateToEdit(classe?.id)">
                Edit Group
              </button>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Trainee List"> </TabPanel>
        <TabPanel header="Calendar">
          <ViewCalendar :expected-start-date="expectedStartDate" :groupId="getGroupId" />
        </TabPanel>
        <TabPanel header="Activities">
          <ViewActivity :event="events" />
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
