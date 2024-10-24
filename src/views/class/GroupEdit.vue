<script setup>
import { useDeliveryTypeStore } from '@/stores/deliveryTypeStore'
import { useFormatTypeStore } from '@/stores/formatTypeStore'
import { useClassStore } from '@/stores/groupStore'
import { useKeyProgramStore } from '@/stores/keyProgramStore'
import { useLocationStore } from '@/stores/locationStore'
import { useScopeStore } from '@/stores/scopeStore'
import { useSiteStore } from '@/stores/siteStore'
import { useTechnicalGroupStore } from '@/stores/technicalGroupStore'
import { useTraineeTypeStore } from '@/stores/traineeTypeStore'
import { useTrainingProgramStore } from '@/stores/trainingProgramStore'
import { useUserStore } from '@/stores/userStore'
import { convertToVietnamTime, parseDateFromString } from '@/utils/date'
import { toTypedSchema } from '@vee-validate/zod'
import Toast from 'primevue/toast'
import { useField, useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { z } from 'zod'

const deliveryTypeOptions = ref([])
const traineeTypeOptions = ref([])
const formatTypeOptions = ref([])
const technicalGroupOptions = ref([])
const trainingProgramOptions = ref()
const siteOptions = ref([])
const locationOptions = ref([])
const scopeOptions = ref([])
const keyProgramOptions = ref([])
const classAdminOptions = ref([])
const locationStore = useLocationStore()
const siteStore = useSiteStore()
const traineeTypeStore = useTraineeTypeStore()
const deliveryTypeStore = useDeliveryTypeStore()
const formatTypeStore = useFormatTypeStore()
const technicalGroupStore = useTechnicalGroupStore()
const trainingProgramStore = useTrainingProgramStore()
const scopeStore = useScopeStore()
const keyProgramStore = useKeyProgramStore()
const userStore = useUserStore()
const classStore = useClassStore()
const route = useRoute();
onMounted(() => {
    const groupId = route.params.id
    classStore.fetchClassDetail(groupId).then(() => {
        const classDetail = classStore.classDetail
        className.value = classDetail.groupName
        expectedStart.value = parseDateFromString(classDetail.expectedStartDate)
        expectedEnd.value = parseDateFromString(classDetail.expectedEndDate)
        note.value = classDetail.note || ''
    })

    keyProgramStore.fetchPrograms().then(() => {
        keyProgramOptions.value = keyProgramStore.keyPrograms
    })
    technicalGroupStore.fetchTechnicalGroup().then(() => {
        technicalGroupOptions.value = technicalGroupStore.technicalGroups
    })
    traineeTypeStore.fectchTraineeTypes().then(() => {
        traineeTypeOptions.value = traineeTypeStore.traineeTypes
    })
    formatTypeStore.fetchformatTypes().then(() => {
        formatTypeOptions.value = formatTypeStore.formatTypes
    })
    scopeStore.fetchScopes().then(() => {
        scopeOptions.value = scopeStore.scopes
    })
    siteStore.fetchSites().then(() => {
        siteOptions.value = siteStore.sites
    })
    deliveryTypeStore.fetchDeliveryTypes().then(() => {
        deliveryTypeOptions.value = deliveryTypeStore.deliveryTypes
    })
    userStore.fetchClassAdmins().then(() => {
        classAdminOptions.value = userStore.classAdmins
    })
})

const handleTechnicalGroupChange = () => {
    let technicalId = technicalGroup.value.id
    trainingProgramStore.fetchTrainingProgramsByTechnicalGroup(technicalId).then(() => {
        trainingProgramOptions.value = trainingProgramStore.trainingProgramsByTecnicalGroups
    })
}

const handleSiteChange = () => {
    let siteId = site.value.id
    locationStore.fecthLocationsBySite(siteId).then(() => {
        locationOptions.value = locationStore.locations
    })
}


// Validation schema using Zod
const validationSchema = toTypedSchema(
    z.object({
        className: z
            .string({ required_error: 'Group Name is required' })
            .trim()
            .min(1, { message: 'Group Name is required' })
            .max(20, { message: 'Group Name must not exceed 20 characters' }),
        deliveryType: z.object({
            id: z
                .number({ required_error: 'Delivery Type is required' })
                .min(1, { message: 'Delivery Type is required' })
        }),
        traineeType: z.object({
            id: z
                .number({ required_error: 'Trainee Type is required' })
                .min(1, { message: 'Trainee Type is required' })
        }),
        formatType: z.object({
            id: z
                .number({ required_error: 'Format Type is required' })
                .min(1, { message: 'Format Type is required' })
        }),
        technicalGroup: z.object({
            id: z
                .number({ required_error: 'Technical Group is required' })
                .min(1, { message: 'Technical Group is required' })
        }),
        trainingProgram: z.object({
            id: z
                .number({ required_error: 'Training Program is required' })
                .min(1, { message: 'Training Program is required' })
        }),
        site: z.object({
            id: z.number({ required_error: 'Site is required' }).min(1, { message: 'Site is required' })
        }),
        location: z.object({
            id: z
                .number({ required_error: 'Location is required' })
                .min(1, { message: 'Location is required' })
        }),
        scope: z.object({
            id: z.number({ required_error: 'Scope is required' }).min(1, { message: 'Scope is required' })
        }),
        plannedTrainee: z
            .number({
                required_error: 'Planned Trainee is required',
                invalid_type_error: 'PlannedTrainee is required'
            })
            .positive({ message: 'Planned Trainee is required' }),
        keyProgram: z.object({
            id: z
                .number({ required_error: 'Key Program is required' })
                .min(1, { message: 'Key Program is required' })
        }),
        expectedStart: z
            .date({
                required_error: 'Expected Start Date is required',
                invalid_type_error: 'Expected Start Date is required'
            })
            .refine((date) => date instanceof Date, { message: 'Expected Start Date is required' }),
        expectedEnd: z
            .date({
                required_error: 'Expected Start Date is required',
                invalid_type_error: 'Expected Start Date is required!'
            })
            .refine((date) => date instanceof Date, { message: 'Expected End Date is required' }),
        note: z.string().max(5000, { message: 'Note must not exceed 5000 characters' }).optional(),
        classAdminOptions: z.preprocess(
            (val) => (val === undefined || val === null ? [] : val),
            z
                .array(
                    z.object({
                        id: z.number().min(1, { message: 'Group Admin code is required' })
                    })
                )
                .min(1, { message: 'Group Admin is required' })
        )
    })
)

// Set up form validation with VeeValidate
const { handleSubmit: handleSubmit, errors: errors } = useForm({ validationSchema })
const { value: classAdmins } = useField('classAdminOptions')
const { value: className } = useField('className')
const { value: deliveryType } = useField('deliveryType')
const { value: formatType } = useField('formatType')
const { value: traineeType } = useField('traineeType')
const { value: technicalGroup } = useField('technicalGroup')
const { value: trainingProgram } = useField('trainingProgram')
const { value: site } = useField('site')
const { value: location } = useField('location')
const { value: scope } = useField('scope')
const { value: plannedTrainee } = useField('plannedTrainee')
const { value: keyProgram } = useField('keyProgram')
const { value: expectedStart } = useField('expectedStart')
const { value: expectedEnd } = useField('expectedEnd')
const { value: note } = useField('note')
const data = ref(null)
const onSubmit = handleSubmit((values) => {
    data.value = convertToSchema(values)
    console.log(data.value);
})


function convertToSchema(data) {
    return {
        groupName: data.className || '',
        traineeNumber: data.plannedTrainee || 0,
        trainingProgramId: data.trainingProgram?.id || 0,
        technicalGroupId: data.technicalGroup?.id || 0,
        siteId: data.site?.id || 0,
        locationId: data.location?.id || 0,
        expectedStartDate: convertToVietnamTime(data.expectedStart).toString(),
        expectedEndDate: convertToVietnamTime(data.expectedEnd).toString(),
        deliveryTypeId: data.deliveryType?.id || 0,
        traineeTypeId: data.traineeType?.id || 0,
        scopeId: data.scope?.id || 0,
        formatTypeId: data.formatType?.id || 0,
        keyProgramId: data.keyProgram?.id || 0,
        note: data.note || '',
        assignedUserIds: data.classAdminOptions.map((option) => option.id) || [0]
    }
}
</script>

<template>
    <div class="card flex flex-col gap-6">
        <Toast />
        <Fluid>
            <div class="font-bold mb-2 block">
                <span class="font-semibold text-2xl">Edit Group</span>
            </div>
            <Divider />
            <form @submit.prevent="onSubmit">
                <Accordion value="0">
                    <AccordionPanel value="0">
                        <AccordionHeader class="!font-bold">General Information</AccordionHeader>
                        <AccordionContent>
                            <div class="flex flex-col gap-4 w-full">
                                <div class="flex flex-col md:flex-row gap-4">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="classname">
                                            Group Name
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <InputText id="classname" v-model="className"
                                            :class="`{ 'p-invalid': errors.className }`" placeholder="Group Name"
                                            type="text" />
                                    </div>

                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="DeliveryType">Delivery Type
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="DeliveryType" v-model="deliveryType" :options="deliveryTypeOptions"
                                            class="w-full" optionLabel="deliveryTypeName"
                                            placeholder="Select One"></Select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="TraineeType">Trainee Type
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="TraineeType" v-model="traineeType" :options="traineeTypeOptions"
                                            class="w-full" optionLabel="traineeTypeName"
                                            placeholder="Select One"></Select>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.className" class="text-red-600">
                                            {{ errors.className }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.deliveryType" class="text-red-600 ml-2">
                                            {{ errors.deliveryType }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.traineeType" class="text-red-600 ml-3">
                                            {{ errors.traineeType }}</small>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row gap-4">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="FormatType">Format Type
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="FormatType" v-model="formatType" :options="formatTypeOptions"
                                            class="w-full" optionLabel="formatTypeName"
                                            placeholder="Select One"></Select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="TechnicalGroup">Technical Group
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="TechnicalGroup" v-model="technicalGroup"
                                            :options="technicalGroupOptions" class="w-full" optionLabel="code"
                                            placeholder="Select One" @change="handleTechnicalGroupChange"></Select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="TrainingProgram">Training Program
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="TrainingProgram" v-model="trainingProgram"
                                            :options="trainingProgramOptions" class="w-full"
                                            optionLabel="trainingProgramNameVersion" placeholder="Select One"></Select>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.formatType" class="text-red-600">
                                            {{ errors.formatType }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.technicalGroup" class="text-red-600 ml-2">
                                            {{ errors.technicalGroup }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.trainingProgram" class="text-red-600 ml-2">
                                            {{ errors.trainingProgram }}</small>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row gap-4">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="Site">Site
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="Site" v-model="site" :options="siteOptions" class="w-full"
                                            optionLabel="siteName" placeholder="Select One"
                                            @change="handleSiteChange"></Select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="Location">Location
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="Location" v-model="location" :options="locationOptions"
                                            class="w-full" optionLabel="locationName" placeholder="Select One"></Select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="Scope">Scope
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="Scope" v-model="scope" :options="scopeOptions" class="w-full"
                                            optionLabel="scopeName" placeholder="Select One"></Select>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.site" class="text-red-600"> {{ errors.site }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.location" class="text-red-600 ml-2">
                                            {{ errors.location }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.scope" class="text-red-600 ml-2"> {{ errors.scope }}</small>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row gap-4">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="PlannedRevenue">Planned Trainee No
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <InputNumber v-model="plannedTrainee" :max="200" :min="0" mode="decimal"
                                            showButtons>
                                        </InputNumber>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="Location">Key Program
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="Location" v-model="keyProgram" :options="keyProgramOptions"
                                            class="w-full" optionLabel="keyProgramName"
                                            placeholder="Select One"></Select>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.plannedTrainee" class="text-red-600">
                                            {{ errors.plannedTrainee }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.keyProgram" class="text-red-600 ml-2">
                                            {{ errors.keyProgram }}</small>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row gap-4">
                                    <div class="flex-auto">
                                        <label for="expectedStart">
                                            Expected Start Date
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <DatePicker v-model="expectedStart" :max-date="expectedEnd"
                                            dateFormat="dd-mm-yy" fluid iconDisplay="input" inputId="icondisplay"
                                            showIcon />
                                    </div>
                                    <div class="flex-auto">
                                        <label for="expectedEnd">
                                            Expected End Date
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <DatePicker v-model="expectedEnd" :min-date="expectedStart"
                                            dateFormat="dd-mm-yy" fluid iconDisplay="input" inputId="icondisplay"
                                            showIcon />
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.expectedStart" class="text-red-600">
                                            {{ errors.expectedStart }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.expectedEnd" class="text-red-600 ml-2">
                                            {{ errors.expectedEnd }}</small>
                                    </div>
                                </div>
                                <div class="flex flex-wrap">
                                    <label for="note">Note</label>
                                    <Textarea id="note" v-model="note" rows="4" />
                                </div>
                                <div class="flex flex-col md:flex-row">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.note" class="text-red-600 pt-1"> {{ errors.note }}</small>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionPanel>
                    <AccordionPanel value="0">
                        <AccordionHeader class="!font-bold">Human Resource</AccordionHeader>
                        <AccordionContent>
                            <label for="classAdmin">
                                Group Admin
                                <i class="text-red-600">*</i>
                            </label>
                            <MultiSelect id="classAdminOptions" v-model="classAdmins" :maxSelectedLabels="3"
                                :options="classAdminOptions" class="w-full md:w-80 mt-2" filter optionLabel="account"
                                placeholder="Select Admin" />
                            <small v-if="errors.classAdminOptions" class="text-red-600">
                                {{ errors.classAdminOptions }}</small>
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>
                <div class="mt-4 flex justify-end">
                    <div class="flex gap-2">
                        <button
                            class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                            type="submit">
                            Save changes
                        </button>
                    </div>
                </div>
            </form>
        </Fluid>
    </div>
</template>