/**
 * App util filters
 * @file 过滤器扩展
 * @module app/utils/filters
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

 import { LANGUAGE_KEYS } from '@app/constants/language';
 import i18n from '@app/services/i18n';

 // 时间转换
 export const dateToYMD = (dateString: string): string => {
    if (!dateString) {
        return dateString;
    }
    console.log(dateString.replace(/-/gi, '/'));
    const date = new Date(dateString.replace(/-/gi, '/'));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    console.log(`${year}/${month}/${day} ${hour > 11 ? i18n.t(LANGUAGE_KEYS.PM) : i18n.t(LANGUAGE_KEYS.AM)}`);
    return `${year}/${padNumber(month)}/${padNumber(day)} ${hour > 11 ? i18n.t(LANGUAGE_KEYS.PM) : i18n.t(LANGUAGE_KEYS.AM)}`;
 };

 // 文本限制
 export const stringLimit = (description: string, limit: number = 80): string => {
    return description.length < limit ? description : `${description.slice(0, limit)}...`;
 };

// 补0
export const padNumber = (n) => {
   if (n < 10) {
     return `0${n}`;
   }
   return n;
};
 

 // 获取DateObject
 export const dateToDateObject = (date: Date) => {
    return {
      dateString: date.getFullYear() + '-' + padNumber((date.getMonth() + 1)) + '-' + padNumber(date.getDate()),
      day: date.getDate(),
      month: date.getMonth() + 1,
      timestamp: date.getTime(),
      year: date.getFullYear()
    };
 };
