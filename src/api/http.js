import Vue from 'vue'

/*环境配置标识*/
let env = process.env.NODE_ENV;
console.log(env)
let BaseUrl;
let HostApiurl;
let CityUrl;
switch (env) {
  /*开发*/
  case 'development':
    BaseUrl = 'http://admin-pre.kuaidaoapp.com/';
    HostApiurl = 'https://mapi.kuaidao.cn/'
    CityUrl = 'https://brand.kuaidao.cn/'
    // BaseUrl = 'http://192.168.60.51:80/'
    break;
  /*测试*/
  case 'test':
    BaseUrl = 'http://admin-pre.kuaidaoapp.com/';
    HostApiurl = 'https://mapi.kuaidao.cn/'
    CityUrl = 'https://brand.kuaidao.cn/'
    break;
  /*生产*/
  case 'production':
    BaseUrl = 'http://admin-api.kuaidao.cn/';
    HostApiurl = 'https://mapi.kuaidao.cn/';
    CityUrl = 'https://brand.kuaidao.cn/';
    break;
  default:
    break;
}

let httpUrl = {
  BaseUrl,
  HostApiurl,
  CityUrl
}

export { httpUrl };




