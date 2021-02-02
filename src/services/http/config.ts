
import { IRequestConfig, EHttpConstants } from '@app/types/http';

const defaultConfig: IRequestConfig = {
  method: 'post',
  isFilterEmptyField: false, // 是否过滤空字段
  isCancel: false, // 如果第二次请求发起在第一次请求结束之前，取消第一次请求
  errorPop: true, // 是否弹出默认错误信息
  useLocalCache: 0, // 通过本地缓存cache接口数据，0 不缓存，单位（s） 3 * 24 * 60 * 60
  usePreResult: false, // 多次请求同一个接口，皆返回第一次请求的数据，不会判断参数变更，谨慎使用
  enabledUrlConfigure: true, // 是否开启url转化
  encrypt: false, // 是否请求加密
  // 等待前置条件完成，再发起请求
  // additional: (params) => { return params },
};

export default defaultConfig;

export const constants: EHttpConstants = {
  TIMEOUT: 20 * 1000,
  JSONPREFIX: '__jp',
  PREFIX_URL: '/api'
};
