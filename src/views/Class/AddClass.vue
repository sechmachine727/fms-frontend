<script setup>
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import { ref } from "vue";
import { z } from "zod";

const deliveryTypeOptions = ref([
    { name: 'Online', code: 'ON' },
    { name: 'Offline', code: 'OFF' }
]);

const traineeTypeOptions = ref([
    { name: 'Fresh Graduate', code: 'FG' },
    { name: 'Experienced', code: 'EX' }
]);

const formatTypeOptions = ref([
    { name: 'In-Person', code: 'IP' },
    { name: 'Virtual', code: 'VR' }
]);

const technicalGroupOptions = ref([
    { name: 'Development', code: 'DEV' },
    { name: 'Testing', code: 'TEST' }
]);

const trainingProgramOptions = ref([
    { name: 'Program A', code: 'PA' },
    { name: 'Program B', code: 'PB' }
]);

const siteOptions = ref([
    { name: 'Site A', code: 'SA' },
    { name: 'Site B', code: 'SB' }
]);

const locationOptions = ref([
    { name: 'Location A', code: 'LA' },
    { name: 'Location B', code: 'LB' }
]);

const scopeOptions = ref([
    { name: 'Scope A', code: 'SCA' },
    { name: 'Scope B', code: 'SCB' }
]);

const keyProgramOptions = ref([
    { name: 'Key Program A', code: 'KPA' },
    { name: 'Key Program B', code: 'KPB' }
]);

const classAdmins = ref([
    { name: 'DuongPT', code: 'DPT' },
    { name: 'TungNIT', code: 'RM' },
    { name: 'AnhHK6', code: 'LDN' },
    { name: 'TrangNT3', code: 'IST' },
    { name: 'DungMT', code: 'PRS' }
]);

// Validation schema using Zod
const validationSchema = toTypedSchema(
    z.object({
        className: z
            .string({ required_error: 'Class Name is required' })
            .min(1, { message: "Class Name is required" }),
        deliveryType: z
            .object({
                code: z.string().min(1, { message: "Delivery Type is required" })
            }),
        traineeType: z
            .object({
                code: z.string().min(1, { message: "Trainee Type is required" })
            }),
        formatType: z
            .object({
                code: z.string().min(1, { message: "Format Type is required" })
            }),
        technicalGroup: z
            .object({
                code: z.string().min(1, { message: "Technical Group is required" })
            }),
        trainingProgram: z
            .object({
                code: z.string().min(1, { message: "Training Program is required" })
            }),
        site: z
            .object({
                code: z.string().min(1, { message: "Site is required" })
            }),
        location: z
            .object({
                code: z.string().min(1, { message: "Location is required" })
            }),
        scope: z
            .object({
                code: z.string().min(1, { message: "Scope is required" })
            }),
        plannedTrainee: z
            .number()
            .positive({ message: "Planned Trainee must be a positive number" })
        ,
        planRevenue: z
            .number()
            .positive({ message: "Planned Revenue must be a positive number" }),
        keyProgram: z
            .object({
                code: z.string().min(1, { message: "Key Program is required" })
            }),
        expectedStart: z
            .date()
            .refine((date) => date instanceof Date, { message: "Expected Start Date is required" }),
        expectedEnd: z
            .date()
            .refine((date) => date instanceof Date, { message: "Expected End Date is required" }),
        note: z
            .string()
            .optional(),
        classAdminOptions: z
            .array(z.object({
                code: z.string().min(1, { message: "Class Admin is required" })
            }))
            .nonempty({ message: "At least one Class Admin must be selected" })
    })
);

// Set up form validation with VeeValidate
const { handleSubmit, errors } = useForm({ validationSchema });
const { value: classAdminOptions } = useField("classAdminOptions")
const { value: className } = useField("className");
const { value: deliveryType } = useField("deliveryType");
const { value: traineeType } = useField("traineeType");
const { value: formatType } = useField("formatType");
const { value: technicalGroup } = useField("technicalGroup");
const { value: trainingProgram } = useField("trainingProgram");
const { value: site } = useField("site");
const { value: location } = useField("location");
const { value: scope } = useField("scope");
const { value: plannedTrainee } = useField("plannedTrainee");
const { value: planRevenue } = useField("planRevenue");
const { value: keyProgram } = useField("keyProgram");
const { value: expectedStart } = useField("expectedStart");
const { value: expectedEnd } = useField("expectedEnd");
const { value: note } = useField("note");

const onSubmit = handleSubmit((values) => {
    console.log("Form values:", values);
});
</script>

<template>
    <div class="card flex flex-col gap-6">

        <Fluid>
            <div class="font-bold mb-2 block">
                <span class="font-semibold text-2xl">Add Class</span>
            </div>
            <Divider />

            <form @submit.prevent="onSubmit">
                <Accordion value="0">
                    <AccordionPanel value="0">
                        <AccordionHeader class="!font-bold">General Information</AccordionHeader>
                        <AccordionContent>
                            <div class=" flex flex-col gap-4 w-full">
                                <div class="flex flex-col md:flex-row gap-4 ">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="classname">
                                            Class Name
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <InputText id="classname" placeholder="Class Name"
                                            :class="`{ 'p-invalid': errors.className }`" v-model="className"
                                            type="text" />
                                    </div>

                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="DeliveryType">Delivery Type
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="DeliveryType" v-model="deliveryType" :options="deliveryTypeOptions"
                                            optionLabel="name" placeholder="Select One" class="w-full"></Select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="TraineeType">Trainee Type
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="TraineeType" v-model="traineeType" :options="traineeTypeOptions"
                                            optionLabel="name" placeholder="Select One" class="w-full"></Select>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small class="text-red-600" v-if="errors.className"> {{ errors.className
                                            }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small class="text-red-600 ml-2" v-if="errors.deliveryType"> {{
                                            errors.deliveryType
                                        }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small class="text-red-600 ml-3" v-if="errors.traineeType"> {{
                                            errors.traineeType }}</small>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row gap-4 ">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="FormatType">Format Type
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="FormatType" v-model="formatType" :options="formatTypeOptions"
                                            optionLabel="name" placeholder="Select One" class="w-full"></Select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="TechnicalGroup">Technical Group
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="TechnicalGroup" v-model="technicalGroup"
                                            :options="technicalGroupOptions" optionLabel="name" placeholder="Select One"
                                            class="w-full"></Select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="TrainingProgram">Training Program
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="TrainingProgram" v-model="trainingProgram"
                                            :options="trainingProgramOptions" optionLabel="name"
                                            placeholder="Select One" class="w-full"></Select>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row ">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small class="text-red-600" v-if="errors.formatType"> {{ errors.formatType
                                            }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full ">
                                        <small class="text-red-600 ml-2" v-if="errors.technicalGroup"> {{
                                            errors.technicalGroup
                                        }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small class="text-red-600 ml-2" v-if="errors.trainingProgram"> {{
                                            errors.trainingProgram
                                        }}</small>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row gap-4 ">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="Site">Site
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="Site" v-model="site" :options="siteOptions" optionLabel="name"
                                            placeholder="Select One" class="w-full"></Select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="Location">Location
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="Location" v-model="location" :options="locationOptions"
                                            optionLabel="name" placeholder="Select One" class="w-full"></Select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="Scope">Scope
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="Scope" v-model="scope" :options="scopeOptions" optionLabel="name"
                                            placeholder="Select One" class="w-full"></Select>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row ">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small class="text-red-600" v-if="errors.site"> {{ errors.site }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small class="text-red-600 ml-2" v-if="errors.location"> {{ errors.location
                                            }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small class="text-red-600 ml-2" v-if="errors.scope"> {{ errors.scope }}</small>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row gap-4">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="PlannedRevenue">Planned Trainee No
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <InputNumber v-model="plannedTrainee" showButtons mode="decimal"></InputNumber>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="PlannedRevenue">Planned Revenue
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <InputNumber v-model="planRevenue" showButtons mode="decimal"></InputNumber>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="Location">Key Program
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="Location" v-model="keyProgram" :options="keyProgramOptions"
                                            optionLabel="name" placeholder="Select One" class="w-full"></Select>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row ">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small class="text-red-600 " v-if="errors.plannedTrainee"> {{
                                            errors.plannedTrainee
                                        }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small class="text-red-600 ml-2" v-if="errors.planRevenue"> {{
                                            errors.planRevenue }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small class="text-red-600 ml-2" v-if="errors.keyProgram"> {{ errors.keyProgram
                                            }}</small>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row gap-4">
                                    <div class="flex-auto">
                                        <label for="expectedStart"> Expected Start Date
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <DatePicker v-model="expectedStart" showIcon fluid iconDisplay="input"
                                            inputId="icondisplay" />
                                    </div>
                                    <div class="flex-auto">
                                        <label for="expectedEnd"> Expected End Date
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <DatePicker v-model="expectedEnd" showIcon fluid iconDisplay="input"
                                            inputId="icondisplay" />
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row ">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small class="text-red-600 " v-if="errors.expectedStart"> {{
                                            errors.expectedStart
                                        }}</small>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small class="text-red-600 ml-2" v-if="errors.expectedEnd"> {{
                                            errors.expectedEnd }}</small>
                                    </div>
                                </div>
                                <div class="flex flex-wrap">
                                    <label for="note">Note</label>
                                    <Textarea id="note" v-model="note" rows="4" />
                                </div>
                                <div class="flex flex-col md:flex-row ">
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <small class="text-red-600 pt-1" v-if="errors.note"> {{ errors.note }}</small>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionPanel>
                    <AccordionPanel value="1">
                        <AccordionHeader class="!font-bold">Resource Plaining</AccordionHeader>
                        <AccordionContent>
                            <label for="classAdmin"> Class Admin
                                <i class="text-red-600">*</i>
                            </label>
                            <MultiSelect v-model="classAdminOptions" :options="classAdmins" optionLabel="name" filter
                                placeholder="Select Cities" :maxSelectedLabels="3" class="w-full md:w-80" />
                            <small class="text-red-600 " v-if="errors.classAdminOptions"> {{
                                errors.classAdminOptions
                                }}</small>
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>

                <div class="mt-4">
                    <button type="submit"
                        class="mr-2 bg-gray-200 hover:bg-gray-400 active:bg-gray-200 text-black font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Plan Class
                    </button>
                    <button type="submit"
                        class="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Assign to Class Admin
                    </button>
                </div>
            </form>
        </Fluid>
    </div>
</template>
