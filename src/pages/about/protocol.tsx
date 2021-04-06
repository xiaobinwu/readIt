/**
 * @file 服务协议
 * @module pages/about/protocol
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { observable } from 'mobx';
import { ProtocolUrl } from '@app/config';
import { IPageProps } from '@app/types/props';
import colors from '@app/style/colors';
import sizes from '@app/style/sizes';
import mixins from '@app/style/mixins';

export interface IProtocolProps extends IPageProps {}
export default class Protocol extends PureComponent<IProtocolProps> {
  render() {
    const { styles } = obStyles;
    return (
      <View style={styles.container}>
        <WebView
          style={styles.webview} 
          source={{ uri: ProtocolUrl }}
          startInLoadingState={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
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
        ...mixins.center
      },
      webview: {
        flex: 1,
        width: sizes.screen.width,
        height: sizes.screen.height,
        backgroundColor: colors.cardBackground
      }
    });
  }
});
