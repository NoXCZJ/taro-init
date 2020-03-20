import Taro, { useState, useDidShow } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import _isFunction from 'lodash/isFunction';
import { getGlobalData, setGlobalData } from '@/utils/global_data';

import './index.less';

function Index(props) {

  const {
    className = '',
    background = 'rgba(255, 255, 255, 1)',
    placeholder = true, // 是否需要导航栏占位
    // backgroundColorTop = 'rgba(255, 255, 255, 1)',
    color = 'rgba(0, 0, 0, 1)',
    title = '',
    back = false,
    home = false,
    delta = 1, // 返回的页面数，如果 delta 大于现有页面数，则返回到首页。
    iconTheme = 'black', // icon的主体色；默认：'black'（黑色）；'white'（白色）
    onBack,
    onHome
  } = props;

  let globalSystemInfo = getSystemInfo();

  const [configStyle, setConfigStyle] = useState(setStyle(globalSystemInfo));
  const {
    navigationbarinnerStyle,
    navBarLeft,
    navBarHeight,
    capsulePosition,
    navBarExtendHeight,
    ios,
    rightDistance
  } = configStyle;

  useDidShow(() => {
    if (globalSystemInfo.ios) {
      globalSystemInfo = getSystemInfo();
      setConfigStyle(setStyle(globalSystemInfo));
    }
  })

  function setStyle(systemInfo) {
    const {
      statusBarHeight,
      navBarHeight,
      capsulePosition,
      navBarExtendHeight,
      ios,
      windowWidth
    } = systemInfo;

    const rightDistance = windowWidth - capsulePosition.right; // 胶囊按钮右侧到屏幕右侧的边距
    const leftWidth = windowWidth - capsulePosition.left; // 胶囊按钮左侧到屏幕右侧的边距

    const navigationbarinnerStyle = [
      `color: ${color}`,
      `background: ${background}`,
      `height:${navBarHeight + navBarExtendHeight}px`,
      `padding-top:${statusBarHeight}px`,
      `padding-right:${leftWidth}px`,
      `padding-bottom:${navBarExtendHeight}px`
    ].join(';');

    let navBarLeft = [];
    if ((back && !home) || (!back && home)) {
      navBarLeft = [`width:${capsulePosition.width}px`, `height:${capsulePosition.height}px`].join(';')
    } else if ((back && home) || title) {
      navBarLeft = [
        `width:${capsulePosition.width}px`,
        `height:${capsulePosition.height}px`,
        `margin-left:${rightDistance}px`
      ].join(';')
    } else {
      navBarLeft = ['width:auto', 'margin-left:0px'].join(';')
    }

    return {
      navigationbarinnerStyle,
      navBarLeft,
      navBarHeight,
      capsulePosition,
      navBarExtendHeight,
      ios,
      rightDistance
    };
  }

  // 获取用户手机基本信息
  function getSystemInfo() {
    let systemInfo = getGlobalData('globalSystemInfo');
    if (systemInfo) {
      return systemInfo;
    } else {
      systemInfo = Taro.getSystemInfoSync();
      const ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
      systemInfo.ios = ios
      const rect = getMenuButtonBoundingClientRect(systemInfo);

      let navBarHeight;
      if (!systemInfo.statusBarHeight) {
        systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;

        navBarHeight = (function () {
          const gap = rect.top - systemInfo.statusBarHeight;
          return 2 * gap + rect.height;
        }());

        systemInfo.statusBarHeight = 0;
        systemInfo.navBarExtendHeight = 0; // 下方扩展4像素高度 防止下方边距太小
      } else {
        navBarHeight = (function () {
          const gap = rect.top - systemInfo.statusBarHeight;
          return systemInfo.statusBarHeight + 2 * gap + rect.height;
        }());

        if (ios) {
          systemInfo.navBarExtendHeight = 4; // 下方扩展4像素高度 防止下方边距太小
        } else {
          systemInfo.navBarExtendHeight = 0;
        }
      }

      systemInfo.navBarHeight = navBarHeight; // 导航栏高度不包括statusBarHeight
      systemInfo.capsulePosition = rect;
      systemInfo.ios = ios; // 是否ios

      setGlobalData('globalSystemInfo', systemInfo); // 将信息保存到全局变量中,后边再用就不用重新异步获取了
      // console.log('systemInfo', systemInfo);
      globalSystemInfo = systemInfo;
      return systemInfo;
    }
  }

  // 检查获取到的元素信息
  function checkRect(rect) {
    // 胶囊信息4种任一属性为0返回true
    return !rect.width || !rect.top || !rect.left || !rect.height;
  }

  // 获取菜单按钮（右上角胶囊按钮）的布局位置信息
  function getMenuButtonBoundingClientRect(systemInfo) {
    const { ios } = systemInfo;
    // 胶囊高度；ios和Android一致
    const capsuleHeight = 32;
    let rect;
    try {
      rect = Taro.getMenuButtonBoundingClientRect ? Taro.getMenuButtonBoundingClientRect() : null;
      if (rect === null) {
        throw new Error('getMenuButtonBoundingClientRect Error');
      }
      // 取值为0的情况  有可能width不为0 top为0的情况
      if (checkRect(rect)) {
        throw new Error('getMenuButtonBoundingClientRect Error');
      }
    } catch (error) {
      let gap = 4; // 胶囊按钮上下间距；使导航内容居中
      let width = 88; // 胶囊宽度
      if (systemInfo.platform === 'android') {
        // 安卓机
        gap = 8;
        width = 96;
      } else if (systemInfo.platform === 'devtools') {
        // 开发工具的模拟器
        if (ios) {
          gap = 5.5;
        } else {
          gap = 7.5;
        }
      }
      if (!systemInfo.statusBarHeight) {
        // 开启wifi的情况下修复statusBarHeight值获取不到
        systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
      }
      // 获取不到胶囊信息就自定义重置一个
      rect = {
        top: systemInfo.statusBarHeight + gap,
        bottom: systemInfo.statusBarHeight + gap + capsuleHeight,
        left: systemInfo.windowWidth - width - 10,
        right: systemInfo.windowWidth - 10,
        height: capsuleHeight,
        width
      };
    }

    return rect;
  }

  function handleBackClick() {
    if (_isFunction(onBack)) {
      onBack();
    } else {
      const pages = Taro.getCurrentPages();
      if (pages.length >= 2) {
        Taro.navigateBack({
          delta: delta
        });
      }
    }
  }

  function handleGoHomeClick() {
    if (_isFunction(onHome)) {
      onHome();
    }
  }

  let nav_bar__center = null;
  let need_bar__center = true;

  if (title) {
    nav_bar__center = <Text className='title'>{title}</Text>;
  } else {
    // nav_bar__center = props.renderCenter; // 无效，taro针对render props的bug
    need_bar__center = false;
  }

  return (
      <View
        className={`nav-bar-component ${ios ? 'ios' : 'android'} ${className}`}
      >
        {
          // 导航栏占位
          placeholder
          &&
          <View
            className={`nav-bar__placeholder ${ios ? 'ios' : 'android'}`}
            style={`padding-top: ${navBarHeight + navBarExtendHeight}px;`}
          />
        }
        <View
          className={`nav-bar__inner ${ios ? 'ios' : 'android'}`}
          style={`background:${background};${navigationbarinnerStyle};`}
        >
          <View className='nav-bar__left' style={navBarLeft}>
            {back && !home && (
              <View
                onClick={handleBackClick.bind(this)}
                className={`nav-bar__button nav-bar__btn_goback ${iconTheme}`}
              />
            )}
            {!back && home && (
              <View
                onClick={handleGoHomeClick.bind(this)}
                className={`nav-bar__button nav-bar__btn_gohome ${iconTheme}`}
              />
            )}
            {back && home && (
              <View className={`nav-bar__buttons ${ios ? 'ios' : 'android'}`}>
                <View
                  onClick={handleBackClick.bind(this)}
                  className={`nav-bar__button nav-bar__btn_goback ${iconTheme}`}
                />
                <View
                  onClick={handleGoHomeClick.bind(this)}
                  className={`nav-bar__button nav-bar__btn_gohome ${iconTheme}}`}
                />
              </View>
            )}
            {!back && !home && props.renderLeft}
          </View>
          <View className='nav-bar__center' style={`padding-left: ${rightDistance}px`}>
            {need_bar__center ? nav_bar__center : props.renderCenter}
          </View>
          <View className='nav-bar__right' style={`margin-right: ${rightDistance}px`}>
            {props.renderRight}
          </View>
        </View>
      </View>
  );
}

Index.options = {
  multipleSlots: true,
  addGlobalClass: true
}

export default Index;
