import Vue from 'vue'
import Router from 'vue-router'
import { redirectF } from '@/utils/router'

Vue.use(Router)
/* Layout */
import Layout from '@/layout'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  }, {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: () => {
      return redirectF()
    }
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/role',
    name: 'system',
    meta: { title: '系统管理', icon: 'dashboard' },
    children: [
      {
        path: 'role',
        component: () => import('@/views/system/role/rolelist'),
        name: 'role',
        meta: { title: '角色管理' }
      },
      {
        /*编辑以及添加角色的路由*/
        path: 'role/:id',
        component: () => import('@/views/system/role/editorRole'),
        name: 'editorrole',
        hidden: true,
        meta: {
          title: '角色管理',
          guidePath: true,
          jumpPath: '/system/role'
        }
      },
      {
        path: 'account',
        component: () => import('@/views/system/account/index'),
        name: 'account',
        meta: { title: '账号管理' }
      },
      {
        path: 'syslog',
        component: () => import('@/views/system/syslog/index'),
        name: 'syslog',
        meta: { title: '系统日志' }
      }
    ]
  },
  {
    path: '/advertising',
    component: Layout,
    redirect: '/advertising/brandADspace',
    name: 'advertising',
    meta: { title: '广告管理', icon: 'nested' },
    children: [
      {
        path: 'brandADspace',
        component: () => import('@/views/advertising/brandADspace/index'),
        name: 'BrandADspace',
        meta: { title: '广告位管理' }
      },
      {
        path: 'brandADspace/:id',
        component: () => import('@/views/advertising/ADspaceEditor/index'),
        name: 'ADspaceEditor',
        hidden: true,
        meta: {
          title: '广告位管理',
          guidePath: true,
          jumpPath: '/advertising/brandADspace'
        }
      }
    ]
  }, {
    path: '/brandWiki',
    component: Layout,
    redirect: '/brandWiki/category/level1',
    name: 'brandWiki',
    meta: {
      title: '品牌百科',
      icon: 'form',
      // initShow:true
    },
    children: [
      {
        path: 'category',
        component: () => import('@/views/brandWiki/category/index'),
        redirect: '/brandWiki/category/level1',
        name: 'category',
        meta: { title: '品类管理' },
        children: [
          {
            path: 'level1',
            component: () => import('@/views/brandWiki/category/levelone/index'),
            name: 'level1',
            meta: { title: '一级品类' }
          }, {
            path: 'level2',
            component: () => import('@/views/brandWiki/category/leveltwo/index'),
            name: 'level2',
            meta: { title: '二级品类' }
          }
        ]
      }, {
        path: 'brand',
        component: () => import('@/views/brandWiki/brand/index'),
        name: 'brand',
        redirect: '/brandWiki/brand/brandLibrary',
        meta: { title: '品牌管理' },
        children: [
          {
            path: 'brandLibrary',
            component: () => import('@/views/brandWiki/brand/brandLibrary/index'),
            name: 'brandLibrary',
            meta: { title: '品牌管理' }
          },
          {
            path: 'companyInfo',
            component: () => import('@/views/brandWiki/brand/companyInfo/index'),
            name: 'companyInfo',
            hidden:true,
            meta: { title: '基本信息' }
          },
          {
            path: 'companyrisk',
            component: () => import('@/views/brandWiki/brand/companyrisk/index'),
            name: 'companyrisk',
            hidden:true,
            meta: { title: '企业风险' }
          },
          {
            path: 'trademarks',
            component: () => import('@/views/brandWiki/brand/trademarks/index'),
            name: 'trademarks',
            hidden:true,
            meta: { title: '商标信息' }
          },
          {
            path: 'store',
            component: () => import('@/views/brandWiki/brand/companystore/index'),
            name: 'store',
            hidden:true,
            meta: { title: '商标信息' }
          }
        ]
      }
    ]
  },
  {
    path: '/informationManage',
    component: Layout,
    redirect: '/informationManage/list',
    name: 'informationManage',
    meta: { title: '资讯管理', icon: 'form',initShow:true},
    children: [
      {
        path: 'list',
        component: () => import('@/views/informationManage/list/index'),
        name: 'list',
        meta: { title: '所有内容' }
      },
      {
        path: 'writeArticle/:id',
        component: () => import('@/views/informationManage/writeArticle/index'),
        name: 'writeArticle',
        hidden: true,
        meta: {
          title: '编辑文章' ,
          guidePath: true,
          jumpPath: '/informationManage/list'
        }
      },
      {
        path: 'publishVideo/:id',
        component: () => import('@/views/informationManage/publishVideo/index'),
        name: 'publishVideo',
        hidden: true,
        meta: {
          title: '编辑视频' ,
          guidePath: true,
          jumpPath: '/informationManage/list'
        }
      },
      {
        path: 'writeArticle',
        component: () => import('@/views/informationManage/writeArticle/index'),
        name: 'writeArticle',
        meta: { title: '写文章' }
      },
      {
        path: 'publishVideo',
        component: () => import('@/views/informationManage/publishVideo/index'),
        name: 'publishVideo',
        meta: { title: '发视频' }
      },
      {
        path: 'creatorManage',
        component: () => import('@/views/informationManage/creatorManage/index'),
        name: 'creatorManage',
        meta: { title: '创作者管理' }
      },
      {
        path: 'tagManage',
        component: () => import('@/views/informationManage/tagManage/index'),
        name: 'tagManage',
        meta: { title: '标签管理' }
      },
    ]
  },{
    path: '/messageManagement',
    component: Layout,
    redirect: '/messageManagement/PushMsg/list',
    name: 'messageManagement',
    meta: {
      title: '消息管理',
      icon: 'form',
      initShow:true
    },
    children: [
      {
        path: 'PushMsg',
        component: () => import('@/views/messageManagement/PushMsg/index'),
        redirect: '/messageManagement/PushMsg/list',
        name: 'PushMsg',
        meta: { title: '推送消息' },
        children: [
          {
            path: 'list',
            component: () => import('@/views/messageManagement/PushMsg/list/index'),
            name: 'list',
            meta: { title: '推送消息' }
          }, {
            path: 'historyList',
            component: () => import('@/views/messageManagement/PushMsg/historyList/index'),
            name: 'historyList',
            hidden:true,
            meta: { title: '消息发送记录' }
          }
        ]
      },
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
