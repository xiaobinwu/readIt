/**
 * @file 收藏、阅读文章列表
 * @module pages/article/collectArticleList
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import React, { Component, RefObject } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { boundMethod } from 'autobind-decorator';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { IPageProps } from '@app/types/props';
import List from './components/list';


export interface IArticleListProps extends IPageProps {}

class IndexStore {
    articleListElement: RefObject<List> = React.createRef();

    @boundMethod
    scrollToArticleListTop() {
        const element = this.articleListElement.current;
        element && element.scrollToListTop();
    }
}

export const indexStore = new IndexStore();

@observer
class CollectArticleList extends Component<IArticleListProps> {
    render() {
        const { styles } = obStyles;
        const { route, navigation } = this.props;
        const { params = {} } = route;
        const { pageType, articleIds } = params;
        return (
            <View style={styles.container}>
                <List
                    route={route}
                    navigation={navigation}
                    ref={indexStore.articleListElement}
                    pageType={pageType}
                    articleIds={articleIds}
                />
            </View>
        );
    }
}

// tip：colors对应变化，会对应将obStyles进行响应
const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            container: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }
        });
    }
});

export default CollectArticleList;
