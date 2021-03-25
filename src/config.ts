/**
 * App config
 * @file App 配置
 * @module app/config
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import { Platform } from 'react-native';
import packageJSON from '../package.json';

// export const baseApi = 'http://47.107.148.74:8087/api';
export const baseApi = 'http://192.168.47.1:8087/api';
export const appApi = `${baseApi}/readIt`;
export const staticApi = 'http://read-it.oss-cn-shenzhen.aliyuncs.com';
export const appName = 'ReadIt';
export const webUrl = 'http://wushaobin.top';
export const email = 'xiaobin_wu@yahoo.com';
export const GitHubUrl = 'https://github.com/xiaobinwu';
export const version = packageJSON.version;
export const weatherCurUrl = 'https://devapi.qweather.com/v7/weather/now';
export const weather3dUrl = 'https://devapi.qweather.com/v7/weather/3d'; 
export const weatherKey = 'f51675abaa1840548d4fcce778828437'; // https://dev.qweather.com/docs/api/weather/

export const geocodeRegeoKey = 'a39e9f0d5d10460b3e4ae7e735f34733'; // https://console.amap.com/dev/key/app
export const geocodeRegeoUrl = 'https://restapi.amap.com/v3/geocode/regeo';

export const geocodeRegeoAndroidKey = '2a6798dbf79f695cb560bd25be519722';

export const IS_DEV = __DEV__;
export const IS_IOS = Object.is(Platform.OS, 'ios');
export const IS_ANDROID = !IS_IOS;
