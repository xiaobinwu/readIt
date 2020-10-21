import React, { Component } from 'react';
import { Alert, StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { boundMethod } from 'autobind-decorator';
import colors from '@app/style/colors';
import mixins from '@app/style/mixins';
import fonts from '@app/style/fonts';

export interface IAgendaScreenProps {
}

@observer
export class AgendaScreen extends Component<IAgendaScreenProps> {
    constructor(props: IAgendaScreenProps) {
        super(props);

        this.state = {
            items: {}
        };
    }

    render() {
        const { items } = this.state;
        return (
            <Agenda
                // items={items}
                // loadItemsForMonth={this.loadItems}
                selected={'2017-05-16'}
                renderItem={this.renderItem}
                renderEmptyDate={this.renderEmptyDate}
                rowHasChanged={this.rowHasChanged}
                renderEmptyData={this.renderEmptyData}
                theme={{
                    backgroundColor: colors.background,
                    calendarBackground: colors.cardBackground,
                    textSectionTitleColor: colors.textDefault,
                    textSectionTitleDisabledColor: colors.textDefault,
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
    loadItems(day: any) {
        const { items } = this.state;
        setTimeout(() => {
            // eslint-disable-next-line no-plusplus
            for (let i = -15; i < 85; i++) {
                // eslint-disable-next-line no-mixed-operators
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = this.timeToString(time);
                if (!items[strTime]) {
                    items[strTime] = [];
                    // eslint-disable-next-line no-mixed-operators
                    const numItems = Math.floor(Math.random() * 3 + 1);
                    for (let j = 0; j < numItems; j++) {
                        items[strTime].push({
                            name: `Item for ${strTime} #${j}`,
                            height: Math.max(50, Math.floor(Math.random() * 150))
                        });
                    }
                }
            }
            const newItems: any = {};
            Object.keys(items).forEach((key) => { newItems[key] = items[key]; });
            this.setState({
                items: newItems
            });
        }, 1000);
    }

    @boundMethod
    renderItem(item: any) {
        const { styles } = obStyles;
        return (
            <TouchableOpacity
                testID="item"
                style={[styles.item, { height: item.height }]}
                onPress={() => Alert.alert(item.name)}
            >
                <Text>{item.name}</Text>
            </TouchableOpacity>
        );
    }

    @boundMethod
    renderEmptyDate() {
        const { styles } = obStyles;
        return (
            <View style={styles.emptyDate}>
                <Text>This is empty date!</Text>
            </View>
        );
    }

    @boundMethod
    renderEmptyData() {
        const { styles } = obStyles;
        return (
            <View style={styles.emptyDataContainer}>
                <Image
                    style={styles.emptyData}
                    source={require('@app/assets/images/noPlan.png')}
                />
                <View style={styles.emptyDataTextContainer}>
                    <Text style={styles.emptyFirstDataText}>你这一天没有任务</Text>
                    <Text style={styles.emptyDataText}>想做点什么？点击+按钮记下来</Text>
                </View>
            </View>
        );
    }

    @boundMethod
    rowHasChanged(r1: any, r2: any) {
        return r1.name !== r2.name;
    }

    @boundMethod
    timeToString(time: any) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }
}

const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            item: {
                backgroundColor: colors.cardBackground,
                flex: 1,
                borderRadius: 5,
                padding: 10,
                marginRight: 10,
                marginTop: 17
            },
            emptyDate: {
                height: 15,
                flex: 1,
                paddingTop: 30
            },
            emptyDataContainer: {
                flex: 1,
                flexDirection: 'column',
                ...mixins.center
            },
            emptyData: {
                width: 300,
                height: 300,
                resizeMode: 'cover'
            },
            emptyDataTextContainer: {
                ...mixins.center
            },
            emptyDataText: {
                color: colors.textDefault,
                marginTop: 10
            },
            emptyFirstDataText: {
                ...fonts.h4,
                color: colors.textSecondary,
            }
        });
    }
});
