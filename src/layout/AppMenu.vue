<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        items: [
            {
                label: 'Group Management',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Group List',
                        to: '/group-management/list'
                    },
                    {
                        label: 'In progress group',
                        to: '/group-management/in-progress-list'
                    }
                ]
            },
            { label: 'Trainer management', icon: 'pi pi-fw pi-user', to: '#' },
            { label: 'Trainee management', icon: 'pi pi-fw pi-list', to: '#' },
            {
                label: 'Content Management',
                icon: 'pi pi-fw pi-book',
                items: [
                    {
                        label: 'Training Program',
                        to: '/topic-management/training-program'
                    },
                    {
                        label: 'Topic',
                        to: '/topic-management/topic'
                    },
                ]
            },
            {
                label: 'FMS Settings',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Email template',
                        to: '/fams-settings/email-template'
                    },
                    {
                        label: 'User management',
                        to: '/fms-settings/user-management'
                    }
                ]
            },
            { label: 'FAQs', icon: 'pi pi-fw pi-question-circle', to: '/#' },
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
