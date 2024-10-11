<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
    text: {
        type: String,
        default: 'Button',
    },
    bgColor: {
        type: String,
        default: 'bg-gray-200',
    },
    hoverColor: {
        type: String,
        default: 'hover:bg-gray-400',
    },
    activeColor: {
        type: String,
        default: 'active:bg-gray-200',
    },
    textColor: {
        type: String,
        default: 'text-black',
    },
    borderColor: {
        type: String,
        default: 'border border-gray-300',
    },
    onClick: {
        type: Function,
        default: null,
    },
});

const buttonClasses = computed(() => {
    return `${props.bgColor} ${props.hoverColor} ${props.activeColor} ${props.textColor} ${props.borderColor} font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out mr-2`;
});

const handleClick = () => {
    if (props.onClick) {
        props.onClick();
    }
};
</script>
<template>
    <button :class="buttonClasses" @click="handleClick">
        {{ text }}
    </button>
</template>
