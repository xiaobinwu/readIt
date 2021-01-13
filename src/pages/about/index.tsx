/**
 * @file 关于（首页）
 * @module pages/about/index
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import React, { Component, RefObject } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ImageSourcePropType, Linking, SectionList, Alert } from 'react-native';
import { boundMethod } from 'autobind-decorator';
import { observable, computed } from 'mobx';
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
import { AboutRoutes } from '@app/constants/routes';

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

    @observable.ref
    private userInfo: IUserInfo = {
      gravatar: require('@app/assets/images/gravatar.png'),
      name: '-',
      slogan: '-'
    }

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
            name: '掘金',
            key: 'juejin',
            iconName: 'social-_round-blogger',
            url: 'https://juejin.cn/user/1468603262840910'
        },
        {
            name: '博客园',
            key: 'bokeyuan',
            iconName: 'CN_cnblogs',
            url: 'https://www.cnblogs.com/wuxiaobin/'
        },
        {
            name: 'Segmentfault',
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
          name: 'setting',
          key: 'setting',
          iconName: 'webpack',
          onPress: () => {
            // this.props.navigation.push(AboutRoutes.Setting)
          }
        }
      ];
    }

    private openUrl(url: string): Promise<any> {
        return Linking.openURL(url).catch(error => {
            console.warn('Open url failed:', error);
            return Promise.reject(error);
        });
    }

    render() {
        const { styles } = obStyles;
        const sections = [
            { key: Sections.Setting, data: this.settings.slice() },
            { key: Sections.Follow, data: this.follows.slice() },
            { key: Sections.Social, data: this.socials.slice() }
        ];
        return (
            <View style={styles.container}>
                <ImageBackground
                    style={styles.user}
                    source={this.userInfo.gravatar}
                    blurRadius={90}
                >
                    <Image
                        style={styles.userGravatar}
                        source={this.userInfo.gravatar}
                    />
                    <View>
                        <Text style={styles.userName}>{this.userInfo.name}</Text>
                        <Text style={styles.userSlogan}>{this.userInfo.slogan}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.statistic}>
                    <View style={styles.statisticItem}>
                        <Text style={styles.statisticCount}>{this.statistic.articles}</Text>
                        <Text style={styles.statisticTitle}>文章</Text>
                    </View>
                    <View style={styles.statisticSeparator} />
                    <View style={styles.statisticItem}>
                        <Text style={styles.statisticCount}>{this.statistic.tags}</Text>
                        <Text style={styles.statisticTitle}>标签</Text>
                    </View>
                    <View style={styles.statisticSeparator} />
                    <View style={styles.statisticItem}>
                        <Text style={styles.statisticCount}>{this.statistic.comments}</Text>
                        <Text style={styles.statisticTitle}>评论</Text>
                    </View>
                    <View style={styles.statisticSeparator} />
                    <View style={styles.statisticItem}>
                        <Text style={styles.statisticCount}>{this.statistic.views}</Text>
                        <Text style={styles.statisticTitle}>查看</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <SectionList<ISectionItem>
                        sections={sections}
                        ListHeaderComponent={<View style={styles.listHeaderAndFooter} />}
                        ListFooterComponent={<View style={styles.listHeaderAndFooter} />}
                        SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
                        ItemSeparatorComponent={() =>  <View style={styles.lineItemSeparator} />}
                        renderItem={
                            ({ item, index, section }) => (
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
                                        <Text>{item.name}</Text>
                                        {item.remind && (<Remind style={styles.lineRemindIcon} />)}
                                    </View>
                                    <Iconfont style={styles.lineDetailIcon} name="jiantou" />
                                </TouchableView>
                            )
                        }
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
                justifyContent: 'flex-start',
                paddingVertical: sizes.gap / 2,
                paddingHorizontal: sizes.gap,
                backgroundColor: colors.cardBackground,
                borderBottomColor: colors.border,
                borderBottomWidth: sizes.borderWidth
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
            section: {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start'
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
                height: sizes.gap * 2,
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
              lineItemSeparator: {
                height: sizes.borderWidth,
                backgroundColor: colors.border
              }
        });
    }
});

export default About;
