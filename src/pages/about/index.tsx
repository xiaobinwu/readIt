/**
 * @file 关于（首页）
 * @module pages/about/index
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
class About extends Component<IPageProps> {
    render() {
        return (
            <View>
                <Text>关于</Text>
            </View>
        );
    }
}

export default About;
