import requestAxios from '@/utils/request'

var HttpRequest = {
  getRequest({ url, data = {}, method = 'GET', contentType = 'application/json' }) {
    return new Promise((resolve, reject) => {
      this._getRequest(url, resolve, reject, data, method, contentType)
    })
  },
  _getRequest: function(url, resolve, reject, data = {}, method = 'GET', contentType = 'application/json') {
    let format = method.toLocaleLowerCase() === 'get' ? 'params' : 'data'
    requestAxios({
      url: url,
      method: method,
      [format]: data,
      header: {
        'content-type': contentType
      }
    }).then(res => {
      /*通过响应拦截器已做处理*/
      if (res) {
        resolve(res)
      }
    }).catch(err=>{
      console.log(err)
    })
  }
}
export { HttpRequest }
