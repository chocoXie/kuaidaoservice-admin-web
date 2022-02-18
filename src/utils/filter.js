/*接口类型*/
const ApiTtype = function(val) {
  let ApiTtypeMsg = ''
  switch (val) {
    case 1:
      ApiTtypeMsg = '首页banner'
      break
    case 2:
      ApiTtypeMsg = '筛选品类接口'
      break
    case 3:
      ApiTtypeMsg = '看点顶部banner'
      break;
    case 4:
      ApiTtypeMsg = '个人中心banner'
      break;
    case 5:
      ApiTtypeMsg = '搜索页-猜你喜欢'
      break;
    case 6:
      ApiTtypeMsg = '无忧退款'
      break;
    case 7:
      ApiTtypeMsg = '限时立减'
      break;
    case 8:
      ApiTtypeMsg = '首页'
      break;
    case 9:
      ApiTtypeMsg = '搜索页-大家都在搜'
      break;
    default:
      break
  }
  return ApiTtypeMsg
}

const getSkipType = function(val) {
  let skipTypeMsg = '';
  switch (val) {
    case 1:
      skipTypeMsg = '仅唤醒'
      break;
    case 2:
      skipTypeMsg = '详情页'
      break;
    case 3:
      skipTypeMsg = '看点'
      break;
    case 4:
      skipTypeMsg = 'banner'
      break;
    default:
      break;
  }
  return skipTypeMsg;
}

export {
  ApiTtype,
  getSkipType
}
