const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userinfo: state => state.user.userinfo,
  /*权限*/
  permissions: state => state.user.permissions,
  /*可展示按钮列表*/
  buttonList: state => state.user.buttonList,
  /*看点列表*/
  watchList: state => state.commonData.watchList,
  /*品牌列表*/
  brandList: state => state.commonData.brandList,
  /*城市列表*/
  cityList: state => state.commonData.cityList,
  /*新资讯列表*/
  infoNewList: state => state.commonData.infoNewList
}
export default getters
