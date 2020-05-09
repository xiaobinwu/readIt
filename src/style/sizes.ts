/**
 * Style Sizes
 * @file 尺寸相关的配置
 * @module app/sizes
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import { Dimensions, StyleSheet } from 'react-native';
import { IS_IOS } from '@app/config';

const { width, height } = Dimensions.get('window');

export const goldenRatio = 0.618;

export const screen = {
    height,
    width,
    widthHalf: width * 0.5,
    widthThird: width * 0.333,
    widthTwoThirds: width * 0.666,
    widthQuarter: width * 0.25,
    widthThreeQuarters: width * 0.75,
    heightTwoThirds: height * 0.666,
    heightHoldenRatio: height * goldenRatio
};

export default {
  gap: 20,
  goldenRatioGap: 20 * goldenRatio,
  screen
};
