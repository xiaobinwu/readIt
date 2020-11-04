/* eslint-disable react-native/no-inline-styles */
/**
 * Comment list component
 * @file 评论列表组件
 * @module app/components/comment
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React, { PureComponent } from 'react';
import { Alert, StyleSheet, View, Image, Text } from 'react-native';
import { observable, action } from 'mobx';
import { observer, Observer } from 'mobx-react';
import { Agenda, AgendaItemsMap, DateObject } from 'react-native-calendars';
import { boundMethod } from 'autobind-decorator';
import colors, { isDarkSystemTheme } from '@app/style/colors';
import mixins from '@app/style/mixins';
import fonts from '@app/style/fonts';
import { Iconfont } from '@app/components/common/iconfont';
import i18n from '@app/services/i18n';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { TouchableView } from '@app/components/common/touchable-view';

const CURRENT_DATE = new Date();

export interface IAgendaItem {
    title: string;
    description?: string;
    dateTime?: string;
    hasClock?: boolean;
}

class AgendaStore {
    @observable items: AgendaItemsMap<IAgendaItem> = {};
    @observable currentSelectedYear: number = CURRENT_DATE.getFullYear();
    @observable currentSelectedMonth: number = CURRENT_DATE.getMonth() + 1;
    @observable.ref selectedDate: DateObject | null = null;
    @observable calendarOpened: boolean = false;

    @action.bound
    updateAgendaItems(items: AgendaItemsMap<IAgendaItem>) {
        this.items = items;
    }

    @action.bound
    updateAgendaSelectDate(date: DateObject) {
        this.currentSelectedYear = date.year;
        this.currentSelectedMonth = date.month;
        this.selectedDate = date;
    }

    @action.bound
    updateCalendarOpened(opened: boolean) {
        this.calendarOpened = opened;
    }
}

export const agendaStore = new AgendaStore();

export interface IAgendaScreenProps {
    onDayChange?: (date: DateObject) => void; 
}

@observer
export class AgendaScreen extends PureComponent<IAgendaScreenProps> {
    render() {
        console.log('渲染');
        return (
            <Agenda
                testID="calendars"
                items={agendaStore.items}
                loadItemsForMonth={this.loadItems}
                selected={CURRENT_DATE}
                renderItem={this.renderItem}
                renderDay={this.renderDay}
                rowHasChanged={this.rowHasChanged}
                renderEmptyData={this.renderEmptyData}
                onCalendarToggled={this.calendarToggled}
                theme={{
                    backgroundColor: colors.background,
                    calendarBackground: colors.cardBackground,
                    textSectionTitleColor: colors.textDefault,
                    selectedDayBackgroundColor: colors.primary,
                    selectedDayTextColor: colors.cardBackground,
                    todayTextColor: colors.primary,
                    dayTextColor: colors.textDefault,
                    textDisabledColor: colors.textDefault,
                    dotColor: colors.primary,
                    selectedDotColor: colors.cardBackground,
                    monthTextColor: colors.primary,
                    indicatorColor: colors.primary,
                    agendaDayTextColor: colors.primary,
                    agendaDayNumColor: colors.primary,
                    agendaTodayColor: colors.primary,
                }}
            />
        );
    }

    @boundMethod
    loadItems(day: DateObject) {
        console.log('选中时间', day);
        const { onDayChange } = this.props;
        agendaStore.updateAgendaSelectDate(day);
        onDayChange && onDayChange(day);

        const items = agendaStore.items;
            
            items[day.dateString] = [
                {
                    title: `Item for ${day.dateString} #${0}`,
                },
                // {
                //     title: `Item for ${day.dateString} #${1}`,
                // }
            ];

            const newItems: any = {};
            Object.keys(items).forEach((key) => { newItems[key] = items[key]; });
            agendaStore.updateAgendaItems(items);
    }


    // 隐藏左侧日期列
    @boundMethod
    renderDay() {
        return null;
    }

    @boundMethod
    calendarToggled(calendarOpened: boolean) {
        agendaStore.updateCalendarOpened(calendarOpened);
    }

    @boundMethod
    renderItem(item: IAgendaItem) {
        const { styles } = obStyles;
        return (
            <Observer render={() => (
                <View>
                    <TouchableView
                        accessibilityLabel="日程条目"
                        style={styles.item}
                        testID="item"
                        onPress={() => Alert.alert(item.title)}
                    >
                        <View style={styles.itemIcon}>
                            <Image
                                style={styles.itemIconImg}
                                source={require('@app/assets/images/learn.png')}
                            />
                        </View>
                        <View style={styles.itemContent}>
                            <Text style={styles.itemContentTitle} numberOfLines={1}>
                                <Iconfont name="qizi" size={18} color={colors.green}/>
                                会议记录
                            </Text>
                            <Text style={styles.itemContentSubTitle} numberOfLines={1}>会议记录详情会议记录详情</Text>
                        </View>
                        <View style={styles.itemCheck}>
                            {/* <Iconfont name="CheckboxChecked" size={25} color={colors.checked} /> */}
                            <Iconfont name="CheckboxUnchecked" size={25} color={colors.textSecondary} />
                        </View>
                    </TouchableView>
                </View>
            )} />
        );
    }
    
    @boundMethod
    renderEmptyData() {
        const { styles } = obStyles;
        return (
            <Observer render={() => (
                <View style={styles.emptyContainer}>
                    {
                        isDarkSystemTheme ? (
                            <Image
                                style={styles.emptyImage}
                                source={require('@app/assets/images/noPlan-dark.png')}
                            />
                        ) : (
                            <Image
                                style={styles.emptyImage}
                                source={require('@app/assets/images/noPlan-light.png')}
                            />
                        )
                    }
                    <View style={styles.emptyTextContainer}>
                        <Text style={styles.emptyFirstText}>{ i18n.t(LANGUAGE_KEYS.NOPLANTITLE) }</Text>
                        <Text style={styles.emptyText}>{ i18n.t(LANGUAGE_KEYS.NOPLANDES)}</Text>
                    </View>
                </View>
            )} />
        );
    }

    @boundMethod
    rowHasChanged(r1: IAgendaItem, r2: IAgendaItem) {
        return r1.title !== r2.title;
    }
}

const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            itemContainer: {
                flexDirection: 'column',
            },
            item: {
                width: '100%',
                backgroundColor: colors.cardBackground,
                flex: 1,
                borderRadius: 5,
                marginHorizontal: 10,
                marginTop: 17,
                height: 100,
                flexDirection: 'row',
                justifyContent: 'space-around'
            },
            itemIcon: {
                width: 100,
                height: 100,
                ...mixins.colCenter
            },
            itemIconImg: {
                width: 50,
                height: 50
            },
            itemContent: {
                flex: 1,
                justifyContent: 'center'
            },
            itemContentTitle: {
                color: colors.textDefault,
                ...fonts.h3
            },
            itemContentSubTitle: {
                color: colors.textSecondary,
                marginTop: 2
            },
            itemCheck: {
                width: 50,
                justifyContent: 'center'
            },
            emptyContainer: {
                flex: 1,
                flexDirection: 'column',
                ...mixins.center
            },
            emptyImage: {
                width: 300,
                height: 300,
                resizeMode: 'cover'
            },
            emptyTextContainer: {
                ...mixins.center
            },
            emptyText: {
                color: colors.textSecondary,
                marginTop: 10
            },
            emptyFirstText: {
                ...fonts.h4,
                color: colors.textDefault
            }
        });
    }
});
