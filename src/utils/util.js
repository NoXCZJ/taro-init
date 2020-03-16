import Taro from '@tarojs/taro';
//获取浏览器地址的参数
export const getUrlParam = (name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2])
  return null//返回参数值
}

// 获取当前页面
export const getCurrentPages = (pageRoute) => {
  let curPageList = Taro.getCurrentPages();
  let curPage = curPageList[curPageList.length - 1].route;
  let isMatchPage = false;
  if (pageRoute) {
    isMatchPage = curPage.match(pageRoute) ? true : false;
  }
  return {
    isMatchPage,
    curPageList,
    curPage
  }
}

/**
 * 数字单位格式化
 * @param {*} count 基数
 * @param {*} format 单位
 */
export const getFormatCount = (count, format = 'w') => {
  return count >= 10000 ? `${parseInt(count/10000)}.${parseInt(count%10000/1000)}${format}` : count;
}

//日志
export const log = function (msg, level) {
  let time = dateFtt('hh:mm:ss', new Date());
  logitems.push(`${time}: ${msg}`);
  Array.prototype.unshift.call(arguments, `${time}`);
  if (level === "error") {
    console.error.apply(null, arguments);
  } else {
    console.log.apply(null, arguments);
  }
}

// 防止多次点击
export let throttle = (fn, gapTime) => {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500;
  }

  let _lastTime = null;

  // 返回新的函数
  return function () {
    let _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments); //将this和参数传给原函数
      _lastTime = _nowTime;
    }
  }
}

//设置同步缓存
export let setStorageSync = (key, value) => {
  try {
    Taro.setStorageSync(key, value);
  } catch (e) {
    console.log(e)
  }
}

//设置同步缓存
export let getStorageSync = (key) => {
  var getStorageSyncData = "";
  try {
    getStorageSyncData = Taro.getStorageSync(key);
  } catch (e) {
    console.log(e)
    return getStorageSyncData;
  }
  return getStorageSyncData;
}

/**
 * 获取用户的系统信息
 */
export let checkSystemInfo = () => {
  try {
    const res = Taro.getSystemInfoSync();
    return res;
  } catch (error) {
    console.error('getSystemInfoSync失败');
  }
}
