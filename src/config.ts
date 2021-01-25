/**
 * App config
 * @file App 配置
 * @module app/config
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import { Platform } from 'react-native';
import packageJSON from '../package.json';

export const appApi = 'http://192.168.47.1:8087/api/readIt';
export const staticApi = 'http://read-it.oss-cn-shenzhen.aliyuncs.com';
export const appName = 'ReadIt';
export const webUrl = 'http://wushaobin.top';
export const email = 'xiaobin_wu@yahoo.com';
export const GitHubUrl = 'https://github.com/xiaobinwu';
export const version = packageJSON.version;
export const weatherCurUrl = 'https://devapi.qweather.com/v7/weather/now';
export const weather3dUrl = 'https://devapi.qweather.com/v7/weather/3d';
export const weatherKey = 'f51675abaa1840548d4fcce778828437'; // https://dev.qweather.com/docs/api/weather/

export const IS_DEV = __DEV__;
export const IS_IOS = Object.is(Platform.OS, 'ios');
export const IS_ANDROID = !IS_IOS;
