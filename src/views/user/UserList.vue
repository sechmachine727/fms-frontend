<script setup>
import router from '@/router'
import { useDepartmentStore } from '@/stores/departmentStore'
import { useRoleStore } from '@/stores/roleStore'
import { useUserStore } from '@/stores/userStore'
import { toTypedSchema } from '@vee-validate/zod'
import Toast from 'primevue/toast'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useField, useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { z } from 'zod'
import UpdateUser from './UpdateUser.vue'

const visible = ref(false);
const users = ref([]);
const contractTypes = ref([
    { code: "Official", name: "Official" },
    { code: "Collaborator", name: "Collaborator" },
]);

const statuses = ref([
    { id: "All", name: "All" },
    { id: "Active", name: "Active" },
    { id: "Inactive", name: "Inactive" },
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
        name: values.name || '',
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
const { handleSubmit, errors, resetForm, setFieldError } = useForm({ validationSchema });
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
        resetForm();
        toast.add({ severity: 'success', summary: 'User successfully added ', life: 3000 });
    }).catch((error) => {

        if (error.status === 400) {

            if (error.response.data.employeeId) {
                setFieldError('employeeId', error.response.data.employeeId);
            }

            if (error.response.data.account) {
                setFieldError('account', error.response.data.account);
            }

            if (error.response.data.email) {
                setFieldError('email', error.response.data.email);
            }
        } else {
            toast.add({ severity: 'error', summary: error.response.data.error, life: 3000 });
        }
    })
});


const confirmActive = (value) => {
    confirm.require({
        group: 'templating',
        message: 'Are you sure you want to activate this account.' + value.account,
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

const confirmDeactive = (value) => {
    confirm.require({
        group: 'templating',
        message: 'Are you sure you want to deactivate this account.' + value.account,
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
                toast.add({ severity: 'success', summary: 'User successfully deactivated', life: 3000 });
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

const route = useRoute(); // Khởi tạo route

const fetchData = () => {
    departmentStore.fetchDepartments().then(() => {
        departments.value = departmentStore.departments;
    })
    userStore.fetchUserList().then(() => {
        users.value = userStore.users;
        querySearchFromUrl();
    })
    roleStore.fetchRoleList().then(() => {
        roles.value = roleStore.roles;
    })
}

const querySearchFromUrl = () => {
    const getQueryFromUrl = ref(route.query.q || "");
    const getQueryActiveFromUrl = ref(route.query.active || "");
    const getQueryRoleFromUrl = ref(route.query.role || "");
    const getQueryDepartmentFromUrl = ref(route.query.department || "");
    if (getQueryFromUrl.value !== "" || getQueryActiveFromUrl.value !== ""
        || getQueryRoleFromUrl.value !== "" || getQueryDepartmentFromUrl.value !== "") {
        if (getQueryFromUrl.value !== "") {
            searchQuery.value = getQueryFromUrl.value;
        }

        if (getQueryActiveFromUrl.value !== "") {
            const value = getQueryActiveFromUrl.value;
            statusOptions.value = { id: value, name: value };
        }

        if (getQueryRoleFromUrl.value !== "") {
            const values = getQueryRoleFromUrl.value.split(',').map(role => ({ name: role }));
            const filteredRole = roles.value.filter(item1 => values.some(item2 => item1.name === item2.name));
            roleFilterOptions.value = filteredRole;
        }

        if (getQueryDepartmentFromUrl.value !== "") {
            const values = getQueryDepartmentFromUrl.value.split(',').map(department => ({ departmentName: department }));
            const filteredDepartment = departments.value.filter(item1 => values.some(item2 => item1.departmentName === item2.departmentName));
            departmentOptionsSearch.value = filteredDepartment;
        }
        applyFilters()
    }
}


onMounted(() => {
    fetchData();
})




const roleFilterOptions = ref([])
const departmentOptionsSearch = ref([]);
const statusOptions = ref("");
const buildQueryObject = () => {
    const query = {};

    if (searchQuery.value) {
        query.q = searchQuery.value;
    }
    if (roleFilterOptions.value.length > 0) {
        const roles = roleFilterOptions.value.map(role => role.name);
        query.role = roles.join(',');
    }
    if (departmentOptionsSearch.value.length > 0) {
        const departmentNames = departmentOptionsSearch.value.map(department => department.departmentName);
        query.department = departmentNames.join(',');
    }
    if (statusOptions.value && statusOptions.value.id !== "All") {
        query.active = statusOptions.value.name; // Adjust this to match your status logic
    }

    return query;
};

const applyFilters = () => {
    const criteria = {
        searchQuery: searchQuery.value,
        rolesOptions: roleFilterOptions.value,
        departmentOptionsSearch: departmentOptionsSearch.value,
        statusOptions: statusOptions.value,
    };
    userStore.fetchFilterUsers(criteria)
    users.value = userStore.filterUsers
};
const updateQueryParams = () => {
    // Push the constructed query object to the router
    const query = buildQueryObject();
    router.push({
        path: '/fms-settings/user-management',
        query: query,
    });
    applyFilters()
};




const handleSearch = () => {
    updateQueryParams();
};

const handleRoleChange = () => {
    updateQueryParams();
}

const handleDepartmentChange = () => {
    updateQueryParams();
}

const handleStatusChange = () => {
    updateQueryParams();
}
const showOptions = (event, item) => {
    selectedItem.value = item;
    overlay.value.toggle(event);
};

const handleActive = () => {
    if (selectedItem.value) {
        confirmActive(selectedItem.value);
    }
};

const handleDeactive = () => {
    if (selectedItem.value) {
        confirmDeactive(selectedItem.value);
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
                <span class="!font-semibold text-xl">User List</span>
                <Button label="Add" @click="visible = true" />
            </div>
            <Divider />
            <div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-col w-60 mt-1 gap-2">
                        <label for="contractType" class="w-60">Active</label>
                        <Select id="contractType" v-model="statusOptions" :options="statuses" optionLabel="name"
                            placeholder="Filter status" @change="handleStatusChange" class="w-full"></Select>
                    </div>
                    <div class="flex flex-wrap w-60 gap-2">
                        <label for="role" class="w-32">Role</label>
                        <MultiSelect @change="handleRoleChange" v-model="roleFilterOptions" :options="roles"
                            optionLabel="name" filter placeholder="Filter Roles" id="rolesOptions"
                            :maxSelectedLabels="3" class="w-full" />
                    </div>
                    <div class="flex flex-wrap w-60 gap-2">
                        <label for="department">Department</label>
                        <MultiSelect v-model="departmentOptionsSearch" @change="handleDepartmentChange"
                            :options="departments" optionLabel="departmentName" filter placeholder="Filter Department"
                            id="department" :maxSelectedLabels="3" class="w-full" />
                    </div>
                    <div class="flex flex-wrap w-60 gap-2">
                        <label for="search">Search</label>
                        <InputText class="h-11 w-full" v-model="searchQuery" type="text" id="search"
                            placeholder="Enter name, account ..." @keyup.enter="handleSearch" />
                    </div>
                </div>
                <DataTable :rows="10" :rowsPerPageOptions="[10, 20, 30, 50]" :value="users"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginator
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    tableStyle="min-width: 50rem" scrollable scrollHeight="500px" class="mt-6">
                    <Column header="No" style="width: 10%">
                        <template #body="slotProps">
                            {{ users.indexOf(slotProps.data) + 1 }}
                        </template>
                    </Column>
                    <Column field="employeeId" header="Employee ID" style="width: 5%"></Column>
                    <Column field="account" header="Account" style="width: 10%"></Column>
                    <Column field="name" header="Name" style="width: 20%"></Column>
                    <Column field="email" header="Email" style="width: 10%"></Column>
                    <Column field="department.departmentName" header="Department" style="width: 5%"></Column>
                    <Column header="Roles" style="width: 10%">
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

                    <Column alignFrozen="right" field="status" frozen header="Status" style="width: 10%">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status" :severity="getStatusLabel(slotProps.data.status)" />
                        </template>
                    </Column>
                    <Column alignFrozen="right" frozen header="Actions" style="width: 10%">
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
        <ConfirmDialog group="templating">
            <template #message="slotProps">
                <div
                    class="flex flex-col items-center w-full gap-4 border-b border-surface-200 dark:border-surface-700">
                    <i v-for="(line, index) in slotProps.message.message.split('.')" :key="index"
                        :class="{ 'text-red-500 font-bold': index === 1 }">
                        {{ line }}
                    </i>
                </div>
            </template>
        </ConfirmDialog>
    </div>
</template>
<style>
.no-triangle::before,
.no-triangle::after {
    display: none !important;
}
</style>
