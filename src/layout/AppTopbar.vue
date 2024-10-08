<script setup>
import { useLayout } from '@/layout/composables/layout';
import router from '@/router';
import { getUserInfo } from '@/utils/token';
import { ref } from 'vue';

const { onMenuToggle } = useLayout();
const menu = ref();
const items = ref([
    {
        items: [
            {
                label: 'Profile',
                icon: 'pi pi-user',
                command: () => {
                    console.log('Profile clicked');
                }
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => {
                    localStorage.removeItem('token');
                    router.push("/auth/login")
                }
            },
            {
                label: 'Change Password',
                icon: 'pi pi-pencil',
                command: () => {
                    console.log('Change Password');
                }
            }
        ]
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);

};

const userInfo = getUserInfo();
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="#" class="layout-topbar-logo">
                <Image src="https://th.bing.com/th/id/OIP.BWC1rQkSdd47znCeM12YGAHaHa?rs=1&pid=ImgDetMain" alt="Image"
                    width="50" />
                <span>FMS</span>
            </router-link>
        </div>
        <div class="card flex justify-center">
            <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />

        </div>
        <div class="layout-topbar-actions">
            <span class="mt-3">
                Welcome to {{ userInfo.username }}
            </span>
            <div class="layout-topbar-menu-content">
                <button type="button" @click="toggle" class="layout-topbar-action">
                    <i class="pi pi-user"></i>
                </button>
            </div>
        </div>
    </div>
</template>
