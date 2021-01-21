/**
 * App article item component
 * @file 文章列表子组件
 * @module pages/article/components/item
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import React, { PureComponent } from 'react';
import { Image, ImageSourcePropType, TextStyle, View, StyleSheet } from 'react-native';
import { observable, computed } from 'mobx';
import { TouchableView } from '@app/components/common/touchable-view';
import { Iconfont } from '@app/components/common/iconfont';
import { Text } from '@app/components/common/text';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { IArticle } from '@app/types/business';
import { EOriginState } from '@app/types/state';
import i18n, { TLanguage } from '@app/services/i18n';
import { dateToYMD } from '@app/utils/filters';
import { staticApi } from '@app/config';
import colors from '@app/style/colors';
import sizes from '@app/style/sizes';
import fonts from '@app/style/fonts';
import mixins from '@app/style/mixins';

export interface IArtileListItemProps {
    article: IArticle;
    liked: boolean;
    darkTheme: boolean;
    language: TLanguage;
    onPress(article: IArticle): void;
}


export class ListItem extends PureComponent<IArtileListItemProps> {
    // 文章来源文案
    @computed
    private get originTexts() {
        return {
            [EOriginState.Hybrid]: i18n.t(LANGUAGE_KEYS.ORIGIN_HYBRID),
            [EOriginState.Original]: i18n.t(LANGUAGE_KEYS.ORIGIN_ORIGINAL),
            [EOriginState.Reprint]: i18n.t(LANGUAGE_KEYS.ORIGIN_REPRINT)
        };
    }

    // 文章来源样式
    private getOriginBackgroundStyle(origin: EOriginState): TextStyle {
        const bgColors = {
            [EOriginState.Hybrid]: colors.primary,
            [EOriginState.Original]: colors.accent,
            [EOriginState.Reprint]: colors.red
        };
        return {
            backgroundColor: bgColors[origin]
        };
    }

    // 缩略图
    private getThumbSource(thumb: string): ImageSourcePropType {
        return { uri: thumb || `${staticApi}/sys/thumb-carrousel.gif` };
    }

    render() {
        const { article } = this.props;
        const { styles } = obStyles;
        return (
            <TouchableView
                onPress={() => { this.props.onPress(article); }} 
                style={styles.container}
            >
                <Image
                    source={this.getThumbSource(article.thumb)}
                    style={styles.thumb}
                />
                <Text
                    style={[
                        styles.origin,
                        this.getOriginBackgroundStyle(article.origin)
                    ]}
                >
                    {this.originTexts[article.origin]}
                </Text>
                <Text style={styles.title} numberOfLines={1}>{article.title}</Text>
                <Text style={styles.description} numberOfLines={1}>{article.description}</Text>
                <View style={styles.meta}>
                    <View style={styles.metaItem}>
                        <Iconfont name="shijian" size={13} style={styles.metaIcon} />
                        <Text style={styles.metaText}>{dateToYMD(article.create_at)}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Iconfont name="chakan" size={13} style={styles.metaIcon} />
                        <Text style={styles.metaText}>{article.meta.views}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Iconfont name="pinglun" size={15} style={styles.metaIcon} />
                        <Text style={styles.metaText}>{article.meta.comments}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Iconfont
                            name="favored"
                            style={[
                                styles.metaIcon,
                                this.props.liked ? { color: colors.red } : null
                            ]}
                        />
                        <Text style={styles.metaText}>{article.meta.likes}</Text>
                    </View>
                </View>
            </TouchableView>
        );
    }
}

const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            container: {
                marginTop: sizes.gap,
                marginHorizontal: sizes.goldenRatioGap,
                backgroundColor: colors.cardBackground
            },
            thumb: {
                flex: 1,
                height: 100,
                maxWidth: '100%',
                resizeMode: 'cover',
                backgroundColor: colors.textSecondary
            },
            origin: {
                position: 'absolute',
                top: 0,
                right: 0,
                height: 28,
                lineHeight: 26,
                paddingHorizontal: 8,
                opacity: 0.6,
                color: colors.textTitle,
                textTransform: 'capitalize'
            },
            title: {
                ...fonts.h3,
                fontWeight: '700',
                margin: sizes.goldenRatioGap
            },
            description: {
                ...fonts.base,
                margin: sizes.goldenRatioGap,
                marginTop: -(sizes.goldenRatioGap / 4),
                color: colors.textSecondary
            },
            meta: {
                ...mixins.rowCenter,
                justifyContent: 'space-between',
                borderTopColor: colors.textMuted,
                borderTopWidth: sizes.borderWidth,
                paddingHorizontal: sizes.goldenRatioGap,
                paddingVertical: sizes.gap / 2
            },
            metaItem: {
                ...mixins.rowCenter,
                justifyContent: 'center'
            },
            metaIcon: {
                marginTop: 1,
                marginRight: sizes.goldenRatioGap / 2,
                color: colors.textSecondary
            },
            metaText: {
                ...fonts.small,
                color: colors.textSecondary
            }
        });
    }
});
