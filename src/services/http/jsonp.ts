import jsonp from 'jsonp';
import qs from 'qs';
import { TRequestUrlPath, IRequestParams, IRequestConfig } from '@app/types/http';
import i18n from '@app/services/i18n';
import { showToast } from '@app/services/toast';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { constants } from './config';

const { TIMEOUT, JSONPREFIX } = constants;

const xhrData: any = {};
let tokenStart: number = 1;

const getPathName = (url: TRequestUrlPath): string => {
  return url.replace(/^a-z/g, '_');
};

const oJonp = (config: IRequestConfig) => {
  const { url, prefix, params, jsonpCallback, cancelToken, } = config;
  return new Promise((resolve, reject) => {
    if (cancelToken && url) {
      xhrData[cancelToken as number] = jsonp(
        url,
        {
          prefix: prefix || JSONPREFIX,
          param: qs.stringify(params),
          name: jsonpCallback || getPathName(url),
          timeout: TIMEOUT
        },
        (error: any, data: any) => {
          if (error) {
            // 网络错误，500，404
            const text = i18n.t(LANGUAGE_KEYS.NETWORK_ERROR);
            showToast(text);
            reject(error);
          } else {
            // eslint-disable-next-line prefer-reflect
            delete xhrData[cancelToken as number]; // 成功返回结果后，释放
            resolve(data);
          }
        }
      );
    } else {
      reject(new Error('cancelToken或url为空'));
    }
  });
};

// 兼容 axios 取消api
class CancelTokenSource {
  public token: number;
  constructor() {
    this.token = tokenStart;
    tokenStart += 1;
  }
  cancel() {
    const calledFn = xhrData[this.token];
    if (calledFn) {
      return calledFn();
    }
    // 请求已经结束获知不存在
    return 0;
  }
}

oJonp.CancelToken = {
  source() {
    return new CancelTokenSource();
  }
};

export default oJonp;
