import axios from 'axios';
import qs from 'qs';
import { IRequestConfig } from '@app/types/http';
import { AxiosResponse } from 'axios';
import { LANGUAGE_KEYS } from '@app/constants/language';
import i18n from '@app/services/i18n';
import { showToast } from '@app/services/toast';
import defaultConfig, { constants } from './config';
import { isNotEmptyObject } from './util';

const { TIMEOUT } = constants;

// 删除所有对象中的空字段，不包括数组中非对象数据的空字符
const filterEmptyData = (field: any) => {
  const keys = Object.keys(field);
  keys.map((key: any) => {
      const value = field[key];
      if(value === null || value === undefined || value === '') {
          if(Array.isArray(field)) {
              // 不删除数组中''元素
              if(value != '') {
                field.splice(key, 1);
              }
          } else {
            // 删除对象中值为null, undefined 和''的属性
            // eslint-disable-next-line prefer-reflect
            delete field[key];
          }
      } else if(typeof value === 'object') {
        filterEmptyData(value);
      }
  });
};

// 过滤空字段
export const filterEmptyField = (config: IRequestConfig): IRequestConfig => {
  const { data, isFilterEmptyField, headers } = config;
  // multipart/form-data不做字段过滤
  if (headers && headers['Content-Type'] === 'multipart/form-data') { return data; }
  if (!isFilterEmptyField) { return data; }
  const dataCopy = JSON.parse(JSON.stringify(data));
  filterEmptyData(dataCopy);
  return dataCopy;
};



// 发起请求前与默认配置合并
const assignConfig = (config: IRequestConfig = {}): IRequestConfig => {
  // application/x-www-form-urlencoded需要使用qs
  if (config.headers && isNotEmptyObject(config.headers) && config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    const handleForXwwwFormUrlencodedFunc = (data: any, headers: any): any => qs.stringify(data);
    if (Array.isArray(config.transformRequest)) { config.transformRequest.push(handleForXwwwFormUrlencodedFunc); } else {
      config.transformRequest = [handleForXwwwFormUrlencodedFunc];
    }
  }
  return Object.assign({}, defaultConfig, config);
};

// 创建实例
const oAxios = axios.create({
  responseType: 'json',
  timeout: TIMEOUT,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// 请求拦截器
oAxios.interceptors.request.use((config: IRequestConfig): any => {
  // 配置过滤空字段
  config.data = filterEmptyField(config);
  // 合并配置
  const finalConfig = assignConfig(config);
  return finalConfig;
}, (error: any) => {
  const text = i18n.t(LANGUAGE_KEYS.NETWORK_ERROR);
  showToast(text);
  console.warn(`${text}：`,  error);
  Promise.reject(error);
});

// 响应拦截器
oAxios.interceptors.response.use((res: AxiosResponse<any>): any => {
  return res || {};
}, (error: any) => {
  // 网络错误，500，404
  const text = i18n.t(LANGUAGE_KEYS.NETWORK_ERROR);
  showToast(text);
  console.warn(`${text}：`,  error);
});

export default oAxios;
