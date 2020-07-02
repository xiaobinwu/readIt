/**
 * Type transformer
 * @file Type 类型转换器
 * @module app/utils/transform
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

 export type ValueOf<T extends object> = T[keyof T];
