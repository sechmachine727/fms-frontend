<script setup>
import ButtonComponent from '@/components/ButtonComponent.vue'
import router from '@/router'
import { useDepartmentStore } from '@/stores/departmentStore'
import { useTechnicalGroupStore } from '@/stores/technicalGroupStore'
import { useTopicStore } from '@/stores/topicStore'
import { useTrainingProgramStore } from '@/stores/trainingProgramStore'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from 'primevue/usetoast'
import { useField, useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { z } from 'zod'

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
            .min(1, { message: 'Code is required' })
            .max(20, { message: 'Code must not exceed 20 characters' }),
        // version: z
        //     .string({ required_error: 'Version is required' })
        //     .min(1, { message: 'Version is required' }),
        trainingProgramName: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name is required' })
            .max(30, { message: 'Name must not exceed 30 characters' }),
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
                value: z.number()
            })),
            z.array(z.object({
                label: z.string(),
                value: z.number()
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
const { value: description } = useField('description')
const { value: topicData } = useField('topicData')

const onSubmit = handleSubmit((values) => {
    const currentVersion = trainingProgram.value.version  // Assuming this is fetched from the store or API
    const newVersion = parseInt(currentVersion) + 1
    // Prepare the request body according to the expected format
    const payload = {
        trainingProgramName: values.trainingProgramName,
        code: values.code,
        departmentId: values.department.id,  // Extract department ID
        version: newVersion,
        description: values.description || '',  // Ensure description is not undefined
        technicalGroupId: values.technicalGroupCode.id,  // Extract technical group ID
        topicIds: values.topicData[1].map(topic => topic.value)
    }
    trainingProgramStore.fetchUpdateTrainingProgram(trainingProgramId, payload).then(() => {
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Training Program updated successfully',
            life: 3000
        })
        router.push('/content-management/training-program')

    }).catch((error) => {
        setFieldError('code', error.response.data.trainingProgram)
    })
})


const navigateToBack = () => {
    router.push('/content-management/training-program')
}

const onChange = (value) => {
    topicData.value[0] = value[0]
    topicData.value[1] = value[1]
}
const allTopics = ref(null)
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
        department.value = trainingProgram.value.department || ''
        technicalGroupCode.value = trainingProgram.value.technicalGroup || {}
        // Lấy danh sách topic đã chọn từ topicInfoList
        const selectedTopics = trainingProgram.value.topicInfoList.map(topic => ({
            label: `${topic.topicCode} - ${topic.topicName} - ${topic.version}`,
            value: topic.id,
        }))
        // Lấy tất cả các topic từ store
        await topicStore.fetchActiveTopics()
        allTopics.value = topicStore.topics.map(topic => ({
            label: `${topic.code} - ${topic.name} - ${topic.version}`,
            value: topic.id,
        }));

        // Lọc các topic chưa chọn
        const selectedTopicValues = selectedTopics.map(topic => topic.value) // lấy các giá trị đã chọn
        const availableTopics = allTopics.value.filter(topic => !selectedTopicValues.includes(topic.value))

        // Đặt dữ liệu cho PickList (topic chưa chọn và những topic đã chọn)
        topicData.value = [availableTopics, selectedTopics]
    }

    // Fetch technical groups and departments for dropdowns
    await technicalGroupStore.fetchTechnicalGroup()
    technicalGroupCodeOptions.value = technicalGroupStore.technicalGroups

    await departmentStore.fetchDepartments()
    departments.value = departmentStore.departments
});

const handleChange = (event) => {
    const search = event.target.value;
    const sourceData = allTopics.value.filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
    const targetData = topicData.value[1].map(item => item.value)
    const filteredData = sourceData.filter(item => !targetData.includes(item.value));
    topicData.value[0] = filteredData
};
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
                    <div class="flex-grow-[4]">

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

                    <div class="flex-grow-[6]">
                        <div class="mt-5">
                            <label for="topicData">
                                Topic
                                <i class="text-red-600">*</i>
                            </label>
                            <div class="responsive-div">
                                <InputText class="h-10 w-full" @input="handleChange" type="text" id="search"
                                    placeholder="Choose or Search a Topic" />
                            </div>
                            <PickList style="width: 100%; height: 350px;" v-model="topicData" breakpoint="1400px"
                                class="mt-3" scrollHeight="25rem" dataKey=" value" @update:modelValue="onChange">
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
                    <ButtonComponent text="Back to Training Program List" bgColor="bg-white"
                        hoverColor="hover:bg-gray-200" activeColor="active:bg-gray-300" màu đen
                        :onClick="navigateToBack" />
                    <div class="flex gap-2">
                        <button
                            class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                            type="submit">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </Fluid>
    </div>
</template>
<style scoped>
@media (max-width: 1400px) {
    .responsive-div {
        width: 100%;
        margin-left: 0;
    }
}

@media (min-width: 1401px) and (max-width: 1528px) {
    .responsive-div {
        width: 39%;
        margin-left: 6.5%;
    }
}

@media (min-width: 1529px) and (max-width: 1909px) {
    .responsive-div {
        width: 38.5%;
        margin-left: 7%;
    }
}

@media (min-width: 1909px) {
    .responsive-div {
        width: 41.5%;
        margin-left: 5%;
    }
}
</style>