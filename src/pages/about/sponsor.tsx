/**
 * Github
 * @file Github 项目列表
 * @module pages/about/sponsor
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React, { PureComponent } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { observable } from 'mobx';
import { staticApi } from '@app/config';
import { IPageProps } from '@app/types/props';
import mixins from '@app/style/mixins';
import { normalColors } from '@app/style/colors';

export interface ISponsorProps extends IPageProps {}
export default class Sponsor extends PureComponent<ISponsorProps> {
  render() {
    const { styles } = obStyles;
    return (
      <View style={styles.container}>
        <Image
            style={styles.image1}
            source={{ uri: `${staticApi}/images/wechatPay.jpg` }}
        />
        <Image
            style={styles.image2}
            source={{ uri: `${staticApi}/images/antdPay.jpg` }}
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
      image1: {
        width: 1080 / 5,
        height: 1466 / 5,
        marginBottom: 30
      },
      image2: {
        width: 600 / 3,
        height: 900 / 3
      }
    });
  }
});
