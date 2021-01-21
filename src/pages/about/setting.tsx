/**
 * Githubsetting
 * @file 设置页面
 * @module pages/about/setting
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React, { Component } from 'react';
import { StyleSheet, View, Switch, Alert, Animated } from 'react-native';
import { observable, reaction, action } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { appName, version } from '@app/config';
import { IPageProps } from '@app/types/props';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { optionStore } from '@app/stores/option';
import { likeStore } from '@app/stores/like';
import { Iconfont } from '@app/components/common/iconfont';
import { Text } from '@app/components/common/text';
import { TouchableView } from '@app/components/common/touchable-view';
import i18n, { TLanguage, languageMaps } from '@app/services/i18n';
import storage from '@app/services/storage';
import colors from '@app/style/colors';
import fonts from '@app/style/fonts';
import mixins from '@app/style/mixins';
import { normalColors } from '@app/style/colors';
import sizes from '@app/style/sizes';
import { color } from 'react-native-reanimated';

interface ILanguageDetailIconProps {
    close: boolean
}

@observer class LanguageDetailIcon extends Component<ILanguageDetailIconProps> {
    constructor(props: ILanguageDetailIconProps) {
        super(props);
        reaction(
            () => this.props.close,
            (close) => this.updateOpacityAnimate(close ? 1 : 0)
        );
    }

    @observable private opacity = new Animated.Value(1);

    @boundMethod private updateOpacityAnimate(value: number) {
        Animated.timing(
            this.opacity,
            { duration: 30, toValue: value }
        ).start();
    }

    render() {
        const { styles } = obStyles;
        return (
            <React.Fragment>
                <Animated.View style={{ opacity: this.opacity }}>
                    <Text>{languageMaps[optionStore.language].name}</Text>
                </Animated.View>
                <Iconfont
                    style={styles.lineDetailIcon}
                    name={this.props.close ? 'jiantou' : 'iconfonticonfonti2'}
                />
            </React.Fragment>
        );
    }
}

export interface ISettingProps extends IPageProps {}

@observer class Setting extends Component<ISettingProps> {
    @observable.ref isLanguageBoxCollapsed: boolean = true;

    @action.bound
    private updateLanguageBoxCollapsedState(collapsed: boolean) {
      this.isLanguageBoxCollapsed = collapsed;
    }
  
    private handleToggleLanguages = () => {
      this.updateLanguageBoxCollapsedState(!this.isLanguageBoxCollapsed);
    }

    private handleUpdateLanguage(lang: TLanguage): void {
        optionStore.updateLanguage(lang);
    }

    private handleToggleDarkThemeState(value: boolean): void {
        optionStore.updateDarkTheme(value);
    }

    private handleClearCache() {
        Alert.alert(
            i18n.t(LANGUAGE_KEYS.CLEAR_CACHE),
            i18n.t(LANGUAGE_KEYS.CLEAR_CACHE_TEXT),
            [
                {
                    text: i18n.t(LANGUAGE_KEYS.CANCEL),
                    style: 'cancel'
                },
                {
                    text: i18n.t(LANGUAGE_KEYS.OK),
                    onPress: () => {
                        const done = () => {
                            // likeStore.resetStore();
                            Alert.alert(i18n.t(LANGUAGE_KEYS.SUCCESS));
                        };
                        // storage.clear().then(done).catch(done);
                    }
                }
            ],
            { cancelable: false }
        );
    }

    private renderLanguagesView(): JSX.Element | null {
        if (this.isLanguageBoxCollapsed) {
            return null;
        }
        const { styles } = obStyles;
        return (
            <React.Fragment>
                {
                    Object.keys(languageMaps).map((language) => {
                        const lang = language as TLanguage;
                        return (
                            <View key={lang}>
                                <TouchableView
                                    style={[styles.lineItem, styles.lineItemLanguage]}
                                    onPress={() => this.handleUpdateLanguage(lang)}
                                    disabled={optionStore.language === lang}
                                >
                                    <View style={styles.lineItemLanguageContent}>
                                        <Text style={styles.lineItemLanguageTitle}>{languageMaps[lang].name}</Text>
                                        <Text style={styles.lineItemLanguageEnglish}>{languageMaps[lang].english}</Text>
                                    </View>
                                    <View style={styles.lineItemContent}>
                                        <Iconfont
                                            name="zhengque"
                                            style={{ color: lang === optionStore.language ? colors.primary : colors.textSecondary }}
                                        />
                                    </View>
                                </TouchableView>
                                <View style={styles.lineSeparator} />
                            </View>
                        );
                    })
                }
            </React.Fragment>
        );
    }

    render() {
        const { styles } = obStyles;
        return (
            <View style={styles.container}>
                <View style={styles.lineSeparator} />
                <View style={styles.lineItem}>
                    <View style={styles.lineItemContent}>
                        <Iconfont
                            name="moonbyueliang"
                            style={styles.lineItemIcon}
                        />
                        <Text>
                            {i18n.t(LANGUAGE_KEYS.DARK_THEME)}
                        </Text>
                    </View>
                    <View style={styles.lineItemContent}>
                        <Switch
                            value={optionStore.darkTheme}
                            onValueChange={this.handleToggleDarkThemeState}
                        />
                    </View>
                </View>
                <View style={styles.lineSeparator} />
                <TouchableView style={styles.lineItem} onPress={this.handleToggleLanguages}>
                    <View style={styles.lineItemContent}>
                        <Iconfont
                            name="diqiu"
                            style={styles.lineItemIcon}
                        />
                        <Text>
                            {i18n.t(LANGUAGE_KEYS.SWITCH_LANGUAGE)}
                        </Text>
                    </View>
                    <View style={styles.lineItemContent}>
                        <LanguageDetailIcon close={this.isLanguageBoxCollapsed} />
                    </View>
                </TouchableView>
                <View style={styles.lineSeparator} />
                {this.renderLanguagesView()}
                <View style={[styles.lineSeparator, { marginTop: sizes.gap / 2 }]} />
                <TouchableView
                    style={[styles.lineItem, styles.lineClearCache]}
                    onPress={this.handleClearCache}
                >
                    <Text style={styles.lineClearCacheContent}>
                        {i18n.t(LANGUAGE_KEYS.CLEAR_CACHE)}
                    </Text>
                </TouchableView>
                <View style={styles.lineSeparator} />
                <Text style={styles.version}>{appName} ∙ {version}</Text>
            </View>
        );
    }
}

export default Setting;

const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            container: {
                flex: 1,
                paddingTop: sizes.gap,
                backgroundColor: colors.background
            },
            lineDetailIcon: {
                color: colors.textSecondary,
                marginLeft: sizes.gap / 2
            },
            lineItem: {
                ...mixins.rowCenter,
                justifyContent: 'space-between',
                height: sizes.gap * 2,
                paddingHorizontal: sizes.gap * 0.8,
                backgroundColor: colors.cardBackground
            },
            lineItemLanguage: {
                height: sizes.gap * 3,
                backgroundColor: colors.background
            },
            lineItemLanguageContent: {
                flexDirection: 'column',
                justifyContent: 'center'
            },
            lineItemLanguageTitle: {
                ...fonts.h4
            },
            lineItemLanguageEnglish: {
                ...fonts.small
            },
            lineItemContent: {
                ...mixins.rowCenter
            },
            lineSeparator: {
                width: '100%',
                height: sizes.borderWidth,
                backgroundColor: colors.border
            },
            lineItemIcon: {
                color: colors.textDefault,
                width: sizes.gap,
                marginRight: sizes.gap / 2
            },
            lineClearCache: {
                justifyContent: 'center'
            },
            lineClearCacheContent: {
                color: colors.red
            },
            version: {
                color: colors.textSecondary,
                textAlign: 'center',
                marginTop: sizes.gap
            }
        });
    }
})
;
