<script setup>
import ButtonComponent from '@/components/ButtonComponent.vue'
import router from '@/router'
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
import { convertToVietnamTime } from '@/utils/date'
import { generateClassCode } from '@/utils/generate'
import { toTypedSchema } from '@vee-validate/zod'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useField, useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
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
const visible = ref(false)
const assignedVisible = ref(false)
const statusClass = ref(null)
const classes = ref([])

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
onMounted(() => {
  classStore.fetchClassList().then(() => {
    classes.value = classStore.classes
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
const handleForm = ref({
  status: false,
  formatType: ''
})
const handleFormtTypeandStatus = (status, formtType) => {
  handleForm.value.status = status
  handleForm.value.formatType = formtType
}

const closePopup = () => {
  assignedVisible.value = false
}

const closePopupForPlaining = () => {
  visible.value = false
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
  data.value.expectedStartDate = convertToVietnamTime(values.expectedStart).toString()
  data.value.expectedEndDate = convertToVietnamTime(values.expectedEnd).toString()
  classCode.value = generateClassCode(
    deliveryType.value.deliveryTypeName,
    formatType.value.formatTypeName,
    technicalGroup.value.code,
    classes.value
  )

  if (handleForm.value.formatType === 'Planning') {
    data.value.status = 'Planning'
    visible.value = true
  } else if (handleForm.value.formatType === 'Assigned') {
    data.value.status = 'Assigned'
    assignedVisible.value = true
  }
})

const validationSchemaCode = toTypedSchema(
  z.object({
    classCode: z
      .string({ required_error: 'Group Code is required' })
      .trim()
      .min(1, { message: 'Group Code is required' })
      .max(50, { message: 'Group Code must not exceed 50 characters' })
  })
)
const {
  handleSubmit: handleSubmitcode,
  errors: finalError,
  setFieldError
} = useForm({ validationSchema: validationSchemaCode })
const { value: classCode } = useField('classCode')
const toast = useToast()
const onSubmits = handleSubmitcode((values) => {
  data.value.groupCode = values.classCode
  assignedVisible.value = false
  classStore
    .fetchAddGroup(data.value)
    .then(() => {
      sessionStorage.setItem(
        'toastMessage',
        JSON.stringify({
          severity: 'success',
          summary: 'Data saved successfully with class code ' + values.classCode,
          life: 4000
        })
      )
      visible.value = false
      router.push('/group-management/list')
    })
    .catch((errors) => {
      if (errors.status === 400) {
        if (errors.response.data.groupCode) {
          setFieldError('classCode', errors.response.data.groupCode)
        }
      } else {
        toast.add({ severity: 'error', summary: errors.response.data.error, life: 4000 })
      }
    })
})

function convertToSchema(data) {
  return {
    groupName: data.className || '',
    groupCode: '',
    traineeNumber: data.plannedTrainee || 0,
    trainingProgramId: data.trainingProgram?.id || 0,
    technicalGroupId: data.technicalGroup?.id || 0,
    siteId: data.site?.id || 0,
    locationId: data.location?.id || 0,
    expectedStartDate: '',
    expectedEndDate: '',
    planRevenue: 0,
    deliveryTypeId: data.deliveryType?.id || 0,
    traineeTypeId: data.traineeType?.id || 0,
    scopeId: data.scope?.id || 0,
    formatTypeId: data.formatType?.id || 0,
    keyProgramId: data.keyProgram?.id || 0,
    note: data.note || '',
    status: statusClass.value,
    assignedUserIds: data.classAdminOptions.map((option) => option.id) || [0]
  }
}

const navigateToBack = () => {
  router.push('/group-management/list')
}
</script>

<template>
  <div class="card flex flex-col gap-6">
    <Toast />
    <Fluid>
      <div class="font-bold mb-2 block">
        <span class="font-semibold text-2xl">Add Group</span>
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
                    <InputText
                      id="classname"
                      v-model="className"
                      :class="`{ 'p-invalid': errors.className }`"
                      placeholder="Group Name"
                      type="text"
                    />
                  </div>

                  <div class="flex flex-wrap gap-2 w-full">
                    <label for="DeliveryType"
                      >Delivery Type
                      <i class="text-red-600">*</i>
                    </label>
                    <Select
                      id="DeliveryType"
                      v-model="deliveryType"
                      :options="deliveryTypeOptions"
                      class="w-full"
                      optionLabel="deliveryTypeName"
                      placeholder="Select One"
                    ></Select>
                  </div>
                  <div class="flex flex-wrap gap-2 w-full">
                    <label for="TraineeType"
                      >Trainee Type
                      <i class="text-red-600">*</i>
                    </label>
                    <Select
                      id="TraineeType"
                      v-model="traineeType"
                      :options="traineeTypeOptions"
                      class="w-full"
                      optionLabel="traineeTypeName"
                      placeholder="Select One"
                    ></Select>
                  </div>
                </div>
                <div class="flex flex-col md:flex-row">
                  <div class="flex flex-wrap gap-2 w-full">
                    <small v-if="errors.className" class="text-red-600">
                      {{ errors.className }}</small
                    >
                  </div>
                  <div class="flex flex-wrap gap-2 w-full">
                    <small v-if="errors.deliveryType" class="text-red-600 ml-2">
                      {{ errors.deliveryType }}</small
                    >
                  </div>
                  <div class="flex flex-wrap gap-2 w-full">
                    <small v-if="errors.traineeType" class="text-red-600 ml-3">
                      {{ errors.traineeType }}</small
                    >
                  </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                  <div class="flex flex-wrap gap-2 w-full">
                    <label for="FormatType"
                      >Format Type
                      <i class="text-red-600">*</i>
                    </label>
                    <Select
                      id="FormatType"
                      v-model="formatType"
                      :options="formatTypeOptions"
                      class="w-full"
                      optionLabel="formatTypeName"
                      placeholder="Select One"
                    ></Select>
                  </div>
                  <div class="flex flex-wrap gap-2 w-full">
                    <label for="TechnicalGroup"
                      >Technical Group
                      <i class="text-red-600">*</i>
                    </label>
                    <Select
                      id="TechnicalGroup"
                      v-model="technicalGroup"
                      :options="technicalGroupOptions"
                      class="w-full"
                      optionLabel="code"
                      placeholder="Select One"
                      @change="handleTechnicalGroupChange"
                    ></Select>
                  </div>
                  <div class="flex flex-wrap gap-2 w-full">
                    <label for="TrainingProgram"
                      >Training Program
                      <i class="text-red-600">*</i>
                    </label>
                    <Select
                      id="TrainingProgram"
                      v-model="trainingProgram"
                      :options="trainingProgramOptions"
                      class="w-full"
                      optionLabel="trainingProgramNameVersion"
                      placeholder="Select One"
                    ></Select>
                  </div>
                </div>
                <div class="flex flex-col md:flex-row">
                  <div class="flex flex-wrap gap-2 w-full">
                    <small v-if="errors.formatType" class="text-red-600">
                      {{ errors.formatType }}</small
                    >
                  </div>
                  <div class="flex flex-wrap gap-2 w-full">
                    <small v-if="errors.technicalGroup" class="text-red-600 ml-2">
                      {{ errors.technicalGroup }}</small
                    >
                  </div>
                  <div class="flex flex-wrap gap-2 w-full">
                    <small v-if="errors.trainingProgram" class="text-red-600 ml-2">
                      {{ errors.trainingProgram }}</small
                    >
                  </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                  <div class="flex flex-wrap gap-2 w-full">
                    <label for="Site"
                      >Site
                      <i class="text-red-600">*</i>
                    </label>
                    <Select
                      id="Site"
                      v-model="site"
                      :options="siteOptions"
                      class="w-full"
                      optionLabel="siteName"
                      placeholder="Select One"
                      @change="handleSiteChange"
                    ></Select>
                  </div>
                  <div class="flex flex-wrap gap-2 w-full">
                    <label for="Location"
                      >Location
                      <i class="text-red-600">*</i>
                    </label>
                    <Select
                      id="Location"
                      v-model="location"
                      :options="locationOptions"
                      class="w-full"
                      optionLabel="locationName"
                      placeholder="Select One"
                    ></Select>
                  </div>
                  <div class="flex flex-wrap gap-2 w-full">
                    <label for="Scope"
                      >Scope
                      <i class="text-red-600">*</i>
                    </label>
                    <Select
                      id="Scope"
                      v-model="scope"
                      :options="scopeOptions"
                      class="w-full"
                      optionLabel="scopeName"
                      placeholder="Select One"
                    ></Select>
                  </div>
                </div>
                <div class="flex flex-col md:flex-row">
                  <div class="flex flex-wrap gap-2 w-full">
                    <small v-if="errors.site" class="text-red-600"> {{ errors.site }}</small>
                  </div>
                  <div class="flex flex-wrap gap-2 w-full">
                    <small v-if="errors.location" class="text-red-600 ml-2">
                      {{ errors.location }}</small
                    >
                  </div>
                  <div class="flex flex-wrap gap-2 w-full">
                    <small v-if="errors.scope" class="text-red-600 ml-2"> {{ errors.scope }}</small>
                  </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                  <div class="flex flex-wrap gap-2 w-full">
                    <label for="PlannedRevenue"
                      >Planned Trainee No
                      <i class="text-red-600">*</i>
                    </label>
                    <InputNumber
                      v-model="plannedTrainee"
                      :max="200"
                      :min="0"
                      mode="decimal"
                      showButtons
                    >
                    </InputNumber>
                  </div>
                  <div class="flex flex-wrap gap-2 w-full">
                    <label for="Location"
                      >Key Program
                      <i class="text-red-600">*</i>
                    </label>
                    <Select
                      id="Location"
                      v-model="keyProgram"
                      :options="keyProgramOptions"
                      class="w-full"
                      optionLabel="keyProgramName"
                      placeholder="Select One"
                    ></Select>
                  </div>
                </div>
                <div class="flex flex-col md:flex-row">
                  <div class="flex flex-wrap gap-2 w-full">
                    <small v-if="errors.plannedTrainee" class="text-red-600">
                      {{ errors.plannedTrainee }}</small
                    >
                  </div>
                  <div class="flex flex-wrap gap-2 w-full">
                    <small v-if="errors.keyProgram" class="text-red-600 ml-2">
                      {{ errors.keyProgram }}</small
                    >
                  </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                  <div class="flex-auto">
                    <label for="expectedStart">
                      Expected Start Date
                      <i class="text-red-600">*</i>
                    </label>
                    <DatePicker
                      v-model="expectedStart"
                      :max-date="expectedEnd"
                      dateFormat="dd-mm-yy"
                      fluid
                      iconDisplay="input"
                      inputId="icondisplay"
                      showIcon
                    />
                  </div>
                  <div class="flex-auto">
                    <label for="expectedEnd">
                      Expected End Date
                      <i class="text-red-600">*</i>
                    </label>
                    <DatePicker
                      v-model="expectedEnd"
                      :min-date="expectedStart"
                      dateFormat="dd-mm-yy"
                      fluid
                      iconDisplay="input"
                      inputId="icondisplay"
                      showIcon
                    />
                  </div>
                </div>
                <div class="flex flex-col md:flex-row">
                  <div class="flex flex-wrap gap-2 w-full">
                    <small v-if="errors.expectedStart" class="text-red-600">
                      {{ errors.expectedStart }}</small
                    >
                  </div>
                  <div class="flex flex-wrap gap-2 w-full">
                    <small v-if="errors.expectedEnd" class="text-red-600 ml-2">
                      {{ errors.expectedEnd }}</small
                    >
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
              <MultiSelect
                id="classAdminOptions"
                v-model="classAdmins"
                :maxSelectedLabels="3"
                :options="classAdminOptions"
                class="w-full md:w-80 mt-2"
                filter
                optionLabel="account"
                placeholder="Select Admin"
              />
              <small v-if="errors.classAdminOptions" class="text-red-600">
                {{ errors.classAdminOptions }}</small
              >
            </AccordionContent>
          </AccordionPanel>
        </Accordion>

        <div class="mt-4 flex justify-between">
          <ButtonComponent
            :onClick="navigateToBack"
            activeColor="active:bg-gray-300"
            bgColor="bg-white"
            hoverColor="hover:bg-gray-200"
            màu
            text="Back to Group List"
            đen
          />
          <div class="flex gap-2">
            <button
              class="bg-white text-green-500 hover:bg-gray-200 border border-gray-300 active:bg-gray-300 py-2 px-4 rounded-lg transition duration-300 ease-in-out mr-2"
              type="submit"
              @click="handleFormtTypeandStatus(true, 'Planning')"
            >
              Plan Group
            </button>
            <button
              class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
              type="submit"
              @click="handleFormtTypeandStatus(true, 'Assigned')"
            >
              Assign to Group Admin
            </button>
          </div>
        </div>
      </form>
    </Fluid>
    <Dialog v-model:visible="visible" :style="{ width: '34rem' }" header="Plan Group" modal>
      <span class="text-surface-500 dark:text-surface-400 block mb-8"
        >Are you sure you want to save this planning Group?</span
      >
      <form @submit.prevent="onSubmits">
        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-2">
            <label for="account">Group Code<i class="text-red-600">*</i></label>
            <InputText
              id="classCode"
              v-model="classCode"
              :class="`{ 'p-invalid': finalError.classCode }`"
              type="text"
            />
            <small v-if="finalError.classCode" class="text-red-600">{{
              finalError.classCode
            }}</small>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <ButtonComponent
            :onClick="closePopupForPlaining"
            activeColor="active:bg-gray-300"
            bgColor="bg-white text-red-500"
            hoverColor="hover:bg-gray-200"
            text="Cancel"
          />
          <button
            class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </Dialog>
    <Dialog
      v-model:visible="assignedVisible"
      :style="{ width: '34rem' }"
      header="Assign to group admin(s)"
      modal
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8"
        >Are you sure you want to assign group with the following code to group admin(s)?</span
      >
      <form @submit.prevent="onSubmits">
        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-2">
            <label for="account">Group Code<i class="text-red-600">*</i></label>
            <InputText
              id="classCode"
              v-model="classCode"
              :class="`{ 'p-invalid': finalError.classCode }`"
              type="text"
            />
            <small v-if="finalError.classCode" class="text-red-600">{{
              finalError.classCode
            }}</small>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <ButtonComponent
            :onClick="closePopup"
            activeColor="active:bg-gray-300"
            bgColor="bg-white text-red-500"
            hoverColor="hover:bg-gray-200"
            text="Cancel"
          />
          <button
            class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </Dialog>
  </div>
</template>

<!-- .superRefine((data, ctx) => {
if (contractType.value.code === "Official") {
if (!email.value.endsWith("@fpt.com")) {
ctx.addIssue({
path: ['email'],
message: 'Account must be end with @fpt.com',
});
}
}
}) -->
