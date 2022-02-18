import { login, logout, getInfo,getUserPermissions } from '@/api/user'
import { getToken, setToken, removeToken ,setPermissions,removePermissions} from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    userinfo: '',
    permissions:'',
    buttonList:''
  }
}
const state = getDefaultState()
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userinfo) => {
    state.userinfo = userinfo
  },
  SET_Permissions:(state, permissions) =>{
    state.permissions = permissions
  },
  SET_ButtonList:(state, buttonList) =>{
    state.buttonList = buttonList
  }
}

function arrayToTree(array,paramsKey){
  // pid 和id 都是字符串
  const pid = paramsKey.pid;
  const id = paramsKey.id;
  let copyArr = JSON.parse(JSON.stringify(array));
  // 筛选出没有父级的数据
  array.forEach(function(item){
    copyArr = copyArr.filter(function(child){
      return child[pid] !== item[id]
    })
  })
  // 递归转换
  function treeLoop(arr = [],total=[]){
    for(let i=0;i<arr.length;i++){
      const aid = arr[i][id]
      let children = total.filter(function(child){
        return child[pid] === aid
      });
      if(children.length > 0){
        children = treeLoop(children,total);
      }
      arr[i].children = children;
    }
    return arr;
  }
  return treeLoop(copyArr,array)
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { phone, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone: phone.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data)
        setToken(data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('验证失败,请重新登录.')
        }
        /*用户信息*/
        commit('SET_USERINFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  /*用户权限列表*/
  getUserPermissions({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserPermissions(state.token).then(response => {
        const { data } = response
        setPermissions(data.length)
        let buttonJson = [];
        let initPermissionsRouter =[];
        data.forEach((item,index)=>{
          if(item.viewUrl != ''){
            initPermissionsRouter.push(item.viewUrl)
          }
          buttonJson[item['name']] = item;
        })

        let slideRouterList={};
        initPermissionsRouter.forEach((item,index)=>{
          slideRouterList[item.split('/')[1]] = [];
          initPermissionsRouter.forEach((_item,_index)=>{
            if(item.split('/')[1] == _item.split('/')[1]){
              slideRouterList[item.split('/')[1]].push(_item.split('/')[2])
            }
          })
        })
        /*获取到的权限列表中的第一个viewUrl设置为登录后默认展示的页面*/
        sessionStorage.setItem('homeRedirect', initPermissionsRouter[0])
        commit('SET_Permissions', slideRouterList)
        commit('SET_ButtonList', buttonJson)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        removePermissions() //
        resetRouter()
        console.log(commit('RESET_STATE'))
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removePermissions()
      commit('RESET_STATE')
      resolve()
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

