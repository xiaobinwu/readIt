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
import { likeStore } from '@app/stores/like';
import { optionStore } from '@app/stores/option';
import { ArticleRoutes } from '@app/constants/routes';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { IHttpPaginate, IRequestParams, IHttpResultPaginate } from '@app/types/http';
import { IArticle, ITag, ICategory } from '@app/types/business';
import { NavigationProps } from '@app/types/props';
import { Iconfont } from '@app/components/common/iconfont';
import { Text } from '@app/components/common/text';
import { AutoActivityIndicator } from '@app/components/common/activity-indicator';
import { archiveFilterStore, EFilterType, TFilterValue } from './filter';
import { ArticleArchiveHeader } from './header';
import { ListItem } from './item';
import i18n from '@app/services/i18n';
import fetch from '@app/services/fetch';
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
    @observable.ref private articles: IArticle[] = [];
    @observable.ref private params: IRequestParams = {};

    constructor(props: IListProps) {
        super(props);
        this.fetchArticles();
        // 当过滤条件变化时进行重请求
        reaction(
            () => [
                archiveFilterStore.filterActive,
                archiveFilterStore.filterType,
                archiveFilterStore.filterValue
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
        return `index:${index}:sep:${article._id}:${article.id}`;
    }

    // 为了不影响FlatList组件渲染，对于引用类型，需要特殊处理
    @computed
    private get articleListData(): IArticle[] {
        return this.articles.slice() || [];
    }

    @action
    private updateLoadingState(loading: boolean) {
        this.isLoading = loading;
    }

    @action
    private updateResultData(result: THttpResultPaginateArticles) {
        const { data, pagination } = result;
        this.updateLoadingState(false);
        this.pagination = pagination;
        if (pagination.current_page > 1) {
            this.articles.push(...data);
        } else {
            this.articles = data;
        }
    }


    @boundMethod
    private scrollToListTop() {
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
                    params.tag_slug = (value as ITag).slug; // 啥?
                } else if (type === EFilterType.Category) {
                    params.category_slug = (value as ICategory).slug; // 啥?
                }
            }
            this.params = params;
        });
        this.fetchArticles();
    }

    @boundMethod
    private fetchArticles(page: number = 1): Promise<any> {
        this.updateLoadingState(true);
        return fetch.get<THttpResultPaginateArticles>('/article', { ...this.params, page })
            .then((article: { result: THttpResultPaginateArticles; }) => {
                this.updateResultData(article.result);
                return article;
            }).catch((error: any) => {
                this.updateLoadingState(false);
                console.warn('Fetch article list error:', error); // 黄屏
                return Promise.reject(error);
            });
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

    render() {
        return (
            <View style={obStyles.styles.listViewContainer}>
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
         });
     }
 });

 export default List;


