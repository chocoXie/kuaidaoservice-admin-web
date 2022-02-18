import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // elementuiIcon
import '@/assets/fonts/iconfont.css' // aliIconfont
import '@/permission' // permission control 权限管理
import {hasBtnPermission} from './permission' ;

import utils from '@/utils/utils'


/*域名接口文件*/
import { requestApi } from '@/api/requestApi'
// 过滤器
import * as filters from './utils/filter'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(ElementUI)
Vue.prototype.requestApi = requestApi
Vue.prototype.utils = utils
Vue.prototype.hasPerm = hasBtnPermission

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
