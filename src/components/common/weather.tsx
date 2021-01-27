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
import { normalColors } from '@app/style/colors';
import fonts from '@app/style/fonts';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import mixins from '@app/style/mixins';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { TouchableView } from '@app/components/common/touchable-view';
import i18n from '@app/services/i18n';
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
    currentCity?: string;
    onPress? : (event: any) => void
}

interface IWeatherProps extends IWeather {}

export const Weather = observer((props: IWeatherProps): JSX.Element => {
    const { temp = '-', icon, text = '-', tempMax = '-', tempMin = '-', feelsLike = '-', fxLink = '', currentCity = '-', onPress } = props;
    const { styles } = obStyles;
    return (
        <TouchableView
            accessibilityLabel="跳往天气预报网址"
            disabled={!fxLink}
            onPress={onPress && onPress}
        >
            <View style={styles.container}>
                <View style={styles.temp}>
                    <Image style={styles.icon} source={{ uri: `${staticApi}/weather/${icon}.png` }} />
                    <Text style={[styles.fontColor, styles.weatherDec]}>{text}</Text>
                    <Text style={[styles.tempValue, styles.fontColor]}>{temp}{'°'}</Text>
                    <Text style={[styles.cityValue, styles.fontColor]}>{currentCity}</Text>
                </View>
                <View style={styles.tempRnage}>
                    <Text style={styles.fontColor}>{tempMin}{'°'}</Text>
                    <Text style={styles.fontColor}>/</Text>
                    <Text style={styles.fontColor}>{tempMax}{'°'}</Text>
                    <Text style={[styles.fellLikeDec, styles.fontColor]}>{i18n.t(LANGUAGE_KEYS.FELLIKE)}</Text>
                    <Text style={styles.fontColor}>{feelsLike}{'°'}</Text>
                </View>
            </View>
        </TouchableView>
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
                color: normalColors.white
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
            weatherDec: {
                marginRight: 5
            },
            tempValue: {
                ...fonts.h3
            },
            cityValue: {
                marginLeft: 8
            }
        });
    }
});
