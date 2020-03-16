import Taro from '@tarojs/taro';
import CONFIG from '@/config';
import { setGlobalData } from '@/utils/global_data';

import {
  setStorageSync,
  getStorageSync
} from '@/utils/util';

let isShowLoginTips = false;

export default (options = {
  method: 'GET',
  data: {}
}) => {

  //用户TOKEN
  let userToken = '';
  let requestType = options.requestType || '';
  let postData = {};
  let systemObj = getStorageSync('logsParams');
  let header = options.header;
  let isBackALL = options.backAll;
  let isNotToken = options.isNotToken;
  // 1.0 check invalid url
  if (!options.url) {
    return false
  }

  //2.0 get token
  userToken = getStorageSync("loginToken");
  //3.0 get format send data
  postData = options.data;

  const tokenObj = userToken ? {
    token: userToken
  } : {}

  //5.0 format header
  let headerObj = Object.assign({}, {
    ...tokenObj
  }, systemObj)
  if (header) {
    options.header = Object.assign(headerObj, options.header, {
      ...tokenObj
    }, systemObj)
  } else {
    options.header = requestType ? Object.assign(headerObj, {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    }) : Object.assign(headerObj, {
      'content-type': 'application/json',
      'Accept': 'application/json'
    })
  }

  //config 可删
  if (!CONFIG.noConsole) {
    console.info(`${new Date().toLocaleString()}【 M=${options.url} 】P=${JSON.stringify(options)} 【postData ： 】 ${postData}`);

  }

  return Taro.request({
    url: CONFIG.baseUrl + options.url,
    data: postData,
    header: options.header,
    method: options.method,
  }).then((res) => {
    // console.log(postData);
    !CONFIG.noConsole && console.log("request", res);
    const {
      statusCode,
      data
    } = res;
    if (statusCode >= 200 && statusCode < 300) {
      // let app = getApp();
      // console.log(app, getGlobalData('backPage'));
      if (!isNotToken) {
        const pages = Taro.getCurrentPages();
        if (data.code !== 0) {
          if (data.code == 10003) {
            setStorageSync("user_info", '');
            setGlobalData('backPage', pages[pages.length - 1].route);
            if (pages && pages[pages.length - 1] && pages[pages.length - 1].route !== 'pages/login/index') {
              if (!isShowLoginTips) {
                isShowLoginTips = true;
                if (userToken) {
                  Taro.showModal({
                    title: '提示',
                    content: '您的账号已在其他设备登录。',
                    showCancel: false,
                    confirmText: '知道了',
                    success: function (ret) {
                      if (ret.confirm) {
                        Taro.reLaunch({
                          url: '/pages/login/index',
                        })
                      }
                    }
                  })
                } else {
                  Taro.reLaunch({
                    url: '/pages/login/index',
                  })
                }
              }
            }
          } else if (data.code == 10102) {
            // 表示微信登录信息过期、需要重新走/login流程
            setStorageSync("user_info", '');
            Taro.showToast({
              title: res.data.msg,
              icon: 'none',
              mask: true,
            });
            if (pages && pages[pages.length - 1] && pages[pages.length - 1].route !== 'pages/login/index') {
              Taro.reLaunch({
                url: '/pages/login/index',
              })
            }
          } else if (data.code == 20024) {
            setStorageSync("user_info", '');
            // 账号被冻结
            Taro.showToast({
              title: res.data.msg,
              icon: 'none',
              mask: true,
            });
            const pages = Taro.getCurrentPages();
            if (pages && pages[pages.length - 1] && pages[pages.length - 1].route !== 'pages/login/index') {
              Taro.reLaunch({
                url: '/pages/login/index',
              });
            }
          } else if (res.data && res.data.msg) {
            Taro.showToast({
              title: `${res.data.msg}~` || res.data.msg,
              icon: 'none',
              duration: 2000,
              mask: true,
            });
          }
        } else {
          isShowLoginTips = false;
        }
      }
      if (isBackALL) {
        return data
      } else {
        return data.data;
      }

    } else {
      // if ()
      // throw new Error(`网络请求错误，状态码${statusCode}`);
      Taro.showToast({
        title: data && data.msg || `网络请求失败，状态码${statusCode}`,
        icon: 'none',
        mask: true,
      });
      if (isBackALL) {
        return data
      }
    }
  }).catch((e) => {
    console.warn("e", e)
    if (e.errMsg && e.errMsg.match('fail')) {
      Taro.showToast({
        title: '请求失败~',
        icon: 'none',
        mask: true,
      });
    }
  })
}
