import { httpUrl } from "./http.js";
import request from '@/utils/request'
import qs from 'qs';

export function login(data) {
  return request({
    url: httpUrl.BaseUrl + 'login',
    method: 'post',
    data:qs.stringify(data)
  })
}
export function getInfo(token) {
  return request({
    url: httpUrl.BaseUrl + 'sysUser/getCurrentUserInfo',
    method: 'get',
    params: { token }
  })
}
export function getUserPermissions(token) {
  return request({
    url: httpUrl.BaseUrl + 'sysPermission/getCurrentUserPermissions',
    method: 'get',
    params: { token }
  })
}
export function logout(token) {
  return request({
    url: httpUrl.BaseUrl + 'loginOut',
    method: 'post',
    params: { token }
  })
}
