import { httpUrl } from "./http.js";
import { HttpRequest } from "./httpRequest.js";
import qs from 'qs';

function dateFormat(fmt, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}

let requestApi = {
  //获取日志列表
  getSysLogList:function(data){
    if(data.startTime){
      data.startTime = dateFormat("YYYY-mm-dd", new Date(data.startTime))
    }
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "sysLog/query",
      data
    });
  },
  // 获取角色列表 =》 在权限管理内，有分页
  getRoleList: function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "sysRole/query",
      data
    });
  },
  // 获取角色列表 =》 独立于权限管理之外，无分页
  getAllRole: function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "sysRole/queryEffective",
    });
  },
  /*更新角色状态*/
  updataRoleStatus: function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "sysRole/updateStatus",
      data:qs.stringify(data)
    });
  },
  /*删除角色*/
  delRoleitem:function(data){
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "sysRole/delete",
      data:qs.stringify(data)
    });
  },
  /*创建新角色*/
  addNewRole: function(data){
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "sysRole/add",
      data
    })
  },
  /*获取角色的信息*/
  getRoleInfo:function(data){
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "sysRole/detail",
      data
    })
  },
  /*编辑角色*/
  editorRole:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "sysRole/edit",
      data
    })
  },
  /*获取所有权限列表*/
  getSysPermission:function() {
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "sysPermission/query",
    })
  },
  /*获取用户列表*/
  getUserList:function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "sysUser/query",
      data
    })
  },
  /*新增用户*/
  addUser:function(data){
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "sysUser/add",
      data
    })
  },
  /*删除用户*/
  delUserItem:function(data){
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "sysUser/delete",
      data:qs.stringify(data)
    });
  },
  /*修改用户状态*/
  updateUserStatus:function(data){
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "sysUser/updateStatus",
      data:qs.stringify(data)
    });
  },
  /*编辑用户信息*/
  editUserInfo:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "sysUser/edit",
      data
    });
  },
  /*查询广告列表*/
  getAdvertList:function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "advert/query",
      data
    });
  },
  /*新增广告位*/
  advertAdd:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "advert/add",
      data
    })
  },
  /*编辑广告位*/
  updateAdvert:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "advert/update",
      data
    })
  },
  /*删除广告位*/
  deleteAdvert:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "advert/delete",
      data:qs.stringify(data)
    })
  },
  /*获取广告位详情*/
  getAdvertInfo:function(data){
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "advert/detail",
      data
    })
  },
  /*编辑广告位状态*/
  updateAdvertStatus:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "advert/updateStatus",
      data:qs.stringify(data)
    })
  },
  /*获取首页tag*/
  getHomeTag:function(){
    return HttpRequest.getRequest({
      method:'GET',
      url:httpUrl.BaseUrl + "tag/query",
    })
  },
  /*获取关联品牌*/
  getBrandList:function() {
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "currency/brand/listPublish"
    })
  },
  /*获取城市列表*/
  getAllCityList:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.HostApiurl + "brand/api",
      data:{
        apiUrl:httpUrl.CityUrl + 'brand/v1.0/phone/cityList',
        method:'get'
      }
    })
  },
  /*获取品类列表*/
  getCategoryList:function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "category/query",
      data
    })
  },
  /*修改品类*/
  updateCategory:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "category/update",
      data
    })
  },
  /*添加品类*/
  addCategory:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "category/add",
      data
    })
  },
  /*删除品类*/
  delCategory:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "category/delete",
      data:qs.stringify(data)
    })
  },
  /*查询百科品牌列表*/
  getWikiBrandList:function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "wikiBrand/query",
      data
    })
  },
  /*百科品牌下架*/
  wikiBrandOffLine:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "wikiBrand/doOffLine",
      data:qs.stringify(data)
    })
  },
  /*百科品牌下架*/
  wikiBrandOnline:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "wikiBrand/doOnline",
      data:qs.stringify(data)
    })
  },
  /*获取百科品牌详情*/
  getWikiBrandDetail(data){
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "wikiBrand/detail",
      data
    })
  },
  /*修改百科品牌详情*/
  updateWikiBrandDetail(data){
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "wikiBrand/update",
      data
    })
  },
  /*添加新品牌*/
  addWikiBrandDetail(data){
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "wikiBrand/add",
      data
    })
  },
  /*删除品牌*/
  delWikiBrandItem(data){
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "wikiBrand/delete",
      data:qs.stringify(data)
    })
  },
  /*查询企业风险*/
  getCompanyRisk(data){
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "company/queryRisk",
      data
    })
  },
  /*删除企业风险*/
  delCompanyRisk(data){
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "company/deleteCompanyRiskById",
      data:qs.stringify(data)
    })
  },
  /*获取商标信息*/
  getCompanyTrademark(data){
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "company/queryCompanyTrademark",
      data
    })
  },
  /*获取所有创作者*/
  getCreatorList:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "creatorInfo/query",
      data
    });
  },
  /*查询所有文章列表*/
  getInformationList:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "information/query",
      data
    });
  },
  /*删除文章*/
  deleteInformation:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "information/delete",
      data
    })
  },
  // 删除创作者
  deleteCreator:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "creatorInfo/delete",
      data
    })
  },
  // 添加创作者
  addCreator:function (data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "creatorInfo/add",
      data
    })
  },
  //获取创作者信息
  getEditorDetail:function (data) {
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "creatorInfo/detail",
      data
    })
  },
  // 编辑创作者
  updateEditor:function (data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "creatorInfo/update",
      data
    })
  },
  //获取文章详情
  getArticleinfo:function (data) {
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "information/detail",
      data
    })
  },
  // 添加文章
  addInformation:function (data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "information/add",
      data
    })
  },
  //编辑文章
  editInformation:function (data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "information/update",
      data
    })
  },
  /*推送消息列表  */
  getALLPushMsgList:function (data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "pushMessage/query",
      data
    })
  },
  /*获取推送消息详情*/
  getPushMsgDetail:function(data){
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "pushMessage/detail",
      data
    })
  },
  /*新增推送消息*/
  addPushMsg:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "pushMessage/add",
      data
    })
  },
  /*修改推送消息*/
  updatePushMsg:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "pushMessage/update",
      data
    })
  },
  /*手动推送消息*/
  manualSendPushMsg:function(data){
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "pushMessage/send",
      data
    })
  },
  /* 删除Push消息*/
  delPsuhMsg:function(data){
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "pushMessage/delete",
      data
    })
  },
  /*获取用户分组*/
  getUserGroups:function(){
    return HttpRequest.getRequest({
      method: "GET",
      url:httpUrl.BaseUrl + "pushMessage/getGroups"
    })
  },
  /*历史推送记录*/
  getPushMsgHistory:function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url:httpUrl.BaseUrl + "pushMessage/getRecordList",
      data
    })
  }
};
export { requestApi };
