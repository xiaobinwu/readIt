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
import { TouchableView } from '@app/components/common/touchable-view';
import { Remind } from '@app/components/common/remind';
import { Iconfont } from '@app/components/common/iconfont';
import { getHeaderButtonStyle } from '@app/style/mixins';
import { ArticleRoutes } from '@app/constants/routes';
import List from './components/list';
import { filterStore, Filter } from './components/filter';


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
            ),
            headerLeft: () => (
                <Observer render={() => (
                    <TouchableView
                        accessibilityLabel="文章筛选器"
                        accessibilityHint="切换文章筛选器"
                        onPress={() => filterStore.updateVisibleState(true)}
                    >
                        <Iconfont
                            name="liebiaolist29" 
                            color={colors.cardBackground}
                            {...getHeaderButtonStyle()}
                        />
                        {
                            filterStore.isActiveTagOrCategoryFilter && (
                                <Remind style={styles.headerCheckedIcon} />
                            )
                        }
                    </TouchableView>
                )} />
            ),
            headerRight: () => (
                <Observer render={() => (
                    <TouchableView
                        accessibilityLabel="搜索按钮"
                        accessibilityHint="打开搜索页面"
                        onPress={() => navigation.push(ArticleRoutes.ArticleSearch)}
                    >
                        <Iconfont
                            name="sousuo"
                            color={colors.cardBackground}
                            {...getHeaderButtonStyle(18)}
                        />
                    </TouchableView>
                )} />
            )
        };
    }
    render() {
        const { styles } = obStyles;
        const { route, navigation } = this.props;
        return (
            <View style={styles.container}>
                <Filter />
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
