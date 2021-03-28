/* eslint-disable react-native/no-inline-styles */
/**
 * Index
 * @file 文章列表组件
 * @module pages/article/components/list
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React, { Component, RefObject } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { observable, action, computed, reaction, runInAction } from 'mobx';
import { Observer, observer } from 'mobx-react';
import { CommonActions } from '@react-navigation/native';
import { boundMethod } from 'autobind-decorator';
import { IS_IOS } from '@app/config';
import { optionStore } from '@app/stores/option';
import { ArticleRoutes } from '@app/constants/routes';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { IHttpPaginate, IRequestParams, IHttpResultPaginate } from '@app/types/http';
import { IArticle, ITag, ICategory, Iuser } from '@app/types/business';
import { NavigationProps } from '@app/types/props';
import { Iconfont } from '@app/components/common/iconfont';
import { Text } from '@app/components/common/text';
import { AutoActivityIndicator } from '@app/components/common/activity-indicator';
import { filterStore, EFilterType, TFilterValue } from './filter';
import { Header } from './header';
import { ListItem } from './item';
import i18n from '@app/services/i18n';
import request from '@app/services/request';
import colors from '@app/style/colors';
import sizes from '@app/style/sizes';
import fonts from '@app/style/fonts';
import mixins from '@app/style/mixins';

 type THttpResultPaginateArticles = IHttpResultPaginate<IArticle[]>;

 export type TArticleListElement = RefObject<FlatList<IArticle>>;
 export interface IListProps extends NavigationProps {}

 @observer 
 class List extends Component<IListProps> {

    private listElement: TArticleListElement = React.createRef();
    @observable private isLoading: boolean = false;
    @observable.ref private pagination: IHttpPaginate | null = null; // 引用类型，不自动转换成observer
    @observable.shallow private articles: IArticle[] = [];
    @observable.ref private params: IRequestParams = {};

    constructor(props: IListProps) {
        super(props);
        this.fetchArticles();
        // 当过滤条件变化时进行重请求
        reaction(
            () => [
                filterStore.filterActive,
                filterStore.filterType,
                filterStore.filterValue
            ],
            ([isActive, type, value]: any) => {
                this.handleFilterChanged(isActive, type, value);
            }
        );
    }

    private getAricleItemLayout(_: any, index: number) {
        const height = 250;
        return {
          index,
          length: height,
          offset: height * index
        };
    }

    private getArticleIdKey(article: IArticle, index?: number): string {
        return `index:${index}:sep:${article._id}`;
    }

    // 为了不影响FlatList组件渲染，对于引用类型，需要特殊处理
    @computed
    private get articleListData(): IArticle[] {
        return this.articles.slice() || [];
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
    private updateResultData(result: THttpResultPaginateArticles) {
        const { entry, ...resetReuslt } = result;
        const { list = [] } = entry;
        this.updateLoadingState(false);
        this.pagination = resetReuslt;
        if (resetReuslt.page > 1) {
            this.articles.push(...list);
        } else {
            this.articles = list;
        }
    }


    @boundMethod
    scrollToListTop() {
        const listElement = this.listElement.current;
        if (this.articleListData.length > 0) {
            listElement && listElement.scrollToIndex({ index: 0, viewOffset: 0 });
        }
    }

    @boundMethod
    private handleFilterChanged(isActive: boolean, type: EFilterType, value: TFilterValue) {
        // 归顶
        if (this.pagination && this.pagination.total > 0) {
            this.scrollToListTop();
        }
        // runInAction(f) => action(f)()
        runInAction(() => {
            const params: IRequestParams = {};
            if (isActive && value) {
                if (type === EFilterType.Search) {
                    params.keyword = value as string;
                } else if (type === EFilterType.Tag) {
                    params.tag = [(value as ITag)._id];
                } else if (type === EFilterType.Category) {
                    params.category = [(value as ICategory)._id];
                }
            }
            this.params = params;
        });
        this.fetchArticles();
    }

    @boundMethod
    private async fetchArticles(pageNo: number = 1): Promise<any> {
        this.updateLoadingState(true);
        const data = await request.fetchArticles<THttpResultPaginateArticles>({ ...this.params, pageNo });
        const { code, message, ...reset } = data;
        if (code === 0) {
            this.updateResultData(reset);
            this.updateLoadingState(false);
            return data;
        }
        this.updateLoadingState(false);
    }

    // 渲染文章列表为空时的状态：无数据
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

    // 渲染文章列表脚部的三种状态：空、加载中、无更多、上拉加载
    @boundMethod
    private renderListFooterView(): JSX.Element | null {
        const { styles } = obStyles;

        if (!this.articleListData.length) {
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
        this.fetchArticles(this.pagination.page + 1);
        }
    }

    @boundMethod
    private handleToDetailPage(article: IArticle) {
        // 可以使用navigate
        this.props.navigation.dispatch(
            CommonActions.navigate({
                key: String(article._id),
                name: ArticleRoutes.ArticleDetail,
                params: { article }
            })
        );
    }

    render() {
        return (
            <View style={obStyles.styles.listViewContainer}>
                <Header />
                <FlatList
                    style={obStyles.styles.articleListView}
                    data={this.articleListData}
                    ref={this.listElement}
                    // 首屏渲染多少个数据
                    initialNumToRender={5}
                    // 手动维护每一行的高度以优化性能
                    getItemLayout={this.getAricleItemLayout}
                    // 列表为空时渲染
                    ListEmptyComponent={this.renderListEmptyView}
                    // 加载更多时渲染
                    ListFooterComponent={this.renderListFooterView}
                    // 当前列表 loading 状态
                    refreshing={this.isLoading}
                    // 刷新
                    onRefresh={this.fetchArticles}
                    // 加载更多安全距离（相对于屏幕高度的比例）
                    onEndReachedThreshold={IS_IOS ? 0.05 : 0.2}
                    // 加载更多
                    onEndReached={this.handleLoadmoreArticle}
                    // 唯一 ID
                    keyExtractor={this.getArticleIdKey}
                    // 单个主体
                    renderItem={({ item: article, index }) => {
                        return (
                            <Observer
                                render={() => (
                                    <ListItem
                                        article={article}
                                        liked={optionStore.userInfo.likeArticles.includes(article._id)}
                                        onPress={this.handleToDetailPage}
                                        darkTheme={optionStore.darkTheme}
                                        language={optionStore.language}
                                        key={this.getArticleIdKey(article, index)}
                                    />
                                )}
                            />
                        );
                    }}
                />
            </View>
        );
    }

 }

 const obStyles = observable({
     get styles() {
         return StyleSheet.create({
            listViewContainer: {
                position: 'relative',
                flex: 1
            },
            articleListView: {
                width: sizes.screen.width
            },
            centerContainer: {
                justifyContent: 'center',
                alignItems: 'center',
                padding: sizes.gap
            },
            normalTitle: {
                ...fonts.base,
                color: colors.textSecondary
            },
            loadmoreViewContainer: {
                ...mixins.rowCenter,
                padding: sizes.goldenRatioGap
            },
            smallTitle: {
                ...fonts.small,
                color: colors.textSecondary
            }
         });
     }
 });

 export default List;


