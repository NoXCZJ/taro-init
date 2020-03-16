import {
  loginApi,
} from '@/services/api';
import {
  setStorageSync,
  getStorageSync,
  checkSystemInfo
} from '@/utils/util';
import CONFIG from '@/config';
// mta
import mta, { AppInit, customEvent } from '@/plugins/mta';

export default {
  namespace: 'common',
  state: {
    userInfo: null,
    logsParams: {
      apiVersion: CONFIG.apiVersion,
      appVersion: CONFIG.appVersion
    },
  },

  effects: {
    //上报数据logparams
    *actLogParams({ payload }, { put, select }) {
      let { logsParams } = yield select(state => state.common);
      let newParams = Object.assign({}, logsParams, payload);
      yield put({
        type: "save",
        payload: {
          logsParams: newParams,
        }
      })
      setStorageSync('logsParams', newParams);
    },
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(loginApi, payload);
        if (response) {
          setStorageSync('user_info', response);
          setStorageSync('loginToken', response.token);
          put({
            type: 'save',
            payload: {
              userInfo: response
            }
          });
          return response;
        }
      } catch (error) {
        console.log("loginApi error", e)
      }
      return false;
    },
    // 获取手机信息
    *checkSystemInfo({ payload }, { put, select }) {
      let {
        systemInfo,
      } = yield select(state => state.common);
      if (!systemInfo) {
        systemInfo = yield checkSystemInfo();
      }
      yield put({
        type: "actLogParams",
        payload: {
          os: systemInfo && systemInfo.system,
          deviceInfo: systemInfo && systemInfo.brand,
          wxVersion: systemInfo && systemInfo.version,
          sdkVersion: systemInfo && systemInfo.SDKVersion,
          userInfo: getStorageSync('user_info') || null
        }
      })
    },
    //mta初始化
    *mtaAppInit({ payload }) {
      let params = Object.assign({}, payload)
      CONFIG.MtaSwitch && log('act mta初始化', params);
      CONFIG.MtaSwitch && AppInit(params);
    },
    // mta 页面初始化
    *mtaPageInit({ payload }) {
      CONFIG.MtaSwitch && log('act mta页面初始化', payload);
      CONFIG.MtaSwitch && mta.Page.init();
    },
    // mta 自定义事件
    *mtaEvent({ payload }) {
      let { type, params = {} } = payload;
      CONFIG.MtaSwitch && log('act mta 自定义事件 type', type, 'sendParams', params)
      CONFIG.MtaSwitch && customEvent(type, params);
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
