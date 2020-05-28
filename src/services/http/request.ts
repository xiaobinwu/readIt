import axios from 'axios';
import { ERequestMethod, IRequestConfig, TCancelToken } from '@app/types/http';
import oAxios from './oAxios';
import jsonp from './jsonp';



const request = (options: any): Promise<any> => {
  const curFetch = String(options.method).toLocaleLowerCase() === 'jsonp' ? jsonp : oAxios;
  return curFetch(options);
};

// jsonp 兼容axios取消操作
request.CancelToken = {
  source(type: ERequestMethod): TCancelToken {
    if (type === 'jsonp') {
      return jsonp.CancelToken.source();
    }
    return axios.CancelToken.source();
  },
};

export default request;

