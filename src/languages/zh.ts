/**
 * Chinese language
 * @file 中文语言包
 * @module app/languages/chinese
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import { LANGUAGE_KEYS } from '@app/constants/language';

export default {
    [LANGUAGE_KEYS.ENGLISH]: '英文',
    [LANGUAGE_KEYS.CHINESE]: '简体中文',
    [LANGUAGE_KEYS.ARTICLELIST]: '文章列表',
    [LANGUAGE_KEYS.LOADING]: '暂无数据，下拉刷新重试',
    [LANGUAGE_KEYS.NO_RESULT_RETRY]: '加载中...',
    [LANGUAGE_KEYS.LOADMORE]: '加载更多',
    [LANGUAGE_KEYS.NO_MORE]: '没有更多',

    [LANGUAGE_KEYS.NETWORK_ERROR]: '网络请求错误',
    [LANGUAGE_KEYS.UNKNOW_ERROR]: '未知错误'
};
