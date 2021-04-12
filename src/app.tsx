/**
 * App entry.
 * @file App 入口文件
 * @module app/entry
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import 'react-native-gesture-handler'; // 链接原生依赖
import React, { Component, RefObject } from 'react';
import { StyleSheet, Linking } from 'react-native';
import { boundMethod } from 'autobind-decorator';
import SplashScreen from 'react-native-splash-screen';
import { computed, observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { NavigationContainer, NavigationContainerRef, NavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppearanceProvider } from 'react-native-appearance';
import JPush from 'jpush-react-native';
import { ArticleRoutes, TodoRoutes, AboutRoutes } from '@app/constants/routes';
import colors from '@app/style/colors';
import { headerStyles, AutoI18nTitle, CustomHeaderTitle } from '@app/components/layout/title';
import ArticleList, { indexStore } from '@app/pages/article/articleList';
import ArticleSearch from '@app/pages/article/articleSearch';
import ArticleDetail from '@app/pages/article/articleDetail';
import CollectArticleList from '@app/pages/article/collectArticleList';
import TodoList from '@app/pages/todo/todoList';
import TodoDetail from '@app/pages/todo/todoDetail';
import { Iconfont } from '@app/components/common/iconfont';
import About from '@app/pages/about';
import Github from '@app/pages/about/github';
import Privacy from '@app/pages/about/privacy';
import Protocol from '@app/pages/about/protocol';
import Weather from '@app/pages/about/weather';
import Qq from '@app/pages/about/qq';
import Wechat from '@app/pages/about/wechat';
import Sponsor from '@app/pages/about/sponsor';
import Setting from '@app/pages/about/setting';
import { IS_ANDROID } from '@app/config';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { WebViewPage } from '@app/pages/common/webview';
import AgreementModal from '@app/pages/common/agreementModal';
import request from '@app/services/request';
import { getUniqueId, getBaseOs, getDeviceName, getManufacturer, getBrand, getSystemVersion  } from 'react-native-device-info';
import { TIHttpUserResultOrdinary } from '@app/types/http';
import { STORAGE } from '@app/constants/storage';
import storage from '@app/services/storage';
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
            <ArticleStack.Screen
                name={ArticleRoutes.ArticlePrivacy}
                component={Privacy}
                options={{
                    headerTitle: () => <CustomHeaderTitle i18nKey={LANGUAGE_KEYS.PRIVACY} />
                }}
            />
            <ArticleStack.Screen
                name={ArticleRoutes.ArticleProtocol}
                component={Protocol}
                options={{
                    headerTitle: () => <CustomHeaderTitle i18nKey={LANGUAGE_KEYS.PROTOCOL} />
                }}
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
                options={About.getPageScreenOptions}
            />
            <AboutStack.Screen
                name={AboutRoutes.Github}
                component={Github}
                options={{
                    headerTitle: () => <CustomHeaderTitle i18nKey={LANGUAGE_KEYS.GITHUB} />
                }}
            />
            <AboutStack.Screen
                name={AboutRoutes.Privacy}
                component={Privacy}
                options={{
                    headerTitle: () => <CustomHeaderTitle i18nKey={LANGUAGE_KEYS.PRIVACY} />
                }}
            />
            <AboutStack.Screen
                name={AboutRoutes.Protocol}
                component={Protocol}
                options={{
                    headerTitle: () => <CustomHeaderTitle i18nKey={LANGUAGE_KEYS.PROTOCOL} />
                }}
            />
            <AboutStack.Screen
                name={AboutRoutes.Weather}
                component={Weather}
                options={{
                    headerTitle: () => <CustomHeaderTitle i18nKey={LANGUAGE_KEYS.WEATHER} />
                }}
            />
            <AboutStack.Screen
                name={AboutRoutes.Qq}
                component={Qq}
                options={{
                    headerTitle: () => <CustomHeaderTitle i18nKey={LANGUAGE_KEYS.QQ} />
                }}
            />
            <AboutStack.Screen
                name={AboutRoutes.Wechat}
                component={Wechat}
                options={{
                    headerTitle: () => <CustomHeaderTitle i18nKey={LANGUAGE_KEYS.WECHAT} />
                }}
            />
            <AboutStack.Screen
                name={AboutRoutes.Sponsor}
                component={Sponsor}
                options={{
                    headerTitle: () => <CustomHeaderTitle i18nKey={LANGUAGE_KEYS.SPONSOR} />
                }}
            />
            <AboutStack.Screen
                name={AboutRoutes.Setting}
                component={Setting}
                options={{
                    headerTitle: () => <CustomHeaderTitle i18nKey={LANGUAGE_KEYS.SETTING} />
                }}
            />
            <AboutStack.Screen
                name={AboutRoutes.CollectArticleList}
                component={CollectArticleList}
                options={{
                    headerTitle: () => <CustomHeaderTitle i18nKey={LANGUAGE_KEYS.ARTICLELIST} />
                }}
            />
            <AboutStack.Screen
                name={AboutRoutes.CollectArticleDetail}
                component={ArticleDetail}
                options={{ headerShown: false }}
            />
        </AboutStack.Navigator>
    );
});

@observer export class App extends Component {
    

    @observable.ref private navigationState: NavigationState | undefined;
    @observable private isVisible: boolean = false;
    @observable private isTempVisible: boolean = false; // 暂存弹框的显示状态
    private navigationRef: RefObject<NavigationContainerRef> = React.createRef();

    constructor(props: Readonly<{}>) {
        super(props);
        this.fetchLogin();
    }

    componentDidMount() {
        SplashScreen.hide();
        JPush.init();
        JPush.setLoggerEnable(true);
        // 连接状态
        JPush.addConnectEventListener(result => {
            console.log("connectListener:" + JSON.stringify(result));
        });
        // 通知回调
        JPush.addNotificationListener(result => {
            console.log("notificationListener:" + JSON.stringify(result));
            const { extras = {}, notificationEventType } = result;
            if (notificationEventType === 'notificationOpened') {
                const { url } = extras;
                if (url) {
                    setTimeout(() => {
                        console.log(url);
                        Linking.openURL(url).catch(error => {
                            console.warn('Open url failed:', error);
                            return Promise.reject(error);
                        });
                    }, 266);
                }
            }
        });
    }

    componentWillUnmount() {
    }

    // 请求签名牌，创建用户
    private async fetchLogin() {
        const { code, entry } = await this.fetchHasLogin();
        if (code === 0 && entry.length === 0) {
            setTimeout(() => {
                this.isTempVisible = true;
                this.isVisible = true;
            }, 0);
        } else if (code === 0 && entry.length > 0) {
            const avatar = await storage.get<string>(STORAGE.USER_AVATAR);
            optionStore.updateUserInfo({
                ...entry[entry.length - 1],
                ...(avatar ? { avatar } : {})
            });
        }
    }

    // 创建用户
    @boundMethod
    @action
    private async createUser() {
        const os = await getBaseOs();
        const deviceName = await getDeviceName();
        const manufacturer = await getManufacturer();
        const data = await request.fetchAddUser<TIHttpUserResultOrdinary>({
            deviceId: getUniqueId(),
            os,
            brand: getBrand(),
            deviceName,
            manufacturer,
            systemVersion: getSystemVersion()
        });
        if (data) {
            const { code, entry } = data;
            if (code === 0) {
                this.isTempVisible = false;
                this.isVisible = false;
                optionStore.updateUserInfo(entry);
            }
        }
    }

    // 判断是否已经有用户
    private async fetchHasLogin(): Promise<any> {
        const data = await request.fetchHasLogin<TIHttpUserResultOrdinary>({ deviceId: getUniqueId() });
        return data;
    }

    @boundMethod
    @action
    private updateNavigationState(state: NavigationState | undefined) {
        this.navigationState = state;
    } 

    // 导航至服务协议与隐私政策
    @boundMethod
    private navigateTo(name: string) {
        this.isVisible = false;
        setTimeout(() => {
            this.navigationRef.current && this.navigationRef.current.navigate(name);
        }, 200);
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
                <AgreementModal
                    isVisible={this.isVisible}
                    onAgree={this.createUser}
                    onReject={() => { this.isVisible = false; this.isTempVisible = false; }}
                    navigateTo={(name) => { this.navigateTo(name); }}
                />
                <NavigationContainer
                    ref={this.navigationRef}
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
                                // 复原弹框的可见状态
                                if (isFocused && isHomeRoute && isHomeRoot) {
                                    this.isVisible = this.isTempVisible;
                                }
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
