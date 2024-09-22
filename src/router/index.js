import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    redirect: "/class-management/list"
                },

                {
                    path: '/class-management/list',
                    name: 'class-management',
                    component: () => import('@/views/Class/ClassList.vue')
                },
            ]
        },
        {
            path: '/:catchAll(.*)',
            name: 'notfound',
            component: () => import('@/views/auth/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/auth/Error.vue')
        }
    ]
});

export default router;
