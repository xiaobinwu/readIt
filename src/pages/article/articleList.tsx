/**
 * @file 主页（文章列表）
 * @module pages/article/articleList
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import React, { Component, RefObject } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { boundMethod } from 'autobind-decorator';
import { observable } from 'mobx';
import { Observer, observer } from 'mobx-react';
import { CustomHeaderTitle } from '@app/components/layout/title';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { IPageProps, NavigationProps } from '@app/types/props';
import colors from '@app/style/colors';
import sizes from '@app/style/sizes';
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
class ArticleList extends Component<IArticleListProps> {
    // 静态方法，定义主页（文章列表）屏幕组件的配置
    static getPageScreenOptions = ({ navigation }: NavigationProps) => {
        const { styles } = obStyles;
        return {
            headerTitle: () => (
                <CustomHeaderTitle
                    i18nKey={LANGUAGE_KEYS.ARTICLELIST}
                    onDoubleClick={indexStore.scrollToArticleListTop}
                />
            )
        };
    }
    render() {
        const { styles } = obStyles;
        const { route, navigation } = this.props;
        return (
            <View style={styles.container}>
                <List
                    route={route}
                    navigation={navigation}
                    ref={indexStore.articleListElement}
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
                justifyContent: 'center',
                backgroundColor: colors.cardBackground
            },
            headerCheckedIcon: {
                position: 'absolute',
                right: sizes.gap - 4,
                bottom: -1
            }
        });
    }
});

export default ArticleList;
