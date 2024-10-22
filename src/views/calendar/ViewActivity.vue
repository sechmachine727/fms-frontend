<script setup>
const props = defineProps({
    event: Array,
})

</script>
<template>
    <div class="card" style="max-height: calc(100vh - 19rem); overflow-y: auto;">
        <Timeline :value="props.event">
            <template #content="slotProps">
                {{ slotProps.item.status }} - {{ slotProps.item.date }} - {{ slotProps.item.icon }} - {{
                    slotProps.item.color }}
            </template>
        </Timeline>
    </div>
</template>
<style>
.p-timeline-event-opposite {
    display: none !important;
}
</style>