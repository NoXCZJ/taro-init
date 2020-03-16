// const ENV = "development";  //development  release
// const ENV = "release";  //development  release
const ENV = process.env.BUILD_ENV === 'test' ? 'development' : 'release';

// cos
const cosUrl = "https://test-123456789.file.myqcloud.com";

// 基础配置
const baseConfig = {
  // mta上报开关
  MtaSwitch: process.env.BUILD_ENV === 'prod' ? true : false,
  noConsole: true,
  appVersion: "1.0.0", //应用版本 v0.0.1实际的迭代版本
  apiVersion: "v1",   //api大的版本号（用于重构）  v1(默认)、v2
  cosUrl,
  cosBasePath: `${cosUrl}/test`,
}

// 开发环境
const devConfig = {
  version: "dev",
  noConsole: false,
  baseUrl: "https://micro.test.com/test/v1", //请求连接前缀
}

// 生产环境
const relConfig = {
  version: "release",
  noConsole: true,
  baseUrl: process.env.BUILD_ENV === 'pre' ? 'https://pre-xqlive.test.com/test/v1' : 'https://xqlive.test.com/test/v1', //请求连接前缀
}

const Config = Object.assign(baseConfig, ENV == "development" ? devConfig : relConfig);
// const Config = Object.assign({ fundebugConfig }, baseConfig, ENV == "development" ? devConfig : relConfig);

export default Config;
