/**
 * @file 关于（首页）
 * @module pages/about/index
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import React, { Component } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { View, StyleSheet, ImageBackground, Image, ImageSourcePropType, Linking, SectionList, Alert } from 'react-native';
import { boundMethod } from 'autobind-decorator';
import { observable, computed, reaction } from 'mobx';
import { TouchableView } from '@app/components/common/touchable-view';
import { Observer, observer } from 'mobx-react';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { IPageProps } from '@app/types/props';
import colors from '@app/style/colors';
import sizes from '@app/style/sizes';
import fonts from '@app/style/fonts';
import { Iconfont } from '@app/components/common/iconfont';
import { Remind } from '@app/components/common/remind';
import mixins from '@app/style/mixins';
import i18n from '@app/services/i18n';
import { webUrl, email } from '@app/config';
import { Text } from '@app/components/common/text';
import { IWeather, Weather } from '@app/components/common/weather';
import { AboutRoutes } from '@app/constants/routes';
import { AutoI18nTitle, } from '@app/components/layout/title';
import request from '@app/services/request';
import { optionStore } from '@app/stores/option';
import { staticApi } from '@app/config';
import locationService from '@app/services/location';
import { showToast } from '@app/services/toast';
import { getUniqueId } from 'react-native-device-info';

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
    gravatar: ImageSourcePropType
    name: string
    slogan: string
}

type StatisticValue = number | '-'
interface IStatistic {
    tags: StatisticValue
    views: StatisticValue
    articles: StatisticValue
    comments: StatisticValue
}

@observer
class About extends Component<IAboutProps> {

    constructor(props: IAboutProps) {
        super(props);
        reaction(
            () => optionStore.language,
            (language) => this.getLocation()
        );
        this.getLocation();
    }

    @observable.ref
    private userInfo: IUserInfo = {
      gravatar: require('@app/assets/images/gravatar.png'),
      name: '-',
      slogan: '-'
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

    @observable.ref
    private statistic: IStatistic = {
      tags: '-',
      views: '-',
      articles: '-',
      comments: '-'
    }
    
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
    private getLocation() {
        locationService.getLocation((position) => {
            this.fetchWeatherMessage(position);
            this.fetchGeocodeRegeo(position);
        }, (error) => {
            showToast(error.message);
        });
    }

    // 获取当前城市
    private async fetchGeocodeRegeo(position: Geolocation.GeoPosition) {
        const { coords } = position;
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

    // 获取实况天气预报
    private async fetchWeatherMessage(position: Geolocation.GeoPosition) {
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

    render() {
        const { styles } = obStyles;
        const sections1 = [
            { key: Sections.Setting, data: this.settings.slice() }
        ];
        const sections2 = [
            { key: Sections.Follow, data: this.follows.slice() },
            { key: Sections.Social, data: this.socials.slice() }
        ];
        return (
            <View style={styles.container}>
                <ImageBackground
                    style={styles.user}
                    source={{ uri: `${staticApi}/sys/black-bg.png` }}
                    blurRadius={3}
                >
                    <View style={styles.userContent}>
                        <Image
                            style={styles.userGravatar}
                            source={this.userInfo.gravatar}
                        />
                        <View>
                            <Text style={styles.userName}>{this.userInfo.name}</Text>
                            <Text style={styles.userSlogan}>{this.userInfo.slogan}</Text>
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
                    <View style={styles.statisticItem}>
                        <Text style={styles.statisticCount}>{this.statistic.articles}</Text>
                        <Text style={styles.statisticTitle}>{i18n.t(LANGUAGE_KEYS.LIKE)}</Text>
                    </View>
                    <View style={styles.statisticSeparator} />
                    <View style={styles.statisticItem}>
                        <Text style={styles.statisticCount}>{this.statistic.comments}</Text>
                        <Text style={styles.statisticTitle}>{i18n.t(LANGUAGE_KEYS.COMMENT)}</Text>
                    </View>
                    <View style={styles.statisticSeparator} />
                    <View style={styles.statisticItem}>
                        <Text style={styles.statisticCount}>{this.statistic.views}</Text>
                        <Text style={styles.statisticTitle}>{i18n.t(LANGUAGE_KEYS.VIEW)}</Text>
                    </View>
                </View>
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
            </View>
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
                justifyContent: 'space-between',
                paddingVertical: sizes.gap * 1.5,
                paddingHorizontal: sizes.gap,
                backgroundColor: colors.cardBackground,
                borderBottomColor: colors.border,
                borderBottomWidth: sizes.borderWidth
            },
            userContent: {
                ...mixins.rowCenter
            },
            userGravatar: {
                width: 70,
                height: 70,
                marginRight: sizes.gap,
                borderRadius: 35,
                borderWidth: 2,
                borderColor: colors.border
            },
            userName: {
                ...fonts.h2,
                fontWeight: 'bold',
                color: colors.cardBackground,
                marginTop: sizes.gap,
                marginBottom: sizes.gap / 2
            },
            userSlogan: {
                ...fonts.base,
                color: colors.cardBackground,
                marginBottom: sizes.gap
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
