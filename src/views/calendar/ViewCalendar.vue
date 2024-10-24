<script setup>
import { useTrainingCalendarStore } from '@/stores/trainingCalendarStore'
import { convertToVietnamTimeWithTimeZone } from '@/utils/date'
import { getUserInfo } from '@/utils/token'
import { useToast } from 'primevue/usetoast'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  groupId: Number,
  expectedStartDate: String
})

const userRoles = getUserInfo()
const visible = ref(false)
const toast = useToast()
const trainingCalendarStore = useTrainingCalendarStore()

const columns = ref([
  { field: 'topicCode', header: 'Code' },
  { field: 'topicName', header: 'Name' },
  { field: 'version', header: 'Version' },
  { field: 'trainer', header: 'Trainer' }
])
const trainers = ref([])
const topics = ref([])
const topicByGroups = ref([])
const slotTimes = ref([])
const trainingCalendar = ref([])
const route = useRoute()
const filteredTopics = ref([])
onMounted(() => {
  const groupId = route.params.id
  trainingCalendarStore.fectchTrainers().then(() => {
    trainers.value = trainingCalendarStore.trainers
  })

  trainingCalendarStore.fectchPresets().then(() => {
    slotTimes.value = trainingCalendarStore.presets
  })

  trainingCalendarStore.fectchCalendarByGroupId(groupId).then(() => {
    trainingCalendar.value = trainingCalendarStore.calendars
  })

  trainingCalendarStore.fectchTrainingTopics(groupId).then(() => {
    topicByGroups.value = trainingCalendarStore.topicByGroups
    trainingCalendarStore.fectchTopics().then(() => {
      filteredTopics.value = trainingCalendarStore.topics.filter(
        (topic) => !topicByGroups.value.some((groupTopic) => groupTopic.id === topic.id || groupTopic.topicCode === topic.topicCode)
      )
      topics.value = filteredTopics.value.map((topic) => {
        return {
          label: `[${topic.topicCode}] ${topic.topicName} (${topic.version})`,
          value: topic.id
        }
      })
    })
  })
})

const onRowReorder = (event) => {
  topicByGroups.value = event.value
}

const slotTimeSelection = ref(null)
const dateSelection = ref(null)
const errorDate = ref(null)
const errorSlotTime = ref(null)
const errorTrainers = reactive({})

let isValid = true
const validateForm = () => {
  if (!slotTimeSelection.value) {
    errorSlotTime.value = 'Slot Time is required'
    isValid = false
  } else {
    errorSlotTime.value = null
    isValid = true
  }

  if (!dateSelection.value) {
    errorDate.value = 'Actual Start Date is required'
  } else {
    const [day, month, year] = props.expectedStartDate.split('-').map(Number)
    const targetDate = new Date(year, month - 1, day)
    if (dateSelection.value < targetDate) {
      errorDate.value = 'The selected date must be on or after ' + props.expectedStartDate
      isValid = false
    } else {
      errorDate.value = null
      isValid = true
    }
  }

  topicByGroups.value.forEach((topic) => {
    if (!topic.trainer) {
      errorTrainers[topic.id] = `Please select a trainer for topic ${topic.topicName}.`
      isValid = false
    } else {
      errorTrainers[topic.id] = null
    }
  })
  return isValid
}
const handleDateChange = () => {
  if (!dateSelection.value) {
    errorDate.value = 'Actual Start Date is required'
  } else {
    errorDate.value = null
  }
}
const onchangeTrainer = (event) => {
  errorTrainers[event] = null
}
const handleSelectChange = () => {
  errorSlotTime.value = null
}
const clearData = () => {
  dateSelection.value = null
  selectedTopcis.value = []
  slotTimeSelection.value = null
  trainers.value = null
  isValid = false
  visible.value = false
  selectedChanges()
}
const onSubmit = () => {
  if (validateForm()) {
    const formData = {
      groupId: props.groupId,
      actualStartDate: convertToVietnamTimeWithTimeZone(dateSelection.value),
      slotTimeSuggestionId: slotTimeSelection.value.id,
      topics: topicByGroups.value.map((topic) => ({
        topicId: topic.id,
        trainerId: topic.trainer.id
      }))
    }
    trainingCalendarStore
      .fectchGenerateCalender(formData)
      .then(() => {
        toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: 'Generate calendar successfully',
          life: 3000
        })
        visible.value = false
        clearData()
        const groupId = route.params.id
        trainingCalendarStore.fectchCalendarByGroupId(groupId).then(() => {
          trainingCalendar.value = trainingCalendarStore.calendars
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

const selectedTopcis = ref(null)
const selectedChanges = () => {
  const groupId = route.params.id
  trainingCalendarStore.fectchTrainingTopics(groupId).then(() => {
    topicByGroups.value = trainingCalendarStore.topicByGroups
    const filterTopicsConCat = filteredTopics.value.filter((topic) => selectedTopcis.value.some((selectedTopic) => selectedTopic.value === topic.id))
    let uniqueArrTopic = [];
    if (filterTopicsConCat.length > 1) {
      for (let i = 0; i < filterTopicsConCat.length; i++) {
        for (let j = i + 1; j < filterTopicsConCat.length; j++) {
          if (filterTopicsConCat[i].topicCode === filterTopicsConCat[j].topicCode) {
            filterTopicsConCat.splice(j, 1);
            j--;
            toast.add({
              severity: 'error',
              summary: 'Duplicate',
              detail: 'The topic name ' + filterTopicsConCat[i].topicName + ' is duplicated',
              life: 4000
            });
          }
        }
        uniqueArrTopic.push(filterTopicsConCat[i]);
      }
    } else {
      uniqueArrTopic = filterTopicsConCat;
    }

    topicByGroups.value = topicByGroups.value.concat(uniqueArrTopic)
  })
}
const onclose = () => {
  clearData()
}
</script>
<template>
  <Toast />
  <div>
    <div class="mb-4 flex justify-end items-center">
      <Button v-if="userRoles.roles.includes('ROLE_DELIVERABLES_MANAGER', 'ROLE_GROUP_ADMIN')" label="Generate Calendar"
        @click="visible = true" />
    </div>
    <div v-if="trainingCalendar.length > 0">
      <div class="flex gap-5">
        <div><span class="font-semibold">Class Start Date:</span> {{ props.expectedStartDate }}</div>
        <div><span class="font-semibold">Actual Learning Start Date</span> {{ trainingCalendar[0]?.startDate }}</div>
      </div>
      <Accordion v-for="data in trainingCalendar" :key="data.id" value="{null}">
        <AccordionPanel value="0">
          <AccordionHeader class="flex justify-between items-center">
            <div class="w-4/6">[{{ data.topic.topicCode }}] {{ data.topic.topicName }} ({{ data.topic.version }})</div>
            <div class="w-1/2">From: {{ data.startDate }} To: {{ data.endDate }}</div>
            <div class="w-1/6">
              PIC: {{ data.trainer.name }}
            </div>
          </AccordionHeader>
          <AccordionContent>
            <div>
              Slot time: [HCM] [FTOWN-1] FWF tối 2,4,6
            </div>
            <Accordion v-for="lesson in data.lessons" :key="lesson.id">
              <AccordionPanel value="0">
                <AccordionHeader class="flex justify-between items-center">
                  <div class="w-4/5">{{ lesson.unit.unitName }} {{ lesson.unit.unitName }}</div>
                  <div class="w-1/6">
                    From: {{ lesson.startDate }} To: {{ lesson.endDate }}
                  </div>
                </AccordionHeader>
                <AccordionContent>
                  <DataTable :value="lesson.unit.unitSections" scrollHeight="300px" scrollable>
                    <Column field="title" header="Content"></Column>
                    <Column field="deliveryType" header="Delivery Type"></Column>
                    <Column field="duration" header="Duration"></Column>
                    <Column field="trainingFormat" header="Training Format"></Column>
                    <Column field="note" header="Training Materials / Logistics & General Notes">
                    </Column>
                  </DataTable>
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>

    <form @submit.prevent="onSubmit">
      <div v-if="visible" class="card flex justify-center">
        <Dialog v-model:visible="visible" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
          :style="{ width: '80rem' }" header="Generate Calendar" maximizable modal>
          <div class="flex mb-5">
            <div class="flex flex-col gap-2 h-28">
              <label>
                Actual Start Date
                <i class="text-red-600">*</i>
              </label>
              <DatePicker v-model="dateSelection" fluid iconDisplay="input" dateFormat="dd-mm-yy" required showIcon
                @update:modelValue="handleDateChange" />
              <small v-if="errorDate" class="text-red-600">{{ errorDate }}</small>
            </div>
            <div class="flex flex-col gap-2 ml-3 w-80 h-25">
              <label>
                Slot Time
                <i class="text-red-600">*</i>
              </label>
              <!-- Field required -->
              <Select v-model="slotTimeSelection" :options="slotTimes" class="w-full md:w-80"
                optionLabel="suggestionName" placeholder="Select slot time" required @change="handleSelectChange" />
              <small v-if="errorSlotTime" class="text-red-600">{{ errorSlotTime }}</small>
            </div>
            <div class="flex flex-col gap-2 ml-3 w-56 h-25">
              <label> Topics </label>
              <MultiSelect v-model="selectedTopcis" :maxSelectedLabels="3" :options="topics" class="w-full md:w-80"
                display="chip" filter optionLabel="label" placeholder="Select Cities" @change="selectedChanges" />
            </div>
          </div>

          <div>
            <DataTable :reorderableColumns="true" :value="topicByGroups" scrollHeight="30rem
                        " scrollable tableStyle="width: full" @rowReorder="onRowReorder">
              <Column :reorderableColumn="false" headerStyle="width: 3rem" rowReorder />
              <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
                <template #body="slotProps">
                  <!-- Check if the column is 'trainer' to add the Select component -->
                  <div v-if="col.field === 'trainer'" class="flex flex-col">
                    <div class="h-20 flex flex-col w-96 mt-8">
                      <Select v-model="slotProps.data.trainer" :options="trainers" optionLabel="name"
                        placeholder="Select Trainer" required @change="onchangeTrainer(slotProps.data.id, $event)" />
                      <small v-if="errorTrainers[slotProps.data.id]" class="text-red-600">
                        {{ errorTrainers[slotProps.data.id] }}
                      </small>
                    </div>
                  </div>
                  <div v-else>
                    {{ slotProps.data[col.field] }}
                  </div>
                </template>
              </Column>
            </DataTable>
            <Toast />
          </div>

          <!-- Form Footer -->
          <template #footer>
            <Button autofocus label="Cancel" severity="secondary" text @click="onclose" />
            <button
              class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
              type="submit" @click="onSubmit">
              Save
            </button>
          </template>
        </Dialog>
      </div>
    </form>
  </div>
</template>
