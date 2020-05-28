/**
 * Global HTTP types
 * @file HTTP 响应模型
 * @module types/http
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import { AxiosRequestConfig, AxiosResponse, Method, CancelTokenSource, Canceler, CancelToken } from 'axios';

export type TRequestUrlPath = string;
export type TRequestData = object;

// 请求参数
export interface IRequestParams {
  [key: string]: any;
}

export type ERequestJSONPMethod = 'jsonp' | 'JSONP' | undefined;

// 请求方法
export type ERequestMethod = Method | ERequestJSONPMethod;

// 常量配置-枚举
export interface EHttpConstants {
  TIMEOUT: number;
  JSONPREFIX: string
}

// http请求response data（必须返回）
export interface IBaseResponse {
  code: number;
  message: string;
}

// 页数数据
export interface IHttpPaginate extends IBaseResponse  {
  total: number; // 总页数
  page: number; // 当前页
  pages: number; // 总页数
  size: number; // 每页显示数据数
}

// 翻页数据
export interface IHttpResultPaginate<T> extends IHttpPaginate {
  entry: {
    list: T
  }
}



// 缓存的请求结果-接口定义
export interface ICacheAxiosResponse<T> {
  lastCacheTime: number;
  result: AxiosResponse<T>;
}

// http请求默认配置-接口定义

type TCancelTokenConfig = CancelToken | number;

type TAxiosRequestConfig = Omit<AxiosRequestConfig, 'cancelToken'>;

export interface IRequestConfig extends TAxiosRequestConfig {
  cancelToken?: TCancelTokenConfig;
  isFilterEmptyField?: boolean;
  isCancel?: boolean;
  errorPop?: boolean;
  useLocalCache?: number;
  usePreResult?: boolean;
  additional?: (params: IRequestConfig) => Promise<IRequestConfig>;
  prefix?: string;
  jsonpCallback?: string;
}

// 兼容Jsonp CancelToken
export interface IJsonpCancelTokenSource {
  token: number;
  cancel: Canceler;
}

export type TCancelToken = CancelTokenSource | IJsonpCancelTokenSource;
