<script setup>
</script>

<template>
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div>
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center"
                    style="border-radius: 53px">
                    <div class="gap-4 flex flex-col items-center">
                        <h1 class="text-surface-900 dark:text-surface-0 font-bold text-4xl lg:text-5xl mb-2">Access
                            Denied</h1>
                        <span class="text-muted-color mb-8">You do not have the necessary permisions. Please contact
                            admins.</span>
                        <div class="col-span-12 mt-8 text-center">
                            <Button as="router-link" label="Go to Dashboard" to="/" severity="warn" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
