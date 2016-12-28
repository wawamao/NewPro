export default [
    {
        path: '/home',
        meta: {
            auth: false,
            title: '首页'
        },
        name: 'routeHome',
        component: resolve => require(['../components/home.vue'], resolve)
    },
    {
        path: '/investement',
        meta: {
            auth: false,
            title: '投资'
        },
        name: 'routeInvestement',
        component: resolve => require(['../components/investement/investementList.vue'], resolve)
    },
    {
        path: '/investement/:Datas',
        meta: {
            auth: false,
            title: '投资详情'
        },
        name: 'routeInvestementId',
        component: resolve => require(['../components/investement/investementDetails.vue'], resolve)
    },
    {
        path: '/media',
        meta: {
            auth: true,
            title: '媒体'
        },
        name: 'routeMedia',
        component: resolve => require(['../components/media.vue'], resolve)
    },
    {
        path: '/my',
        meta: {
            auth: true,
            title: '我的设置',

        },
        name: 'routeMy',
        component: resolve => require(['../components/my.vue'], resolve)
    },
    {
        path: '/login',
        meta: {
            auth: true,
            title: '登录',
        },
        name: 'routeLogin',
        component: resolve => require(['../components/login.vue'],resolve)
    },{
        path: '/picker',
        meta: {
            auth: false,
            title: '选择时间',
        },
        name: 'routePicker',
        component: resolve => require(['../components/testComponents/pickerTime.vue'],resolve)
    },
    {
        path: '*',
        redirect: {name:'routeHome'}
    }
]
