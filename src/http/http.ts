import { Api } from '@compass-aiden/utils';
import { ResponseInterceptorFn } from '@compass-aiden/utils/types/modules/api/_api.type';
import {message} from "ant-design-vue";

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
  message.warn(resp.data?.message || resp.message)
  throw new Error(resp.data?.message || resp.message)
};

const ApiInstance = new Api({
  config: {
    baseURL: '/api/v1',
  },
  interceptors: {
    response: [respInterceptor],
    error: (error) => {
      message.error(error?.message || error)
      return error
    },
    request: (req) => {
      const context = useLocalStorage('context', null)
      if (context.value) {
        // @ts-ignore
        req.headers.Authorization = JSON.parse(context.value).token
      }
      return req
    }
  },
});

export default ApiInstance;
