<script setup>

</script>

<template>
    <div class="card">
        <div class="text-xl mb-4 flex justify-between items-center">
            <span class="font-semibold text-2xl">Add Class</span>
        </div>
        <Divider />
        <Fluid>
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="firstname2">Class Name</label>
                            <InputText id="firstname2" type="text" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="lastname2">Lastname</label>
                            <InputText id="lastname2" type="text" />
                        </div>
                    </div>

                    <div class="flex flex-wrap">
                        <label for="address">Address</label>
                        <Textarea id="address" rows="4" />
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="state">State</label>
                            <Select id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name"
                                placeholder="Select One" class="w-full"></Select>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="zip">Zip</label>
                            <InputText id="zip" type="text" />
                        </div>
                    </div>
                </div>
            </div>
        </Fluid>
    </div>
</template>
