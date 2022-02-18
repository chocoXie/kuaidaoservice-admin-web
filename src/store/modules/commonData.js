import { commonWatchList,commonBrandList,commonAllCityList,commonInfoNewList} from '@/api/commonData'

const getDefaultState = () => {
  return {
    watchList:'',
    brandList: '',
    cityList:'',
    commonInfoNewList:''
  }
}
const state = getDefaultState()
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_WATCHLIST: (state, watchList) => {
    state.watchList = watchList
  },
  SET_BRANDLIST: (state, brandList) => {
    state.brandList = brandList
  },
  SET_CITYLIST: (state, cityList) => {
    state.cityList = cityList
  },
  SET_INFONEWLIST: (state, infoNewList) => {
  state.infoNewList = infoNewList
}
}
const actions = {
  getWatchList({ commit }) {
    return new Promise((resolve, reject) => {
      commonWatchList().then(response => {
        const { data } = response;
        commit('SET_WATCHLIST', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getBrandList({ commit }) {
    return new Promise((resolve, reject) => {
      commonBrandList().then(response => {
        const { data } = response;
        commit('SET_BRANDLIST', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getCityList({ commit }) {
    return new Promise((resolve, reject) => {
      commonAllCityList().then(response => {
        const { data } = response;
        commit('SET_CITYLIST', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getInfoNewList({ commit }) {
    return new Promise((resolve, reject) => {
      commonInfoNewList().then(response => {
        const { data } = response;
        commit('SET_INFONEWLIST', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

