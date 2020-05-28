/**
 * Style mixins
 * @file Mixins 预置样式
 * @module app/mixins
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import { StyleSheet, ViewStyle } from 'react-native';
import sizes from '@app/style/sizes';

const mixins = StyleSheet.create({
    // 垂直分布，全部居中
    colCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    // 水平分布，垂直居中
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    // 绝对居中
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    // 头部按钮
    headerButton: {
        paddingHorizontal: sizes.gap
    }
});

export default mixins;
