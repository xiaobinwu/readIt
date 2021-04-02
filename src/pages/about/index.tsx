/**
 * @file 关于（首页）
 * @module pages/about/index
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, PermissionsAndroid, ImageSourcePropType, Linking, SectionList, Alert, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { boundMethod } from 'autobind-decorator';
import { CustomHeaderTitle } from '@app/components/layout/title';
import { observable, computed, reaction } from 'mobx';
import { TouchableView } from '@app/components/common/touchable-view';
import { Observer, observer } from 'mobx-react';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { IPageProps, NavigationProps } from '@app/types/props';
import colors, { normalColors } from '@app/style/colors';
import sizes from '@app/style/sizes';
import fonts from '@app/style/fonts';
import { Iconfont } from '@app/components/common/iconfont';
import { Remind } from '@app/components/common/remind';
import mixins from '@app/style/mixins';
import i18n, { TLanguage } from '@app/services/i18n';
import { webUrl, email } from '@app/config';
import { Text } from '@app/components/common/text';
import { IWeather, Weather } from '@app/components/common/weather';
import { Gravatar } from '@app/components/common/gravatar';
import { AboutRoutes, ArticleRoutes } from '@app/constants/routes';
import { AutoI18nTitle, } from '@app/components/layout/title';
import request from '@app/services/request';
import { optionStore } from '@app/stores/option';
import { staticApi, geocodeRegeoAndroidKey } from '@app/config';
import { showToast } from '@app/services/toast';
import { TIHttpUserResultOrdinary } from '@app/types/http';
import { STORAGE } from '@app/constants/storage';
import storage from '@app/services/storage';
import { getHeaderButtonStyle } from '@app/style/mixins';
import { EArticleListType } from '@app/types/state';
import {
    init,
    Geolocation,
    setInterval,
    setGeoLanguage,
    setGpsFirst,
    setGpsFirstTimeout,
    setLocationMode,
    setNeedAddress,
    GeoLanguage,
    LocationMode
} from "react-native-amap-geolocation";

export interface IAboutProps extends IPageProps {}

enum Sections {
    Follow = 'follow',
    Social = 'social',
    Setting = 'setting'
}

interface ISectionItem {
    name: string
    key: string
    iconName: string
    url?: string
    remind?: boolean
    onPress?(): void
}

interface IUserInfo {
    avatar: ImageSourcePropType
    nickName: string
    motto: string
}

enum UserInfo {
    Avatar = 'avatar',
    NickName = 'nickName',
    Motto = 'motto'
}

type StatisticValue = number | '-'
interface IStatistic {
    views: StatisticValue
    articles: StatisticValue
    comments: StatisticValue
    likeComments: StatisticValue
}

class AboutStore {
    @observable editProfile: boolean = false;

    @boundMethod
    updateEditProfile() {
        this.editProfile = !this.editProfile;
    }
}

export const aboutStore = new AboutStore();

@observer
class About extends Component<IAboutProps> {

    watchPositionId: any = null;

    // 静态方法，定义主页（文章列表）屏幕组件的配置
    static getPageScreenOptions = ({ navigation }: NavigationProps) => {
        return {
            headerTitle: () => (
                <CustomHeaderTitle
                    i18nKey={LANGUAGE_KEYS.ABOUT}
                />
            ),
            headerRight: () => (
                <Observer render={() => (
                    <TouchableView
                        accessibilityLabel="编辑个人资料"
                        accessibilityHint="编辑个人资料"
                        onPress={() => { aboutStore.updateEditProfile(); }}
                    >
                        <Iconfont
                            name="pinglun1"
                            color={colors.cardBackground}
                            {...getHeaderButtonStyle(18)}
                        />
                    </TouchableView>
                )} />
            )
        };
    }

    constructor(props: IAboutProps) {
        super(props);
        reaction(
            () => optionStore.language,
            (language: TLanguage) => setGeoLanguage(language.toUpperCase() as GeoLanguage)
        );
        this.getLocation();
    }

    componentWillUnmount() {
        Geolocation.clearWatch(this.watchPositionId);
    }

    @observable.ref
    private userInfo: IUserInfo = {
      avatar: { uri: optionStore.userInfo.avatar || `${staticApi}/sys/green-bg.jpg` },
      nickName: optionStore.userInfo.nickName ||  '-',
      motto: optionStore.userInfo.motto || '-'
    }

    @observable.ref
    private currentWeather: IWeather | undefined = {
        updateTime: '-',
        temp: '-',
        icon: '-',
        text: '-',
        tempMax: '-',
        tempMin: '-',
        feelsLike: '-',
        fxLink: '-'
    }
    @observable private currentCity = '-';
    
    @computed
    private get socials() {
      return [
        {
            name: i18n.t(LANGUAGE_KEYS.JUEJIN),
            key: 'juejin',
            iconName: 'social-_round-blogger',
            url: 'https://juejin.cn/user/1468603262840910'
        },
        {
            name: i18n.t(LANGUAGE_KEYS.CNBLOG),
            key: 'bokeyuan',
            iconName: 'CN_cnblogs',
            url: 'https://www.cnblogs.com/wuxiaobin/'
        },
        {
            name: i18n.t(LANGUAGE_KEYS.SEGMENTFAULT),
            key: 'segmentfault',
            iconName: 'sf-logo',
            url: 'https://segmentfault.com/u/xiaobinwu'
        },
      ];
    }
  
    @computed
    private get follows() {
      return [
        {
          name: i18n.t(LANGUAGE_KEYS.GITHUB),
          key: 'github',
          iconName: 'github',
          onPress: () => {
            this.props.navigation.push(AboutRoutes.Github);
          }
        },
        {
          name: i18n.t(LANGUAGE_KEYS.VLOG),
          key: 'vlog',
          iconName: 'social-_round-blogger',
          onPress: () => this.openUrl(`${webUrl}`)
        },
        {
          name: i18n.t(LANGUAGE_KEYS.EMAILTOME),
          key: 'email',
          iconName: 'email',
          onPress: () => this
            .openUrl(`mailto:${email}`)
            .catch(() => Alert.alert('邮件出错'))
        },
        {
            name: i18n.t(LANGUAGE_KEYS.WECHAT),
            key: 'wechat',
            iconName: 'weixin-copy',
            onPress: () => {
                this.props.navigation.push(AboutRoutes.Wechat);
            }
        },
        {
            name: i18n.t(LANGUAGE_KEYS.QQ),
            key: 'qq',
            iconName: 'sign_qq',
            onPress: () => {
                this.props.navigation.push(AboutRoutes.Qq);
            }
        },
        {
            name: i18n.t(LANGUAGE_KEYS.SPONSOR),
            key: 'sponsor',
            iconName: 'meiyuan2',
            onPress: () => {
                this.props.navigation.push(AboutRoutes.Sponsor);
            }
        },
      ];
    }
  
    @computed
    private get settings() {
      return [
        {
          name: i18n.t(LANGUAGE_KEYS.SETTING),
          key: 'setting',
          iconName: 'shezhi',
          onPress: () => {
            this.props.navigation.push(AboutRoutes.Setting);
          }
        }
      ];
    }

    // 获取定位信息
    private async getLocation() {
        try {
            // 对于 Android 需要自行根据需要申请权限
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            ]);
        
            // 使用自己申请的高德 App Key 进行初始化
            await init({
                android: geocodeRegeoAndroidKey
            });
        
            // android下的配置
            setGpsFirst(true);
            setGpsFirstTimeout(10000);
            setInterval(600000);
            setNeedAddress(true);
            setLocationMode('Hight_Accuracy' as LocationMode);
            setGeoLanguage(optionStore.language.toUpperCase() as GeoLanguage);

            this.watchPositionId = Geolocation.watchPosition((position: any) => {
                this.fetchWeatherMessage(position);
                this.fetchGeocodeRegeo(position);
            }, (err: { message: string; }) => {
                console.log(err);
                showToast(err.message);
            });
        } catch (error) {
            showToast(error.message);
        }
    }

    // 获取当前城市
    private async fetchGeocodeRegeo(position: any) {
        const { coords, location = {} } = position;
        const { city } = location;
        if (city) {
            this.currentCity = city;
        } else {
            const { longitude, latitude } = coords;
            const curGeoData = await request.fetchGeocodeRegeo<any>({ location: `${longitude},${latitude}` });
            const { status, info } = curGeoData;
            if (status !== '0') {
                const { regeocode: { addressComponent: { city } } } = curGeoData;
                this.currentCity = city;
            } else {
                showToast(info);
            }
        }
    }

    // 获取实况天气预报
    private async fetchWeatherMessage(position: any) {
        const { coords } = position;
        const { longitude, latitude } = coords;
        let currentWeather;
        const curWeatherData = await request.fetchCurrentWeatherMessage<any>({ location: `${longitude},${latitude}`, lang: optionStore.language });
        const tdWeatherData = await request.fetch3dWeatherMessage<any>({ location: `${longitude},${latitude}`, lang: optionStore.language });
        if (curWeatherData.code === '200') {
            const { fxLink, updateTime, now = {} } = curWeatherData;
            const { temp, feelsLike, icon, text, } = now;
            currentWeather = {
                ...(fxLink ? { fxLink } : {}),
                ...(updateTime ? { updateTime } : {}),
                ...(temp ? { temp } : {}),
                ...(feelsLike ? { feelsLike } : {}),
                ...(icon ? { icon } : {}),
                ...(text ? { text } : {})
            };
        }
        if (tdWeatherData.code === '200') {
            const { daily = [] } = tdWeatherData;
            if (daily.length > 0) {
                const { tempMax, tempMin } = daily[0];
                currentWeather = {
                    ...currentWeather,
                    ...(tempMax ? { tempMax } : {}),
                    ...(tempMin ? { tempMin } : {})
                };
            }
        }
        this.currentWeather = currentWeather;
    }

    private openUrl(url: string): Promise<any> {
        return Linking.openURL(url).catch(error => {
            console.warn('Open url failed:', error);
            return Promise.reject(error);
        });
    }

    @boundMethod
    renderSection(data: any): JSX.Element {
        const { styles } = obStyles;
        const { index, section, item } = data;
        return (
            <Observer render={() => (
                <TouchableView
                    style={[
                        styles.line,
                        index === 0 ? styles.firstLineSeparator : null,
                        index === section.data.length - 1 ? styles.lastLineSeparator : null
                    ]}
                    onPress={
                        () => {
                            if (section.key === Sections.Social && item.url) {
                                this.openUrl(item.url);
                            } else if (item.onPress) {
                                item.onPress();
                            }
                        }
                    }
                >
                    <View style={styles.lineContent}>
                        <Iconfont style={styles.lineIcon} name={item.iconName} />
                        <Text style={styles.lineContentText}>{item.name}</Text>
                        {item.remind && (<Remind style={styles.lineRemindIcon} />)}
                    </View>
                    <Iconfont style={styles.lineDetailIcon} name="jiantou" />
                </TouchableView>
            )} />
        );
    }

    @boundMethod
    renderTitle(languageKey: LANGUAGE_KEYS): JSX.Element {
        const { styles } = obStyles;
        return (
            <Observer render={
                () => (
                    <View style={styles.headerTitle}>
                        <View style={styles.titleBadge} />
                        <AutoI18nTitle
                            i18nKey={languageKey}
                            size={15}
                            color={colors.textDefault}
                        />
                    </View>

                )
            } />
        );
    }

    // 改变用户信息
    @boundMethod
    updateUserInfo(fieldName: string, text: string | object) {
        optionStore.updateUserInfo({
            ...optionStore.userInfo,
            [fieldName]: text
        });
        this.userInfo = {
            ...this.userInfo,
            [fieldName]: text,
        };
    }

    @boundMethod
    updateUserInfoAvatar(uri: string, uploadedUrl: string) {
        this.updateUserInfo(UserInfo.Avatar, { uri });
        storage.set(STORAGE.USER_AVATAR, uri);
        this.fetchUserInfo(UserInfo.Avatar, uploadedUrl);
    }

    // 改变用户信息
    async fetchUserInfo(fieldName: string, text: string) {
        await request.fetchUpdateUser<TIHttpUserResultOrdinary>({
            deviceId: optionStore.userInfo.deviceId,
            [fieldName]: text,
        });
    }

    render() {
        const { viewArticles, likeArticles, commentArticles, likeComments } = optionStore.userInfo;
        const statistic: IStatistic = {
          views: viewArticles ? viewArticles.length : '-',
          articles: likeArticles ? likeArticles.length : '-',
          comments: commentArticles ? commentArticles.length : '-',
          likeComments: likeComments ? likeComments.length : '-'
        };

        const { styles } = obStyles;
        const sections1 = [
            { key: Sections.Setting, data: this.settings.slice() }
        ];
        const sections2 = [
            { key: Sections.Follow, data: this.follows.slice() },
            { key: Sections.Social, data: this.socials.slice() }
        ];
        return (
            <SafeAreaView style={styles.container}>
                <ImageBackground
                    style={styles.user}
                    source={{ uri: `${staticApi}/sys/black-bg.png` }}
                    blurRadius={3}
                >
                    <View style={styles.userContent}>
                        <Gravatar
                            style={styles.userGravatar}
                            source={this.userInfo.avatar}
                            picker={aboutStore.editProfile}
                            onSuccess={(uri, uploadedUrl) => { this.updateUserInfoAvatar(uri, uploadedUrl); }}
                        />
                        <View style={styles.userMessage}>
                            <TextInput
                                placeholderTextColor={colors.cardBackground}
                                placeholder={i18n.t(LANGUAGE_KEYS.WIRTEWATH)}
                                style={styles.userName}
                                value={this.userInfo.nickName}
                                editable={aboutStore.editProfile}
                                onChangeText={text => this.updateUserInfo(UserInfo.NickName, text)}
                                onSubmitEditing={({nativeEvent: { text }}) => this.fetchUserInfo(UserInfo.NickName, text)}
                            />
                            <TextInput
                                placeholderTextColor={colors.cardBackground}
                                placeholder={i18n.t(LANGUAGE_KEYS.WIRTEWATH)}
                                style={styles.userSlogan}
                                value={this.userInfo.motto}
                                editable={aboutStore.editProfile}
                                onChangeText={text => this.updateUserInfo(UserInfo.Motto, text)}
                                onSubmitEditing={({nativeEvent: { text }}) => this.fetchUserInfo(UserInfo.Motto, text)}
                            />
                        </View>
                    </View>
                    <Weather { ...this.currentWeather } currentCity={this.currentCity}  onPress={() => {
                        // 可以使用navigate
                        this.props.navigation.navigate(AboutRoutes.Weather, {
                            fxLink: this.currentWeather?.fxLink
                        });
                    }} />
                </ImageBackground>
                <View style={styles.statistic}>
                    <TouchableView
                        accessibilityLabel="喜欢的文章"
                        accessibilityHint="喜欢的文章"
                        onPress={() => { 
                            // 可以使用navigate
                            this.props.navigation.navigate(AboutRoutes.CollectArticleList, {
                                pageType: EArticleListType.Like,
                                articleIds: likeArticles
                            });
                        }}
                        style={styles.statisticItem}
                    >
                        <View>
                            <Text style={styles.statisticCount}>{statistic.articles}</Text>
                            <Text style={styles.statisticTitle}>{i18n.t(LANGUAGE_KEYS.LIKE)}</Text>
                        </View>
                    </TouchableView>
                    <View style={styles.statisticSeparator} />
                    <View style={styles.statisticItem}>
                        <Text style={styles.statisticCount}>{statistic.comments}</Text>
                        <Text style={styles.statisticTitle}>{i18n.t(LANGUAGE_KEYS.COMMENT)}</Text>
                    </View>
                    <View style={styles.statisticSeparator} />
                    <View style={styles.statisticItem}>
                        <Text style={styles.statisticCount}>{statistic.likeComments}</Text>
                        <Text style={styles.statisticTitle}>{i18n.t(LANGUAGE_KEYS.LIKE_COMMENT)}</Text>
                    </View>
                    <View style={styles.statisticSeparator} />
                    <TouchableView
                        accessibilityLabel="阅读的文章"
                        accessibilityHint="阅读的文章"
                        onPress={() => { 
                            // 可以使用navigate
                            this.props.navigation.navigate(AboutRoutes.CollectArticleList, {
                                pageType: EArticleListType.View,
                                articleIds: Array.from(new Set(viewArticles))
                            });
                        }}
                        style={styles.statisticItem}
                    >
                        <View>
                            <Text style={styles.statisticCount}>{statistic.views}</Text>
                            <Text style={styles.statisticTitle}>{i18n.t(LANGUAGE_KEYS.VIEW)}</Text>
                        </View>
                    </TouchableView>
                </View>
                <ScrollView>
                    {this.renderTitle(LANGUAGE_KEYS.ABOUTME)}
                    <View>
                        <SectionList<ISectionItem>
                            sections={sections2}
                            ListHeaderComponent={<View style={styles.listHeaderAndFooter} />}
                            ListFooterComponent={<View style={styles.listHeaderAndFooter} />}
                            SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
                            ItemSeparatorComponent={() =>  <View style={styles.lineItemSeparator} />}
                            renderItem={this.renderSection}
                        />
                    </View>
                    {this.renderTitle(LANGUAGE_KEYS.MORESETTING)}
                    <View>
                        <SectionList<ISectionItem>
                            sections={sections1}
                            ListHeaderComponent={<View style={styles.listHeaderAndFooter} />}
                            ListFooterComponent={<View style={styles.listHeaderAndFooter} />}
                            SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
                            ItemSeparatorComponent={() =>  <View style={styles.lineItemSeparator} />}
                            renderItem={this.renderSection}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: colors.background
            },
            user: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: "space-between",
                paddingVertical: sizes.gap * 1.5,
                paddingHorizontal: sizes.gap,
                backgroundColor: colors.cardBackground,
                borderBottomColor: colors.border,
                borderBottomWidth: sizes.borderWidth,
                width: sizes.screen.width
            },
            userContent: {
                ...mixins.rowCenter
            },
            userGravatar: {
                width: 70,
                height: 70,
                borderRadius: 35,
                borderWidth: 2,
                borderColor: colors.border
            },
            userMessage: {
                marginLeft: sizes.gap,
                ...mixins.colCenter,
                alignItems: 'flex-start'
            },
            userName: {
                ...fonts.h2,
                color: normalColors.white,
                padding: 2,
            },
            userSlogan: {
                ...fonts.base,
                color: normalColors.white,
                padding: 2,
            },
            statistic: {
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                height: sizes.gap * 3,
                borderBottomWidth: sizes.borderWidth,
                borderBottomColor: colors.border,
                backgroundColor: colors.cardBackground
            },
            statisticItem: {
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            },
            statisticCount: {
                ...fonts.h3
            },
            statisticTitle: {
                ...fonts.small,
                marginTop: 2,
                textTransform: 'capitalize'
            },
            statisticSeparator: {
                width: sizes.borderWidth,
                height: sizes.gap * 2,
                marginTop: sizes.gap / 2,
                backgroundColor: colors.border
            },
            listHeaderAndFooter: {
                height: sizes.gap / 2
            },
            sectionSeparator: {
                height: sizes.gap / 4
            },
            line: {
                ...mixins.rowCenter,
                justifyContent: 'space-between',
                height: sizes.gap * 2.5,
                paddingHorizontal: sizes.gap * 0.8,
                backgroundColor: colors.cardBackground
            },
            firstLineSeparator: {
                borderTopWidth: sizes.borderWidth,
                borderTopColor: colors.border
            },
            lastLineSeparator: {
                borderBottomWidth: sizes.borderWidth,
                borderBottomColor: colors.border
            },
            lineContent: {
                ...mixins.rowCenter
            },
            lineTitle: {
            },
            lineIcon: {
                width: sizes.gap,
                marginRight: sizes.gap / 2,
                color: colors.textDefault
            },
            lineDetailIcon: {
                color: colors.textSecondary
            },
            lineRemindIcon: {
                marginLeft: sizes.gap / 2
            },
            lineContentText: {
                color: colors.textTitle
            },
            lineItemSeparator: {
                height: sizes.borderWidth,
                backgroundColor: colors.border
            },
            headerTitle: {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                color: colors.textTitle,
                marginTop: sizes.gap,
                marginHorizontal: sizes.gap * 0.8,
                width: sizes.screen.width - sizes.gap * 1.6,
                ...fonts.h5,
            },
            titleBadge: {
                width: 5,
                height: 15,
                backgroundColor: colors.primary,
                marginRight: 5
            }
        });
    }
});

export default About;
