<script setup>
import router from "@/router";
import { useDeliveryTypeStore } from "@/stores/deliveryTypeStore";
import { useFormatTypeStore } from "@/stores/formatTypeStore";
import { useClassStore } from "@/stores/groupStore";
import { useKeyProgramStore } from "@/stores/keyProgramStore";
import { useLocationStore } from "@/stores/locationStore";
import { useScopeStore } from "@/stores/scopeStore";
import { useSiteStore } from "@/stores/siteStore";
import { useTechnicalGroupStore } from "@/stores/technicalGroupStore";
import { useTraineeTypeStore } from "@/stores/traineeTypeStore";
import { useTrainingProgramStore } from "@/stores/trainingProgramStore";
import { useUserStore } from "@/stores/userStore";
import { convertToVietnamTime } from "@/utils/date";
import { generateClassCode } from "@/utils/generate";
import { toTypedSchema } from "@vee-validate/zod";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useField, useForm } from "vee-validate";
import { onMounted, ref } from "vue";
import { z } from "zod";

const deliveryTypeOptions = ref([]);
const traineeTypeOptions = ref([]);
const formatTypeOptions = ref([]);
const technicalGroupOptions = ref([])
const trainingProgramOptions = ref();
const siteOptions = ref([]);
const locationOptions = ref([]);
const scopeOptions = ref([]);
const keyProgramOptions = ref([]);
const classAdminOptions = ref([]);
const visible = ref(false);
const assignedVisible = ref(false);
const statusClass = ref(null)


const locationStore = useLocationStore();
const siteStore = useSiteStore();
const traineeTypeStore = useTraineeTypeStore();
const deliveryTypeStore = useDeliveryTypeStore();
const formatTypeStore = useFormatTypeStore();
const technicalGroupStore = useTechnicalGroupStore();
const trainingProgramStore = useTrainingProgramStore();
const scopeStore = useScopeStore();
const keyProgramStore = useKeyProgramStore();
const userStore = useUserStore();
const classStore = useClassStore();
onMounted(() => {
    keyProgramStore.fetchPrograms().then(() => {
        keyProgramOptions.value = keyProgramStore.keyPrograms;
    })
    technicalGroupStore.fetchTechnicalGroup().then(() => {
        technicalGroupOptions.value = technicalGroupStore.technicalGroups
    })
    traineeTypeStore.fectchTraineeTypes().then(() => {
        traineeTypeOptions.value = traineeTypeStore.traineeTypes;
    })
    formatTypeStore.fetchformatTypes().then(() => {
        formatTypeOptions.value = formatTypeStore.formatTypes;
    })
    scopeStore.fetchScopes().then(() => {
        scopeOptions.value = scopeStore.scopes;
    })
    siteStore.fetchSites().then(() => {
        siteOptions.value = siteStore.sites;
    })
    deliveryTypeStore.fetchDeliveryTypes().then(() => {
        deliveryTypeOptions.value = deliveryTypeStore.deliveryTypes;
    })
    userStore.fetchClassAdmins().then(() => {
        classAdminOptions.value = userStore.classAdmins;
    })
})

const handleTechnicalGroupChange = () => {
    let technicalId = technicalGroup.value.id;
    trainingProgramStore.fetchTrainingPrograms(technicalId).then(() => {
        trainingProgramOptions.value = trainingProgramStore.trainingPrograms
    })
}

const handleSiteChange = () => {
    let siteId = site.value.id;
    locationStore.fecthLocationsBySite(siteId).then(() => {
        locationOptions.value = locationStore.locations
    })
}
const handleForm = ref({
    status: false,
    formatType: ""
})
const handleFormtTypeandStatus = (status, formtType) => {
    handleForm.value.status = status;
    handleForm.value.formatType = formtType;
}




// Validation schema using Zod
const validationSchema = toTypedSchema(
    z.object({
        className: z
            .string({ required_error: 'Class Name is required' })
            .min(1, { message: "Class Name is required" }),
        deliveryType: z
            .object({
                id: z.number({ required_error: "Delivery Type is required" }).min(1, { message: "Delivery Type is required" }),
            }),
        traineeType: z
            .object({
                id: z.number({ required_error: "Trainee Type is required" }).min(1, { message: "Trainee Type is required" })
            }),
        formatType: z
            .object({
                id: z.number({ required_error: "Format Type is required" }).min(1, { message: "Format Type is required" }),
            }),
        technicalGroup: z
            .object({
                id: z.number({ required_error: "Technical Group is required" }).min(1, { message: "Technical Group is required" })
            }),
        trainingProgram: z
            .object({
                id: z.number({ required_error: "Training Program is required" }).min(1, { message: "Training Program is required" })
            }),
        site: z
            .object({
                id: z.number({ required_error: "Site is required" }).min(1, { message: "Site is required" })
            }),
        location: z
            .object({
                id: z.number({ required_error: "Location is required" }).min(1, { message: "Location is required" })
            }),
        scope: z
            .object({
                id: z.number({ required_error: "Scope is required" }).min(1, { message: "Scope is required" })
            }),
        plannedTrainee: z
            .number({
                required_error: "PlannedTrainee is required",
                invalid_type_error: "PlannedTrainee is required",
            })
            .positive({ message: "PlannedTrainee is required" })
        ,
        planRevenue: z
            .number({
                required_error: "PlanRevenue is required",
                invalid_type_error: "PlanRevenue is required",
            })
            .positive({ message: "PlanRevenue is required" }),
        keyProgram: z
            .object({
                id: z.number({ required_error: "Key Program is required" }).min(1, { message: "Key Program is required" })
            }),
        expectedStart: z
            .date({
                required_error: "Expectedt Start Date is required",
                invalid_type_error: "Expectedt Start Date is required",
            })
            .refine((date) => date instanceof Date, { message: "Expected Start Date is required" }),
        expectedEnd: z
            .date({
                required_error: "Expectedt Start Date is required",
                invalid_type_error: "Expectedt Start Date is required!",
            })
            .refine((date) => date instanceof Date, { message: "Expected End Date is required" }),
        note: z
            .string()
            .optional(),
        classAdminOptions: z.preprocess(
            (val) => (val === undefined || val === null ? [] : val),
            z.array(
                z.object({
                    id: z.number().min(1, { message: "Class Admin code is required" })
                })
            ).min(1, { message: "Class Admin is required" })
        ),
    })
);


// Set up form validation with VeeValidate
const { handleSubmit: handleSubmit, errors: errors } = useForm({ validationSchema });
const { value: classAdmins } = useField("classAdminOptions")
const { value: className } = useField("className");
const { value: deliveryType } = useField("deliveryType");
const { value: formatType } = useField("formatType");
const { value: traineeType } = useField("traineeType");
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
const data = ref(null);
const onSubmit = handleSubmit((values) => {
    data.value = convertToSchema(values);
    data.value.expectedStartDate = convertToVietnamTime(values.expectedStart).toString(),
        data.value.expectedEndDate = convertToVietnamTime(values.expectedEnd).toString(),
        classCode.value = generateClassCode(deliveryType.value.deliveryTypeName, formatType.value.formatTypeName, technicalGroup.value.code)
    if (handleForm.value.formatType === "Planning") {
        data.value.status = "Planning";
        visible.value = true;
    } else if (handleForm.value.formatType === "Assigned") {
        data.value.status = "Assigned";
        assignedVisible.value = true;
    }
});

const validationSchemaCode = toTypedSchema(
    z.object({
        classCode: z
            .string({ required_error: 'Class Name is required' })
            .min(1, { message: "Class Name is required" }),
    })
);
const { handleSubmit: handleSubmitcode, errors: finalError } = useForm({ validationSchema: validationSchemaCode });
const { value: classCode } = useField("classCode")
const toast = useToast();
const onSubmits = handleSubmitcode((values) => {
    data.value.groupCode = values.classCode
    visible.value = false;
    assignedVisible.value = false;
    classStore.fetchAddGroup(data.value).then(() => {
        console.log();
        sessionStorage.setItem('toastMessage', JSON.stringify({
            severity: 'success',
            summary: 'Data saved successfully with class code ' + values.classCode,
            life: 4000
        }));
        router.push("/group-management/list")
    }).catch((errors) => {
        console.log(errors.response.data);
        toast.add({ severity: 'error', summary: errors.response.data, life: 4000 });
    })
});





function convertToSchema(data) {
    return {
        groupName: data.className || "",
        traineeNumber: data.plannedTrainee || 0,
        groupCode: "",
        trainingProgramId: data.trainingProgram?.id || 0,
        siteId: data.site?.id || 0,
        expectedStartDate: "",
        expectedEndDate: "",
        planRevenue: data.planRevenue || 0,
        deliveryTypeId: data.deliveryType?.id || 0,
        locationId: data.location?.id || 0,
        traineeTypeId: data.traineeType?.id || 0,
        scopeId: data.scope?.id || 0,
        formatTypeId: data.formatType?.id || 0,
        keyProgramId: data.keyProgram?.id || 0,
        note: data.note || "",
        status: statusClass.value,
        assignedUserIds: data.classAdminOptions.map(option => option.id) || [0]
    };
}

</script>

<template>
    <div class="card flex flex-col gap-6">
        <Toast />
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
                                            optionLabel="deliveryTypeName" placeholder="Select One"
                                            class="w-full"></Select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="TraineeType">Trainee Type
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="TraineeType" v-model="traineeType" :options="traineeTypeOptions"
                                            optionLabel="traineeTypeName" placeholder="Select One"
                                            class="w-full"></Select>
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
                                            optionLabel="formatTypeName" placeholder="Select One"
                                            class="w-full"></Select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="TechnicalGroup">Technical Group
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="TechnicalGroup" v-model="technicalGroup"
                                            :options="technicalGroupOptions" @change="handleTechnicalGroupChange"
                                            optionLabel="code" placeholder="Select One" class="w-full"></Select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="TrainingProgram">Training Program
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="TrainingProgram" v-model="trainingProgram"
                                            :options="trainingProgramOptions" optionLabel="trainingProgramNameVersion"
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
                                        <Select id="Site" v-model="site" @change="handleSiteChange"
                                            :options="siteOptions" optionLabel="siteName" placeholder="Select One"
                                            class="w-full"></Select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="Location">Location
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="Location" v-model="location" :options="locationOptions"
                                            optionLabel="locationName" placeholder="Select One" class="w-full"></Select>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="Scope">Scope
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="Scope" v-model="scope" :options="scopeOptions"
                                            optionLabel="scopeName" placeholder="Select One" class="w-full"></Select>
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
                                        <InputNumber v-model="plannedTrainee" :min="0" :max="200" showButtons
                                            mode="decimal">
                                        </InputNumber>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="PlannedRevenue">Planned Revenue
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <InputNumber v-model="planRevenue" :min="0" :max="99999999999999" showButtons
                                            mode="decimal">
                                        </InputNumber>
                                    </div>
                                    <div class="flex flex-wrap gap-2 w-full">
                                        <label for="Location">Key Program
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <Select id="Location" v-model="keyProgram" :options="keyProgramOptions"
                                            optionLabel="keyProgramName" placeholder="Select One"
                                            class="w-full"></Select>
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
                                        <DatePicker v-model="expectedStart" :max-date="expectedEnd"
                                            dateFormat="yy-mm-dd" showIcon fluid iconDisplay="input"
                                            inputId="icondisplay" />
                                    </div>
                                    <div class="flex-auto">
                                        <label for="expectedEnd"> Expected End Date
                                            <i class="text-red-600">*</i>
                                        </label>
                                        <DatePicker v-model="expectedEnd" :min-date="expectedStart"
                                            dateFormat="yy-mm-dd" showIcon fluid iconDisplay="input"
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
                            <MultiSelect v-model="classAdmins" :options="classAdminOptions" optionLabel="account" filter
                                placeholder="Select Class Admins" id="classAdminOptions" :maxSelectedLabels="3"
                                class="w-full md:w-80" />
                            <small class="text-red-600 " v-if="errors.classAdminOptions"> {{
                                errors.classAdminOptions
                            }}</small>
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>

                <div class="mt-4">
                    <button type="submit" @click="handleFormtTypeandStatus(true, 'Planning')"
                        class="mr-2 bg-gray-200 hover:bg-gray-400 active:bg-gray-200 text-black font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Plan Class
                    </button>
                    <button type="submit" @click="handleFormtTypeandStatus(true, 'Assigned')"
                        class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Assign to Class Admin
                    </button>
                </div>
            </form>
        </Fluid>
        <Dialog v-model:visible="visible" modal header="Plan Class)" :style="{ width: '34rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Are you sure you want to save this planning
                class?</span>
            <form @submit.prevent="onSubmits">
                <div class="flex flex-col gap-2">
                    <div class="flex flex-col gap-2">
                        <label for="account">Class Code<i class="text-red-600">*</i></label>
                        <InputText id="classCode" :class="`{ 'p-invalid': finalError.classCode }`" v-model="classCode"
                            type="text" />
                        <small class="text-red-600" v-if="finalError.classCode">{{ finalError.classCode }}</small>
                    </div>
                </div>
                <div class="flex justify-end mt-4">
                    <button @click.prevent="visible = false"
                        class="mr-2 bg-gray-200 hover:bg-gray-400 active:bg-gray-200 text-black font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Cancel
                    </button>
                    <button type="submit"
                        class=" bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Save
                    </button>
                </div>
            </form>
        </Dialog>
        <Dialog v-model:visible="assignedVisible" modal header="Assign to class admin(s)" :style="{ width: '34rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Are you sure you want to assign class with
                the following code to class admin(s)?</span>
            <form @submit.prevent="onSubmits">
                <div class="flex flex-col gap-2">
                    <div class="flex flex-col gap-2">
                        <label for="account">Class Code<i class="text-red-600">*</i></label>
                        <InputText id="classCode" :class="`{ 'p-invalid': finalError.classCode }`" v-model="classCode"
                            type="text" />
                        <small class="text-red-600" v-if="finalError.classCode">{{ finalError.classCode }}</small>
                    </div>
                </div>
                <div class="flex justify-end mt-4">
                    <button @click.prevent="assignedVisible = false"
                        class="mr-2 bg-gray-200 hover:bg-gray-400 active:bg-gray-200 text-black font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Cancel
                    </button>
                    <button type="submit"
                        class=" bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Save
                    </button>
                </div>
            </form>
        </Dialog>
    </div>
</template>
