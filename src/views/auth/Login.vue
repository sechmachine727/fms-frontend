<script setup>
import { useAuthStore } from "@/stores/authStore";
import { toTypedSchema } from "@vee-validate/zod";
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";

import { useField, useForm } from "vee-validate";
import { z } from "zod";
const validationSchema = toTypedSchema(
    z.object({
        account: z.string({ required_error: 'Class Name is required' }),
        password: z.string().min(4, "Must be 4 or more characters long"),
    })
);
const toast = useToast();
const authStore = useAuthStore();


const { handleSubmit, errors } = useForm({ validationSchema });
const { value: account } = useField("account");
const { value: password } = useField("password");

const onSubmit = handleSubmit((values) => {
    authStore.fetchLogin(values).then((reponse) => {
        localStorage.setItem("token", reponse.token);
        window.location.href = '/group-management/list';
    }).catch((error) => {
        if (error.status === 401 && error.response.data.message === 'User is inactive') {
            toast.add({ severity: 'error', summary: 'Your account is inactive.', life: 3000 });
        } else if (error.status === 401 && error.response.data.message === 'Username or password is incorrect') {
            toast.add({ severity: 'error', summary: 'Username or password is incorrect', life: 3000 });
        } else {
            toast.add({ severity: 'error', summary: error.message, life: 3000 });
        }
    });
});
</script>

<template>
    <Toast />
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="flex justify-center mb-4">
                            <img src="@/assets/img/logo.png" alt="FPT Software Academy" class="h-20" />
                        </div>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to FMS!
                        </div>
                        <span class="text-muted-color font-medium">Sign in to continue</span>
                    </div>

                    <form @submit.prevent="onSubmit">
                        <label for="email1"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                        <InputText id="email1" type="text" placeholder="Username" class="w-full md:w-[30rem]"
                            :class="{ 'p-invalid': errors.account }" v-model="account"></InputText>
                        <small class="error block pt-0 mb-4"> {{ errors.account }}</small>

                        <label for="password1"
                            class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" :inputClass="{ 'p-invalid': errors.password }" v-model="password"
                            placeholder="Password" :toggleMask="true" fluid :feedback="false"></Password>
                        <small class="error block">{{ errors.password }}</small>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">

                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot
                                password?</span>
                        </div>
                        <button type="submit"
                            class="text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out w-full"
                            style="background-color: #10b981; hover:bg-opacity-90;">
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}

.error {
    color: red;
}
</style>
