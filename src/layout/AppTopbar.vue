<script setup>
import ButtonComponent from '@/components/ButtonComponent.vue'
import { useLayout } from '@/layout/composables/layout'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import { getUserInfo } from '@/utils/token'
import { toTypedSchema } from '@vee-validate/zod'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { z } from 'zod'

const { onMenuToggle } = useLayout()

const userStore = useUserStore()
const userInfo = getUserInfo()
const visible = ref(false)
const validationSchema = toTypedSchema(
  z
    .object({
      oldPassword: z
        .string({ required_error: 'Old Password is required' })
        .min(1, { message: 'Old Password is required' })
        .max(20, { message: 'Old Password must not exceed 20 characters' }),
      newPassword: z
        .string({ required_error: 'New Password is required' })
        .min(8, { message: 'New Password must be at least 8 characters long' })
        .max(20, { message: 'New Password must not exceed 20 characters' }),
      reEnterPassword: z.string({ required_error: 'Confirm Password is required' })
    })
    .refine((data) => data.newPassword === data.reEnterPassword, {
      path: ['reEnterPassword'],
      message: 'The New and Confirm passwords must match. Please re-type them.'
    })
)

const { handleSubmit, errors, setFieldError, resetForm } = useForm({ validationSchema })
const toast = useToast()
const { value: oldPassword } = useField('oldPassword')
const { value: newPassword } = useField('newPassword')
const { value: reEnterPassword } = useField('reEnterPassword')
const onSubmit = handleSubmit((values) => {
  const payload = {
    oldPassword: values.oldPassword,
    newPassword: values.newPassword
  }
  userStore
    .fetchChangePassword(userInfo.username, payload)
    .then(() => {
      visible.value = false
      resetForm()
      toast.add({ severity: 'success', summary: 'Password successfully changed', life: 4000 })
    })
    .catch((errors) => {
      if (errors.status === 400) {
        if (errors.response.data.oldPassword) {
          setFieldError('oldPassword', errors.response.data.oldPassword)
        }
        if (errors.response.data.newPassword) {
          setFieldError('newPassword', errors.response.data.newPassword)
        }
      } else {
        toast.add({ severity: 'error', summary: errors.response.data.error, life: 4000 })
      }
    })
})

const menu = ref()
const items = ref([
  {
    label: userInfo.username,
    items: [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => {
          console.log('Profile clicked')
        }
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          localStorage.removeItem('token')
          router.push('/auth/login')
        }
      },
      {
        label: 'Change Password',
        icon: 'pi pi-pencil',
        command: () => {
          visible.value = true
        }
      }
    ]
  }
])

const toggle = (event) => {
  menu.value.toggle(event)
}

const closeDialog = () => {
  visible.value = false
  resetForm()
}
</script>

<template>
  <div class="layout-topbar">
    <Toast />
    <div class="layout-topbar-logo-container">
      <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
        <i class="pi pi-bars"></i>
      </button>
      <router-link class="layout-topbar-logo" to="#">
        <Image
          alt="Image"
          src="https://th.bing.com/th/id/OIP.BWC1rQkSdd47znCeM12YGAHaHa?rs=1&pid=ImgDetMain"
          width="50"
        />
        <span>FMS</span>
      </router-link>
    </div>
    <Menu ref="menu" :model="items" :popup="true" />
    <div class="layout-topbar-actions">
      <div class="layout-topbar-menu-content">
        <button class="layout-topbar-action" type="button" @click="toggle">
          <i class="pi pi-user"></i>
        </button>
      </div>
    </div>
  </div>
  <Dialog v-model:visible="visible" :style="{ width: '25rem' }" header="Change Password" modal>
    <form @submit.prevent="onSubmit">
      <div class="flex flex-col gap-1">
        <div class="flex flex-col gap-2">
          <label for="oldPassword">Old Password<i class="text-red-600">*</i></label>
          <InputText
            id="oldPassword"
            v-model="oldPassword"
            :class="`{ 'p-invalid': errors.oldPassword }`"
            type="password"
          />
          <small v-if="errors.oldPassword" class="text-red-600">{{ errors.oldPassword }}</small>
        </div>
        <div class="flex flex-col gap-2">
          <label for="newPassword">New Password<i class="text-red-600">*</i></label>
          <InputText
            id="newPassword"
            v-model="newPassword"
            :class="`{ 'p-invalid': errors.newPassword }`"
            type="password"
          />
          <small v-if="errors.newPassword" class="text-red-600">{{ errors.newPassword }}</small>
        </div>
        <div class="flex flex-col gap-2">
          <label for="reEnterPassword">Re- Enter Password:<i class="text-red-600">*</i></label>
          <InputText
            id="reEnterPassword"
            v-model="reEnterPassword"
            :class="`{ 'p-invalid': errors.reEnterPassword }`"
            type="password"
          />
          <small v-if="errors.reEnterPassword" class="text-red-600">{{
            errors.reEnterPassword
          }}</small>
        </div>
        <div class="flex justify-end gap-2">
          <ButtonComponent
            :onClick="closeDialog"
            activeColor="active:bg-gray-300"
            bgColor="bg-white text-red-500"
            hoverColor="hover:bg-gray-200"
            text="Cancel"
          />
          <Button label="Save" type="submit"></Button>
        </div>
      </div>
    </form>
  </Dialog>
</template>
