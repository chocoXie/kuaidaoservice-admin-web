import { httpUrl } from "./http.js";
import axios from 'axios'
/*OSS地址*/
let getOSSsignUrl = httpUrl.BaseUrl+'common/oss';
/*防止文件重名*/
function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}
/*获取oss签名*/
/*
  _index:索引
  param:需要上传的内容
  type:图片上传的目录
 */
let ossupload = {
  ossuploadFile(_index = '',param,type){
    return new Promise((resolve, reject) => {
      //得到文件的内容
      let file = param;
      //填写获取签名的地址
      // advert  广告
      var serviceType = type;
      const getPolicyApiUrl = getOSSsignUrl + "?business=" + serviceType;
      axios({
        method: 'get',
        url: getPolicyApiUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Control-Allow-Origin': '*'
        }
      }).then(res => {
        let response = res.data;
        if (response.code == 0) {
          let policyData = response.data;
          let ossUrl = policyData.host + '/';//OSS服务器的地址
          let filName = getUUID();
          let accessUrl = policyData.dir + filName;//设置上传的访问路径
          let sendData = new FormData();// 上传文件的data参数
          sendData.append('OSSAccessKeyId', policyData.accessId);
          sendData.append('policy', policyData.policy);
          sendData.append('Signature', policyData.signature);
          sendData.append('keys', policyData.dir);
          sendData.append('key', accessUrl);//上传的文件路径
          sendData.append('success_action_status', 200); // 指定返回的状态码
          sendData.append('type', 'image/jpeg');
          sendData.append('file', file);
          axios.post(ossUrl, sendData).then(res=>{
            if (res.status == 200){
              let pictureUrl = ossUrl + accessUrl;
              resolve(pictureUrl)
            }
          }).catch(err=>{
            reject(err)
          })
        }
      })
    })
  }
}
export { ossupload }

