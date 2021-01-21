/**
 * Text
 * @file 实况天气预报
 * @module app/components/common/weather
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React from 'react';
import { View, StyleSheet, Image,  } from 'react-native';
import { staticApi } from '@app/config';
// import { IChildrenProps } from '@app/types/props';
import colors from '@app/style/colors';
import fonts from '@app/style/fonts';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import mixins from '@app/style/mixins';
import { Iconfont } from './iconfont';
import { Text } from './text';

export interface IWeather {
    updateTime?: string;
    temp?: number | string;
    icon?: number | string;
    text?: string;
    tempMax?: number | string;
    tempMin?: number | string;
    feelsLike?: number | string;
    fxLink?: string;
}

interface IWeatherProps extends IWeather {}

export const Weather = observer((props: IWeatherProps): JSX.Element => {
    const { temp = '-', icon, text = '-', tempMax = '-', tempMin = '-', feelsLike = '-', } = props;
    const { styles } = obStyles;
    return (
        <View style={styles.container}>
            <View style={styles.temp}>
                <Image style={styles.icon} source={{ uri: `${staticApi}/weather/${icon}.png` }} />
                <Text style={[styles.tempValue, styles.fontColor]}>{temp}{'°'}</Text>
            </View>
            <View style={styles.tempRnage}>
                <Text style={styles.fontColor}>{tempMin}{'°'}</Text>
                <Text style={styles.fontColor}>/</Text>
                <Text style={styles.fontColor}>{tempMax}{'°'}</Text>
                <Text style={[styles.fellLikeDec, styles.fontColor]}>体感温度</Text>
                <Text style={styles.fontColor}>{feelsLike}{'°'}</Text>
            </View>
        </View>
    );
});


const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            container: {
                ...mixins.colCenter,
            },
            temp: {
                ...mixins.rowCenter,
            },
            fontColor: {
                color: colors.cardBackground
            },
            tempRnage: {
                ...mixins.rowCenter,
                ...fonts.h4
            },
            fellLikeDec: {
                marginLeft: 10,
                marginRight: 5
            },
            icon: {
                width: 50,
                height: 50
            },
            tempValue: {
                ...fonts.h3
            }
        });
    }
});
