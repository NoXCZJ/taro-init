import mta from 'mta-wechat-analysis';

// mta 初始化
export const AppInit = (params = {}) => {
  let opations = Object.assign({}, {
    "appID": "",
    "eventID": "", // 高级功能-自定义事件统计ID，配置开通后在初始化处填写
    // "lauchOpts":options, //渠道分析,需在onLaunch方法传入options,如onLaunch:function(options){...}
    // "statPullDownFresh":true, // 使用分析-下拉刷新次数/人数，必须先开通自定义事件，并配置了合法的eventID
    "statShareApp": true, // 使用分析-分享次数/人数，必须先开通自定义事件，并配置了合法的eventID
    "statParam": true,
    "autoReport": true,
    // "statReachBottom":true // 使用分析-页面触底次数/人数，必须先开通自定义事件，并配置了合法的eventID
  }, params)
  mta.App.init(opations);
}


// 自定义事件
export const customEvent = (type, params = {}) => {
  mta.Event.stat(type, params);
}

export default mta;
