import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken,getPermissions } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  const hasPermissions = getPermissions()
  /*只有存在token并且返回的权限列表大于0才能正常跳转*/
  if (hasToken && hasPermissions > 0) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.userinfo
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          await store.dispatch('user/getUserPermissions')
          /*登录即获取看点列表、品牌列表、城市列表*/
          await store.dispatch('commonData/getWatchList');
          await store.dispatch('commonData/getBrandList');
          await store.dispatch('commonData/getCityList');
          await store.dispatch('commonData/getInfoNewList');

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error.message || 'Has Error')
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})


//从vuex 中 取出 button数组进行比较 有返回true 没有 返回 false
export function hasBtnPermission(permission) {
  const myBtns = store.getters.buttonList
  // console.log(myBtns)
  return myBtns[permission]
}
