/**
 * @file 学习计划（列表）
 * @module pages/todo/todoList
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import React, { Component, RefObject } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { boundMethod } from 'autobind-decorator';
import { observable } from 'mobx';
import { Observer, observer } from 'mobx-react';
import { IPageProps, NavigationProps } from '@app/types/props';
import { AgendaScreen } from '@app/components/common/agendaScreen';
import { TouchableView } from '@app/components/common/touchable-view';
import { Iconfont } from '@app/components/common/iconfont';
import { getHeaderButtonStyle } from '@app/style/mixins';
import colors from '@app/style/colors';
import { TodoButton } from './components/todoButton';
import { TodoTitle } from './components/todoTitle';
import sizes from '@app/style/sizes';



export interface IIndexProps extends IPageProps {}
@observer
class TodoList extends Component<IPageProps> {
    // 静态方法，定义主页（todo列表）屏幕组件的配置
    static getPageScreenOptions = ({ navigation }: NavigationProps) => {
        const { styles } = obStyles;
        return {
            headerTitle: () => (<TodoTitle />),
            headerRight: () => (
                <Observer render={() => (
                    <TouchableView
                        accessibilityLabel="学习计划筛选器"
                        accessibilityHint="切换学习计划筛选器"
                    >
                        <Iconfont
                            name="liebiaolist29" 
                            color={colors.cardBackground}
                            {...getHeaderButtonStyle()}
                        />
                    </TouchableView>
                )} />
            )
        };
    }
    @boundMethod
    onDayChange() {
        const { navigation } = this.props;
        navigation.setParams({title: <TodoTitle />});
    }
    render() {
        const { styles } = obStyles;
        const { navigation, route } = this.props;
        return (
            <View style={styles.container}>
                <AgendaScreen onDayChange={this.onDayChange} />
                <TodoButton navigation={navigation} route={route} />
            </View>
        );
    }
}

const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            container: {
                flex: 1,
                width: sizes.screen.width,
                position: 'relative'
            }
        });
    }
});

export default TodoList;
