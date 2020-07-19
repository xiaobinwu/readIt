/**
 * Style Sizes
 * @file 尺寸相关的配置
 * @module app/sizes
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import { Dimensions, StyleSheet } from 'react-native';
import { IS_IOS } from '@app/config';

const { width, height } = Dimensions.get('window');

export const defaultHeaderHeight = IS_IOS ? 44 : 56;

export const safeAreaViewTop = 44;

export const goldenRatio = 0.618;

export const safeAreaViewBottom = 34;

const screenHeight = width < height ? height : width;
const screenWidth = width < height ? width : height;

export const screen = {
    height: screenHeight,
    width: screenWidth,
    widthHalf: width * 0.5,
    widthThird: width * 0.333,
    widthTwoThirds: width * 0.666,
    widthQuarter: width * 0.25,
    widthThreeQuarters: width * 0.75,
    heightTwoThirds: height * 0.666,
    heightHoldenRatio: height * goldenRatio,
    heightSafeArea: screenHeight - safeAreaViewTop,
};

export default {
  gap: 20,
  goldenRatio,
  goldenRatioGap: 20 * goldenRatio,
  thumbHeightRatio: 1190 / 420,
  touchOpacity: 0.6,
  screen,
  borderWidth: StyleSheet.hairlineWidth,
  statusBarHeight: IS_IOS ? 16 : 24
};
