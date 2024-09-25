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
                {
                    path: '/topic-management/topic',
                    name: 'topic-management',
                    component: () => import('@/views/content/TopicList.vue')
                },
                {
                    path: '/topic-management/topic/:id',
                    name: 'topic-detail',
                    component: () => import('@/views/content/TopicDetail.vue'),
                    props: true, // Pass route params as props to the component
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
