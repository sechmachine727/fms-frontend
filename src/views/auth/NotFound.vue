<script setup>
</script>

<template>
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="width: 500px;">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center"
                    style="border-radius: 53px">
                    <div class="gap-4 flex flex-col items-center">
                        <span class="text-primary font-bold text-3xl">404</span>
                        <h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-5xl mb-2">Not Found
                        </h1>
                        <div class="text-surface-600 dark:text-surface-200 mb-8">Requested resource is not available.

                        </div>
                        <Button as="router-link" label="Go to Dashboard" to="/" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
