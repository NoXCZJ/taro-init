import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import NavBar from '@components/navbar';
import './index.less';

@connect(({ home, common }) => ({
  home: home,
  common: common,
}))
class Index extends Component {
  config = {
    navigationBarTitleText: '首页',
    enablePullDownRefresh: true
  };
  static options = {
    addGlobalCalss: true
  }
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentWillMount() {}

  componentDidMount = () => {};

  onPullDownRefresh = () => {
    Taro.stopPullDownRefresh();
  }

  render() {
    return (
      <View className='main'>
        <NavBar
          title='首页'
          background='#fff'
          extClass="navBar"
        />
        <View>
          页面
        </View>
      </View>
    )
  }
}

export default Index;
