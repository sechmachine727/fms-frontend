<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        items: [
            {
                label: 'Class Management',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Class List',
                        to: '/class-management/list'
                    },
                    {
                        label: 'In progress class',
                        to: '/#'
                    }
                ]
            },
            { label: 'Trainer management', icon: 'pi pi-fw pi-user', to: '/#' },
            { label: 'Trainee management', icon: 'pi pi-fw pi-list', to: '/#' },
              {
                label: 'Content Management',
                icon: 'pi pi-fw pi-book',
                items: [
                    {
                        label: 'Training Program',
                        to: '/#'
                    },
                    {
                        label: 'Topic',
                        to: '/#'
                    }
                ]
            },
              {
                label: 'FMS Settings',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Email template',
                        to: '/#'
                    },
                    {
                        label: 'User management',
                        to: '/#'
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
