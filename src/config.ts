/**
 * App config
 * @file App 配置
 * @module app/config
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import { Platform } from 'react-native';


export const IS_DEV = __DEV__;
export const IS_IOS = Object.is(Platform.OS, 'ios');
export const IS_ANDROID = !IS_IOS;
