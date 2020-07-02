/**
 * Style mixins
 * @file Mixins 预置样式
 * @module app/mixins
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
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

// 自定义头部按钮大小样式
export const getHeaderButtonStyle = (size?: number | void | null): { size: number, style: TextStyle } => {
    return {
        size: size != null ? size : 16,
        style: mixins.headerButton
    };
};

export default mixins;
