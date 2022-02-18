import Cookies from 'js-cookie'

const TokenKey = 'kuaidaoservice_admin_web_token';
const isHasPermissions = 'isHasPermissions';

export function getToken() {
  return Cookies.get(TokenKey)
}
export function getPermissions() {
  return Cookies.get(isHasPermissions)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setPermissions(num) {
  return Cookies.set(isHasPermissions, num)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function removePermissions() {
  return Cookies.remove(isHasPermissions)
}
