import AppLayout from '@/layout/AppLayout.vue';
import { getUserInfo } from '@/utils/token';
import { createRouter, createWebHistory } from 'vue-router';

function isLoggedIn() {
    const userInfo = getUserInfo();
    
    if (userInfo && userInfo.expiration) {
        const currentTime = Date.now();
        const expirationTime = new Date(userInfo.expiration).getTime();
        return currentTime < expirationTime;
    }
    
    return false;
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    redirect: "/group-management/list"
                },

                {
                    path: '/group-management/list',
                    name: 'group-management',
                    component: () => import('@/views/Class/GroupList.vue')
                },
                {
                    path: '/content-management/topic',
                    name: 'topic-management',
                    component: () => import('@/views/content/TopicList.vue')
                },
                {
                    path: '/content-management/topic/:id',
                    name: 'topic-detail',
                    component: () => import('@/views/content/TopicDetail.vue'),
                    props: true, // Pass route params as props to the component
                },
                {
                    path: '/content-management/training-program',
                    name: 'training-program',
                    component: () => import('@/views/content/TrainingProgramList.vue'),
                    props: true, // Pass route params as props to the component
                },
                {
                    path: '/content-management/training-program/:id',
                    name: 'training-program-detail',
                    component: () => import('@/views/content/TrainingProgramDetail.vue'),
                    props: true, // Pass route params as props to the component
                },
                {
                    path: '/content-management/training-program/add',
                    name: 'training-program-add',
                    component: () => import('@/views/content/AddTrainingProgram.vue')
                },
                {

                    path: '/content-management/training-program/edit/:id',
                    name: 'training-program-edit',
                    component: () => import('@/views/content/EditTrainingProgram.vue')
                },
                {
                    path: '/group-management/add',
                    name: 'group-management-add',
                    component: () => import('@/views/Class/GroupAdd.vue')
                },

                {
                    path: '/group-management/detail/:id',
                    name: 'group-detail',
                    component: () => import('@/views/Class/GroupDetail.vue')
                },
                 {
                    path: '/group-management/in-progress-list',
                    name: 'group-management-in-progress-list',
                    component: () => import('@/views/Class/InProgress.vue')
                },
                {
                    path: '/fms-settings/user-management',
                    name: 'fms-settings-user-management',
                    component: () => import('@/views/user/UserList.vue')
                },
                 {
                    path: '/fams-settings/email-template',
                    name: 'fms-settings-email-template-management',
                    component: () => import('@/views/templateEmail/TemplateEmailList.vue')
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

router.beforeEach((to, from, next) => {
    // Nếu không phải là trang đăng nhập và người dùng chưa đăng nhập
    if (to.name !== 'login' && !isLoggedIn()) {
        next({ name: 'login' });  // Chuyển hướng tới trang đăng nhập
    }
    // Nếu đã đăng nhập và muốn vào trang login, chuyển đến class list
    else if (to.name === 'login' && isLoggedIn()) {
        next({ name: 'class-management' });  // Chuyển hướng đến class list
    }
    // Cho phép chuyển tiếp tới trang yêu cầu
    else {
        next();
    }
});

export default router;
