import Vue from 'vue';

export default {
  /*table头部样式*/
  tableHeaderClass(){
    return 'background: rgba(64, 158, 255, 0.7);color:#fff;font-size:14px'
  },
  /**
 * 存储sessionStorage
 */
  setSessionStore(name, content) {
    if (!name) return
    if (typeof content !== 'string') {
      content = JSON.stringify(content)
    }
    window.sessionStorage.setItem(name, content)
  },

  /**
 * 获取sessionStorage
 */
  getSessionStore(name) {
    if (!name) return
    return window.sessionStorage.getItem(name)
  },

  /**
 * 存储localStorage
 */

  setStore(name, content) {
    if (!name) return
    if (typeof content !== 'string') {
      content = JSON.stringify(content)
    }
    window.localStorage.setItem(name, content)
  },

  /**
 * 获取localStorage
 */
  getStore(name) {
    if (!name) return
    // var value = JSON.parse(window.localStorage.getItem(name));
    var value = window.localStorage.getItem(name)
    return value
  },

  /**
 * 删除localStorage
 */
  removeStore(name) {
    if (!name) return
    window.localStorage.removeItem(name)
  },

  /**
 * 存储cookie
 */
  setCookie(objName, objValue, objHours = 30) {
    var str = objName + '=' + escape(objValue)
    if (objHours != null) {
      var date = new Date()
      var ms = objHours * 3600 * 1000 * 24
      date.setTime(date.getTime() + ms)
      str += '; expires=' + date.toGMTString()
    }
    document.cookie = str
  },

  /**
   * 获取cookie
   */
  getCookie(objName) {
    var search = objName + '='
    if (document.cookie.length > 0) {
      var offset = document.cookie.indexOf(search)
      if (offset != -1) {
        offset += search.length
        var end = document.cookie.indexOf(';', offset)
        if (end == -1) end = document.cookie.length
        return unescape(document.cookie.substring(offset, end))
      } else {
        return ''
      }
    }
    return ''
  },
  /**
   * 删除cookie
   */
  delCookie(name) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval = getCookie(name)
    if (cval != null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
    }
  },
  /**
   * 删除所有cookie
   */
  clearCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
    if (keys) {
      for (var i = keys.length; i--;) {
        document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
      }
    }
  },
  getQueryString(name) {
    var after = window.location.search;
    // if (after.indexOf('?') === -1) return null; //如果url中没有传参直接返回空
    //key存在先通过search取值如果取不到就通过hash来取
    // console.log(344);

    // var after =window.location.hash.split("?")[1];
    if (after.indexOf('?') === -1) {
      after = window.location.hash.split("?")[1];
    }
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    if(after!=undefined){
    var r = after.match(reg);

      if (r != null) {
        return decodeURIComponent(r[2]);
      }
      else {
        return null;
      }
    }else{
      return null;
    }
  },
  /**
   * Parse the time to string
   * @param {(Object|string|number)} time
   * @param {string} cFormat
   * @returns {string | null}
   */
  parseTime(time, cFormat) {
    if (arguments.length === 0 || !time) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string')) {
        if ((/^[0-9]+$/.test(time))) {
          // support "1548221490638"
          time = parseInt(time)
        } else {
          // support safari
          // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
          time = time.replace(new RegExp(/-/gm), '/')
        }
      }

      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
      const value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
      return value.toString().padStart(2, '0')
    })
    return time_str
  },
  /**
   * @param {number} time
   * @param {string} option
   * @returns {string}
   */
  formatTime(time, option) {
    if (('' + time).length === 10) {
      time = parseInt(time) * 1000
    } else {
      time = +time
    }
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
      return '刚刚'
    } else if (diff < 3600) {
      // less 1 hour
      return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
      return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
      return '1天前'
    }
    if (option) {
      return parseTime(time, option)
    } else {
      return (
        d.getMonth() +
        1 +
        '月' +
        d.getDate() +
        '日' +
        d.getHours() +
        '时' +
        d.getMinutes() +
        '分'
      )
    }
  },

  /**
   * @param {string} url
   * @returns {Object}
   */
  param2Obj(url) {
    const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
    if (!search) {
      return {}
    }
    const obj = {}
    const searchArr = search.split('&')
    searchArr.forEach(v => {
      const index = v.indexOf('=')
      if (index !== -1) {
        const name = v.substring(0, index)
        const val = v.substring(index + 1, v.length)
        obj[name] = val
      }
    })
    return obj
  }

}


