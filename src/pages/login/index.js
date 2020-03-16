import Taro, { Component } from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import NavBar from '@components/navbar';
import {
  checkSystemInfo
} from '@/utils/util';
import './index.less';

@connect(({ common }) => ({
  common: common
}))
class Index extends Component {
  config = {
    navigationBarTitleText: '登录',
    enablePullDownRefresh: false
  };
  static options = {
    addGlobalCalss: true
  }
  constructor(props) {
    super(props);
    this.state = {}
  }
  async componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "common/mtaPageInit",
    });
  }

  componentDidMount = async () => {};

  handleLogin = async () => {
    const { dispatch } = this.props;
    const sysInfo = checkSystemInfo();
    console.log(sysInfo);
    const data = await dispatch({
      type: 'common/login',
      payload: {
        userId: sysInfo.brand === 'devtools' ? 10003 : 10007
      }
    });

    if (data) {
      Taro.reLaunch({
        url: '/pages/home/index'
      });
    }
  }

  render() {
    return (
      <View className='main-container'>
        <NavBar
          title='登录'
          background='#fff'
          extClass="navBar"
          back
          home
        />
        <View className="main-page">
          <Button onClick={this.handleLogin}>登录</Button>
        </View>
      </View>
    )
  }
}

export default Index;
