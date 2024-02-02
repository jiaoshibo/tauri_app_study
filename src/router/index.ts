import { createRouter, createWebHistory } from 'vue-router';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css'
import Home from '../views/Home.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: ()=>import("../views/Home.vue"),
      meta:{
        name:'首页',
        routeType:'home'
      }
    },
    {
      path: '/matterList', // 事项管理
      name: 'MatterList',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Matter/MatterList.vue'),
      meta:{
        name:'事项管理',
        routeType:'list'
      }
    },
    // WARNING 不再显示未进驻事项的单独菜单
    /* {
      path: '/outmatterlist', // 未进驻事项
      name: 'OutMatterList',
      component: () => import('../views/Matter/OutMatterList.vue'),
      meta: {
        name: '未进驻事项',
        routeType: 'list'
      }
    }, */
    {
      path:'/nonPublicMatterList', // 非公服目录事项管理
      name: 'NonPublicMatterList',
      component: ()=>import('../views/NonPublicMatter/NonPublicMatterList.vue'),
      meta:{
        name:'非公服目录事项管理',
        routeType:'list'
      }
    },
    {
      path:'/addNonPublicMatter/:pageType/:id?',
      name:'AddNonPublicMatter',
      component:()=>import('../views/NonPublicMatter/AddNonPublicMatter.vue'),
      meta:{
        name:'非公服目录事项管理-新增/修改'
      }
    },
    {
      path: '/diversionOfMatterList', // 事项分流配置
      name: 'DiversionOfMatterList',
      component: ()=>import('../views/DiversionOfMatter/DiversionOfMatterList.vue'),
      meta:{
        name:'事项分流配置',
        routeType:'list'
      }
    },
    {
      path: '/dictionaryList', // 字典管理
      name: 'DictionaryList',
      component: ()=>import('@/views/Dictionary/DictionaryList.vue'),
      meta:{
        name:"字典管理",
        routeType:'list'
      }
    },
    {
      path:'/dictionaryValueList/:id/:name',
      name:'DictionaryValueList',
      component:()=>import('@/views/Dictionary/DictionaryValueList.vue'),
      meta:{
        name:'选项数据管理'
      }
    },
    {
      path: '/associationBinding', // 关联绑定
      name: 'AssociationBinding',
      component: ()=>import('../views/AssocationBinding/AssociationBinding.vue'),
      meta:{
        name:"关联绑定",
        routeType:'list'
      }
    },
    {
      path: '/matterChange',
      name: 'MatterChange',
      component: ()=>import('../views/MatterChange/MatterChange.vue'),
      meta:{
        name:"事项异动",
        routeType:'list'
      }
    },
    {
      path:'/matterChangeDetail/:matterMainId',
      name:'MatterChangeDetail',
      component: ()=>import('../views/MatterChange/MatterChangeDetail.vue'),
      meta:{
        name:'事项异动详情'
      }
    },
    {
      path: '/versionComparsion',
      name:'VersionComparison',
      component:()=>import('../views/MatterChange/VersionComparison.vue'),
      meta:{
        name:'版本对比'
      }
    },
    {
      path: '/matterDetails', // 事项管理查看界面
      name: 'MatterDetails',
      component: () => import('../views/MatterDetails/DetailList.vue'),
      meta:{
        name:'事项管理查看详情'
      }
    },
    {
      path:'/setting',
      name:'Setting',
      component: ()=>import('../views/Setting/Setting.vue'),
      meta:{
        name:'设置',
        routeType:'list'
      }
    }
    // WARNING: /versionModification 这个路由先隐藏，暂时用不到此页面 modify: 2023/11/23
    /* {
      path: '/versionModification', // 事项异动-版本修改
      name: 'VersionModification',
      component: () => import('../views/MatterChange/VersionModification.vue'),
      meta:{
        name:'事项异动-版本对比-修改'
      }
    }, */
  ]
})


router.beforeEach(async ()=>{
  nprogress.start();
})

router.afterEach(()=>{
  nprogress.done();
})
export default router;
