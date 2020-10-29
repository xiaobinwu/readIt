/**
 * @file 学习计划，添加按钮
 * @module pages/todo/components/todoButton
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { optionStore } from '@app/stores/option';
import { Iconfont } from '@app/components/common/iconfont';
import { Text } from '@app/components/common/text';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { ICategory, ITag } from '@app/types/business';
import { TouchableView } from '@app/components/common/touchable-view';
import i18n from '@app/services/i18n';
import colors, { normalColors } from '@app/style/colors';
import sizes from '@app/style/sizes';
import mixins, { getHeaderButtonStyle } from '@app/style/mixins';

export interface ITodoButtonProps {}

export const TodoButton = observer((props: ITodoButtonProps): JSX.Element | null => {
    const { styles } = obStyles; 
    return (
        <View style={styles.container}>
            <TouchableView
                accessibilityLabel="添加计划按钮"
            >
                <Iconfont
                    name="tianjiajiahaowubiankuang"
                    color={normalColors.white}
                    size={30}
                />
            </TouchableView>
        </View>
    );
});

const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            container: {
                ...mixins.colCenter,
                position: 'absolute',
                right: 20,
                bottom: 20,
                width: 60,
                height: 60,
                borderRadius: 100,
                backgroundColor: colors.primary
            },
        });
    }
});
