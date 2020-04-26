/**
 * @file 学习计划（列表）
 * @module pages/todo/todoList
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import React, { Component, RefObject } from 'react';
import { View, Text } from 'react-native';
import { boundMethod } from 'autobind-decorator';
import { observable } from 'mobx';
import { Observer, observer } from 'mobx-react';
import { CustomHeaderTitle } from '@app/components/layout/title';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { IPageProps, NavigationProps } from '@app/types/props';


export interface IIndexProps extends IPageProps {}

@observer
class TodoList extends Component<IPageProps> {
    render() {
        return (
            <View>
                <Text>学习计划（列表）</Text>
            </View>
        );
    }
}

export default TodoList;
