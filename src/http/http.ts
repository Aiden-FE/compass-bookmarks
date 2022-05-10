import {Api} from '@compass-aiden/utils';
import { ResponseInterceptorFn } from '@compass-aiden/utils/types/modules/api/_api.type';

const respInterceptor: ResponseInterceptorFn = (resp) => {
  if (resp.status === 200 && resp.data?.status === 200) {
    return resp.data.result;
  }
  throw new Error(resp.data?.message || resp.message);
};

const ApiInstance = new Api({
  interceptors: {
    response: [respInterceptor],
  },
});

export default ApiInstance
