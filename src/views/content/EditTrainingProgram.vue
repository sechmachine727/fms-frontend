<script setup>
import { useTopicStore } from '@/stores/topicStore'
import { useTrainingProgramStore } from '@/stores/trainingProgramStore'
import { useTechnicalGroupStore } from '@/stores/technicalGroupStore'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { z } from 'zod'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useDepartmentStore } from '@/stores/departmentStore'

// const topicName = ref()
const topicStore = useTopicStore()
const trainingProgramStore = useTrainingProgramStore()
const technicalGroupStore = useTechnicalGroupStore()
const departmentStore = useDepartmentStore()

const trainingProgram = ref(null)
const technicalGroupCodeOptions = ref([])
const departments = ref([])


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
        technicalGroupCode: z
            .object({
                id: z.number({ required_error: 'Technical Group code is required' }).min(1, { message: 'Technical Group code is required' })
            }),
        status: z
            .boolean()
            .default(false),
        department: z
            .object({
                id: z.number({ required_error: 'Department is required' }).min(1, { message: 'Department is required' })
            }),
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
const { handleSubmit, errors } = useForm({ validationSchema })
const { value: code } = useField('code')
const { value: version } = useField('version')
const { value: trainingProgramName } = useField('trainingProgramName')
const { value: technicalGroupCode } = useField('technicalGroupCode')
const { value: department } = useField('department')
const { value: status } = useField('status')
const { value: description } = useField('description')
const { value: topicData } = useField('topicData')
// const { value: code } = useField('code')
// const { value: version } = useField('version')

const onSubmit = handleSubmit(async (values) => {
    try {
        await trainingProgramStore.fetchUpdateTrainingProgram(trainingProgramId, values)
        router.push('/topic-management/training-program')
    } catch (error) {
        console.error('Error updating the training program:', error)
    }
})

const navigateToBack = () => {
    router.push('/topic-management/training-program')
}

const onChange = (value) => {
    console.log('Selected Topics Changed:', value)
    topicData.value.target = value // Update the selected topics
}

const route = useRoute()
const trainingProgramId = route.params.id
onMounted(async () => {
    const route = useRoute()
    const trainingProgramId = route.params.id

    // Lấy chi tiết của chương trình đào tạo
    await trainingProgramStore.fetchTrainingProgramDetail(trainingProgramId)
    trainingProgram.value = trainingProgramStore.trainingProgram

    if (trainingProgram.value) {
        // Populate form fields with the fetched training program data
        code.value = trainingProgram.value.code || ''
        version.value = trainingProgram.value.version || ''
        trainingProgramName.value = trainingProgram.value.trainingProgramName || ''
        description.value = trainingProgram.value.description || ''
        status.value = trainingProgram.value.status === 'Active'
        department.value = trainingProgram.value.department || ''

        // Lấy danh sách topic đã chọn từ topicInfoList
        const selectedTopics = trainingProgram.value.topicInfoList.map(topic => ({
            label: `${topic.topicCode} - ${topic.topicName} - ${topic.version}`,
            value: topic.topicCode
        }))

        // Lấy tất cả các topic từ store
        await topicStore.fetchTopics()
        const allTopics = topicStore.topics.map(topic => ({
            label: `${topic.code} - ${topic.name} - ${topic.version}`,
            value: topic.code
        }));

        // Lọc các topic chưa chọn (tức là không thuộc danh sách selectedTopics)
        const selectedTopicValues = selectedTopics.map(topic => topic.value) // lấy các giá trị đã chọn
        const availableTopics = allTopics.filter(topic => !selectedTopicValues.includes(topic.value))

        // Đặt dữ liệu cho PickList (topic chưa chọn và những topic đã chọn)
        topicData.value = [availableTopics, selectedTopics]
    }

    // Fetch technical groups and departments for dropdowns
    await technicalGroupStore.fetchTechnicalGroup()
    technicalGroupCodeOptions.value = technicalGroupStore.technicalGroups

    await departmentStore.fetchDepartments()
    departments.value = departmentStore.departments
});


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

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="technicalGroupCode"> Technical Group
                                    <i class="text-red-600">*</i>
                                </label>
                                <Select id="technicalGroupCode" v-model="technicalGroupCode"
                                        :options="technicalGroupCodeOptions" class="w-full md:w-80" filter
                                        optionLabel="code" placeholder="Select Technical Group"></Select>
                                <small v-if="errors.technicalGroupCode" class="text-red-600 ml-2">
                                    {{ errors.technicalGroupCode }}</small>
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
                                    : 'text-yellow-600 bg-yellow-100'" class="ml-2 font-semibold px-3 py-1 rounded-full">{{ status ? 'Active' : 'Inactive' }}</span>
                        </div>

                        <div class="flex flex-wrap gap-2 w-full mt-3">
                            <label for="department">
                                Region
                            </label>
                            <Select id="department" v-model="department" :options="departments" class="w-full"
                                    optionLabel="departmentName" placeholder="Select One"></Select>
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
                            <PickList v-model="topicData" breakpoint="1400px" dataKey="value"
                                      @update:modelValue="onChange">
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
