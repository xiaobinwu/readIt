/**
 * @file 主页（文章列表）
 * @module pages/article/articleList
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import React, { Component, RefObject } from 'react';
import { View, Text } from 'react-native';
import { boundMethod } from 'autobind-decorator';
import { observable } from 'mobx';
import { Observer, observer } from 'mobx-react';
import { CustomHeaderTitle } from '@app/components/layout/title';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { IPageProps, NavigationProps } from '@app/types/props';


export interface IIndexProps extends IPageProps {}

@observer
class ArticleList extends Component<IPageProps> {
    render() {
        return (
            <View>
                <Text>文章列表</Text>
            </View>
        );
    }
}

export default ArticleList;
