/**
 * Github
 * @file 和风天气页面
 * @module pages/about/weather
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { observable } from 'mobx';
import { IPageProps } from '@app/types/props';
import colors from '@app/style/colors';
import sizes from '@app/style/sizes';
import mixins from '@app/style/mixins';

export interface IWeatherProps extends IPageProps {}
export default class Weather extends PureComponent<IWeatherProps> {
  render() {
    const { styles } = obStyles;
    console.log(this.props.route.params?.fxLink);
    return (
      <View style={styles.container}>
        <WebView
          style={styles.webview} 
          source={{ uri: this.props.route.params?.fxLink }}
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
