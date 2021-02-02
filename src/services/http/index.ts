/**
 * http service
 * @file http请求服务（基于axios）
 * @module app/services/http
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import { IRequestConfig, ICacheAxiosResponse, TRequestUrlPath, TCancelToken, IBaseResponse } from '@app/types/http';
import { AxiosResponse } from 'axios';
import storage from '@app/services/storage';
import { showToast } from '@app/services/toast';
import request from './request';
import defaultConfig from './config';
import { constants } from './config';
import { getLocalCacheKey, encrypt } from './util';

const { PREFIX_URL } = constants;

export class HttpService {

  private params: IRequestConfig = {};
  private cancelToken: TCancelToken | null = null;
  private $preResult: Promise<AxiosResponse<any>> | null = null;

  constructor(params: IRequestConfig = {}) {
    this.params = Object.assign({}, defaultConfig, params);
  }


  async http<T>(params: IRequestConfig): Promise<AxiosResponse<T>>  {
    // 默认开启url转化
    if (params.enabledUrlConfigure) {
        params.url = `${PREFIX_URL}${params.url}`;
    }
    // 等待前置条件完成
    try {
      const additional = this.params.additional || params.additional;
      if (additional) {
        params = await additional(params);
      }
    } catch (e) {
      // nothing
    }
    const curParams: IRequestConfig = Object.assign({}, this.params, params);
    // 多次请求同一个接口，皆返回第一次请求的数据
    if (curParams.usePreResult && this.$preResult) {
      return this.$preResult;
    }
    // 如果第二次请求发起在第一次请求结束之前，取消第一次请求
    if (curParams.isCancel) {
      this.cancel();
    }
    this.cancelToken = request.CancelToken.source(curParams.method);
    // 判断是否本地储存
    let localCacheName: string | false;
    if (Number(curParams.useLocalCache) > 0) {
      localCacheName = getLocalCacheKey(curParams);
      if (localCacheName) {
        // 正常获取key名
        try {
          const cacheData: ICacheAxiosResponse<T> = await storage.get<ICacheAxiosResponse<T>>(localCacheName);
          const { lastCacheTime, result } = cacheData;
          if (lastCacheTime + Number(curParams.useLocalCache) >= Math.round((+new Date()) / 1000)) {
            return result;
          } else {
            storage.remove(localCacheName);
          }
        } catch (e) {
          // nothing
        }
      }
    }
    this.$preResult = request({
      cancelToken: this.cancelToken.token,
      ...curParams
    }).then((res: AxiosResponse<T>) => {
      const { data = {} } = res;
      const { code, message } = data as IBaseResponse; // 断言，「欺骗」TypeScript 编译器
      if (code && code !== 0 && message && curParams.errorPop) {
        curParams.errorPopCall && curParams.errorPopCall(res);
        showToast(message);
      }
      // 接口报错不缓存, TODO, 待修改 
      if (code && code === 0 && Number(curParams.useLocalCache) > 0) {
        setTimeout(() => {
          // 设置缓存和缓存时的时间
          try {
            localCacheName && storage.set(localCacheName, {
              result: res,
              lastCacheTime: Math.round((+new Date()) / 1000)
            });
          } catch (e) {
            // nothing
          }
        }, 0);
      }
      return res;
    });
    return this.$preResult;
  }
  // Get
  get<T>(url: TRequestUrlPath, params: IRequestConfig = {}, config: IRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.http<T>({
      method: 'get',
      url,
      params,
      ...config
    });
  }

  // Post
  post<T>(url: TRequestUrlPath, params: IRequestConfig = {}, config: IRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.http<T>({
      method: 'post',
      url,
      data: params,
      ...config
    });
  }

  cancel(): void {
    if (this.cancelToken) {
      this.cancelToken.cancel();
    }
  }
}


export default { HttpService, request };
