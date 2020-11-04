/**
 * @file 学习计划，添加按钮
 * @module pages/todo/components/todoButton
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Iconfont } from '@app/components/common/iconfont';
import { TouchableView } from '@app/components/common/touchable-view';
import colors from '@app/style/colors';
import { agendaStore } from '@app/components/common/agendaScreen';
import mixins from '@app/style/mixins';
import { IPageProps } from '@app/types/props';
import { CommonActions } from '@react-navigation/native';
import { TodoRoutes } from '@app/constants/routes';

export interface ITodoButtonProps extends IPageProps {}

export const TodoButton = observer((props: ITodoButtonProps): JSX.Element | null => {
    const { styles } = obStyles;

    const todobutton = !agendaStore.calendarOpened ? (
        <View style={styles.container}>
            <TouchableView
                accessibilityLabel="添加计划按钮"
                onPress={() => { props.navigation.push(TodoRoutes.TodoDetail); }}
            >
                <Iconfont
                    name="tianjiajiahaowubiankuang"
                    color={colors.cardBackground}
                    size={30}
                />
            </TouchableView>
        </View>
    ) : null;
    return todobutton;
});

const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            container: {
                ...mixins.colCenter,
                position: 'absolute',
                right: 20,
                bottom: 20,
                zIndex: 1,
                width: 60,
                height: 60,
                borderRadius: 100,
                backgroundColor: colors.primary
            },
        });
    }
});
