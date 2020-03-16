import Taro, { Component } from '@tarojs/taro'
import '@babel/polyfill'
import Home from './pages/home'
import dva from './utils/dva'
import models from './models'
import { Provider } from '@tarojs/redux'

import './styles/base.css'

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();

class App extends Component {

  config = {
    pages: [
      'pages/home/index',         // 首页
      'pages/login/index',        // 登录
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'yeting-taro',
      navigationBarTextStyle: 'black',
      navigationStyle: 'custom'
    }
  }

  async componentWillMount() {
    const { dispatch } = store;
    // 初始化MTA
    // dispatch({
    //   type: "common/mtaAppInit"
    // });
    // 获取用户手机系统信息
    dispatch({
      type: 'common/checkSystemInfo'
    });
  }

  componentDidMount() {}

  render() {
    return (<Provider store={store}>
      <Home />
    </Provider>);
  }
}

Taro.render(<App />, document.getElementById('app'))
