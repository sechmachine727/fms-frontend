<script setup>
import { getUserInfo } from '@/utils/token'
import { computed, ref } from 'vue'
import AppMenuItem from './AppMenuItem.vue'

const userRoles = getUserInfo(); // Mảng vai trò của người dùng hiện tại

const model = ref([
    {
        items: [
            {
                label: 'Group Management',
                icon: 'pi pi-fw pi-users',
                role: ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_TRAINER', 'ROLE_DELIVERABLES_MANAGER'], // Vai trò cho phép truy cập
                items: [
                    { label: 'Group List', to: '/group-management/list', role: ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_TRAINER', 'ROLE_DELIVERABLES_MANAGER'] },
                    { label: 'In progress group', to: '/group-management/in-progress-list', role: ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_TRAINER', 'ROLE_DELIVERABLES_MANAGER'] },
                ],
            },
            { label: 'Trainer management', icon: 'pi pi-fw pi-user', to: '#', role: ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_TRAINER', 'ROLE_DELIVERABLES_MANAGER'] },
            {
                label: 'Trainee management',
                icon: 'pi pi-fw pi-user-plus',
                to: '/trainee-management/trainees',
                role: ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_TRAINER', 'ROLE_DELIVERABLES_MANAGER']
            },
            {
                label: 'Content Management',
                icon: 'pi pi-fw pi-book',
                role: ['ROLE_FA_MANAGER', 'ROLE_CONTENT_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_TRAINER', 'ROLE_DELIVERABLES_MANAGER'],
                items: [
                    {
                        label: 'Training Program',
                        to: '/content-management/training-program',
                        role: ['ROLE_FA_MANAGER', 'ROLE_CONTENT_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_TRAINER', 'ROLE_DELIVERABLES_MANAGER']
                    },
                    {
                        label: 'Topic',
                        to: '/content-management/topic',
                        role: ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_CONTENT_MANAGER', 'ROLE_TRAINER', 'ROLE_DELIVERABLES_MANAGER']
                    },
                ],
            },
            {
                label: 'FMS Settings',
                icon: 'pi pi-fw pi-cog',
                role: ['ROLE_FMS_ADMIN'],
                items: [
                    {
                        label: 'Email template',
                        to: '/fams-settings/email-template',
                        role: ['ROLE_FMS_ADMIN']
                    },
                    {
                        label: 'User management',
                        to: '/fms-settings/user-management',
                        role: ['ROLE_FMS_ADMIN']
                    },
                ],
            },
            { label: 'Technical Group management', icon: 'pi pi-fw pi-list', to: '#', role: ['ROLE_CONTENT_MANAGER'] },
            { label: 'Trainee Type management', icon: 'pi pi-fw pi-list', role: ['ROLE_CONTENT_MANAGER'] },
            { label: 'Site management', icon: 'pi pi-fw pi-list', to: '#', role: ['ROLE_FMS_ADMIN'] },
            { label: 'Location management', icon: 'pi pi-fw pi-list', to: '#', role: ['ROLE_FMS_ADMIN'] },
            { label: 'FAQs', icon: 'pi pi-fw pi-question-circle', to: '/#', role: ['all'] },
        ],
    },
]);

// Kiểm tra nếu bất kỳ vai trò nào của người dùng có trong vai trò yêu cầu của mục
const filteredModel = computed(() =>
    model.value.map(menu => ({
        ...menu,
        items: menu.items.filter(item =>
            item.role.includes('all') || item.role.some(r => userRoles.roles?.includes(r))
        ),
    })).filter(menu => menu.items.length > 0)
);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in filteredModel" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
