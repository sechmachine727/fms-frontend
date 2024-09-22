<script setup>
import { useLayout } from '@/layout/composables/layout';

const { onMenuToggle } = useLayout();
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="#" class="layout-topbar-logo">
            <Image src="https://th.bing.com/th/id/OIP.BWC1rQkSdd47znCeM12YGAHaHa?rs=1&pid=ImgDetMain" alt="Image" width="50"/>
            <span>FMS</span>
            </router-link>
        </div>
        <div class="layout-topbar-actions">
            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
