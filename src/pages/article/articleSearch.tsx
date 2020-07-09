/**
 * Search
 * @file 搜索页
 * @module pages/article/search
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import React, { Component } from 'react';
import { SafeAreaView, TextInput, ScrollView, StyleSheet, View } from 'react-native';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { TouchableView } from '@app/components/common/touchable-view';
import { Iconfont } from '@app/components/common/iconfont';
import { Text } from '@app/components/common/text';
import { STORAGE } from '@app/constants/storage';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { IPageProps } from '@app/types/props';
import storage from '@app/services/storage';
import i18n from '@app/services/i18n';
import mixins from '@app/style/mixins';
import colors from '@app/style/colors';
import sizes from '@app/style/sizes';
import fonts from '@app/style/fonts';
import { filterStore, EFilterType } from './components/filter';

export interface ISearchProps extends IPageProps {}

@observer
class ArticleSearch extends Component<ISearchProps> {
    
    @observable.ref private keyword: string = '';
    @observable.ref private historys: string[] = [];

    constructor(props: ISearchProps) {
        super(props);
        this.initAndResetHistory();
        this.initAndResetKeyword();
    }

    @action.bound
    private updateHistorys(historys: string[]) {
        this.historys = historys || [];
        console.log('历史记录Storage', this.historys);
    }

    @boundMethod
    private initAndResetHistory() {
        storage.get<string[]>(STORAGE.SEARCH_HISTORY).then(this.updateHistorys);
    }

    @action.bound
    private updateKeyword(keyword: string) {
        this.keyword = keyword;
    }

    @boundMethod
    private initAndResetKeyword() {
        if(filterStore.filterActive && filterStore.filterType === EFilterType.Search) {
            this.updateKeyword(filterStore.filterValues[EFilterType.Search] || '');
        }
    }

    @boundMethod
    private syncHistoryStorage() {
        storage.set(STORAGE.SEARCH_HISTORY, this.historys);
    }

    @boundMethod
    private clearHisrory() {
        storage.remove(STORAGE.SEARCH_HISTORY).then(this.initAndResetHistory);
    }

    @boundMethod
    private handleGoBack() {
        this.props.navigation.goBack(null);
    }

    @boundMethod
    private submitSearch() {
        if (this.keyword) {
            let historys = this.historys.slice();
            historys.unshift(this.keyword);
            historys = Array.from(new Set(historys)).slice(0, 13);
            this.updateHistorys(historys);
            this.syncHistoryStorage();
            filterStore.updateActiveFilter(EFilterType.Search, this.keyword);
            this.handleGoBack();
        }
    }

    @boundMethod
    private handlePressHistory(history: string) {
        this.updateKeyword(history);
        this.submitSearch();
    }

    @boundMethod
    private handleRemoveHistoryItem(index: number) {
        const historys = this.historys.slice();
        historys.splice(index, 1);
        this.updateHistorys(historys);
        this.syncHistoryStorage();
    }

    @computed
    private get historyView(): JSX.Element | null {
        if (!this.historys || !this.historys.length) {
            return null;
        }
        const { styles } = obStyles;
        return (
            <>
                <View style={styles.title}>
                    <Text style={fonts.h5}>{i18n.t(LANGUAGE_KEYS.HISTORT)}</Text>
                    <TouchableView onPress={this.clearHisrory}>
                        <Text style={fonts.small}>{i18n.t(LANGUAGE_KEYS.CLEAR)}</Text>
                    </TouchableView>
                </View>
                <ScrollView style={styles.historys}>
                    {
                        this.historys.map((keyword, index) => (
                            <View key={keyword} style={styles.historyItem}>
                                <TouchableView
                                    accessibilityLabel={`历史记录关键词：${keyword}`}
                                    style={styles.historyKeyword}
                                    onPress={() => this.handlePressHistory(keyword)}
                                >
                                    <Iconfont name="shijian" size={16} style={styles.historyIcon} />
                                    <Text>{keyword}</Text>
                                </TouchableView>
                                <TouchableView
                                    accessibilityLabel={`删除历史记录关键词：${keyword}`}
                                    onPress={() => this.handleRemoveHistoryItem(index)}
                                >
                                    <Iconfont name="guanbi" style={styles.historyIcon} />
                                </TouchableView>
                            </View>
                        ))
                    }
                </ScrollView>
            </>
        );
    } 

    render() {
        const { styles } = obStyles;
        return (
            <SafeAreaView style={styles.safeContainer}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TextInput
                            style={styles.input}
                            value={this.keyword}
                            autoFocus={true}
                            maxLength={30}
                            placeholder={i18n.t(LANGUAGE_KEYS.KEYWORD)}
                            returnKeyType="search"
                            clearButtonMode="while-editing"
                            placeholderTextColor={colors.textSecondary}
                            onChangeText={this.updateKeyword}
                            onSubmitEditing={this.submitSearch}
                        />
                        <TouchableView
                            style={styles.search}
                            onPress={this.handleGoBack}
                        >
                            <Text style={styles.searchText}>
                                {i18n.t(LANGUAGE_KEYS.CANCEL)}
                            </Text>
                        </TouchableView>
                    </View>
                    {this.historyView}
                </View>
            </SafeAreaView>
        );
    }
}

const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            safeContainer: {
                flex: 1,
                backgroundColor: colors.cardBackground
            },
            container: {
                flex: 1,
                padding: sizes.goldenRatioGap
            },
            header: {
                ...mixins.rowCenter,
                justifyContent: 'space-between'
            },
            input: {
                height: 35,
                width: '82%',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
                color: colors.textDefault,
                backgroundColor: colors.background
            },
            search: {
                width: '14%'
            },
            searchText: {
                color: colors.primary
            },
            title: {
                ...mixins.rowCenter,
                justifyContent: 'space-between',
                marginTop: 15,
                marginBottom: 15,
                marginHorizontal: 5
            },
            historys: {
                flex: 1
            },
            historyItem: {
                ...mixins.rowCenter,
                justifyContent: 'space-between',
                height: sizes.gap * 2,
                borderBottomWidth: sizes.borderWidth,
                borderColor: colors.border
            },
            historyKeyword: {
                ...mixins.rowCenter,
                height: sizes.gap * 2,
                paddingRight: sizes.gap
            },
            historyIcon: {
                marginHorizontal: 8,
                color: colors.border
            }
        });
    }
});

export default ArticleSearch;
