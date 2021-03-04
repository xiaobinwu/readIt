/**
 * Detail
 * @file 详情页
 * @module pages/article/articleDetail
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React, { Component, RefObject } from 'react';
import { Animated, ImageBackground, ScrollView, Share, StyleSheet, View, SafeAreaView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { observable, action, computed, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { CommonActions } from '@react-navigation/native';
import { webUrl, appName } from '@app/config';
import { ArticleRoutes } from '@app/constants/routes';
import { IArticle } from '@app/types/business';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { Iconfont } from '@app/components/common/iconfont';
import { TouchableView } from '@app/components/common/touchable-view';
import { AutoActivityIndicator } from '@app/components/common/activity-indicator';
import { DoubleClick } from '@app/components/common/double-click';
import { Text } from '@app/components/common/text';
import { Comment } from '@app/components/common/comment';
import { dateToYMD } from '@app/utils/filters';
import { RichContent } from '@app/components/common/richcontent';
import { IPageProps } from '@app/types/props';
import mixins, { getHeaderButtonStyle } from '@app/style/mixins';
import sizes, { safeAreaViewBottom } from '@app/style/sizes';
import { TIHttpArticleResultOrdinary } from '@app/types/http';
import i18n from '@app/services/i18n';
import colors from '@app/style/colors';
import fonts from '@app/style/fonts';
import request from '@app/services/request';
import { staticApi } from '@app/config';
import { BetterModal } from '@app/components/common/modal';
import { optionStore } from '@app/stores/option';
import { Iuser } from '@app/types/business';

const headerHeight = sizes.gap * 3;
const headerHeightCollapsed = sizes.gap * 2.5;
const headerDescriptionHeight = 20;
const thumbHeight = sizes.screen.width / sizes.thumbHeightRatio;
const footerHeight = headerHeightCollapsed;

export interface IArticleDetailProps extends IPageProps {}

@observer
class ArticleDetail extends Component<IArticleDetailProps> {

    @observable isLoading: boolean = false;
    @observable article: IArticle | null = null;
    @observable isHeaderCollapsed: boolean = false;
    @observable commentModalVisible: boolean = false;
    @observable isOpenCommentInput: boolean = false;

    @observable headerHeight: Animated.Value = new Animated.Value(headerHeight);
    @observable headerDescriptionOpacity: Animated.Value = new Animated.Value(1);
    @observable headerDescriptionHeight: Animated.Value = new Animated.Value(headerDescriptionHeight);

    private scrollContentElement: RefObject<ScrollView> = React.createRef();


    constructor(props: IArticleDetailProps) {
        super(props);
        this.fetchArticleDatail();
        reaction(
            () => this.isHeaderCollapsed,
            collapse => this.runHeaderAnimate(collapse),
            { fireImmediately: true }
        );
    }

    private runHeaderAnimate(collapse: boolean) {
        Animated.parallel([
            Animated.timing(this.headerHeight, {
                toValue: collapse ? headerHeightCollapsed : headerHeight,
                duration: 288
            }),
            Animated.timing(this.headerDescriptionOpacity, {
                toValue: collapse ? 0 : 1,
                duration: 188
            }),
            Animated.timing(this.headerDescriptionHeight, {
                toValue: collapse ? 0 : headerDescriptionHeight,
                duration: 288
            })
        ]).start();
    }

    private getParamArticle(): IArticle {
        // console.log('props请求获得', this.props.route.params?.article);
        return this.props.route.params?.article;
    }

    // 缩略图
    private getThumbSource(thumb: string): string {
        return thumb || `${staticApi}/sys/.gif`;
    }

    @computed
    private get articleContent(): string | null {
        return this.article && this.article.content;
    }

    @computed
    private get articleIsMarkdown(): boolean | null {
        return this.article && !!this.article?.isMarkDown;
    }

    @computed
    private get isLikedArticle(): boolean {
        return optionStore.userInfo.likeArticles.includes(this.getArticleId());
    }

    @action 
    private updateLoadingState(loading: boolean) {
        this.isLoading = loading;
    }

    @action
    private updateHeaderCollapsedState(collapse: boolean) {
        this.isHeaderCollapsed = collapse;
    }

    @action
    private updateResultData(result: TIHttpArticleResultOrdinary) {
        const { entry, ...resetReuslt } = result;
        this.updateLoadingState(false);
        if (entry) {
            // console.log('请求获得', entry);
            this.updateAndCorrectArticle(entry);
        }
    }

    @action
    private updateAndCorrectArticle(article: IArticle | null) {
        // 是否为markdown
        if (article && article.isMarkDown && article.content) {
            const { content } = article;
            // const thumbContent = `![](${article.thumb})`;
            const isBrStart = content.startsWith('\n');
            // const isIncludeThumb = content && content.includes(thumbContent);
            // // 去除内容的缩略图
            // if (isIncludeThumb) {
            //     article.content = article.content.replace(thumbContent, '');
            // }
            // 文本内容首位不为\n
            if (isBrStart) {
            article.content = article.content.replace('\n', '');
            }
        }
        this.article = article;
    }

    @action
    private updateCommentModalVisible(visible: boolean) {
      this.commentModalVisible = visible;
    }

    @action
    private openCommentInput() {
        this.isOpenCommentInput = !this.isOpenCommentInput;
    }

    @boundMethod
    private handleGoBack() {
        this.props.navigation.goBack(null);
    }

    @boundMethod
    private handleScrollToTop() {
        const element = this.scrollContentElement.current;
        element && element.scrollTo({ y: 0 });
    }

    @boundMethod
    private handleToNewArticle(article: IArticle) {
        this.props.navigation.dispatch(
            CommonActions.navigate({
                key: String(article._id),
                name: ArticleRoutes.ArticleDetail,
                params: { article }
            })
        );
    }

    @boundMethod
    private getArticleId(): string {
        const { params } = this.props.route;
        return params?.articleId || params?.article?._id;
    }

    @boundMethod
    private handlePageScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const pageOffsetY = event.nativeEvent.contentOffset.y;
        this.updateHeaderCollapsedState(pageOffsetY > headerHeight);
    }

    @boundMethod
    private async handleLikeArticle() {
        if (!this.isLikedArticle) {
            const articleId = this.getArticleId();
            const deviceId = optionStore.userInfo.deviceId;
            if (!articleId) {
                return Promise.reject();
            }
            const data = await request.fetchLikeArticle<TIHttpArticleResultOrdinary>({ _id: articleId, deviceId, });
            if (data && data.code === 0) {
                action(() => {
                    const { likeArticles } = optionStore.userInfo;
                    const likeArticlesItems = likeArticles.slice();
                    likeArticlesItems.push(articleId);
                    optionStore.updateUserInfo({
                        ...optionStore.userInfo,
                        likeArticles: likeArticlesItems,
                    });
                    this.article && this.article.meta.likes++;
                })();
            }
        }
    }

    @boundMethod
    private commentSuccess() {
        action(() => {
            this.article && this.article.meta.comments++;
        })();
    }

    @boundMethod
    private async fetchArticleDatail(): Promise<any> {
        const articleId = this.getArticleId();
        const deviceId = optionStore.userInfo.deviceId;
        if (!articleId) {
            return Promise.reject();
        }
        this.updateLoadingState(true);
        const data = await request.fetchArticleDetail<TIHttpArticleResultOrdinary>({
            _id: articleId,
            deviceId,
        });
        if (data) {
            const { code, message, ...reset } = data;
            if (code === 0) {
                const { viewArticles } = optionStore.userInfo;
                const viewArticlesItems = viewArticles.slice();
                viewArticlesItems.push(articleId);
                optionStore.updateUserInfo({
                    ...optionStore.userInfo,
                    viewArticles: viewArticlesItems,
                });
                // console.log(JSON.stringify(optionStore.userInfo), 'userInfo');
                this.updateResultData(reset);
                this.updateLoadingState(false);
                return data;
            }
            this.updateLoadingState(false);
        }
    }

    @boundMethod
    private async handleShare() {
        try {
            const title = this.article?.title || '';
            const result = await Share.share({
                title,
                message: title,
                url: `${webUrl}/article/${this.getArticleId()}` // todo
            }, {
                dialogTitle: `Share article: ${title}`,
                subject: `A article from ${appName}: ${title}`
            });
        } catch (error) {
            console.warn('Share article failed:', error.message);
        }
    }
    @boundMethod
    private handleOpenComment() {
      this.updateCommentModalVisible(true);
    }

    render() {
        const { styles } = obStyles;
        const { article, isLoading } = this;
        const automaticArticle = this.article || this.getParamArticle(); // 离线时保证文章正常显示
        const TextSeparator = (
            <Text style={styles.metaTextSeparator}>.</Text>
        );
        return (
            <SafeAreaView style={[styles.container, styles.cardBackground]}>
                <View style={[styles.container, styles.article]}>
                    <Animated.View
                        style={[
                            styles.header,
                            mixins.rowCenter,
                            styles.cardBackground,
                            { height: this.headerHeight }
                        ]}
                    >
                        <TouchableView
                            accessibilityLabel="返回"
                            accessibilityHint="返回列表页"
                            style={{ height: sizes.goldenRatioGap * 2 }}
                            onPress={this.handleGoBack}
                        >
                            <Iconfont name="fanhui" color={colors.textTitle} {...getHeaderButtonStyle(19)} />
                        </TouchableView>
                        <View style={styles.name}>
                            <DoubleClick onDoubleClick={this.handleScrollToTop}>
                                <Text style={styles.title} numberOfLines={1}>
                                    { automaticArticle ? automaticArticle.title : '...' }
                                </Text>
                            </DoubleClick>
                            <Animated.View
                                style={{
                                    height: this.headerDescriptionHeight,
                                    opacity: this.headerDescriptionOpacity
                                }}
                            >
                                <Text style={styles.description} numberOfLines={1}>
                                    {automaticArticle ? automaticArticle.description : '...'}
                                </Text>
                            </Animated.View>
                        </View>
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.container,
                            { transform: [{ translateY: this.headerHeight }] }
                        ]}
                    >
                        <ScrollView
                            ref={this.scrollContentElement}
                            style={styles.container}
                            scrollEventThrottle={16}
                            onScroll={this.handlePageScroll}
                        >
                            <ImageBackground
                                style={styles.thumb}
                                source={automaticArticle ? { uri: this.getThumbSource(automaticArticle.thumb) } : {}}
                            />
                            {
                                automaticArticle && (
                                    <View style={[styles.meta, styles.cardBackground, styles.headerMeta]}>
                                        <Text style={styles.metaText}>
                                            {automaticArticle.meta.views} {i18n.t(LANGUAGE_KEYS.VIEWS)}
                                        </Text>
                                        {TextSeparator}
                                        <Text style={styles.metaText}>
                                            {automaticArticle.meta.likes} {i18n.t(LANGUAGE_KEYS.LIKES)}
                                        </Text>
                                        {TextSeparator}
                                        <Text style={styles.metaText}>
                                            {i18n.t(LANGUAGE_KEYS.LAST_UPDATE_AT)} {dateToYMD(automaticArticle.update_at)}
                                        </Text>
                                    </View>
                                )
                            }
                            <View
                                accessibilityLabel={`文章内容：${this.articleContent}`}
                                style={[styles.content, styles.cardBackground]}
                            >
                                {
                                    isLoading ? (
                                        <AutoActivityIndicator
                                            style={styles.indicator}
                                            text={i18n.t(LANGUAGE_KEYS.LOADING)}
                                        />
                                    ) : <RichContent
                                            navigation={this.props.navigation}
                                            route={this.props.route}
                                            sanitize={false}
                                            style={styles.richContent}
                                            padding={sizes.goldenRatioGap}
                                            content={this.articleContent}
                                            isMarkdown={this.articleIsMarkdown}
                                        />
                                }
                                {
                                    article && (
                                        <View style={[styles.cardBackground, styles.footerMeta]}>
                                            <Text style={styles.metaText}>
                                                {i18n.t(LANGUAGE_KEYS.CREATE_AT)} {dateToYMD(automaticArticle.create_at)}
                                            </Text>
                                            <View style={styles.footerMetaItems}>
                                                <Text style={styles.metaText}>
                                                    {
                                                        article.category.length ? `${String(article.category.map(c => c.name).join('、'))} ∙ ` : i18n.t(LANGUAGE_KEYS.EMPTY)
                                                    }
                                                </Text>
                                                <Text style={styles.metaText}>
                                                    {
                                                        article.tag.length ? `${String(article.tag.map(t => t.name).join('、'))}` : i18n.t(LANGUAGE_KEYS.EMPTY)
                                                    }
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                }
                            </View>
                            {
                                article && article.related.length ? (
                                    <View style={[styles.related, styles.cardBackground]}>
                                        <Text style={styles.relatedTitle}>
                                            {i18n.t(LANGUAGE_KEYS.RELATED_ARTICLE)}
                                        </Text>
                                        {
                                            article.related.filter(a => a._id !== article._id).slice(0, 3).map((item, index) => (
                                                <TouchableView
                                                    key={`${item._id}-${index}`}
                                                    style={styles.relatedItem}
                                                    onPress={(() => this.handleToNewArticle(item))}
                                                >
                                                    <Text
                                                        style={styles.relatedItemTitle}
                                                        numberOfLines={1}
                                                    >
                                                        {item.title}
                                                    </Text>
                                                    <View style={[mixins.rowCenter, styles.cardBackground]}>
                                                        <Text style={styles.metaText}>
                                                            {item.meta.views} {i18n.t(LANGUAGE_KEYS.VIEWS)}
                                                        </Text>
                                                        {TextSeparator}
                                                        <Text style={styles.metaText}>
                                                            {item.meta.likes} {i18n.t(LANGUAGE_KEYS.LIKES)}
                                                        </Text>
                                                        {TextSeparator}
                                                        <Text style={styles.metaText}>
                                                            {item.meta.comments} {i18n.t(LANGUAGE_KEYS.COMMENTS)}
                                                        </Text>
                                                        {TextSeparator}
                                                        <Text style={styles.metaText}>
                                                            {i18n.t(LANGUAGE_KEYS.CREATE_AT)} {dateToYMD(item.create_at)}
                                                        </Text>
                                                    </View>
                                                </TouchableView>
                                            ))
                                        }
                                    </View>
                                ) : null
                            }
                        </ScrollView>
                    </Animated.View>
                    {
                        article && (
                            <View style={[styles.footer, styles.cardBackground]}>
                                <TouchableView
                                    style={styles.footerItem}
                                    onPress={this.handleOpenComment}
                                >
                                    <Iconfont name="pinglun" style={styles.footerItemIcon} />
                                    <Text style={styles.footerItemText}>{i18n.t(LANGUAGE_KEYS.COMMENTS)} {` (${article.meta.comments})`}</Text>
                                </TouchableView>
                                <TouchableView
                                    style={styles.footerItem}
                                    disabled={this.isLikedArticle}
                                    onPress={this.handleLikeArticle}
                                >
                                    <Iconfont name="favored" style={[styles.footerItemIcon, {
                                        color: this.isLikedArticle ? colors.red : styles.footerItemIcon.color
                                    }]} />
                                    <Text style={[styles.footerItemText, {
                                        color: this.isLikedArticle ? colors.red : styles.footerItemText.color
                                    }]}>{i18n.t(LANGUAGE_KEYS.LIKE)} {` (${article.meta.likes})`}</Text>
                                </TouchableView>
                                <TouchableView
                                    style={styles.footerItem}
                                    onPress={this.handleShare}
                                >
                                    <Iconfont
                                        name="fenxiang"
                                        style={styles.footerItemIcon}
                                    />
                                    <Text style={styles.footerItemText}>
                                        {i18n.t(LANGUAGE_KEYS.SHARE)}
                                    </Text>
                                </TouchableView>
                            </View>
                        )
                    }
                </View>
                <BetterModal
                    visible={this.commentModalVisible}
                    title={i18n.t(LANGUAGE_KEYS.GOODCOMMENTS)}
                    onClose={() => this.updateCommentModalVisible(false)}
                    top={this.isHeaderCollapsed ? headerHeightCollapsed : headerHeight}
                    extra={(
                        <TouchableView
                            accessibilityLabel="添加评论"
                            onPress={this.openCommentInput}
                        >
                            <Iconfont name="pinglun1" color={colors.textLink} {...getHeaderButtonStyle()} />
                        </TouchableView>
                    )}
                >
                    <Comment articleId={this.getArticleId()} isOpenCommentInput={this.isOpenCommentInput} onSuccess={this.commentSuccess} />
                </BetterModal>
            </SafeAreaView>
        );
    }
}

const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            metaTextSeparator: {
                marginHorizontal: 5,
                color: colors.textSecondary
            },
            cardBackground: {
                backgroundColor: colors.cardBackground
            },
            container: {
                flex: 1,
                position: 'relative',
                backgroundColor: colors.background
            },
            article: {
                paddingBottom: safeAreaViewBottom + footerHeight
            },
            header: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1,
                borderColor: colors.border,
                borderBottomWidth: sizes.borderWidth
            },
            name: {
                justifyContent: 'center',
                width: sizes.screen.width - sizes.gap * 3.5
            },
            title: {
                ...fonts.h3,
                fontWeight: 'bold',
                color: colors.textTitle
            },
            description: {
                ...fonts.small,
                marginTop: 2
            },
            thumb: {
                flex: 1,
                width: sizes.screen.width,
                height: thumbHeight,
                resizeMode: 'cover',
                backgroundColor: colors.inverse
            },
            meta: {
                ...mixins.rowCenter,
                paddingHorizontal: sizes.goldenRatioGap
            },
            headerMeta: {
                paddingBottom: 0,
                paddingTop: sizes.goldenRatioGap
            },
            metaText: {
                ...fonts.small,
                color: colors.textSecondary
            },
            content: {
                minHeight: sizes.screen.heightSafeArea - thumbHeight - headerHeight - sizes.statusBarHeight,
                marginBottom: sizes.gap
            },
            indicator: {
                flex: 1
            },
            footerMeta: {
                paddingHorizontal: sizes.goldenRatioGap,
                paddingBottom: sizes.goldenRatioGap
            },
            footerMetaItems: {
                ...mixins.rowCenter,
                marginTop: sizes.goldenRatioGap   
            },
            related: {
                marginBottom: sizes.gap * 1.9
            },
            relatedTitle: {
                padding: sizes.goldenRatioGap,
                borderTopColor: colors.border,
                borderTopWidth: sizes.borderWidth
            },
            relatedItem: {
                padding: sizes.goldenRatioGap,
                borderBottomColor: colors.border,
                borderBottomWidth: sizes.borderWidth
            },
            relatedItemTitle: {
                ...fonts.h4,
                marginBottom: 5
            },
            footer: {
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: sizes.screen.width,
                height: footerHeight,
                flex: 1,
                ...mixins.rowCenter,
                justifyContent: 'space-evenly',
                borderTopColor: colors.border,
                borderTopWidth: sizes.borderWidth,
                opacity: 0.9
            },
            footerItem: {
                ...mixins.rowCenter,
                justifyContent: 'center'
            },
            footerItemIcon: {
                marginRight: 5,
                color: colors.textDefault
            },
            footerItemText: {
                color: colors.textDefault
            },
            richContent: {
                marginVertical: sizes.goldenRatioGap
            }
        });
    }
});

export default ArticleDetail;
