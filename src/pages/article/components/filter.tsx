/**
 * App article filter component
 * @file 文章过滤器组件
 * @module pages/article/components/filter
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { observable, action, computed } from 'mobx';
import { observer, observerBatching } from 'mobx-react';
import { optionStore } from '@app/stores/option';
import { Iconfont } from '@app/components/common/iconfont';
import { Text } from '@app/components/common/text';
import { IHttpResultPaginate } from '@app/types/http';
import { BetterModal } from '@app/components/common/modal';
import { ICategory, ITag } from '@app/types/business';
import { TouchableView } from '@app/components/common/touchable-view';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { ValueOf } from '@app/utils/transformer';
import i18n from '@app/services/i18n';
import request from '@app/services/request';
import mixins, { getHeaderButtonStyle } from '@app/style/mixins';
import sizes, { defaultHeaderHeight } from '@app/style/sizes';
import fonts from '@app/style/fonts';
import colors from '@app/style/colors';

// 标签 Type
type THttpResultPaginateTags = IHttpResultPaginate<ITag[]>;

// 类型 Type
type THttpResultPaginateCategory = IHttpResultPaginate<ICategory[]>;

// 过滤类型枚举，标签、分类、搜索
export enum EFilterType {
    Tag = 'Tag',
    Category = 'Category',
    Search = 'Search'
}

// filter store 过滤值模型
export interface IFilterValues {
    [EFilterType.Tag]: ITag | null
    [EFilterType.Category]: ICategory | null
    [EFilterType.Search]: string | null
}

// 当前过滤条件 type
export type TFilterValue = ITag | ICategory | string;

class Store {
    constructor() {
        this.fetchTags();
        this.fetchCategories();
    }
    @observable filterActive: boolean = false; // 是否激活
    @observable filterType: EFilterType = EFilterType.Category; // 激活类型
    @observable filterValues: IFilterValues = {
        [EFilterType.Tag]: null,
        [EFilterType.Category]: null,
        [EFilterType.Search]: null
    }

    @observable.ref tags: ITag[] = [];
    @observable.ref categories: ICategory[] = [];
    @observable modalVisible: boolean = false;

    // 是否拥有文章或分类过滤条件
    @computed
    get isActiveTagOrCategoryFilter(): boolean {
        return (
        this.filterActive &&
        [EFilterType.Tag, EFilterType.Category].includes(this.filterType)
        );
    }

    // 过滤条件类型文案
    @computed
    get filterTypeText(): string {
        const typeTextMap: Record<ValueOf<typeof EFilterType>, string> = {
            [EFilterType.Tag]: i18n.t(LANGUAGE_KEYS.TAG),
            [EFilterType.Category]: i18n.t(LANGUAGE_KEYS.CATEGORY),
            [EFilterType.Search]: i18n.t(LANGUAGE_KEYS.SEARCH)
        };
        return typeTextMap[this.filterType];
    }

    // 当前过滤条件的值
    @computed
    get filterValue(): TFilterValue | void {
        if (this.filterType === EFilterType.Search) {
            return this.filterValues[EFilterType.Search] as string;
        }
        if (this.filterType === EFilterType.Tag) {
            return this.filterValues[EFilterType.Tag] as ITag;
        }
        if (this.filterType === EFilterType.Category) {
            return this.filterValues[EFilterType.Category] as ICategory;
        }
    }

    @action.bound
    updateActiveFilter(type: EFilterType, value: TFilterValue) {
        this.filterType = type;
        this.filterValues[type] = value as any;
        this.filterActive = true;
    }

    @action.bound
    clearActiveFilter() {
        this.filterActive = false;
    }

    @action.bound
    updateVisibleState(visible: boolean) {
        this.modalVisible = visible;
    }

    @action.bound
    private async fetchTags(pageNo: number = 1) {
        const data = await request.fetchTags<THttpResultPaginateTags>({ pageSize: 666, pageNo: 1 });
        const { code, message, ...reset } = data;
        if (code === 0) {
            const { entry, ...resetReuslt } = reset;
            const { list = [] } = entry;
            this.tags = list;
        }
    }

    @action.bound
    private async fetchCategories(pageNo: number = 1) {
        const data = await request.fetchCategories<THttpResultPaginateCategory>({ pageSize: 666, pageNo: 1 });
        const { code, message, ...reset } = data;
        if (code === 0) {
            const { entry, ...resetReuslt } = reset;
            const { list = [] } = entry;
            this.categories = list;
        }
    }
}

export const filterStore = new Store();
export interface IFilterProps {}

@observer
export class Filter extends Component<IFilterProps> {
    @computed
    private get scrollFilterListView(): JSX.Element {
        const { styles } = obStyles;
        const filters = [{
            name: i18n.t(LANGUAGE_KEYS.CATEGORIES),
            type: EFilterType.Category,
            data: filterStore.categories,
            defaultIconName: 'fenlei-copy'
        }, {
            name: i18n.t(LANGUAGE_KEYS.TAGS),
            type: EFilterType.Tag,
            data: filterStore.tags,
            defaultIconName: 'icontag'
        }];
        return (
            <ScrollView style={styles.container}>
                {
                    filters.map(filter => (
                        <View key={filter.type}>
                            <Text style={fonts.h4}>{filter.name}</Text>
                            <View style={styles.list}>
                                {
                                    filter.data.map(item => {
                                        const { filterActive: isFilterActive, filterType, filterValues } = filterStore;
                                        const activeValue = filterValues[filterType] as any;
                                        const activeValueText = optionStore.isEnlang ? item.slug : item.name;
                                        const isActive = (
                                            isFilterActive &&
                                            filterType === filter.type &&
                                            activeValue &&
                                            activeValue.slug === item.slug
                                        );
                                        return (
                                            <TouchableView
                                                key={item._id}
                                                style={[
                                                    styles.item,
                                                    isActive && styles.itemActive
                                                ]}
                                                disabled={isActive}
                                                accessibilityLabel={`选中过滤条件：${activeValueText}`}
                                                onPress={() => {
                                                    filterStore.updateActiveFilter(filter.type, item);
                                                    filterStore.updateVisibleState(false);
                                                }}
                                            >
                                                <View style={[styles.itemIconView, isActive && styles.itemIconViewActive]}>
                                                    <Iconfont
                                                        name={item.icon || filter.defaultIconName}
                                                        style={isActive && styles.itemIconActive}
                                                    />
                                                </View>
                                                <Text
                                                    style={[
                                                        styles.itemText,
                                                        isActive && styles.itemTextActive
                                                    ]}
                                                >
                                                    {activeValueText}
                                                </Text>
                                                {isActive && (
                                                    <Iconfont
                                                        name="zhengque"
                                                        style={[
                                                            styles.itemSelectedIcon,
                                                            isActive && styles.itemTextActive
                                                        ]}
                                                    />
                                                )}
                                            </TouchableView>
                                        );
                                    })
                                }
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
        );
    }
    render() {
        return (
            <BetterModal
                top={defaultHeaderHeight}
                title={i18n.t(LANGUAGE_KEYS.FILTER_BY_TAG_CATEGORY)}
                visible={filterStore.modalVisible}
                onClose={() => filterStore.updateVisibleState(false)}
                extra={(
                    <TouchableView
                        accessibilityLabel="清空所有文章过滤条件"
                        onPress={() => {
                            filterStore.clearActiveFilter();
                            filterStore.updateVisibleState(false);
                        }}
                    >
                        <Iconfont name="ai207" color={colors.textLink} {...getHeaderButtonStyle()} />
                    </TouchableView>
                )}
            >
                {this.scrollFilterListView}
            </BetterModal>
        );
    }
}

const obStyles = observable({
    get styles() {
        const itemSize = 30;
        return StyleSheet.create({
            container: {
                flex: 1,
                padding: sizes.gap
            },
            list: {
                ...mixins.rowCenter,
                flexWrap: 'wrap',
                marginVertical: sizes.gap,
                marginBottom: sizes.gap + sizes.goldenRatioGap
            },
            item: {
                ...mixins.rowCenter,
                height: itemSize,
                paddingRight: sizes.goldenRatioGap,
                backgroundColor: colors.background,
                marginRight: sizes.goldenRatioGap,
                marginBottom: sizes.gap
            },
            itemText: {
                fontSize: fonts.small.fontSize,
                textTransform: 'capitalize'
            },
            itemIconView: {
                width: itemSize,
                height: itemSize,
                ...mixins.center,
                marginRight: 8,
                backgroundColor: colors.grey
            },
            itemIconViewActive: {
                backgroundColor: colors.background
            },
            itemIconActive: {
                color: colors.primary
              },
            itemActive: {
                backgroundColor: colors.primary
            },
            itemTextActive: {
                color: colors.background
            },
            itemSelectedIcon: {
                marginLeft: 8
            }
        });
    }   
});
