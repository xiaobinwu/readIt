/**
 * @file 学习计划（列表）
 * @module pages/todo/todoList
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import React, { Component, RefObject } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { boundMethod } from 'autobind-decorator';
import { observable } from 'mobx';
import { Observer, observer } from 'mobx-react';
import { CustomHeaderTitle } from '@app/components/layout/title';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { IPageProps, NavigationProps } from '@app/types/props';
import AgendaScreen from '@app/components/common/agendaScreen';


export interface IIndexProps extends IPageProps {}

@observer
class TodoList extends Component<IPageProps> {
    render() {
        const { styles } = obStyles;
        return (
            <View style={styles.container}>
                <AgendaScreen />
            </View>
        );
    }
}

const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            container: {
                flex: 1,
                width: '100%'
            }
        });
    }
});

export default TodoList;
