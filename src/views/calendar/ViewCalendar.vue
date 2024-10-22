<script setup>
import { useTrainingCalendarStore } from "@/stores/trainingCalendarStore";
import { convertToVietnamTime } from "@/utils/date";
import { getUserInfo } from "@/utils/token";
import { useToast } from "primevue/usetoast";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
    groupId: Number,
    expectedStartDate: String,
})

const userRoles = getUserInfo();
const visible = ref(false);
const toast = useToast();
const trainingCalendarStore = useTrainingCalendarStore();

const columns = ref([
    { field: 'topicCode', header: 'Code' },
    { field: 'topicName', header: 'Name' },
    { field: 'version', header: 'Version' },
    { field: 'trainer', header: 'Trainer' }, // Thêm cột Trainer
]);
const trainers = ref([]);
const topics = ref([]);
const topicByGroups = ref([]);
const slotTimes = ref([])
const trainingCalendar = ref([])
const route = useRoute()

onMounted(() => {
    const groupId = route.params.id
    trainingCalendarStore.fectchTrainers().then(() => {
        trainers.value = trainingCalendarStore.trainers;
    });

    trainingCalendarStore.fectchPresets().then(() => {
        slotTimes.value = trainingCalendarStore.presets;
    })

    trainingCalendarStore.fectchCalendarByGroupId(groupId).then(() => {
        trainingCalendar.value = trainingCalendarStore.calendars;
    })

    trainingCalendarStore.fectchTrainingTopics(groupId).then(() => {
        topicByGroups.value = trainingCalendarStore.topicByGroups;
        trainingCalendarStore.fectchTopics().then(() => {
            topics.value = trainingCalendarStore.topics.filter(
                topic => !topicByGroups.value.some(
                    groupTopic => groupTopic.id === topic.id
                )
            );
            console.log(topics.value);
        })

    })
})

const onRowReorder = (event) => {
    topicByGroups.value = event.value;
};

const slotTimeSelection = ref(null);
const dateSelection = ref(null);
const errorDate = ref(null);
const errorSlotTime = ref(null);
const errorTrainers = reactive({});

let isValid = true;
const validateForm = () => {
    if (!slotTimeSelection.value) {
        errorSlotTime.value = 'Slot Time is required';
        isValid = false;
    } else {
        errorSlotTime.value = null;
        isValid = true;
    }

    if (!dateSelection.value) {
        console.log(props.expectedStartDate);
        errorDate.value = 'Actual Start Date is required';
    } else {
        const [day, month, year] = props.expectedStartDate.split('-').map(Number);
        const targetDate = new Date(year, month - 1, day);
        console.log(targetDate);
        if (dateSelection.value < targetDate) {
            errorDate.value = 'The selected date must be on or after ' + props.expectedStartDate;
            isValid = false;
        } else {
            errorDate.value = null;
            isValid = true;
        }
    }

    topicByGroups.value.forEach((topic) => {
        if (!topic.trainer) {
            errorTrainers[topic.id] = `Please select a trainer for topic ${topic.topicName}.`;
            isValid = false;
        } else {
            errorTrainers[topic.id] = null;
        }
    });
    return isValid;
};
const handleDateChange = () => {
    if (!dateSelection.value) {
        errorDate.value = 'Actual Start Date is required';
    } else {
        errorDate.value = null;
    }
}
const onchangeTrainer = (event) => {
    errorTrainers[event] = null;
}
const handleSelectChange = () => {
    errorSlotTime.value = null;
}
const clearData = () => {
    dateSelection.value = null;
    selectedTopcis.value = [];
    slotTimeSelection.value = null;
    trainers.value = null;
    isValid = false;
    visible.value = false;
    selectedChanges();
}
const onSubmit = () => {
    if (validateForm()) {
        const formData = {
            groupId: props.groupId,
            actualStartDate: convertToVietnamTime(dateSelection.value),
            slotTimeSuggestionId: slotTimeSelection.value.id,
            topics: topicByGroups.value.map(topic => ({
                topicId: topic.id,
                trainerId: topic.trainer.id
            }))
        };
        trainingCalendarStore.fectchGenerateCalender(formData).then(() => {
            toast.add({ severity: 'success', summary: 'Success Message', detail: 'Generate calendar successfully', life: 3000 });
            visible.value = false;
            clearData();
            const groupId = route.params.id
            trainingCalendarStore.fectchCalendarByGroupId(groupId).then(() => {
                trainingCalendar.value = trainingCalendarStore.calendars;
            })
        }).catch((error) => {
            console.log(error);
        })


    }
};

const selectedTopcis = ref(null);
const selectedChanges = () => {
    const groupId = route.params.id
    trainingCalendarStore.fectchTrainingTopics(groupId).then(() => {
        topicByGroups.value = trainingCalendarStore.topicByGroups;
        topicByGroups.value = topicByGroups.value.concat(selectedTopcis.value);
    })
}
const onclose = () => {
    clearData();
}
</script>
<template>
    <Toast />
    <div>
        <div class="mb-4 flex justify-end items-center">
            <Button label="Generate Calendar" @click="visible = true"
                v-if="userRoles.roles.includes('ROLE_DELIVERABLES_MANAGER')" />
        </div>
        <Divider />
        <div>
            <Accordion value={null} v-for="data in trainingCalendar" :key="data.id">
                <AccordionPanel value="0">
                    <AccordionHeader class="flex justify-between items-center">
                        <div class="w-4/6">{{ data.topic.topicName }}</div>
                        <div class="w-1/3">StartDate: {{ data.startDate }} EndDate: {{ data.endDate }}</div>
                        <div class="w-1/6">Trainer: {{ data.trainer.name }}</div>
                    </AccordionHeader>
                    <AccordionContent>
                        <Accordion v-for="lesson in data.lessons" :key="lesson.id">
                            <AccordionPanel value="0">
                                <AccordionHeader class="flex justify-between items-center">
                                    <div class="w-2/3">{{ lesson.unit.unitName }} {{ lesson.unit.unitName }}</div>
                                    <div class="w-1/2">StartDate: {{ lesson.startDate }} EndDate: {{ lesson.endDate }}
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
            <div class="card flex justify-center" v-if="visible">
                <Dialog v-model:visible="visible" maximizable modal header="Generate Calendar"
                    :style="{ width: '80rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <div class="flex mb-5">
                        <div class="flex flex-col gap-2 h-28">
                            <label>
                                Actual Start Date
                                <i class="text-red-600">*</i>
                            </label>
                            <DatePicker v-model="dateSelection" @update:modelValue="handleDateChange" showIcon fluid
                                iconDisplay="input" required />
                            <small v-if="errorDate" class="text-red-600">{{ errorDate }}</small>
                        </div>
                        <div class="flex flex-col gap-2 ml-3 w-80 h-25">
                            <label>
                                Slot Time
                                <i class="text-red-600">*</i>
                            </label>
                            <!-- Field required -->
                            <Select v-model="slotTimeSelection" @change="handleSelectChange" :options="slotTimes"
                                optionLabel="suggestionName" placeholder="Select slot time" class="w-full md:w-80"
                                required />
                            <small v-if="errorSlotTime" class="text-red-600">{{ errorSlotTime }}</small>
                        </div>
                        <div class="flex flex-col gap-2 ml-3 w-56 h-25">
                            <label>
                                Topics
                            </label>
                            <MultiSelect v-model="selectedTopcis" @change="selectedChanges" display="chip"
                                :options="topics" optionLabel="topicName" filter placeholder="Select Cities"
                                :maxSelectedLabels="3" class="w-full md:w-80" />
                        </div>
                    </div>

                    <div>
                        <DataTable :value="topicByGroups" :reorderableColumns="true" @rowReorder="onRowReorder"
                            scrollable scrollHeight="30rem
                        " tableStyle="width: full">
                            <Column rowReorder headerStyle="width: 3rem" :reorderableColumn="false" />
                            <Column v-for="col of columns" :field="col.field" :header="col.header" :key="col.field">
                                <template #body="slotProps">
                                    <!-- Check if the column is 'trainer' to add the Select component -->
                                    <div v-if="col.field === 'trainer'" class="flex flex-col ">
                                        <div class="h-20 flex flex-col w-96 mt-8">
                                            <Select v-model="slotProps.data.trainer"
                                                @change="onchangeTrainer(slotProps.data.id, $event)" :options="trainers"
                                                optionLabel="name" placeholder="Select Trainer" required />
                                            <small class="text-red-600" v-if="errorTrainers[slotProps.data.id]">
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
                        <Button label="Cancel" text severity="secondary" @click="onclose" autofocus />
                        <button type="submit" @click="onSubmit"
                            class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                            Save
                        </button>
                    </template>
                </Dialog>
            </div>
        </form>
    </div>
</template>
