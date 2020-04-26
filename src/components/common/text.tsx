/**
 * Text
 * @file 公共文本控件，解决了默认颜色和样式的问题
 * @module app/components/common/text
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { observer } from 'mobx-react';
import { IChildrenProps } from '@app/types/props';
import colors from '@app/style/colors';
import fonts from '@app/style/fonts';

// 对于函数组件，有用到props.children需要定义IChildrenProps类型
export const Text = observer((props: TextProps & IChildrenProps): JSX.Element => {
    return (
        <RNText
            {...props}
            style={[
                {
                    color: colors.textDefault,
                    fontFamily: fonts.fontFamily
                },
                props.style
            ]}
        >
            {props.children}
        </RNText>
    );
});
