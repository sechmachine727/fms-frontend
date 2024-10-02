<script setup>
import router from '@/router'
import { useDepartmentStore } from '@/stores/departmentStore'
import { useRoleStore } from '@/stores/roleStore'
import { useUserStore } from '@/stores/userStore'
import { toTypedSchema } from '@vee-validate/zod'
import Toast from 'primevue/toast'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from 'primevue/usetoast'
import { useField, useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { z } from 'zod'
import UpdateUser from './UpdateUser.vue'

const visible = ref(false);
const users = ref([]);
const contractTypes = ref([
    { code: "Official", name: "Official" },
    { code: "Collaborator", name: "Collaborator" },
]);
const toast = useToast();
const roles = ref([]);
const departments = ref([]);
const searchQuery = ref("")
const overlay = ref(null);
const userStore = useUserStore();
const roleStore = useRoleStore();
const departmentStore = useDepartmentStore();
const selectedUser = ref(null);
const isDialogVisible = ref(false);
const selectedItem = ref(null);


const convertToObject = (values) => {
    return {
        account: values.account || '',
        email: values.email || '',
        employeeId: values.employeeId || '',
        status: values.status ? "Active" : "Inactive",
        contractType: values.contractType ? values.contractType.code : '',
        departmentId: values.department ? values.department.id : '',
        roles: values.rolesOptions ? values.rolesOptions.map(role => role.id) : [],
    };
};
const validationSchema = toTypedSchema(
    z.object({
        account: z
            .string({ required_error: 'Account is required' })
            .min(1, { message: "Account is required" }),
        email: z
            .string({ required_error: 'FPT Mail is required' })
            .min(1, { message: "FPT mail is required" })
            .regex(/^[\w-_.+]*[\w-_.]@(\w+\.)+\w+\w$/, { message: 'Invalid email address format' }),
        name: z
            .string({ required_error: 'Display Name is required' })
            .min(1, { message: "Class Name is required" }),
        employeeId: z
            .string({ required_error: 'Class Name is required' }),
        contractType: z
            .object({
                code: z.string({ required_error: "Contract Type is required" }).min(1, { message: "Delivery Type is required" }),
            }),
        rolesOptions: z.preprocess(
            (val) => (val === undefined || val === null ? [] : val),
            z.array(
                z.object({
                    id: z.number({
                        required_error: "Role is required",
                        invalid_type_error: "Role is required",
                    })
                })
            ).min(1, { message: "Role is required" })
        ),
        department: z
            .object({
                id: z.number({ required_error: "Department is required" }).min(1, { message: "Department is required" }),
            }),
        status: z.boolean().default(false),
    })
);
const { handleSubmit, errors, resetForm } = useForm({ validationSchema });
const { value: account } = useField("account")
const { value: email } = useField("email");
const { value: name } = useField("name");
const { value: employeeId } = useField("employeeId");
const { value: contractType } = useField("contractType");
const { value: rolesOptions } = useField("rolesOptions");
const { value: department } = useField("department");
const { value: status } = useField("status");
const confirm = useConfirm();

const onSubmit = handleSubmit((values) => {
    const convertedObject = convertToObject(values);
    userStore.fetchAddUser(convertedObject).then(() => {
        userStore.fetchUserList().then(() => {
            users.value = userStore.users;
        })
        visible.value = false;
        resetForm(); // Reset form sau khi thêm thành công
        toast.add({ severity: 'success', summary: 'User successfully added ', life: 3000 });
    }).catch((errors) => {
        if (errors.status === 400) {
            toast.add({ severity: 'error', summary: errors.response.data, life: 3000 });
        }
    })
});


const confirmActive = () => {
    confirm.require({
        message: 'Are you sure you want to activate this user?',
        header: 'Activate User',
        acceptProps: {
            label: 'Save',
            outlined: true
        },
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        accept: () => {
            userStore.fetchUpdateStatus(selectedItem.value.id).then(() => {
                toast.add({ severity: 'success', summary: 'User successfully activated', life: 3000 });
                userStore.fetchUserList().then(() => {
                    users.value = userStore.users;
                })
            }).catch((errors) => {
                if (errors.status === 400) {
                    toast.add({ severity: 'error', summary: errors.response.data, life: 3000 });
                }
            })
        },
    });
};

const confirmDeactive = () => {
    confirm.require({
        message: 'Are you sure you want to deactivate this user?',
        header: 'Deactivate User',
        acceptProps: {
            label: 'Save',
            outlined: true
        },
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        accept: () => {
            userStore.fetchUpdateStatus(selectedItem.value.id).then(() => {
                userStore.fetchUserList().then(() => {
                    users.value = userStore.users;
                })
                toast.add({ severity: 'success', summary: 'Update status success', life: 3000 });
            }).catch((errors) => {
                if (errors.status === 400) {
                    toast.add({ severity: 'error', summary: errors.response.data, life: 3000 });
                }
            })
        },
    });

}

const getStatusLabel = (status) => {
    switch (status) {
        case 'Active':
            return 'success';
        case 'Inactive':
            return 'warn';
        default:
            return null;
    }
};

const handleSearch = (event) => {
    searchQuery.value = event.target.value;
    if (searchQuery.value) {
        userStore.fetchUserList(searchQuery.value).then(() => {
            users.value = userStore.users;
            console.log(userStore.users);
        })
    }
    router.push({
        path: '/fms-settings/user-management',
        query: { q: searchQuery.value },
    });

};

const fetchData = () => {
    departmentStore.fetchDepartments().then(() => {
        departments.value = departmentStore.departments;
    })
    userStore.fetchUserList().then(() => {
        users.value = userStore.users;
    })
    roleStore.fetchRoleList().then(() => {
        roles.value = roleStore.roles;
    })
}
onMounted(() => {
    fetchData();
})



const showOptions = (event, item) => {
    selectedItem.value = item;
    overlay.value.toggle(event);
};

const handleActive = () => {
    if (selectedItem.value) {
        confirmActive();
    }
};

const handleDeactive = () => {
    if (selectedItem.value) {
        confirmDeactive();
    }
};
const handleEdit = () => {
    isDialogVisible.value = true;
    if (selectedItem.value) {
        userStore.fetchUserDetail(selectedItem.value.id).then(() => {
            selectedUser.value = userStore.user;
        })
    }
};

const handleReset = () => {
    if (selectedItem.value) {
        console.log("Resetting password for:", selectedItem.value);
    }
};

const handleUserUpdated = () => {
    fetchData();
};

</script>

<template>
    <div>
        <UpdateUser :visible="isDialogVisible" :selectedUser="selectedUser" :departments="departments"
            @userUpdated="handleUserUpdated" :roles="roles" />
        <Toast />
        <div class="card">
            <div class="text-xl mb-4 flex justify-between items-center">
                <span class="!font-semibold text-2xl">User List</span>
                <Button label="Add" @click="visible = true" icon="pi pi-plus" iconPos="right" />
            </div>
            <Divider />
            <div>
                <IconField iconPosition="left" class="w-1/4">
                    <InputText class="w-full" type="text" placeholder="Search" @keyup.enter="handleSearch" />
                    <InputIcon class="pi pi-search" />
                </IconField>
                <DataTable :rows="4" :rowsPerPageOptions="[4, 6, 12, 20, 50]" :value="users"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginator
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    tableStyle="min-width: 50rem" scrollable scrollHeight="500px" class="mt-6">
                    <Column header="No" style="min-width: 35px">
                        <template #body="slotProps">
                            {{ users.indexOf(slotProps.data) + 1 }}
                        </template>
                    </Column>
                    <Column field="employeeId" header="Employee ID" style="min-width: 150px"></Column>
                    <Column field="account" header="Account" style="min-width: 100px"></Column>
                    <Column field="contactType" header="Name" style="min-width: 90px"></Column>
                    <Column field="email" header="Email" style="min-width: 100px"></Column>
                    <Column field="department.departmentName" header="Department" style="min-width: 150px"></Column>
                    <Column header="Roles" style="min-width: 150px">
                        <template #body="slotProps">
                            <!-- slotProps.data đại diện cho dữ liệu của một user (một hàng trong bảng) -->
                            <span v-if="slotProps.data.roles && slotProps.data.roles.length">
                                <!-- Hiển thị các vai trò của user -->
                                <span v-for="(role, index) in slotProps.data.roles" :key="index">
                                    {{ role.name }}
                                    <span v-if="index < slotProps.data.roles.length - 1">, </span>
                                </span>
                            </span>

                        </template>
                    </Column>

                    <Column alignFrozen="right" field="status" frozen header="Status" style="min-width: 130px">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status" :severity="getStatusLabel(slotProps.data.status)" />
                        </template>
                    </Column>
                    <Column alignFrozen="right" frozen header="Actions" style="min-width: 50px">
                        <template #body="slotProps">
                            <Button icon="pi pi-ellipsis-v" severity="secondary"
                                @click="showOptions($event, slotProps.data)" class="p-button-text" />
                            <Popover ref="overlay">
                                <div class="flex flex-col gap-4 w-40">
                                    <ul>
                                        <li v-if="selectedItem.status === 'Inactive'"
                                            class="flex items-center gap-2 px-2 py-3  cursor-pointer rounded-border
                                    text-green-500 hover:bg-green-100 active:bg-green-100 focus:outline-none focus:ring focus:ring-green-100"
                                            severity="slotProps.data.status === 'Active' ? 'warn' : 'success'"
                                            @click="handleActive(slotProps.data)">

                                            <i class="pi pi-check"></i>
                                            Activate
                                        </li>
                                        <li v-if="selectedItem.status === 'Active'"
                                            class="flex items-center gap-2 px-2 py-3 cursor-pointer rounded-border
                                    text-orange-500 hover:bg-orange-100 active:bg-orange-100 focus:outline-none focus:ring focus:ring-orange-100"
                                            severity="danger" @click="handleDeactive(slotProps.data)">

                                            <i class="pi pi-times"></i>
                                            Deactive
                                        </li>
                                        <li class="flex items-center gap-2 px-2 py-3  cursor-pointer rounded-border
                                    text-zinc-500 hover:bg-zinc-100 active:bg-zinc-100 focus:outline-none focus:ring focus:ring-zinc-100"
                                            severity="secondary" @click="handleEdit(slotProps.data)">
                                            <i class="pi pi-pencil"></i>
                                            Edit
                                        </li>
                                        <li @click="handleReset(slotProps.data)"
                                            class="flex items-center gap-2 px-2 py-3 hover:bg-emphasis cursor-pointer rounded-border">
                                            <i class="pi pi-sync"></i> <!-- Icon cho Reset Password -->
                                            Reset Password
                                        </li>

                                    </ul>
                                </div>
                            </Popover>
                        </template>
                    </Column>
                    <!-- Custom template for no data -->
                    <template #empty>
                        <tr class="flex justify-center">
                            <td colspan="9" style="text-align: center; padding: 20px;">
                                No content available
                            </td>
                        </tr>
                    </template>
                </DataTable>
            </div>
        </div>
        <Dialog v-model:visible="visible" modal header="Add F-SOFT User" :style="{ width: '45rem' }">
            <Fluid>
                <form @submit.prevent="onSubmit">
                    <div class="flex flex-col gap-1">
                        <div class="flex flex-col gap-2">
                            <label for="account">Account<i class="text-red-600">*</i></label>
                            <InputText id="account" :class="`{ 'p-invalid': errors.account }`" v-model="account"
                                type="text" />
                            <small class="text-red-600" v-if="errors.account">{{ errors.account }}</small>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="email">FPT Email<i class="text-red-600">*</i></label>
                            <InputText id="email" :class="`{ 'p-invalid': errors.email }`" v-model="email"
                                type="text" />
                            <small class="text-red-600 " v-if="errors.email">{{ errors.email }}</small>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="name">Display Name<i class="text-red-600">*</i></label>
                            <InputText id="name" :class="`{ 'p-invalid': errors.name }`" v-model="name" type="text" />
                            <small class="text-red-600 " v-if="errors.name">{{ errors.name }}</small>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="empId">Employee ID</label>
                            <InputText id="empId" :class="`{ 'p-invalid': errors.employeeId }`" v-model="employeeId"
                                type="text" />
                            <small class="text-red-600 " v-if="errors.employeeId">{{ errors.employeeId }}</small>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="contractType">Contract Type<i class="text-red-600">*</i></label>
                            <Select id="contractType" v-model="contractType" :options="contractTypes" optionLabel="name"
                                placeholder="Select One" class="w-full"></Select>
                            <small class="text-red-600 " v-if="errors.contractType">{{ errors.contractType
                                }}</small>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="role">Role<i class="text-red-600">*</i></label>
                            <MultiSelect v-model="rolesOptions" :options="roles" optionLabel="name" filter
                                placeholder="Select Roles" id="rolesOptions" :maxSelectedLabels="3" class="w-full" />
                            <small class="text-red-600 " v-if="errors.rolesOptions">{{ errors.rolesOptions }}</small>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="department">Department<i class="text-red-600">*</i></label>
                            <Select id="department" v-model="department" :options="departments"
                                optionLabel="departmentName" placeholder="Select One" class="w-full"></Select>
                            <small class="text-red-600 " v-if="errors.department">{{ errors.department }}</small>
                        </div>
                        <div class="flex  gap-2">
                            <label for="status">Status:</label>
                            <ToggleSwitch id="status" v-model="status" />
                        </div>
                        <div class="flex justify-end mt-4">
                            <button @click.prevent="visible = false"
                                class="mr-2 bg-gray-200 hover:bg-gray-400 active:bg-gray-200 text-black font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                                Cancel
                            </button>
                            <button type="submit"
                                class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </Fluid>
        </Dialog>
        <ConfirmDialog></ConfirmDialog>
    </div>
</template>
<style>
.no-triangle::before,
.no-triangle::after {
    display: none !important;
}
</style>
