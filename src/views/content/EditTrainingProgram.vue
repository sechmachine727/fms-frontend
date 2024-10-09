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
import { useToast } from 'primevue/usetoast'

const toast = useToast()
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
                id: z.number(),
                label: z.string(),
                value: z.string()
            })),
            z.array(z.object({
                id: z.number(),
                label: z.string(),
                value: z.string()
            })).nonempty({ message: 'At least one topic must be selected' }) // Second array for selected topics
        ])
    })
)

// Set up form validation with VeeValidate
const { handleSubmit, errors, setFieldError } = useForm({ validationSchema })
const { value: code } = useField('code')
const { value: version } = useField('version')
const { value: trainingProgramName } = useField('trainingProgramName')
const { value: technicalGroupCode } = useField('technicalGroupCode')
const { value: department } = useField('department')
const { value: status } = useField('status')
const { value: description } = useField('description')
const { value: topicData } = useField('topicData')

const onSubmit = handleSubmit((values) => {

    // Prepare the request body according to the expected format
    const payload = {
        trainingProgramName: values.trainingProgramName,
        code: values.code,
        departmentId: values.department.id,  // Extract department ID
        version: values.version,
        description: values.description || '',  // Ensure description is not undefined
        status: values.status ? 'Active' : 'Inactive',  // Convert boolean to "Active"/"Inactive"
        technicalGroupId: values.technicalGroupCode.id,  // Extract technical group ID
        topicIds: values.topicData[1].map(topic => topic.id)
    }
    trainingProgramStore.fetchUpdateTrainingProgram(trainingProgramId, payload).then(() => {
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Training Program added successfully',
            life: 3000
        })
        router.push('/topic-management/training-program')

    }).catch((error) => {
        console.error('Error updating training program:', error.response.data.error)
        setFieldError('code', error.response.data.trainingProgram)
        // setFieldError('version', error.message)
    })
})


const navigateToBack = () => {
    router.push('/topic-management/training-program')
}

const onChange = (value) => {
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
        technicalGroupCode.value = trainingProgram.value.technicalGroup || {}
        // Lấy danh sách topic đã chọn từ topicInfoList
        const selectedTopics = trainingProgram.value.topicInfoList.map(topic => ({
            label: `${topic.topicCode} - ${topic.topicName} - ${topic.version}`,
            value: topic.topicCode,
            id: topic.id
        }))
        // Lấy tất cả các topic từ store
        await topicStore.fetchTopics()
        const allTopics = topicStore.topics.map(topic => ({
            label: `${topic.code} - ${topic.name} - ${topic.version}`,
            value: topic.code,
            id: topic.id
        }));

        // Lọc các topic chưa chọn
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

            <Toast />

            <form :value="trainingProgram" @submit.prevent="onSubmit">
                <div class="flex gap-4">
                    <div class="flex-1 ">

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="Code">
                                    Code
                                    <i class="text-red-600">*</i>
                                </label>
                                <InputText id="Code" v-model="code" :class="`{ 'p-invalid': errors.code }`"
                                    placeholder="Code" type="text">{{ trainingProgram.code }}
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
                                <InputText id="Name" v-model="trainingProgramName"
                                    :class="`{ 'p-invalid': errors.name }`" placeholder="Name" type="text" />
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <small v-if="errors.trainingProgramName" class="text-red-600"> {{ errors.trainingProgramName
                                }}</small>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label class="block mb-2" for="technicalGroupCode"> Technical Group
                                    <i class="text-red-600">*</i>
                                </label>
                                <Select id="technicalGroupCode" v-model="technicalGroupCode"
                                    :options="technicalGroupCodeOptions" class="w-full " filter optionLabel="code"
                                    placeholder="Select Technical Group"></Select>
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
                                : 'text-yellow-600 bg-yellow-100'" class="ml-2 font-semibold px-3 py-1 rounded-full">{{
                                    status ? 'Active' : 'Inactive'
                                }}</span>
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
                    <button
                        class="mr-2 bg-gray-200 hover:bg-gray-400 active:bg-gray-200 text-black font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                        @click="navigateToBack">
                        Back to Training Program List
                    </button>
                    <div class="flex gap-2">
                        <button @click="navigateToBack"
                            class="mr-2 bg-white hover:bg-gray-100 active:bg-gray-200 text-green-500 font-semibold py-2 px-4 rounded-lg border border-green-500 transition duration-300 ease-in-out">
                            Cancel
                        </button>
                        <button
                            class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                            type="submit">
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </Fluid>
    </div>
</template>
