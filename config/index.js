var path = require("path");
const { BUILD_ENV } = process.env;

const config = {
  projectName: 'yeting-broadcasting-taro',
  date: '2018-11-12',
  // 设计稿尺寸
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  // 通用插件配置
  babel: {
    sourceMap: true,
    presets: [
      ['env', {
        modules: false
      }]
    ],
    plugins: [
      'transform-class-properties',
      'transform-decorators-legacy',
      'transform-object-rest-spread',
      ['transform-runtime', {
        "helpers": false,
        "polyfill": false,
        "regenerator": true,
        "moduleName": 'babel-runtime'
      }]
    ]
  },
  plugins: [],
  env: {
    BUILD_ENV: JSON.stringify(BUILD_ENV)
  },
  // 全局变量设置
  defineConstants: {},
  alias: {
    '@components': path.resolve(__dirname, '..', 'src/components'),
    '@': path.resolve(__dirname, '..', 'src'),
  },
  copy: {
    patterns: [
      { from: path.resolve(__dirname, '..', 'src/sitemap.json'), to: path.resolve(__dirname, '..', 'dist/sitemap.json') } // copy微信小程序的sitemap.json文件
    ]
  },
  // 小程序端专用配置
  mini: {
    compile: {
      exclude: [function (modulePath) {
        return modulePath.indexOf('tim-wx-sdk') >= 0
      }]
    },
    imageUrlLoaderOption:{
      limit: 500,
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      },
      pxtransform: {
        enable: true,
        config: {

        }
      },
      // 小程序端样式引用本地资源内联配置
      url: {
        enable: true,
        limit: 500
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  // H5 端专用配置
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
    // router: {
    //   mode: 'browser' // 或者是 "browser"
    // }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
