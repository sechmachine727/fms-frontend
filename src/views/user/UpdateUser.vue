<script setup>
import ButtonComponent from '@/components/ButtonComponent.vue'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from 'primevue/usetoast'
import { useField, useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { z } from 'zod'

const contractTypes = ref([
  { code: 'Official', name: 'Official' },
  { code: 'Collaborator', name: 'Collaborator' }
])
const emit = defineEmits(['userUpdated'])
const userStore = useUserStore()
const handleUpdateUser = () => {
  emit('userUpdated')
}

const props = defineProps({
  visible: Boolean,
  selectedUser: Object,
  departments: Array,
  roles: Array
})

const toast = useToast()
const validationSchema = toTypedSchema(
  z
    .object({
      account: z
        .string({ required_error: 'Account is required' })
        .min(1, { message: 'Account is required' })
        .max(20, { message: 'Account must not exceed 20 characters' }),
      email: z
        .string({ required_error: 'FPT Mail is required' })
        .min(1, { message: 'FPT mail is required' })
        .regex(/^[\w-_.+]*[\w-_.]@(\w+\.)+\w+\w$/, { message: 'Invalid email address format' })
        .max(320, { message: 'Email must not exceed 320 characters' }),
      name: z
        .string({ required_error: 'Display Name is required' })
        .min(1, { message: 'Display Name is required' })
        .max(50, { message: 'User Name must not exceed 150 characters' }),
      employeeId: z
        .string({ required_error: 'Employee ID is required' })
        .max(20, { message: 'Employee ID must not exceed 20 characters' }),
      contractType: z.object({
        code: z
          .string({ required_error: 'Contract Type is required' })
          .min(1, { message: 'Contract Type is required' })
      }),
      rolesOptions: z
        .array(
          z.object({
            id: z.number({ required_error: 'Role is required' })
          })
        )
        .min(1, { message: 'Role is required' }),
      department: z.object({
        id: z
          .number({ required_error: 'Department is required' })
          .min(1, { message: 'Department is required' })
      }),
      status: z.boolean().default(false)
    })
    .superRefine((data, ctx) => {
      if (contractType.value.code === 'Official') {
        if (!email.value.endsWith('@fpt.com')) {
          ctx.addIssue({
            path: ['email'],
            message:
              contractType.value.code === 'Official' ? 'Account must be end with @fpt.com' : ''
          })
        }
      }
    })
)

const { handleSubmit, errors, resetForm, setFieldError } = useForm({ validationSchema })
const { value: account } = useField('account')
const { value: email } = useField('email')
const { value: name } = useField('name')
const { value: employeeId } = useField('employeeId')
const { value: contractType } = useField('contractType')
const { value: rolesOptions } = useField('rolesOptions')
const { value: department } = useField('department')
const { value: status } = useField('status')

const localVisible = ref(props.visible)

watch(
  () => props.selectedUser,
  (newValue) => {
    if (newValue) {
      localVisible.value = true
      account.value = newValue.account
      email.value = newValue.email
      name.value = newValue.name
      employeeId.value = newValue.employeeId
      contractType.value = contractTypes.value.find(
        (contractType) => contractType.code === newValue.contractType
      )
      rolesOptions.value = newValue.roles
      department.value = newValue.department
      status.value = newValue.status === 'Active'
    }
  },
  { immediate: true }
)

watch(
  () => props.visible,
  (newValue) => {
    localVisible.value = newValue
  }
)

const onSubmit = handleSubmit((values) => {
  const updatedUser = {
    account: values.account || '',
    email: values.email || '',
    name: values.name || '',
    employeeId: values.employeeId || '',
    status: values.status ? 'Active' : 'Inactive',
    contractType: values.contractType ? values.contractType.code : '',
    departmentId: values.department ? values.department.id : '',
    roles: values.rolesOptions ? values.rolesOptions.map((role) => role.id) : []
  }
  userStore
    .fetchUpdateUser(props.selectedUser.id, updatedUser)
    .then(() => {
      toast.add({ severity: 'success', summary: 'User successfully updated', life: 3000 })
      resetForm()
      localVisible.value = false
      handleUpdateUser()
      router.push('/fms-settings/user-management')
    })
    .catch((error) => {
      if (error.status === 400) {
        if (error.response.data.employeeId) {
          setFieldError('employeeId', error.response.data.employeeId)
        }

        if (error.response.data.account) {
          setFieldError('account', error.response.data.account)
        }

        if (error.response.data.email) {
          setFieldError('email', error.response.data.email)
        }
      } else {
        toast.add({ severity: 'error', summary: error.response.data.error, life: 3000 })
      }
    })
})

const closeDialog = () => {
  localVisible.value = false
}
</script>

<template>
  <div>
    <Dialog
      v-model:visible="localVisible"
      :style="{ width: '45rem' }"
      header="Update User"
      modal
      @update:visible="closeDialog($event)"
    >
      <Fluid>
        <form @submit.prevent="onSubmit">
          <div class="flex flex-col gap-1">
            <div class="flex flex-col gap-2">
              <label for="account">Account<i class="text-red-600">*</i></label>
              <InputText
                id="account"
                v-model="account"
                :class="`{ 'p-invalid': errors.account }`"
                type="text"
              />
              <small v-if="errors.account" class="text-red-600">{{ errors.account }}</small>
            </div>
            <div class="flex flex-col gap-2">
              <label for="email">Email<i class="text-red-600">*</i></label>
              <InputText
                id="email"
                v-model="email"
                :class="`{ 'p-invalid': errors.email }`"
                type="text"
              />
              <small v-if="errors.email" class="text-red-600">{{ errors.email }}</small>
            </div>
            <div class="flex flex-col gap-2">
              <label for="name">Display Name<i class="text-red-600">*</i></label>
              <InputText
                id="name"
                v-model="name"
                :class="`{ 'p-invalid': errors.name }`"
                type="text"
              />
              <small v-if="errors.name" class="text-red-600">{{ errors.name }}</small>
            </div>
            <div class="flex flex-col gap-2">
              <label for="empId">Employee ID</label>
              <InputText
                id="empId"
                v-model="employeeId"
                :class="`{ 'p-invalid': errors.employeeId }`"
                type="text"
              />
              <small v-if="errors.employeeId" class="text-red-600">{{ errors.employeeId }}</small>
            </div>
            <div class="flex flex-col gap-2">
              <label for="contractType">Contract Type<i class="text-red-600">*</i></label>
              <Select
                id="contractType"
                v-model="contractType"
                :options="contractTypes"
                optionLabel="name"
                placeholder="Select Contract Type"
              />
              <small v-if="errors.contractType" class="text-red-600">{{
                errors.contractType.code
              }}</small>
            </div>
            <div class="flex flex-col gap-2">
              <label for="role">Role<i class="text-red-600">*</i></label>
              <MultiSelect
                id="rolesOptions"
                v-model="rolesOptions"
                :maxSelectedLabels="3"
                :options="roles"
                class="w-full"
                filter
                optionLabel="name"
                placeholder="Select Roles"
              />
              <small v-if="errors.rolesOptions" class="text-red-600">{{
                errors.rolesOptions
              }}</small>
            </div>
            <div class="flex flex-col gap-2">
              <label for="department">Department<i class="text-red-600">*</i></label>
              <Select
                id="department"
                v-model="department"
                :options="departments"
                class="w-full"
                optionLabel="departmentName"
                placeholder="Select One"
              ></Select>
              <small v-if="errors.department" class="text-red-600">{{ errors.department }}</small>
            </div>
            <div class="flex gap-2">
              <label for="status">Status:</label>
              <ToggleSwitch id="status" v-model="status" />
            </div>
            <div class="flex justify-end mt-4">
              <ButtonComponent
                :onClick="closeDialog"
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
          </div>
        </form>
      </Fluid>
    </Dialog>
  </div>
</template>
