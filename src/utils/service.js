import Request from './request';
import { stringify } from 'qs';

export const loginApi = data => Request({
  url: '/users/login/mp',
  method: 'GET',
  data,
});

// 用户登录
export const getLoginTokenApi = data => Request({
  url: `/wechat/miniapp/login?${stringify(data)}`,
  data
})
