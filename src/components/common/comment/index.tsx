/* eslint-disable react-native/no-inline-styles */
/**
 * Comment list component
 * @file 评论列表组件
 * @module app/components/comment
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import React, { Component, RefObject } from 'react';
import { FlatList, StyleSheet, View, NativeSyntheticEvent, NativeScrollEvent, TextInput, Button } from 'react-native';
import { showToast } from '@app/services/toast';
import { observable, action, computed, runInAction } from 'mobx';
import { Observer, observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { IComment } from '@app/types/business';
import { IHttpPaginate, IHttpResultPaginate, TIHttpCommentResultOrdinary, } from '@app/types/http';
import { IS_IOS } from '@app/config';
import { Iconfont } from '@app/components/common/iconfont';
import { Text } from '@app/components/common/text';
import { TouchableView } from '@app/components/common/touchable-view';
import { AutoActivityIndicator } from '@app/components/common/activity-indicator';
import request from '@app/services/request';
import i18n from '@app/services/i18n';
import colors from '@app/style/colors';
import sizes from '@app/style/sizes';
import fonts from '@app/style/fonts';
import mixins from '@app/style/mixins';
import { optionStore } from '@app/stores/option';
import { CommentItem } from './item';

export type TCommentListElement = RefObject<FlatList<IComment>>;

type THttpResultPaginateComment = IHttpResultPaginate<IComment[]>;

export interface ICommentProps {
    isOpenCommentInput: boolean;
    articleId: string;
    onScroll?(event: NativeSyntheticEvent<NativeScrollEvent>): void;
    onSuccess?(data: any): void;
}

@observer
export class Comment extends Component<ICommentProps> {

    constructor(props: ICommentProps) {
        super(props);
        this.fetchComments();
    }

    private listElement: TCommentListElement = React.createRef();

    @observable.ref private isLoading: boolean = false;
    @observable.ref private isSortByHot: boolean = false;
    @observable.ref private pagination: IHttpPaginate | null = null;
    @observable.shallow private comments: IComment[] = [];

    // 评论框内容
    @observable private commentAuthor: string = '';
    @observable private commentContent: string = '';
    @observable private commentEmail: string = '';

    @boundMethod
    scrollToListTop() {
        const listElement = this.listElement.current;
        if (this.commentListData.length) {
            listElement && listElement.scrollToIndex({ index: 0, viewOffset: 0 });
        }
    }

    // 为了不影响FlatList组件渲染，对于引用类型，需要特殊处理
    @computed
    private get commentListData(): IComment[] {
        return (this.comments.slice() || []).filter(item => item.isShow);
    }

    // 计算是否已经是最后一页
    @computed
    private get isNoMoreData(): boolean {
        return (
            !!this.pagination && this.pagination.page === this.pagination.pages
        );
    }
    
    @action
    private updateLoadingState(loading: boolean) {
      this.isLoading = loading;
    }

    @action
    private updateResultData(result: THttpResultPaginateComment) {
        const { entry, ...resetReuslt } = result;
        const { list = [] } = entry;
        this.updateLoadingState(false);
        this.pagination = resetReuslt;
        if (resetReuslt.page > 1) {
            this.comments.push(...list);
        } else {
            console.log(list);
            this.comments = list;
        }
    }

    @action.bound
    private updateCommentAuthor(commentAuthor: string) {
      this.commentAuthor = commentAuthor;
    }

    @action.bound
    private updateCommentEmail(commentEmail: string) {
        this.commentEmail = commentEmail;
    }

    @action.bound
    private updateCommentContent(commentContent: string) {
        this.commentContent = commentContent;
    }

    @boundMethod
    private async submitComment() {
        const { articleId, onSuccess } = this.props;

        if (this.commentAuthor && this.commentEmail && this.commentContent) {
            const deviceId = optionStore.userInfo.deviceId;
            if (!articleId) {
                return Promise.reject();
            }
            const params = {
                author: this.commentAuthor,
                email: this.commentEmail,
                content: this.commentContent,
                articleId,
                deviceId
            };
            const data = await request.addComment<TIHttpCommentResultOrdinary>({ ...params });
            if (data) {
                const { code, message, ...reset } = data;
                if (code === 0) {
                    showToast(i18n.t(LANGUAGE_KEYS.COMMENT_SUCESS));

                    const { commentArticles } = optionStore.userInfo;
                    const commentArticlesItems = commentArticles.slice();
                    commentArticlesItems.push(articleId);
                    optionStore.updateUserInfo({
                        ...optionStore.userInfo,
                        commentArticles: commentArticlesItems,
                    });
                    // 归顶
                    if (this.pagination && this.pagination.total > 0) {
                        this.scrollToListTop();
                    }
                    // 重新请求数据
                    setTimeout(this.fetchComments, 266);
                    onSuccess && onSuccess(data);
                    return data;
                }
            }
        } else {
            showToast(i18n.t(LANGUAGE_KEYS.COMMENT_FAIL));
        }
    }

    private getCommentKey(comment: IComment, index?: number): string {
        return `index:${index}:sep:${comment._id}`;
    }

    @boundMethod
    private async fetchComments(pageNo: number = 1): Promise<any> {
        const params = {
            sort: this.isSortByHot ? true : false, // 是否按照热度排序，默认按时间倒序
            articleId: this.props.articleId,
            pageNo,
            pageSize: 50
        };
        this.updateLoadingState(true);
        const data = await request.fetchComments<THttpResultPaginateComment>({ ...params });
        const { code, message, ...reset } = data;
        if (code === 0) {
            this.updateResultData(reset);
            this.updateLoadingState(false);
            return data;
        }
        this.updateLoadingState(false);
    }

    // 渲染评论列表为空时的状态：无数据
    @boundMethod
    private renderListEmptyView(): JSX.Element | null {
        const { styles } = obStyles;
        // 下箭头
        const commonIconOptions = {
            name: 'iconfonticonfonti2',
            size: 19,
            color: colors.textSecondary
        };
        if (this.isLoading) {
            return null;
        }
        return (
            <Observer
                render={() => (
                    <View style={styles.centerContainer}>
                        <Text style={styles.normalTitle}>{i18n.t(LANGUAGE_KEYS.NO_RESULT_RETRY)}</Text>
                        <View style={{ marginTop: sizes.goldenRatioGap }}>
                            <Iconfont {...commonIconOptions} />
                            <Iconfont {...commonIconOptions} style={{ marginTop: -13 }} />
                        </View>
                    </View>
                )}
            />
        );
    }


    // 渲染评论列表脚部的三种状态：空、加载中、无更多、上拉加载
    @boundMethod
    private renderListFooterView(): JSX.Element | null {
        const { styles } = obStyles;

        if (!this.commentListData.length) {
            return null;
        }

        if (this.isLoading) {
            return (
                <Observer
                    render={() => (
                        <View style={[styles.centerContainer, styles.loadmoreViewContainer]}>
                            <AutoActivityIndicator style={{ marginRight: sizes.gap / 4 }} />
                            <Text style={styles.smallTitle}>{i18n.t(LANGUAGE_KEYS.LOADING)}</Text>
                        </View>
                    )}
                />
            );
        }

        if (this.isNoMoreData) {
            return (
                <Observer
                    render={() => (
                        <View style={[styles.centerContainer, styles.loadmoreViewContainer]}>
                            <Text style={styles.smallTitle}>{i18n.t(LANGUAGE_KEYS.NO_MORE)}</Text>
                        </View>
                    )}
                />
            );
        }

        return (
            <Observer
                render={() => (
                    <View style={[styles.centerContainer, styles.loadmoreViewContainer]}>
                        <Iconfont name="jiantou4" color={colors.textSecondary} />
                        <Text style={[styles.smallTitle, { marginLeft: sizes.gap / 4 }]}>
                            {i18n.t(LANGUAGE_KEYS.LOADMORE)}
                        </Text>
                    </View>
                )}
            />
        );
    }

    @boundMethod
    private handleLoadmoreArticle() {
        if (!this.isNoMoreData && !this.isLoading && this.pagination) {
            this.fetchComments(this.pagination.page + 1);
        }
    }

    // 切换排序模式
    @boundMethod
    private handleToggleSortType() {
        // 归顶
        if (this.pagination && this.pagination.total > 0) {
            this.scrollToListTop();
        }
        // 修正参数
        // runInAction(f) => action(f)()
        action(() => {
            this.isSortByHot = !this.isSortByHot;
        })();
        // 重新请求数据
        setTimeout(this.fetchComments, 266);
    }

    // 喜欢评论
    @boundMethod
    private async handleLikeComment(comment: IComment) {
        const commentId = comment._id;
        const articleId = comment.articleId;
        const deviceId = optionStore.userInfo.deviceId;
        if (!articleId) {
            return Promise.reject();
        }
        const data = await request.fetchUpdateComment<TIHttpCommentResultOrdinary>({ _id: commentId, articleId, deviceId, });
        if (data && data.code === 0) {
            action(() => {
                const targetCommentIndex = this.comments.findIndex(item => item._id === commentId);
                const { likeComments } = optionStore.userInfo;
                const likeCommentsItems = likeComments.slice();
                likeCommentsItems.push({ articleId, commentId });
                optionStore.updateUserInfo({
                    ...optionStore.userInfo,
                    likeComments: likeCommentsItems,
                });
                this.comments.splice(targetCommentIndex, 1, {
                    ...comment,
                    likes: comment.likes + 1
                });
            })();
        }
    }

    private renderToolBoxView(): JSX.Element {
        const { isLoading, pagination } = this;
        const { styles } = obStyles;
        return (
            <View style={styles.toolBox}>
                {
                    pagination && pagination.total ? (
                    <Text>{pagination.total} {i18n.t(LANGUAGE_KEYS.TOTAL)}</Text>
                    ) : (
                        <Text>{i18n.t(isLoading ? LANGUAGE_KEYS.LOADING : LANGUAGE_KEYS.EMPTY)}</Text>
                    )
                }
                <TouchableView
                    accessibilityLabel="切换排序模式"
                    disabled={isLoading}
                    onPress={this.handleToggleSortType}
                >
                    <Iconfont
                        name={this.isSortByHot ? 'redu' : 'shijian1'}
                        color={this.isSortByHot ? colors.primary : colors.textDefault}
                        size={16}
                        style={styles.toolSort}
                    />
                </TouchableView>
            </View>
        );
    }

    private reanderCommentInput(): JSX.Element {
        const { isLoading } = this;
        const { styles } = obStyles;
        return (
            <Observer render={
                () => (
                    <View style={styles.commentBox}>
                        <TextInput
                            style={styles.input}
                            value={this.commentAuthor}
                            maxLength={30}
                            placeholder={i18n.t(LANGUAGE_KEYS.NICKNAME)}
                            placeholderTextColor={colors.textSecondary}
                            onChangeText={this.updateCommentAuthor}
                        />
                        <TextInput
                            style={styles.input}
                            value={this.commentEmail}
                            placeholder={i18n.t(LANGUAGE_KEYS.EMAIL)}
                            placeholderTextColor={colors.textSecondary}
                            onChangeText={this.updateCommentEmail}
                        />
                        <TextInput
                            style={[styles.input, styles.inputContent]}
                            value={this.commentContent}
                            placeholder={i18n.t(LANGUAGE_KEYS.COMMENT_COTENT)}
                            multiline
                            numberOfLines={4}
                            maxLength={100}
                            placeholderTextColor={colors.textSecondary}
                            onChangeText={this.updateCommentContent}
                        />
                        <View style={styles.commentButton}>
                            <Button
                                title={i18n.t(LANGUAGE_KEYS.COMMENT_PUBLISH)}
                                color={colors.primary}
                                onPress={this.submitComment}
                            />
                        </View>
                    </View>
                )
            } />
        );
    }

    render() {
        const { styles } = obStyles;
        return (
            <View style={styles.container}>
                {this.renderToolBoxView()}
                <FlatList
                    style={styles.commentListView}
                    data={this.commentListData}
                    ref={this.listElement}
                    // 首屏渲染多少个数据
                    initialNumToRender={16}
                    // 列表为空时渲染
                    ListEmptyComponent={this.renderListEmptyView}
                    // 加载更多时渲染
                    ListFooterComponent={this.renderListFooterView}
                    // 当前列表 loading 状态
                    refreshing={this.isLoading}
                    // 刷新
                    onRefresh={this.fetchComments}
                    // 加载更多安全距离（相对于屏幕高度的比例）
                    onEndReachedThreshold={IS_IOS ? 0.02 : 0.2}
                    // 加载更多
                    onEndReached={this.handleLoadmoreArticle}
                    // 手势滚动
                    onScroll={this.props.onScroll}
                    // 唯一 ID
                    keyExtractor={this.getCommentKey}
                    // 单个主体
                    renderItem={
                        ({ item: comment, index }) => (
                            <CommentItem
                                key={this.getCommentKey(comment, index)}
                                darkTheme={optionStore.darkTheme}
                                language={optionStore.language}
                                comment={comment}
                                liked={optionStore.userInfo.likeComments.findIndex(it => comment._id === it.commentId) > -1}
                                onLike={this.handleLikeComment}
                                seq={index}
                            />
                        )
                    }
                />
                {this.reanderCommentInput()}
            </View>
        );
    }

}

const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            container: {
                flex: 1,
                position: 'relative'
            },
            toolBox: {
                ...mixins.rowCenter,
                justifyContent: 'space-between',
                height: sizes.gap * 2,
                paddingHorizontal: sizes.gap,
                borderColor: colors.border,
                borderTopWidth: sizes.borderWidth,
                borderBottomWidth: sizes.borderWidth,
                backgroundColor: colors.cardBackground
            },
            toolSort: {
                color: colors.textDefault
            },
            commentListView: {
                backgroundColor: colors.cardBackground
            },
            centerContainer: {
                justifyContent: 'center',
                alignItems: 'center',
                padding: sizes.gap
            },
            loadmoreViewContainer: {
                flexDirection: 'row',
                padding: sizes.goldenRatioGap
            },
            normalTitle: {
                ...fonts.base,
                color: colors.textSecondary
            },
            smallTitle: {
                ...fonts.small,
                color: colors.textSecondary
            },
            commentBox: {
                paddingHorizontal: sizes.goldenRatioGap,
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: sizes.screen.width,
                height: 400,
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-around',
                borderTopColor: colors.border,
                borderTopWidth: sizes.borderWidth,
                zIndex: 1,
                paddingTop: 30,
                paddingBottom: 80,
                backgroundColor: colors.cardBackground
            },
            input: {
                height: 40,
                paddingHorizontal: 10,
                paddingVertical: 5,
                color: colors.textDefault,
                width: '100%',
                borderBottomColor: colors.border,
                borderBottomWidth: sizes.borderWidth,
            },
            inputContent: {
                height: 40
            },
            commentButton: {
                paddingVertical: sizes.goldenRatio
            }
        });
    }
});


