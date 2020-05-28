import { IRequestConfig } from '@app/types/http';

export const getLocalCacheKey = (params: IRequestConfig): string | false => {
  try {
    const queryStr = Object.entries({
      ...params.params,
      ...String(params.data) === params.data ? {
        pdata: params.data
      } : params.data
    }).map(([key, value]) => `${key}_${value}`).join('_');
    return `${params.url}_${queryStr}`.replace(/[^a-z | A-Z | \d]/g, '_');
  } catch (e) {
    return false;
  }
};

export const isNotEmptyObject = (obj: object): boolean => {
  return obj && Object.keys(obj).length > 0;
};
