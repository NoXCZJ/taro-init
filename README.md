###  前言

**Taro** 是一套遵循 [React](https://reactjs.org/) 语法规范的 **多端开发** 解决方案。现如今市面上端的形态多种多样，Web、React-Native、微信小程序等各种端大行其道，当业务要求同时在不同的端都要求有所表现的时候，针对不同的端去编写多套代码的成本显然非常高，这时候只编写一套代码就能够适配到多端的能力就显得极为需要。

使用 **Taro**，我们可以只书写一套代码，再通过 **Taro** 的编译工具，将源代码分别编译出可以在不同端（微信小程序、H5、React-Native 等）运行的代码。


### 技术栈

React + taro + dva

#### 项目运行

```

# 全局安装taro脚手架
npm install -g @tarojs/cli

# 安装项目依赖
npm install

# 微信小程序
npm run dev:weapp

# 支付宝小程序
npm run dev:alipay

# 百度小程序
npm run dev:swan

# H5
npm run dev:h5

# React Native
npm run dev:rn

# pages模版快速生成
npm run tep `文件名`

```

#### 项目发布前准备

```bash
# 构建测试环境微信小程序
npm run build:weapp:test

# 构建预发布环境微信小程序
npm run build:weapp:pre

# 构建生产环境微信小程序
npm run build:weapp:prod
```



#### Jenkins脚本（Mac下）[文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html)

**执行shell:**

```shell
echo -------------------------------------------------------
echo GIT_BRANCH: ${GIT_BRANCH}
echo -------------------------------------------------------
# 执行项目构建

#yarn cache clean

#yarn config delete proxy
#npm config rm proxy
#npm config rm https-proxy

# 加速包安装以及node-sass
# 因为使用的是taro，所以会有node-sass
yarn config set registry https://registry.npm.taobao.org
yarn config set sass_binary_site https://npm.taobao.org/mirrors/node-sass

yarn install

if [ "$build_type" == "prod_upload" ]
  then
  rm -rf dist && yarn run build:weapp:prod
else
  rm -rf dist && yarn run build:weapp:$build_type
fi

# 打开微信开发者工具
/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/bin/cli -o
port=$(cat "/Users/winter/Library/Application Support/微信开发者工具/Default/.ide")
echo "微信开发者工具运行在${port}端口"
return_code=$(curl -sL -w %{http_code} http://127.0.0.1:${port}/open)

if [ $return_code == 200 ]
  then
  echo "返回状态码200，devtool启动成功！"
else
  echo "返回状态码${return_code}，devtool启动失败"
  exit 1
fi

#打印登录
return_status_code=$(curl -sL -w %{http_code} http://127.0.0.1:${port}/preview?projectpath=$WORKSPACE -o /dev/null)
echo "${return_status_code}"

if [ $return_status_code == 200 ]
  then
  if [ "$build_type" == "test" ] || [ "$build_type" == "pre" ] || [ "$build_type" == "prod" ]
    then
    echo "发布开发版！"
    # wget -o下载预览二维码，以build_id命名
    /usr/local/bin/wget -O $BUILD_ID.png http://127.0.0.1:${port}/preview?projectpath=$WORKSPACE
    echo "预览成功！请扫描二维码进入开发版！"
  elif [ "$build_type" == "prod_upload" ]
    then
    echo "准备上传！"
    # 上传到微信平台
    /Applications/wechatwebdevtools.app/Contents/Resources/app.nw/bin/cli -u $upload_version@$WORKSPACE --upload-desc $upload_desc
    echo "上传成功！请到微信小程序后台设置体验版或提交审核！"
  fi
else
  echo "未登录"
  /usr/local/bin/wget -O $BUILD_ID.png http://127.0.0.1:${port}/login
fi

```




## 项目说明


### 目标功能

暂定

### 业务介绍

目录结构

    ├── .temp                  // H5编译结果目录
    ├── .rn_temp               // RN编译结果目录
    ├── dist                   // 小程序编译结果目录
    ├── config                 // Taro配置目录
    │   ├── dev.js                 // 开发时配置
    │   ├── index.js               // 默认配置
    │   └── prod.js                // 打包时配置
    ├── src                    // 源码目录
    │   ├── components             // 组件
    │   ├── config                 // 项目开发配置
    │   ├── images                 // 图片文件
    │   ├── models                 // redux models
    │   ├── pages                  // 页面文件目录
    │   │   └── home
    │   │       ├── index.js           // 页面逻辑
    │   │       ├── index.scss         // 页面样式
    │   │       ├── model.js           // 页面models
    │   │       └── service.js        // 页面api
    │   ├── styles             // 样式文件
    │   ├── utils              // 常用工具类
    │   ├── app.js             // 入口文件
    │   └── index.html
    ├── package.json
    └── template.js            // pages模版快速生成脚本,执行命令 npm run tep `文件名`
