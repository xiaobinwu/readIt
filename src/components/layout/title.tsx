/**
 * Style fonts
 * @file 全局公共头部组件
 * @module app/components/layout/header
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import React from 'react';
import { StyleSheet, TextProps, View } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Text } from '@app/components/common/text';
import { DoubleClick } from '@app/components/common/double-click';
import colors from '@app/style/colors';
import fonts from '@app/style/fonts';
import { LANGUAGE_KEYS } from '@app/constants/language';
import i18n from '@app/services/i18n';


interface I18nTitleProps extends TextProps {
    size?: number;
    color?: string;
    i18nKey?: LANGUAGE_KEYS;
}

// 多语言
export const AutoI18nTitle = observer((props: I18nTitleProps): JSX.Element => {
    const { i18nKey, style, color, size } = props;
    const styles = [
        {
            color,
            fontSize: size
        },
        style
    ];
    return (
        <Text style={styles}>{i18nKey && i18n.t(i18nKey)}</Text>
    );
});

interface IHeaderTitleProps extends I18nTitleProps {
    title?: string;
    onDoubleClick?(): void;
}

// 自定义头部
export const CustomHeaderTitle = observer((props: IHeaderTitleProps): JSX.Element => {
    const { title, i18nKey, style, onDoubleClick, ...i18nProps } = props;
    const styles = [headerStyles.styles.title, style];
    const handleClick = () => {
        onDoubleClick && onDoubleClick();
    };
    return (
        <DoubleClick onDoubleClick={handleClick}>
            {
                i18nKey ? (
                    <AutoI18nTitle  {...i18nProps} style={styles} i18nKey={i18nKey} />
                ) : (
                    <Text style={styles}>{title}</Text>
                )
            }
        </DoubleClick>
    );
});

// 头部样式
export const headerStyles = observable({
    get styles() {
        return StyleSheet.create({
            title: {
                ...fonts.h3,
                fontWeight: 'bold',
                color: colors.cardBackground
            }
        });
    }
});
