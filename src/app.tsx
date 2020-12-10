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
import { headerStyles, AutoI18nTitle } from '@app/components/layout/title';
import ArticleList, { indexStore } from '@app/pages/article/articleList';
import ArticleSearch from '@app/pages/article/articleSearch';
import ArticleDetail from '@app/pages/article/articleDetail';
import TodoList from '@app/pages/todo/todoList';
import TodoDetail from '@app/pages/todo/todoDetail';
import { Iconfont } from '@app/components/common/iconfont';
import About from '@app/pages/about';
import { IS_ANDROID } from '@app/config';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { WebViewPage } from '@app/pages/common/webview';
import { optionStore } from './stores/option';


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
            <ArticleStack.Screen
                name={ArticleRoutes.ArticleSearch}
                component={ArticleSearch}
                options={{ headerShown: false }}
            />
            <ArticleStack.Screen
                name={ArticleRoutes.ArticleDetail}
                component={ArticleDetail}
                options={{ headerShown: false }}
            />
            <ArticleStack.Screen
                name={ArticleRoutes.ArticleWebview}
                component={WebViewPage}
                options={WebViewPage.getPageScreenOptions}
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
                options={TodoList.getPageScreenOptions}
            />
            <TodoStack.Screen
                name={TodoRoutes.TodoDetail}
                component={TodoDetail}
                options={TodoDetail.getPageScreenOptions}
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
        const labelStyle = StyleSheet.create({
            text: {
              marginTop: IS_ANDROID ? -2 : 0,
              marginBottom: IS_ANDROID ? 5 : 0
            }
        });
        return (
            <AppearanceProvider>
                <NavigationContainer
                    onStateChange={this.updateNavigationState}
                    theme={{
                        dark: optionStore.darkTheme,
                        colors: {
                            primary: colors.primary,
                            background: colors.background,
                            card: colors.cardBackground,
                            text: colors.textDefault,
                            border: colors.border
                        }
                    }}
                >
                    <Tab.Navigator initialRouteName={ArticleRoutes.ArticleList}>
                        <Tab.Screen
                            name={ArticleRoutes.ArticleList}
                            component={ArticleStackComponent}
                            options={({ route, navigation }) => {
                                const isFocused = navigation.isFocused();
                                const isHomeRoute = route.name === ArticleRoutes.ArticleList;
                                navigation.addListener('tabPress', () => {
                                    if (isFocused && isHomeRoute) {
                                        return indexStore.scrollToArticleListTop();
                                    }
                                });
                                const routeState = (route as any).state;
                                const isHomeRoot = !routeState || routeState?.index === 0;
                                return {
                                    tabBarVisible: isFocused && isHomeRoute && isHomeRoot,
                                    tabBarLabel: ({ color }) => (
                                        <AutoI18nTitle
                                            i18nKey={LANGUAGE_KEYS.ARTICLE}
                                            size={12}
                                            color={color}
                                            style={labelStyle.text}
                                        />
                                    ),
                                    tabBarIcon: ({ color }) => (
                                        <Iconfont name="book" size={20} color={color} />
                                    )
                                };
                            }}
                        />
                        <Tab.Screen
                            name={TodoRoutes.TodoList}
                            component={TodoStackComponent}
                            options={({ route, navigation }) => {
                                const isFocused = navigation.isFocused();
                                const isTodoListRoute = route.name === TodoRoutes.TodoList;
                                const routeState = (route as any).state;
                                const isTodoListRoot = !routeState || routeState?.index === 0;
                                return {
                                    tabBarVisible: isFocused && isTodoListRoute && isTodoListRoot,
                                    tabBarLabel: ({ color }) => (
                                        <AutoI18nTitle
                                            i18nKey={LANGUAGE_KEYS.LEARN}
                                            size={12}
                                            color={color}
                                            style={labelStyle.text}
                                        />
                                    ),
                                    tabBarIcon: ({ color }) => (
                                        <Iconfont name="xuexi" size={20} color={color} />
                                    )
                                };
                            }}
                        />
                        <Tab.Screen
                            name={AboutRoutes.About}
                            component={AboutStackComponent}
                            options={({ route }) => {
                                const routeState = (route as any).state;
                                const isAboutRoot = !routeState || routeState?.index === 0;
                                const isAboutRoute = route.name === AboutRoutes.About;
                                return {
                                  tabBarVisible: isAboutRoute && isAboutRoot,
                                  tabBarLabel: ({ color }) => (
                                    <AutoI18nTitle
                                      i18nKey={LANGUAGE_KEYS.ABOUT}
                                      size={12}
                                      color={color}
                                      style={labelStyle.text}
                                    />
                                  ),
                                  tabBarIcon: ({ color }) => (
                                    <Iconfont name="icon_wode-" size={20} color={color} />
                                  )
                                };
                            }}
                        />
                    </Tab.Navigator>
                </NavigationContainer>
            </AppearanceProvider>
        );
    }
}
