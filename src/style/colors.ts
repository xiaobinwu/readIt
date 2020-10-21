/**
 * Style colors
 * @file Theme 主题/颜色配置
 * @module app/colors
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import { observable } from 'mobx';
import { Appearance } from 'react-native-appearance';

// 导出主题类型枚举
export enum Themes {
  Default = 'Default',
  Dark = 'Dark'
}

type ThemeKey =
| 'primary'// 主题色
| 'secondary' // 次要主题色
| 'accent' // 强调色
| 'red' // 红色，错误色
| 'yellow' // 黄色，警告色
| 'grey' // 银灰色
| 'inverse' // 反色

| 'border' // 边框色
| 'background' // 全局背景色
| 'cardBackground' // 模块背景色

| 'textDefault' // 默认文本
| 'textSecondary' // 次要文本
| 'textMuted' // 禁用文本

| 'textTitle' // 标题文本
| 'textLink' // 链接文本

type Theme = Record<ThemeKey, string>;

export const Default: Theme = {
  primary: '#7cb305',
  secondary: '#262626',
  accent: '#4caf50',
  red: '#ff5722',
  yellow: '#ffeb3b',
  grey: '#e3e3e3',
  inverse: '#333333',
  border: '#BBBBBB',
  background: '#EEEEEE',
  cardBackground: '#FFFFFF',

  textDefault: '#555',
  textSecondary: '#bbb',
  textMuted: '#eee',

  textTitle: '#222',
  textLink: '#000'
};

export const Dark: Theme = {
  primary: '#fadb14',
  secondary: '#262626',
  accent: '#4caf50',
  red: '#ff5722',
  yellow: '#ffeb3b',
  grey: '#3e3e3e',
  inverse: '#FFFFFF',
  border: '#333333',
  background: '#000000',
  cardBackground: '#1a1a1a',

  textDefault: '#999999',
  textSecondary: '#777777',
  textMuted: '#333333',

  textTitle: '#EEEEEE',
  textLink: '#FFFFFF'
};

// 导出系统默认主题
export const isDarkSystemTheme = Appearance.getColorScheme() === 'dark';

// observable观察theme主题变量，ts传入泛型Theme
const colors = observable<Theme>(isDarkSystemTheme ? Default : Dark);
export default colors;

// 更新主题
export const updateTheme = (darkTheme: Boolean) => {
  Object.keys(Default).forEach(key => {
      const themeKey = (key as keyof Theme); // 断言
      colors[themeKey] = darkTheme ? Dark[themeKey] : Default[themeKey];
  });
};

