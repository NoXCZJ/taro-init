import Request from '@/utils/request';
import { stringify } from 'qs';

export const loginApi = data => Request({
  url: '/users/login',
  method: 'POST',
  data,
});

// 用户登录
export const getLoginTokenApi = data => Request({
  url: `/wechat/miniapp/login?${stringify(data)}`,
  data
})
