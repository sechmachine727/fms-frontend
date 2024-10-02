<script setup>
import { useTopicStore } from '@/stores/topicStore'
import { useTrainingProgramStore } from '@/stores/trainingProgramStore'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { z } from 'zod'
import router from '@/router'
import { useRoute } from 'vue-router'

// const topicName = ref()
const topicStore = useTopicStore()
const trainingProgramStore = useTrainingProgramStore()

const regionOptions = ref([
    { name: '-', code: '-' },
    { name: 'FSA.HN', code: 'HN' },
    { name: 'FSA.DN', code: 'DN' },
    { name: 'FSA.HCM', code: 'HCM' },
    { name: 'FSA.QN', code: 'QN' }
])

const technicalGroupTypes = ref([
    { name: 'C#', code: 'C#' },
    { name: 'Front End', code: 'FE' },
    { name: 'Java', code: 'Java' },
    { name: 'Out System', code: 'Out System' },
    { name: 'CPP', code: 'CPP' },
    { name: 'DevOps', code: 'DevOps' },
    { name: 'SAP', code: 'SAP' },
    { name: 'Certificate', code: 'Certificate' },
    { name: 'Python', code: 'Python' },
    { name: 'ABAP', code: 'ABAP' },
    { name: 'MBD', code: 'MBD' },
    { name: 'QA', code: 'QA' },
    { name: 'Azure', code: 'Azure' },
    { name: 'Cloud Computing', code: 'Cloud Computing' },
    { name: 'ASE', code: 'ASE' },
    { name: 'Sharepoint', code: 'Sharepoint' },
    { name: 'Data Analytics', code: 'Data Analytics' },
    { name: 'NodeJS', code: 'NodeJS' },
    { name: 'Infra', code: 'Infra' },
    { name: 'PHP', code: 'PHP' },
    { name: 'Angular', code: 'Angular' },
    { name: 'IT Fundamental', code: 'IT Fundamental' },
    { name: 'React Native', code: 'React Native' },
    { name: 'Docker', code: 'Docker' },
    { name: '.NET', code: '.NET' },
    { name: 'CAE', code: 'CAE' },
    { name: 'Cobol', code: 'Cobol' },
    { name: 'AI', code: 'AI' },
    { name: 'Data Engineer', code: 'Data Engineer' },
    { name: 'IOS', code: 'IOS' },
    { name: 'Automation Test', code: 'Automation Test' },
    { name: 'SQL', code: 'SQL' },
    { name: 'AUTOSAR', code: 'AUTOSAR' },
    { name: 'Manual Test', code: 'Manual Test' },
    { name: 'Maven', code: 'Maven' },
    { name: 'Linux', code: 'Linux' }
])

// Validation schema using Zod
const validationSchema = toTypedSchema(
    z.object({
        code: z
            .string({ required_error: 'Code is required' })
            .min(1, { message: 'Code is required' }),
        version: z
            .string({ required_error: 'Version is required' })
            .min(1, { message: 'Version is required' }),
        trainingProgramName: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name is required' }),
        technicalGroupCode: z.preprocess(
            (val) => (val === undefined || val === null ? [] : val),
            z.array(
                z.object({
                    code: z.string().min(1, { message: 'Technical Group code is required' })
                })
            ).min(1, { message: 'Technical Group is required' })
        ),
        status: z
            .boolean()
            .default(false),
        region: z
            .string()
            .optional(),
        contentLink: z
            .string()
            .optional(),
        description: z
            .string()
            .optional(),
        topicData: z
            .string()
            .optional()
    })
)

// Set up form validation with VeeValidate
const { handleSubmit, errors } = useForm({ validationSchema })
const { value: code } = useField('code')
const { value: version } = useField('version')
const { value: trainingProgramName } = useField('trainingProgramName')
const { value: technicalGroupCode } = useField('technicalGroupCode')
const { value: region } = useField('region')
const { value: contentLink } = useField('contentLink')
const { value: status } = useField('status')
const { value: description } = useField('description')
const { value: topicData } = useField('topicData')
// const { value: code } = useField('code')
// const { value: version } = useField('version')

const onSubmit = handleSubmit((values) => {
    console.log('Form values:', values)
})

const navigateToBack = () => {
    router.push('/topic-management/training-program')
}

const trainingProgram = ref()
onMounted(() => {
    const route = useRoute()
    const trainingProgramId = route.params.id

    trainingProgramStore.fetchTrainingProgramDetail(trainingProgramId).then(() => {
        trainingProgram.value = trainingProgramStore.trainingProgram

        // Populate form fields with the fetched training program data
        code.value = trainingProgram.value?.code || ''
        version.value = trainingProgram.value?.version || ''
        trainingProgramName.value = trainingProgram.value?.trainingProgramName || ''
        contentLink.value = trainingProgram.value?.contentLink || ''
        description.value = trainingProgram.value?.description || ''
        status.value = trainingProgram.value?.status || false

        region.value = trainingProgram.value?.regionOptions || ''
        technicalGroupCode.value = trainingProgram.value?.technicalGroupTypes || []
        topicData.value = trainingProgram.value?.topicData || []
    })

    topicStore.fetchTopics().then(() => {
        const data = topicStore.topics.map(topic => ({
            label: `${topic.code} - ${topic.name} - ${topic.version}`,
            value: topic.code
        }))
        topicData.value = [data, []]
    })
})
</script>

<template>
    <div class="card flex flex-col gap-6">
        <Fluid>
            <div class="font-bold mb-2 block">
                <span class="font-semibold text-2xl">Training Program Edit</span>
            </div>
            <Divider />

            <form :value="trainingProgram" @submit.prevent="onSubmit">
                <div class="flex gap-4">
                    <div class="flex-1 ">

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="Code">
                                    Code
                                    <i class="text-red-600">*</i>
                                </label>
                                <InputText id="Code" v-model="code"
                                           :class="`{ 'p-invalid': errors.code }`" placeholder="Code"
                                           type="text">{{ trainingProgram.code }}
                                </InputText>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <small v-if="errors.code" class="text-red-600"> {{ errors.code }}</small>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="Version">
                                    Version
                                    <i class="text-red-600">*</i>
                                </label>
                                <InputText id="Version" v-model="version"
                                           :class="`{ 'p-invalid': errors.version }`" placeholder="Version"
                                           type="text" />
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <small v-if="errors.version" class="text-red-600"> {{ errors.version }}</small>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="Name">
                                    Name
                                    <i class="text-red-600">*</i>
                                </label>
                                <InputText id="Name" v-model="trainingProgramName"
                                           :class="`{ 'p-invalid': errors.name }`" placeholder="Name"
                                           type="text" />
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <small v-if="errors.trainingProgramName" class="text-red-600"> {{ errors.trainingProgramName
                                }}</small>
                        </div>

                        <div class="flex flex-wrap gap-2 w-full mt-5">
                            <label for="technicalType"> Technical Group
                                <i class="text-red-600">*</i>
                            </label>
                            <MultiSelect id="technicalType" v-model="technicalGroupCode" :maxSelectedLabels="3"
                                         :options="technicalGroupTypes"
                                         class="w-full md:w-80" filter optionLabel="name"
                                         placeholder="Select Technical Group"></MultiSelect>
                            <!--                        <small class="text-red-600 " v-if="errors.technicalGroupTypeOptions"> {{ errors.technicalGroupTypeOptions }}</small>-->
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <small v-if="errors.technicalGroupCode" class="text-red-600 ml-2">
                                {{ errors.technicalGroupCode }}</small>
                        </div>

                        <div class="flex flex-wrap gap-2 w-full mt-5">
                            <label for="status">Status</label>

                            <!-- Toggle Switch for changing status -->
                            <ToggleSwitch id="status" v-model="status" offIcon="pi pi-times" offLabel="Inactive"
                                          onIcon="pi pi-check" onLabel="Active" />

                            <!-- Dynamic Status Text with oval border and lighter background -->
                            <span :class="status
                                    ? 'text-green-600 bg-green-100 '
                                    : 'text-yellow-600 bg-yellow-100'" class="ml-2 font-semibold px-3 py-1 rounded-full">{{ status ? 'Active' : 'Inactive' }}</span>
                        </div>

                        <div class="flex flex-wrap gap-2 w-full mt-3">
                            <label for="Region">
                                Region
                            </label>
                            <Select id="Region" v-model="region" :options="regionOptions"
                                    class="w-full" optionLabel="name" placeholder="Select One"></Select>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="ContentLink">
                                    Content Link
                                </label>
                                <InputText id="ContentLink" v-model="contentLink"
                                           :class="`{ 'p-invalid': errors.contentLink }`" placeholder="Content Link"
                                           type="text" />
                            </div>
                        </div>

                        <div class="flex flex-wrap mt-3">
                            <label for="Description">Description</label>
                            <Textarea id="Description" v-model="description" rows="4" />
                        </div>
                        <div class="flex flex-col md:flex-row ">
                            <div class="flex flex-wrap gap-2 w-full">
                                <small v-if="errors.description" class="text-red-600 pt-1"> {{ errors.description
                                    }}</small>
                            </div>
                        </div>
                    </div>

                    <div class="flex-1 ">
                        <div class="flex-1 ">
                            <div class="flex flex-wrap gap-2 w-full mt-3">
                                <label for="topicData">
                                    Topic
                                    <i class="text-red-600">*</i>
                                </label>
                                <PickList v-model="topicData" breakpoint="1400px" dataKey="value">
                                    <template #option="{ option }">
                                        {{ option.label }}
                                    </template>
                                </PickList>
                            </div>
                            <div class="flex flex-wrap gap-2 w-full">
                                <!--                            <small class="text-red-600 ml-2" v-if="errors.topicData"> {{ errors.topicData }}</small>-->
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 flex justify-between">
                    <button class="mr-2 bg-gray-200 hover:bg-gray-400 active:bg-gray-200 text-black font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                            @click="navigateToBack">
                        Back to Training Program List
                    </button>
                    <div class="flex gap-2">
                        <button
                            class="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                            Cancel
                        </button>
                        <button class="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                                type="submit">
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </Fluid>
    </div>
</template>
