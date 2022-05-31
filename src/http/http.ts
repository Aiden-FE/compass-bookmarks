import { Api } from '@compass-aiden/utils';
import { ResponseInterceptorFn } from '@compass-aiden/utils/types/modules/api/_api.type';
import { message } from 'ant-design-vue';
import userStore from '~/store/user';

const respInterceptor: ResponseInterceptorFn = (resp) => {
  if (resp.config.disableResponseInterceptor) {
    return resp.data;
  }
  if (resp.status >= 200
    && resp.status <= 299
    && resp.data?.status === 100200
  ) {
    return resp.data.result;
  }
  message.warn(resp.data?.message || resp.message);
  throw new Error(resp.data?.message || resp.message);
};

const ApiInstance = new Api({
  config: {
    baseURL: '/api/v1',
    headers: {
      owner_app: 'BOOKMARK',
    },
  },
  interceptors: {
    response: [respInterceptor],
    error: (error) => {
      if (error.response?.status === 401) {
        const { resetUserInfo } = userStore();
        resetUserInfo();
        message.warn('授权信息不存在或已过期');
        return error;
      }
      message.error(error?.message || error);
      return error;
    },
    request: (req) => {
      const { getUserInfo } = userStore();
      if (getUserInfo && req.headers) {
        // eslint-disable-next-line no-param-reassign
        req.headers.Authorization = getUserInfo.token;
      }
      return req;
    },
  },
});

export default ApiInstance;
