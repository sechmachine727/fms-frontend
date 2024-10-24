<script setup>
import ButtonComponent from '@/components/ButtonComponent.vue'
import router from '@/router'
import { useDepartmentStore } from '@/stores/departmentStore'
import { useTechnicalGroupStore } from '@/stores/technicalGroupStore'
import { useTopicStore } from '@/stores/topicStore'
import { useTrainingProgramStore } from '@/stores/trainingProgramStore'; // Import the store handling the training programs
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from 'primevue/usetoast'
import { useField, useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { z } from 'zod'

const topicStore = useTopicStore()
const technicalGroupStore = useTechnicalGroupStore()
const trainingProgramStore = useTrainingProgramStore()
const departmentStore = useDepartmentStore()
const toast = useToast()
const technicalGroupTypeOptions = ref([])
const departments = ref([])

// Validation schema using Zod
const validationSchema = toTypedSchema(
  z.object({
    code: z
      .string({ required_error: 'Code is required' })
      .min(1, { message: 'Code is required' })
      .max(20, { message: 'Code must not exceed 20 characters' }),
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, { message: 'Name is required' })
      .max(30, { message: 'Name must not exceed 30 characters' }),
    technicalGroupType: z.object({
      id: z
        .number({ required_error: 'Technical Group code is required' })
        .min(1, { message: 'Technical Group code is required' })
    }),
    status: z.boolean().default(false),
    department: z.object({
      id: z
        .number({ required_error: 'Region is required' })
        .min(1, { message: 'Region is required' })
    }),
    description: z.string().optional(),
    topicData: z.tuple([
      z.array(
        z.object({
          label: z.string(),
          value: z.number()
        })
      ),
      z
        .array(
          z.object({
            label: z.string(),
            value: z.number()
          })
        )
        .min(1, { message: 'At least one topic must be selected' })
    ])
  })
)

// Set up form validation with VeeValidate
const { handleSubmit, errors, setFieldError } = useForm({
  validationSchema
})
const { value: code } = useField('code')
const { value: name } = useField('name')
const { value: technicalGroupType } = useField('technicalGroupType')
const { value: department } = useField('department')
const { value: description } = useField('description')
const { value: topicData } = useField('topicData')

const onSubmit = handleSubmit((values) => {
  // Extract the topic IDs (assuming `id` exists in topic objects)
  const selectedTopics = values.topicData[1].map((topic) => topic.value)
  const payload = {
    trainingProgramName: values.name,
    code: values.code,
    departmentId: values.department.id,
    version: 1,
    description: values.description || '',
    technicalGroupId: values.technicalGroupType.id,
    topicIds: selectedTopics // Sending only topic IDs as per API requirement
  }
  trainingProgramStore
    .fetchAddTrainingProgram(payload)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Training Program added successfully',
        life: 3000
      })
      router.push('/content-management/training-program')
    })
    .catch((error) => {
      setFieldError('code', error.response.data.trainingProgram)
      // setFieldError('version', error.response.data.version)
    })
})

const navigateToBack = () => {
  router.push('/content-management/training-program')
}
const data = ref(null)
onMounted(() => {
  topicStore.fetchActiveTopics().then(() => {
    data.value = topicStore.topics.map((topic) => ({
      label: `[${topic.code}] ${topic.name} (${topic.version})`,
      value: topic.id
    }))
    topicData.value = [data.value, []]
  })

  technicalGroupStore.fetchTechnicalGroup().then(() => {
    technicalGroupTypeOptions.value = technicalGroupStore.technicalGroups
  })

  departmentStore.fetchDepartments().then(() => {
    departments.value = departmentStore.departments
  })
})

const onChange = (value) => {
  topicData.value[1] = value[1]
  let tartgetSource = value[1]
  const filterTopics = tartgetSource.map((topic) => {
    return {
      code: topic.label.split(']')[0].replace('[', ''),
    }
  });

  const arrIndex = [];
  if (filterTopics.length > 1) {
    for (let i = 0; i < filterTopics.length; i++) {
      for (let j = i + 1; j < filterTopics.length; j++) {
        if (filterTopics[i].code === filterTopics[j].code) {
          arrIndex.push({
            index: j,
            code: filterTopics[i].code
          });
        }
      }
    }
  }

  let arrayDuplicate = [];
  for (let key of arrIndex) {
    arrayDuplicate.push(tartgetSource[key.index]);
  }

  const displayErrors = arrIndex.filter((obj, index, self) =>
    index === self.findIndex((t) => t.code === obj.code)
  );

  for (let error of displayErrors) {
    toast.add({
      severity: 'error',
      summary: 'Duplicate',
      detail: 'The topic name ' + error.code + ' is duplicated',
      life: 4000
    });
  }

  const appendData = topicData.value[0].concat(arrayDuplicate);
  const uniqueData = appendData.filter((obj, index, self) =>
    index === self.findIndex((t) => t.value === obj.value)
  );

  topicData.value[0] = uniqueData
  topicData.value[1] = tartgetSource.filter((item) => !arrayDuplicate.includes(item));
}

const handleChange = (event) => {
  const search = event.target.value
  const sourceData = data.value.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  )
  const targetData = topicData.value[1].map((item) => item.value)
  const filteredData = sourceData.filter((item) => !targetData.includes(item.value))
  topicData.value[0] = filteredData
}
</script>

<template>
  <div class="card flex flex-col">
    <div class="font-bold  block">
      <span class="font-semibold text-2xl">Training Program Add</span>
    </div>
    <Divider />
    <Toast />
    <Fluid>
      <form @submit.prevent="onSubmit">

        <div class="flex flex-col">
          <div class="flex flex-wrap gap-4">
            <div class="flex-grow-[4]">
              <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-wrap w-full">
                  <label for="Code">
                    Code
                    <i class="text-red-600">*</i>
                  </label>
                  <InputText id="Code" v-model="code" :class="`{ 'p-invalid': errors.code }`" placeholder="Code"
                    type="text">{{ trainingProgram.code }}
                  </InputText>
                </div>
              </div>
              <div class="flex flex-wrap  w-50 h-4">
                <small v-if="errors.code" class="text-red-600"> {{ errors.code }}</small>
              </div>
              <div class="flex flex-col md:flex-row gap-4 mt-3">
                <div class="flex flex-wrap w-full">
                  <label for="Name">
                    Name
                    <i class="text-red-600">*</i>
                  </label>
                  <InputText id="Name" v-model="name" :class="`{ 'p-invalid': errors.name }`" placeholder="Name"
                    type="text" />
                </div>
              </div>
              <div class="flex flex-wrap w-50 h-4">
                <small v-if="errors.name" class="text-red-600">
                  {{ errors.name }}</small>
              </div>

              <div class="flex flex-col md:flex-row gap-4 mt-3">
                <div class="flex flex-wrap w-full">
                  <label class="block mb-2" for="technicalGroupCode">
                    Technical Group
                    <i class="text-red-600">*</i>
                  </label>
                  <Select id="technicalGroupCode" v-model="technicalGroupType" :options="technicalGroupTypeOptions"
                    class="w-full" filter optionLabel="code" placeholder="Select Technical Group"></Select>
                </div>
              </div>
              <div class="flex flex-wrap w-50 h-4">
                <small v-if="errors.technicalGroupType" class="text-red-600 ml-2">
                  {{ errors.technicalGroupType }}</small>
              </div>


              <div class="flex flex-wrap  w-full mt-3">
                <label for="department"> Region </label>
                <Select id="department" v-model="department" :options="departments" class="w-full"
                  optionLabel="departmentName" placeholder="Select One"></Select>
              </div>
              <div class="flex flex-wrap w-50 h-4">
                <small v-if="errors.department" class="text-red-600 ml-2">
                  {{ errors.department }}</small>
              </div>

              <div class="flex flex-wrap mt-3">
                <label for="Description">Description</label>
                <Textarea id="Description" v-model="description" rows="4" />
              </div>
              <div class="flex flex-wrap  w-50 h-4">
                <small v-if="errors.technicalGroupType" class="text-red-600 ml-2">
                  {{ errors.technicalGroupType }}</small>
              </div>
            </div>

            <div class="flex-grow-[6]">
              <div>
                <label for="topicData">
                  Topic
                  <i class="text-red-600">*</i>
                </label>
                <div class="responsive-div">
                  <InputText id="search" class="h-10 w-full" placeholder="Choose or Search a Topic" type="text"
                    @input="handleChange" />
                </div>
                <PickList v-model="topicData" breakpoint=" 1400px" class="mt-3" dataKey="value" scrollHeight="25rem"
                  @update:modelValue="onChange">
                  <template #option="{ option }">
                    {{ option.label }}
                  </template>
                </PickList>
              </div>
              <div class="flex flex-wrap gap-2 w-full">
                <small v-if="errors.topicData" class="text-red-600 ml-2">{{
                  errors.topicData
                }}</small>
              </div>
            </div>
          </div>
          <div class="flex mt-4 justify-between">
            <ButtonComponent :onClick="navigateToBack" activeColor="active:bg-gray-300" bgColor="bg-white"
              hoverColor="hover:bg-gray-200" màu text="Back to Training Program List" đen />
            <div class="flex gap-2">
              <button
                class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                type="submit">
                Submit
              </button>
            </div>
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
    width: 38%;
    margin-left: 7%;
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
