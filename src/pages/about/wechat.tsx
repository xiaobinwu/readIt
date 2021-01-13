/**
 * Github
 * @file Github 项目列表
 * @module pages/about/wechat
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React, { PureComponent } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { observable } from 'mobx';
import { staticApi } from '@app/config';
import { IPageProps } from '@app/types/props';
import mixins from '@app/style/mixins';
import { normalColors } from '@app/style/colors';

export interface IWechatProps extends IPageProps {}
export default class Wechat extends PureComponent<IWechatProps> {
  render() {
    const { styles } = obStyles;
    return (
      <View style={styles.container}>
        <Image
            style={styles.image}
            source={{ uri: `${staticApi}/images/wechat.jpg` }}
        />
      </View>
    );
  }
}

const obStyles = observable({
  get styles() {
    return StyleSheet.create({
      container: {
        flex: 1,
        ...mixins.center,
        backgroundColor: normalColors.white
      },
      image: {
        width: 674 / 1.5,
        height: 896 / 1.5
      }
    });
  }
});
