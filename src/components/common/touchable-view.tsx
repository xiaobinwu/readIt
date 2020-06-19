/**
 * TouchableView
 * @file 公共可点击控件，解决了透明度重复使用的问题
 * @module app/components/common/touchable-view
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { observer } from 'mobx-react';
import { IChildrenProps } from '@app/types/props';
import sizes from '@app/style/sizes';

export const TouchableView = observer((props: TouchableOpacityProps & IChildrenProps): JSX.Element => {
  return (
    <TouchableOpacity
      activeOpacity={sizes.touchOpacity}
      {...props}
    >
      {props.children}
    </TouchableOpacity>
  );
});

