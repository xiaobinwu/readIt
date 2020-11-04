/**
 * @file 学习计划Title
 * @module pages/todo/components/todoTitle
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Text } from '@app/components/common/text';
import { AutoI18nTitle } from '@app/components/layout/title';
import { LANGUAGE_KEYS, MONTHS } from '@app/constants/language';
import colors from '@app/style/colors';
import { agendaStore } from '@app/components/common/agendaScreen';
import fonts from '@app/style/fonts';

export interface ITodoTitleProps {}

export const TodoTitle = observer((props: ITodoTitleProps): JSX.Element | null => {
    const { styles } = obStyles; 
    return (
        <Text>
            <AutoI18nTitle
                i18nKey={LANGUAGE_KEYS[MONTHS[agendaStore.currentSelectedMonth - 1]]}
                style={[styles.title, styles.titlePadding]}
            />
            <Text style={styles.title}>{agendaStore.currentSelectedYear}</Text>
        </Text>
    );
});

const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            title: {
                ...fonts.h3,
                fontWeight: 'bold',
                color: colors.cardBackground
            },
            titlePadding: {
                marginRight: 2
            }
        });
    }
});
