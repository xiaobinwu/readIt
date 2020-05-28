/**
 * Storage service
 * @file 本地存储服务
 * @module app/services/storage
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import AsyncStorage from '@react-native-community/async-storage';

export const get = <T>(key: string): Promise<T> => {
    return AsyncStorage.getItem(key).then(data => {
        return data ? JSON.parse(data) : data;
    });
};

export const set = (key: string, value: any): Promise<void> => {
    return AsyncStorage.setItem(key, JSON.stringify(value));
};

export const remove = (key: string): Promise<void> => {
    return AsyncStorage.removeItem(key);
};

export const clear = (): Promise<void> => {
    return AsyncStorage.clear();
};

export default {
    get,
    set,
    remove,
    clear
};
