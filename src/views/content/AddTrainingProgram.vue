<script setup>
import router from '@/router'
import { useTopicStore } from '@/stores/topicStore'
import { useTechnicalGroupStore } from '@/stores/technicalGroupStore'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { z } from 'zod'

const topicStore = useTopicStore()
const technicalGroupStore = useTechnicalGroupStore()

const technicalGroupTypeOptions = ref([])

const regionOptions = ref([
    { name: '-', code: '-' },
    { name: 'FSA.HN', code: 'HN' },
    { name: 'FSA.DN', code: 'DN' },
    { name: 'FSA.HCM', code: 'HCM' },
    { name: 'FSA.QN', code: 'QN' }
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
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name is required' }),
        technicalGroupType: z
            .object({
                id: z.number({ required_error: 'Technical Group code is required' }).min(1, { message: 'Technical Group code is required' })
            }),
        status: z
            .boolean()
            .default(false),
        region: z
            .object({
                code: z.string()
                    .optional()
            }),
        contentLink: z
            .string()
            .optional(),
        description: z
            .string()
            .optional(),
        topicData: z.tuple([
            z.array(z.object({
                label: z.string(),
                value: z.string()
            })),
            z.array(z.object({
                label: z.string(),
                value: z.string()
            })).nonempty({ message: 'At least one topic must be selected' }) // Second array for selected topics
        ])
    })
)

// Set up form validation with VeeValidate
const { handleSubmit, errors } = useForm({
    validationSchema
})
const { value: code } = useField('code')
const { value: version } = useField('version')
const { value: name } = useField('name')
const { value: technicalGroupType } = useField('technicalGroupType')
const { value: region } = useField('region')
const { value: contentLink } = useField('contentLink')
const { value: status } = useField('status')
const { value: description } = useField('description')
const { value: topicData } = useField('topicData')


const onSubmit = handleSubmit((values) => {

    console.log('Form values:', values)
    // console.log('Selected topics:', topicData.value[1]);
    const selectedTopics = values.topicData[1]
    console.log(selectedTopics)
    // router.push('/topic-management/training-program')
})

const navigateToBack = () => {
    router.push('/topic-management/training-program')
}

onMounted(() => {
    topicStore.fetchTopics().then(() => {
        const data = topicStore.topics.map(topic => ({
            label: `${topic.code} - ${topic.name} - ${topic.version}`,
            value: topic.code
        }))
        topicData.value = [data, []]
        console.log('Topic data:', topicData.value)

    })

    technicalGroupStore.fetchTechnicalGroup().then(() => {
        technicalGroupTypeOptions.value = technicalGroupStore.technicalGroups
        console.log('Technical group type:', technicalGroupTypeOptions.value)
    })
})

const onChange = (value) => {
    console.log('Selected Topics Changed:', value)
    topicData.value.target = value // Update the selected topics
}


</script>

<template>
    <div class="card flex flex-col gap-6">
        <Fluid>
            <div class="font-bold mb-2 block">
                <span class="font-semibold text-2xl">Add Training Program</span>
            </div>
            <Divider />

            <form @submit.prevent="onSubmit">
                <div class="flex gap-4">
                    <div class="flex-1 ">
                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="Code">
                                    Code
                                    <i class="text-red-600">*</i>
                                </label>
                                <InputText id="Code" v-model="code" :class="`{ 'p-invalid': errors.code }`"
                                           placeholder="Code" type="text" />
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
                                <InputText id="Version" v-model="version" :class="`{ 'p-invalid': errors.version }`"
                                           placeholder="Version" type="text" />
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
                                <InputText id="Name" v-model="name" :class="`{ 'p-invalid': errors.name }`"
                                           placeholder="Name" type="text" />
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <small v-if="errors.name" class="text-red-600"> {{ errors.name }}</small>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="technicalType"> Technical Group
                                    <i class="text-red-600">*</i>
                                </label>
                                <Select id="technicalType" v-model="technicalGroupType"
                                        :options="technicalGroupTypeOptions" class="w-full md:w-80" filter
                                        optionLabel="code" placeholder="Select Technical Group"></Select>
                                <small v-if="errors.technicalGroupType" class="text-red-600 ml-2">
                                    {{ errors.technicalGroupType }}</small>
                            </div>
                        </div>


                        <div class="flex flex-wrap gap-2 w-full mt-5">
                            <label for="status">Status</label>

                            <!-- Toggle Switch for changing status -->
                            <ToggleSwitch id="status" v-model="status" offIcon="pi pi-times" offLabel="Inactive"
                                          onIcon="pi pi-check" onLabel="Active" />

                            <!-- Dynamic Status Text with oval border and lighter background -->
                            <span :class="status
                                ? 'text-green-600 bg-green-100 '
                                : 'text-yellow-600 bg-yellow-100'"
                                  class="ml-2 font-semibold px-3 py-1 rounded-full">{{ status ? 'Active' : 'Inactive'
                                }}</span>
                        </div>

                        <div class="flex flex-wrap gap-2 w-full mt-3">
                            <label for="Region">
                                Region
                            </label>
                            <Select id="Region" v-model="region" :options="regionOptions" class="w-full"
                                    optionLabel="name" placeholder="Select One"></Select>
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

                    <div class="flex-1">
                        <div class="flex flex-wrap gap-2 w-full mt-3">
                            <label for="topicData">
                                Topic
                                <i class="text-red-600">*</i>
                            </label>
                            <PickList v-model="topicData" breakpoint="1400px" @update:modelValue="onChange"
                                dataKey="value">
                                <template #option="{ option }">
                                    {{ option.label }}
                                </template>
                            </PickList>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <small v-if="errors.topicData" class="text-red-600 ml-2">{{ errors.topicData }}</small>
                        </div>
                    </div>
                </div>

                <div class="mt-4 flex justify-between">
                    <button
                        class="mr-2 bg-gray-200 hover:bg-gray-400 active:bg-gray-200 text-black font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                        @click="navigateToBack">
                        Back to Training Program List
                    </button>
                    <div class="flex gap-2">
                        <button
                            class="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                            Cancel
                        </button>
                        <button
                            class="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                            type="submit">
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </Fluid>
    </div>
</template>
