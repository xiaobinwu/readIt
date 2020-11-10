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
import { ETodoIconType, ETodoPriority } from '@app/types/state';
import { STORAGE } from '@app/constants/storage';
import storage from '@app/services/storage';
import sizes from '@app/style/sizes';

const CURRENT_DATE = new Date();

export interface IAgendaItem {
    title: string;
    description: string;
    dateTime: string;
    hasClock: boolean;
    iconType: ETodoIconType;
    priority: ETodoPriority;
    checked: boolean;
}

class AgendaStore {
    @observable.ref items: AgendaItemsMap<IAgendaItem> = {};
    @observable currentSelectedYear: number = CURRENT_DATE.getFullYear();
    @observable currentSelectedMonth: number = CURRENT_DATE.getMonth() + 1;
    @observable currentSelectedDay: number = CURRENT_DATE.getDate();
    @observable.ref selectedDate: DateObject | null = null;
    @observable calendarOpened: boolean = false;

    @action.bound
    updateAgendaItems(items: AgendaItemsMap<IAgendaItem>) {
        if (items) {
            this.items = items;
        }
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
    constructor(props: IAgendaScreenProps) {
        super(props);
        this.initAgendaScreen();
        // storage.remove(STORAGE.AGENDA_ITEMS_MAP);
    }

    @boundMethod
    initAgendaScreen() {
        this.getAgendaItems();
    }

    @boundMethod
    async getAgendaItems() {
        const agendaItems = await storage.get<AgendaItemsMap<IAgendaItem>>(STORAGE.AGENDA_ITEMS_MAP);
        // if (day) {
        //     const { dateString } = day;
        //     console.log(agendaItems[dateString]);
        //     if (!(agendaItems && agendaItems[dateString] && Array.isArray(agendaStore[dateString]) &&  agendaStore[dateString].length > 0)) {
        //         agendaItems[dateString] = [];
        //     }
        // }
        agendaStore.updateAgendaItems(agendaItems);
    }

    @boundMethod
    dayPress(day: DateObject) {
        console.log('选中日期', day);
        const { onDayChange } = this.props;
        agendaStore.updateAgendaSelectDate(day);
        onDayChange && onDayChange(day);
    }

    @boundMethod
    calendarToggled(calendarOpened: boolean) {
        agendaStore.updateCalendarOpened(calendarOpened);
    }

    @boundMethod
    renderItemIcon(item: IAgendaItem): JSX.Element {
        const { styles } = obStyles;
        const source = {
            [ETodoIconType.Learn]: require('@app/assets/images/learn.png'),
            [ETodoIconType.Matter]: require('@app/assets/images/shixiang.png'),
            [ETodoIconType.Meeting]: require('@app/assets/images/huiyi.png'),
            [ETodoIconType.Plan]: require('@app/assets/images/plan.png'),
            [ETodoIconType.Remind]: require('@app/assets/images/tixing.png'),
            [ETodoIconType.Work]: require('@app/assets/images/work.png')
        };
        return (
            <Image
                style={styles.itemIconImg}
                source={source[item.iconType]}
            />
        );
    }

    @boundMethod
    getPriorityColor(item: IAgendaItem): string {
        const priorityColor = {
            [ETodoPriority.None]: colors.grey,
            [ETodoPriority.First]: colors.green,
            [ETodoPriority.Second]: colors.yellow,
            [ETodoPriority.Third]: colors.red
        };
        return priorityColor[item.priority];
    }
    

    @boundMethod
    renderItem(item: IAgendaItem) {
        const { styles } = obStyles;
        console.log('渲染条目');
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
                            {this.renderItemIcon(item)}
                        </View>
                        <View style={styles.itemContent}>
                            <Text style={styles.itemContentTitle} numberOfLines={1}>
                                {
                                    item.priority !== ETodoPriority.None ? (
                                        <Iconfont name="qizi" size={18} color={this.getPriorityColor(item)}/>
                                    ) : null
                                }
                                {
                                    item.hasClock ? (
                                        <Iconfont name="shijian1" size={18}/>
                                    ) : null
                                }
                                { item.title }
                            </Text>
                            <Text style={styles.itemContentSubTitle} numberOfLines={1}>{item.description}</Text>
                        </View>
                        <View style={styles.itemCheck}>
                            {
                                item.checked ? (
                                    <Iconfont name="CheckboxChecked" size={25} color={colors.checked} /> 
                                ) : (
                                    <Iconfont name="CheckboxUnchecked" size={25} color={colors.textSecondary} />
                                )
                            }                            
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

    render() {
        console.log('渲染');
        const { styles } = obStyles;
        return (
            <Agenda
                style={styles.agendaContainer}
                testID="calendars"
                items={agendaStore.items}
                selected={CURRENT_DATE}
                renderItem={this.renderItem}
                onDayPress={this.dayPress}
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

}

const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            agendaContainer: {
                width: sizes.screen.width
            },
            itemContainer: {
                flexDirection: 'column',
            },
            item: {
                backgroundColor: colors.cardBackground,
                flex: 1,
                borderRadius: 5,
                marginTop: 17,
                height: 100,
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginRight: 10,
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
