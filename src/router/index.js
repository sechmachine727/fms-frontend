import AppLayout from '@/layout/AppLayout.vue'
import { getUserInfo } from '@/utils/token'
import { createRouter, createWebHistory } from 'vue-router'

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
                    path: '/group-management/list',
                    name: 'group-management',
                    meta: { roles: ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_TRAINER', 'ROLE_DELIVERABLES_MANAGER'] },
                    component: () => import('@/views/Class/GroupList.vue')
                },
                {
                    path: '/content-management/topic',
                    name: 'topic-management',
                    meta: { roles: ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_CONTENT_MANAGER', 'ROLE_DELIVERABLES_MANAGER'] },
                    component: () => import('@/views/content/TopicList.vue')
                },
                {
                    path: '/content-management/topic/:id',
                    name: 'topic-detail',
                    meta: { roles: ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_CONTENT_MANAGER', 'ROLE_TRAINER', 'ROLE_DELIVERABLES_MANAGER'] },
                    component: () => import('@/views/content/TopicDetail.vue'),
                    props: true, // Pass route params as props to the component
                },
                {
                    path: '/content-management/training-program',
                    name: 'training-program',
                    meta: { roles: ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_CONTENT_MANAGER', 'ROLE_DELIVERABLES_MANAGER'] },
                    component: () => import('@/views/content/TrainingProgramList.vue'),
                    props: true, // Pass route params as props to the component
                },
                {
                    path: '/content-management/training-program/:id',
                    name: 'training-program-detail',
                    meta: { roles: ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_TRAINER', 'ROLE_CONTENT_MANAGER', 'ROLE_DELIVERABLES_MANAGER'] },
                    component: () => import('@/views/content/TrainingProgramDetail.vue'),
                    props: true, // Pass route params as props to the component
                },
                {
                    path: '/content-management/training-program/add',
                    name: 'training-program-add',
                    meta: { roles: ['ROLE_CONTENT_MANAGER'] },
                    component: () => import('@/views/content/AddTrainingProgram.vue')
                },
                {

                    path: '/content-management/training-program/edit/:id',
                    name: 'training-program-edit',
                    meta: { roles: ['ROLE_CONTENT_MANAGER'] },
                    component: () => import('@/views/content/EditTrainingProgram.vue')
                },
                {
                    path: '/group-management/add',
                    name: 'group-management-add',
                    meta: { roles: ['ROLE_DELIVERABLES_MANAGER'] },
                    component: () => import('@/views/Class/GroupAdd.vue')
                },

                {
                    path: '/group-management/detail/:id',
                    name: 'group-detail',
                    meta: { roles: ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_TRAINER', 'ROLE_DELIVERABLES_MANAGER'] },
                    component: () => import('@/views/Class/GroupDetail.vue')
                },
                 {
                    path: '/group-management/in-progress-list',
                    name: 'group-management-in-progress-list',
                    meta: { roles: ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_TRAINER', 'ROLE_DELIVERABLES_MANAGER'] },
                    component: () => import('@/views/Class/InProgress.vue')
                },
                {
                    path: '/fms-settings/user-management',
                    name: 'fms-settings-user-management',
                    meta: { roles: ['ROLE_FMS_ADMIN'] },
                    component: () => import('@/views/user/UserList.vue')
                },
                 {
                    path: '/fams-settings/email-template',
                    name: 'fms-settings-email-template-management',
                    meta: { roles: ['ROLE_FMS_ADMIN'] },
                    component: () => import('@/views/templateEmail/TemplateEmailList.vue')
                },
                {
                    path: '/trainee-management/trainees',
                    name: 'trainees',
                    meta: { roles: ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_CONTENT_MANAGER', 'ROLE_DELIVERABLES_MANAGER'] },
                    component: () => import('@/views/trainee/TraineeList.vue'),
                    props: true // Pass route params as props to the component
                },
                {
                    path: '/trainee-management/trainee/detail/:id',
                    name: 'trainee-detail',
                    meta: { roles: ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_CONTENT_MANAGER', 'ROLE_DELIVERABLES_MANAGER'] },
                    component: () => import('@/views/trainee/TraineeDetail.vue'),
                    props: true // Pass route params as props to the component
                },
                {
                    path: '/trainee-management/trainee/edit/:id',
                    name: 'trainee-edit',
                    meta: { roles: ['ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_CONTENT_MANAGER', 'ROLE_DELIVERABLES_MANAGER'] },
                    component: () => import('@/views/trainee/EditTrainee.vue'),
                    props: true // Pass route params as props to the component
                }
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
    const userInfo = getUserInfo();
    const userRoles = userInfo && userInfo.roles ? userInfo.roles : [];

    // Nếu người dùng chưa đăng nhập và đang cố truy cập một trang cần đăng nhập
    if (to.name !== 'login' && !isLoggedIn()) {
        next({ name: 'login' });
    }
    // Nếu người dùng đã đăng nhập và đang truy cập trang đăng nhập, điều hướng dựa trên vai trò
    else if (to.name === 'login' && isLoggedIn()) {
        if (userRoles.includes('ROLE_FMS_ADMIN')) {
            next({ path: '/fms-settings/user-management' });
        } else if (userRoles.includes('ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_TRAINER', 'ROLE_DELIVERABLES_MANAGER')) {
            next({ path: '/group-management/list' });
        } else if (userRoles.includes('ROLE_CONTENT_MANAGER')) {
            next({ path: '/content-management/training-program' });
        } else {
            next({ name: 'accessDenied' });
        }
    }
    // Điều hướng tại đường dẫn gốc '/', tự động chuyển hướng dựa trên vai trò
    else if (to.path === '/') {
        if (userRoles.includes('ROLE_FMS_ADMIN')) {
            next({ path: '/fms-settings/user-management' });
        } else if (userRoles.includes('ROLE_FA_MANAGER', 'ROLE_GROUP_ADMIN', 'ROLE_TRAINER', 'ROLE_DELIVERABLES_MANAGER')) {
            next({ path: '/group-management/list' });
        } else if (userRoles.includes('ROLE_CONTENT_MANAGER')) {
            next({ path: '/content-management/training-program' });
        } else {
            next({ name: 'accessDenied' });
        }
    }
    // Kiểm tra quyền truy cập dựa trên vai trò cho các đường dẫn khác
    else {
        const routeRoles = to.meta.roles;
        if (routeRoles && routeRoles.length > 0 && !routeRoles.some(role => userRoles.includes(role))) {
            next({ name: 'accessDenied' });
        } else {
            next();
        }
    }
});


export default router;
