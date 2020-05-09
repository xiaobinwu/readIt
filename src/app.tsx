/**
 * App entry.
 * @file App 入口文件
 * @module app/entry
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import 'react-native-gesture-handler'; // 链接原生依赖
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { boundMethod } from 'autobind-decorator';
import { computed, observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppearanceProvider } from 'react-native-appearance';
import { ArticleRoutes, TodoRoutes, AboutRoutes } from '@app/constants/routes';
import colors from '@app/style/colors';
import { headerStyles } from '@app/components/layout/title';
import ArticleList from '@app/pages/article/articleList';
import TodoList from '@app/pages/todo/todoList';
import About from '@app/pages/about';
import { IS_ANDROID } from '@app/config';


const Tab = createBottomTabNavigator();

const commonStackOtions = computed(() => ({
    headerTitleStyle: headerStyles.styles.title,
    headerTintColor: headerStyles.styles.title.color,
    headerStyle: {
        backgroundColor: colors.primary
    }
}));

// 文章推荐
const ArticleStackComponent = observer(() => {
    const ArticleStack = createStackNavigator();
    return (
        <ArticleStack.Navigator
            initialRouteName={ArticleRoutes.ArticleList}
            screenOptions={commonStackOtions.get()}
        >
            <ArticleStack.Screen
                name={ArticleRoutes.ArticleList}
                component={ArticleList}
                options={ArticleList.getPageScreenOptions}
            />
        </ArticleStack.Navigator>
    );
});

// 学习计划
const TodoStackComponent = observer(() => {
    const TodoStack = createStackNavigator();
    return (
        <TodoStack.Navigator
            initialRouteName={TodoRoutes.TodoList}
            screenOptions={commonStackOtions.get()}
        >
            <TodoStack.Screen
                name={TodoRoutes.TodoList}
                component={TodoList}
            />
        </TodoStack.Navigator>
    );
});

// 关于
const AboutStackComponent = observer(() => {
    const AboutStack = createStackNavigator();
    return (
        <AboutStack.Navigator
            initialRouteName={AboutRoutes.About}
            screenOptions={commonStackOtions.get()}
        >
            <AboutStack.Screen
                name={AboutRoutes.About}
                component={About}
            />
        </AboutStack.Navigator>
    );
});

@observer export class App extends Component {

    @observable.ref private navigationState: NavigationState | undefined;

    @boundMethod
    @action
    private updateNavigationState(state: NavigationState | undefined) {
        this.navigationState = state;
    } 

    render() {
        return (
            <AppearanceProvider>
                <NavigationContainer
                    onStateChange={this.updateNavigationState}
                >
                    <Tab.Navigator initialRouteName={ArticleRoutes.ArticleList}>
                        <Tab.Screen
                            name={ArticleRoutes.ArticleList}
                            component={ArticleStackComponent}
                        />
                        <Tab.Screen name={TodoRoutes.TodoList} component={TodoStackComponent} />
                        <Tab.Screen name={AboutRoutes.About} component={AboutStackComponent} />
                    </Tab.Navigator>
                </NavigationContainer>
            </AppearanceProvider>
        );
    }
}
