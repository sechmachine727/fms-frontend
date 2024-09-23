<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import { ref } from 'vue';
import { z } from "zod";
const validationSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(1, { message: "Plese fill email" })
      .email("Invalid email address"),

    password: z.string().min(8, "Must be 8 or more characters long"),
  })
);

const { handleSubmit, errors } = useForm({ validationSchema });

const { value: email } = useField("email");
const { value: password } = useField("password");
const checked = ref(false);

// const onSubmit = handleSubmit((values) => {
//       router.push('/class-management/list');
// });
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="flex justify-center mb-4">
                            <img src="@/assets/img/logo.png" alt="FPT Software Academy" class="h-20"/>
                        </div>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to FMS!</div>
                        <span class="text-muted-color font-medium">Sign in to continue</span>
                    </div>

                    <form @submit.prevent="handleSubmit(onSubmit)">
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem]" :class="{'p-invalid': errors.email}" v-model="email" ></InputText>
                        <small class="error block pt-0 mb-4"> {{ errors.email }}</small>

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" :inputClass="{'p-invalid': errors.password}" v-model="password" placeholder="Password" :toggleMask="true" fluid :feedback="false"></Password>
                        <small class="error block">{{ errors.password }}</small>
                        
                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                        </div>
                        <Button label="Sign In" class="w-full"></Button>
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
