<script setup>
import ButtonComponent from '@/components/ButtonComponent.vue'
import router from '@/router'
import { useTraineeStore } from '@/stores/traineeStore'
import { convertToVietnamTime } from '@/utils/date'
import { toTypedSchema } from '@vee-validate/zod'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useField, useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { z } from 'zod'

const toast = useToast()
const traineeStore = useTraineeStore()
const trainee = ref(null)
const genderOptions = ([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
])
const genderEnum = z.enum(['Male', 'Female'])
// Validation schema using Zod
const validationSchema = toTypedSchema(
    z.object({
        name: z
            .string({ required_error: 'Name is required' })
            .trim()
            .min(1, { message: 'Name is required' })
            .max(50, { message: 'Name must not exceed 50 characters' }),
        email: z
            .string({ required_error: 'Mail is required' })
            .trim()
            .min(1, { message: 'Mail is required' })
            .regex(/^[\w-_.+]*[\w-_.]@(\w+\.)+\w+\w$/, { message: 'Invalid email address format' })
            .max(320, { message: 'Email must not exceed 320 characters' }),
        phone: z
            .string({ required_error: 'Phone Number is required' })
            .trim()
            .min(10, { message: 'Phone Number must have 10 characters' })
            .max(10, { message: 'Phone Number must not exceed 10 characters' }),
        dob: z
            .date({
                required_error: 'D.O.B is required',
                invalid_type_error: 'D.O.B is required'
            }),
        gender: genderEnum,
        gpa: z
            .number({ invalid_type_error: 'GPA must be a number' })
            .min(0, 'GPA must be greater than or equal to 0')
            .max(4.0, 'GPA must be less than or equal to 4.0'),
        address: z.optional(
            z.string()
            .trim()
            .max(100, { message: 'Address must not exceed 100 characters' }),
        ),
        nationalId: z
            .string({ required_error: 'National Id is required' })
            .trim()
            .min(12, { message: 'National Id must have 12 characters' })
            .max(12, { message: 'National Id must not exceed 12 characters' }),
        language: z.optional(z.string().trim()),
        university: z.optional(z.string().trim()),
        universityGraduationDate: z
            .date({
                required_error: 'University Graduation Date is required',
                invalid_type_error: 'University Graduation Date is required'
            })
    })
)

// Set up form validation with VeeValidate
const { handleSubmit, errors, setFieldError } = useForm({ validationSchema })
const { value: name } = useField('name')
const { value: email } = useField('email')
const { value: phone } = useField('phone')
const { value: dob } = useField('dob')
const { value: gender } = useField('gender')
const { value: gpa } = useField('gpa')
const { value: address } = useField('address')
const { value: nationalId } = useField('nationalId')
const { value: language } = useField('language')
const { value: university } = useField('university')
const { value: universityGraduationDate } = useField('universityGraduationDate')

const onSubmit = handleSubmit((values) => {
    // Prepare the request body according to the expected format
    const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        dob: convertToVietnamTime(values.dob).toString(),
        gender: values.gender,
        gpa: values.gpa,
        address: values.address || '',
        nationalId: values.nationalId,
        language: values.language || '',
        university: values.university,
        universityGraduationDate: convertToVietnamTime(values.universityGraduationDate).toString()
    }
    traineeStore.fetchUpdateTrainee(traineeId, payload).then(() => {
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Trainee Profile updated successfully',
            life: 3000
        })
        router.push('/trainee-management/trainees')

    }).catch((error) => {
        setFieldError('code', error.response.data.trainee)
    })
})


const navigateToBack = (id) => {
    router.push('/trainee-management/trainee/detail/' + id)
}

function parseDateFromString(dateString) {
    const [day, month, year] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)  // month - 1 vì tháng trong Date là 0-based
}
const route = useRoute()
const traineeId = route.params.id
onMounted(async () => {
    // Lấy chi tiết của trainee
    await traineeStore.fetchTraineeDetail(traineeId)
    trainee.value = traineeStore.trainee

    if (trainee.value) {
        // Populate form fields with the fetched training program data
        name.value = trainee.value.name || ''
        email.value = trainee.value.email || ''
        phone.value = trainee.value.phone || ''
        dob.value = parseDateFromString(trainee.value.dob) || ''
        gender.value = trainee.value.gender || ''
        gpa.value = trainee.value.gpa || ''
        address.value = trainee.value.address || ''
        nationalId.value = trainee.value.nationalId || ''
        university.value = trainee.value.university || ''
        language.value = trainee.value.language || ''
        universityGraduationDate.value = parseDateFromString(trainee.value.universityGraduationDate) || ''
    }
})
</script>

<template>
    <div class="card flex flex-col gap-6">
        <Toast />
        <Fluid>
            <div class="font-bold mb-2 block">
                <span class="font-semibold text-2xl">Edit Trainee</span>
            </div>
            <Divider />
            <form @submit.prevent="onSubmit">
                <Accordion value="0">
                    <AccordionPanel value="0">
                        <AccordionHeader class="!font-bold">General Info</AccordionHeader>
                        <AccordionContent>
                            <div class=" flex flex-col gap-4 w-full">
                                <div class="flex flex-col md:flex-row gap-4 ">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="name">
                                            Trainee Name
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <InputText id="name" v-model="name" :class="`{ 'p-invalid': errors.name }`"
                                                   placeholder="Trainee Name" type="text" />
                                    </div>

                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="email">Email
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <InputText id="email" v-model="email" :class="`{ 'p-invalid': errors.email }`"
                                                   placeholder="Email" type="text" />
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="phone">Phone
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <InputText id="phone" v-model="phone" :class="`{ 'p-invalid': errors.phone }`"
                                                   placeholder="Phone" type="text" />
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.name" class="text-red-600"> {{ errors.name }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.email" class="text-red-600 ml-2"> {{ errors.email }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.phone" class="text-red-600 ml-3"> {{ errors.phone }}</small>
                                    </div>
                                </div>

                                <div class="flex flex-col md:flex-row gap-4 ">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="gender">Gender
                                        </label>
                                        <Select id="gender" v-model="gender" :options="genderOptions" class="w-full"
                                                optionLabel="label" optionValue="value"
                                                placeholder="Select Gender"></Select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="gpa">GPA</label>
                                        <InputNumber id="gpa" v-model="gpa" :max="4" :min="0" mode="decimal"
                                                     showButtons step="0.1">
                                        </InputNumber>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="address">Address
                                        </label>
                                        <InputText id="address" v-model="address"
                                                   :class="`{ 'p-invalid': errors.address }`" placeholder="Address"
                                                   type="text" />
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row ">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.gender" class="text-red-600"> {{ errors.gender
                                            }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full ">
                                        <small v-if="errors.gpa" class="text-red-600 ml-2"> {{
                                                errors.gpa
                                            }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.address" class="text-red-600"> {{ errors.address
                                            }}</small>
                                    </div>
                                </div>

                                <div class="flex flex-col md:flex-row gap-4 ">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="nationalId">National Id
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <InputText id="nationalId" v-model="nationalId"
                                                   :class="`{ 'p-invalid': errors.nationalId }`"
                                                   placeholder="National Id"
                                                   type="text" />
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="language">Language
                                        </label>
                                        <InputText id="language" v-model="language"
                                                   :class="`{ 'p-invalid': errors.language }`" placeholder="Language"
                                                   type="text" />
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="university">University
                                        </label>
                                        <InputText id="university" v-model="university"
                                                   :class="`{ 'p-invalid': errors.university }`"
                                                   placeholder="University"
                                                   type="text" />
                                    </div>
                                </div>

                                <div class="flex flex-col md:flex-row ">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.nationalId" class="text-red-600"> {{ errors.nationalId
                                            }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.university" class="text-red-600 ml-2"></small>
                                    </div>
                                </div>

                                <div class="flex flex-col md:flex-row gap-4">
                                    <div class="flex-auto">
                                        <label for="dob"> D.O.B
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <DatePicker v-model="dob" dateFormat="dd-mm-yy" fluid iconDisplay="input"
                                                    inputId="icondisplay" showIcon />
                                    </div>
                                    <div class="flex-auto">
                                        <label for="universityGraduationDate"> University Graduation Date
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <DatePicker v-model="universityGraduationDate" dateFormat="dd-mm-yy" fluid
                                                    iconDisplay="input" inputId="icondisplay" showIcon />
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row ">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.dob" class="text-red-600 "> {{
                                                errors.dob
                                            }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small v-if="errors.universityGraduationDate" class="text-red-600 ml-2"> {{
                                                errors.universityGraduationDate }}</small>
                                    </div>
                                </div>
                                <!--                                <div class="flex flex-wrap">-->
                                <!--                                    <label for="note">Note</label>-->
                                <!--                                    <Textarea id="note" v-model="note" rows="4" />-->
                                <!--                                </div>-->
                                <!--                                <div class="flex flex-col md:flex-row ">-->
                                <!--                                    <div class="flex flex-wrap gap-2 w-full">-->
                                <!--                                        <small class="text-red-600 pt-1" v-if="errors.note"> {{ errors.note }}</small>-->
                                <!--                                    </div>-->
                                <!--                                </div>-->
                            </div>
                        </AccordionContent>
                    </AccordionPanel>
                    <AccordionPanel value="0">
                        <AccordionHeader class="!font-bold">Entry Info</AccordionHeader>
                        <!--                        <AccordionContent>-->
                        <!--                            <label for="classAdmin"> Group Admin-->
                        <!--                                <i class="text-red-600">*</i>-->
                        <!--                            </label>-->
                        <!--                            <MultiSelect v-model="classAdmins" :options="classAdminOptions" optionLabel="account" filter-->
                        <!--                                         id="classAdminOptions" :maxSelectedLabels="3" placeholder="Select Admin"-->
                        <!--                                         class="w-full md:w-80 mt-2" />-->
                        <!--                            <small class="text-red-600 " v-if="errors.classAdminOptions"> {{-->
                        <!--                                    errors.classAdminOptions-->
                        <!--                                }}</small>-->
                        <!--                        </AccordionContent>-->
                    </AccordionPanel>
                </Accordion>


                <div class="mt-4 flex justify-between">
                    <ButtonComponent :onClick="navigateToBack" activeColor="active:bg-gray-300" bgColor="bg-white"
                                     hoverColor="hover:bg-gray-200" màu text="Back to Trainee Info" đen />
                    <div class="flex gap-2">
                        <button
                            class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                            type="submit">
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </Fluid>
        <Dialog v-model:visible="visible" :style="{ width: '34rem' }" header="Plan Group" modal>
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Are you sure you want to save this planning
                Group?</span>
            <form @submit.prevent="onSubmits">
                <div class="flex flex-col gap-2">
                    <div class="flex flex-col gap-2">
                        <label for="account">Group Code<i class="text-red-600">*</i></label>
                        <InputText id="classCode" v-model="classCode" :class="`{ 'p-invalid': finalError.classCode }`"
                                   type="text" />
                        <small v-if="finalError.classCode" class="text-red-600">{{ finalError.classCode }}</small>
                    </div>
                </div>
                <div class="flex justify-end mt-4">
                    <ButtonComponent :onClick="closePopupForPlaining" activeColor="active:bg-gray-300"
                                     bgColor="bg-white text-red-500" hoverColor="hover:bg-gray-200" text="Cancel" />
                    <button
                        class=" bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                        type="submit">
                        Save
                    </button>
                </div>
            </form>
        </Dialog>
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
