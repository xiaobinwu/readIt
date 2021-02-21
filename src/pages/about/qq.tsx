/**
 * Github
 * @file Github 项目列表
 * @module pages/about/qq
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React, { PureComponent } from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { observable } from 'mobx';
import { staticApi } from '@app/config';
import { IPageProps } from '@app/types/props';
import mixins from '@app/style/mixins';
import { normalColors } from '@app/style/colors';
import sizes from '@app/style/sizes';

export interface IQqProps extends IPageProps {}
export default class Qq extends PureComponent<IQqProps> {
  render() {
    const { styles } = obStyles;
    return (
      <ScrollView>
        <View style={styles.container}>
          <Image
              style={styles.image}
              source={{ uri: `${staticApi}/sys/qq.jpg` }}
          />
        </View>
      </ScrollView>
    );
  }
}

const imageHeightRatio = 750 / 1334;
const imageWidth = sizes.screen.width;

const obStyles = observable({
  get styles() {
    return StyleSheet.create({
      container: {
        flex: 1,
        ...mixins.center,
        backgroundColor: normalColors.white
      },
      image: {
        width: imageWidth,
        height: imageWidth / imageHeightRatio
      }
    });
  }
});
