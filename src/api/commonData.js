import { httpUrl } from "./http.js";
import { HttpRequest } from './httpRequest';
import qs from 'qs';
/*看点列表*/
export function commonWatchList() {
  return HttpRequest.getRequest({
    method: "GET",
    url:httpUrl.BaseUrl + "currency/info/managerList"
  })
};
/*品牌列表*/
export function commonBrandList() {
  return HttpRequest.getRequest({
    method: "GET",
    url:httpUrl.BaseUrl + "currency/brand/listPublish"
  })
};
/*城市列表*/
export function commonAllCityList() {
  return HttpRequest.getRequest({
    method: "POST",
    url:httpUrl.HostApiurl + "brand/api",
    data:{
      apiUrl:httpUrl.CityUrl + 'brand/v1.0/phone/cityList',
      method:'get'
    }
  })
};
/*新版资讯列表*/
export function commonInfoNewList() {
  return HttpRequest.getRequest({
    method: "GET",
    url:httpUrl.BaseUrl + "currency/infoNew/list"
  })
};
