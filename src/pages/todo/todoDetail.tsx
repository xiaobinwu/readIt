/**
 * Detail
 * @file Todo操作页
 * @module pages/todo/todoDetail
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React, { Component, RefObject } from 'react';
import {  ScrollView, StyleSheet, View, SafeAreaView, TextInput, Button, Picker } from 'react-native';
import { observable, action } from 'mobx';
import { observer, Observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';   
import { Iconfont } from '@app/components/common/iconfont';
import { TouchableView } from '@app/components/common/touchable-view';
import { Text } from '@app/components/common/text';
import { DateObject, AgendaItemsMap } from 'react-native-calendars';
import { IPageProps, NavigationProps } from '@app/types/props';
import mixins, { getHeaderButtonStyle } from '@app/style/mixins';
import sizes, { safeAreaViewBottom } from '@app/style/sizes';
import DatePicker from 'react-native-datepicker';
import { agendaStore, IAgendaItem } from '@app/components/common/agendaScreen';
import colors from '@app/style/colors';
import { CustomHeaderTitle } from '@app/components/layout/title';
import AlarmClock from "react-native-alarm-clock";
import { LANGUAGE_KEYS } from '@app/constants/language';
import fonts from '@app/style/fonts';
import { STORAGE } from '@app/constants/storage';
import storage from '@app/services/storage';
import { showToast } from '@app/services/toast';

export interface ITodoDetailProps extends IPageProps {}

const baseFontSize = 16;

class ToDoStore {
    @observable dateStr: string = '';
    @observable title: string = '';
    @observable description: string = '';

    @action.bound
    updateDateStr(dateStr: string) {
        this.dateStr = dateStr;
    }
    
    @action.bound
    updateInputTitle(title: string) {
        this.title = title;
    }

    @action.bound
    updateInputDescrption(description: string) {
        this.description = description;
    }
}

export const toDoStore = new ToDoStore();

@observer
class TodoDetail extends Component<ITodoDetailProps> {

    private scrollContentElement: RefObject<ScrollView> = React.createRef();

    // 静态方法，定义主页（文章列表）屏幕组件的配置
    static getPageScreenOptions = ({ navigation }: NavigationProps) => {
        return {
            headerTitle: () => (
                <CustomHeaderTitle
                    i18nKey={LANGUAGE_KEYS.TODOITEM}
                />
            ),
            headerLeft: () => (
                <Observer render={() => (
                    <TouchableView
                        accessibilityLabel="返回"
                        accessibilityHint="返回列表页"
                        onPress={() => navigation.goBack()}
                    >
                        <Iconfont
                            name="fanhui" 
                            color={colors.cardBackground}
                            {...getHeaderButtonStyle()}
                        />
                    </TouchableView>
                )} />
            )
        };
    }

    @boundMethod
    async submitTodo() {
        console.log('提交内容');
        const dateObject: DateObject | null = agendaStore.selectedDate;
        const dateStr = toDoStore.dateStr;
        const params = { hasClock: false, checked: false };
        if (dateObject) {
            if (dateStr) {
                const dateStrArr = dateStr.split(':');
                const date = new Date(dateObject.dateString);
                date.setHours(Number(dateStrArr[0]), Number(dateStrArr[1]));
                console.log(date.toISOString());
                console.log(date.toLocaleString());
                AlarmClock.createAlarm(date.toISOString(), toDoStore.title);
                params.hasClock = true;
            }
            params.title = toDoStore.title;
            params.description = toDoStore.description;
            params.datetime = dateObject.dateString;
            params.iconType = 0;
            params.priority = 0;
            const agendaItems = await storage.get<AgendaItemsMap<IAgendaItem>>(STORAGE.AGENDA_ITEMS_MAP);
            if (agendaItems) {
                if (agendaItems && agendaItems[dateObject.dateString] && Array.isArray(agendaItems[dateObject.dateString])) {
                    agendaItems[dateObject.dateString].push(params);
                    storage.set(STORAGE.AGENDA_ITEMS_MAP, agendaItems);
                    agendaStore.updateAgendaItems(agendaItems);
                } else {
                    agendaItems[dateObject.dateString] = [params];
                    storage.set(STORAGE.AGENDA_ITEMS_MAP, agendaItems);
                    agendaStore.updateAgendaItems(agendaItems);
                }
                console.log(agendaItems);
            } else {
                const items = {};
                items[dateObject.dateString] = [params];
                storage.set(STORAGE.AGENDA_ITEMS_MAP, items);
                agendaStore.updateAgendaItems(items);
            }
            showToast('提交成功', {
                onHidden: () => {
                    this.props.navigation.goBack();
                }
            });
        }
    }

    render() {
        const { styles } = obStyles;
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.container, styles.todo]}>
                    <ScrollView
                        ref={this.scrollContentElement}
                        style={styles.container}
                    >
                        <View style={styles.todoContainer}>
                            {/* <Text>{agendaStore.selectedDate?.dateString}.</Text>
                            <Text>{agendaStore.selectedDate?.day}.</Text>
                            <Text>{agendaStore.selectedDate?.month}.</Text>
                            <Text>{agendaStore.selectedDate?.timestamp}.</Text>
                            <Text>{agendaStore.selectedDate?.year}.</Text> */}
                            <View style={styles.totdoItemContainer}>
                                <View style={styles.todoIcon}>
                                    <Iconfont
                                        name="wenbenbianjitianchong" 
                                        color={colors.primary}
                                        size={20}
                                    />
                                </View>
                                <View style={styles.totdoItemInputContainer}>
                                    <TextInput
                                        placeholder="写点什么？"
                                        style={styles.textInput}
                                        onChangeText={text => toDoStore.updateInputTitle(text)}
                                    />
                                </View>
                            </View>
                            <View style={styles.totdoDescContainer}>
                                <TextInput
                                    multiline
                                    numberOfLines={6}
                                    placeholder="描述"
                                    style={styles.textInput}
                                    onChangeText={text => toDoStore.updateInputDescrption(text)}
                                />
                            </View>
                            <View style={styles.totdoItemContainer}>
                                <View style={styles.todoIcon}>
                                    <Iconfont
                                        name="icontag"
                                        color={colors.primary}
                                        size={22}
                                    />
                                </View>
                                <View style={styles.totdoItemInputContainer}>
                                    <Picker
                                        style={{ height: 40, width: '100%' }}
                                    >
                                        <Picker.Item label="Java" value="java" />
                                        <Picker.Item label="JavaScript" value="js" />
                                    </Picker>
                                </View>
                            </View>
                            <View style={styles.totdoItemContainer}>
                                <View style={styles.todoIcon}>
                                    <Iconfont
                                        name="qizi1"
                                        color={colors.primary}
                                        size={22}
                                    />
                                </View>
                                <View style={styles.totdoItemInputContainer}>
                                    <Picker
                                        style={{ height: 40, width: '100%' }}
                                    >
                                        <Picker.Item label="Java" value="java" />
                                        <Picker.Item label="JavaScript" value="js" />
                                    </Picker>
                                </View>
                            </View>
                            <View style={styles.totdoItemContainer}>
                                <View style={styles.todoIcon}>
                                    <Iconfont
                                        name="lingdangbeifen"
                                        color={colors.primary}
                                        size={23}
                                    />
                                </View>
                                {/* <View style={styles.totdoItemInputContainer}>
                                    <DatePicker
                                        mode="time"
                                        placeholder="请选择时间"
                                        androidMode="spinner"
                                        showIcon={false}
                                        date={toDoStore.dateStr}
                                        customStyles={{
                                            dateInput: {
                                              borderWidth: 0,
                                              alignItems: 'flex-start'
                                            },
                                            dateText: {
                                                color: colors.textSecondary,
                                                textAlign: 'left',
                                                fontSize: baseFontSize
                                            },
                                            placeholderText: {
                                                color: colors.textSecondary,
                                                textAlign: 'left',
                                                fontSize: baseFontSize
                                            }
                                        }}
                                        onDateChange={(dateStr, date) => { toDoStore.updateDateStr(dateStr); }}
                                    />
                                </View> */}
                            </View>
                            <View style={styles.totdoItemContainer}>
                                <View style={styles.todoIcon}>
                                    <Iconfont
                                        name="zhongfu1"
                                        color={colors.primary}
                                        size={22}
                                    />
                                </View>
                                <View style={styles.totdoItemInputContainer}>
                                    <TextInput
                                        placeholder="写点什么？"
                                        style={styles.textInput}
                                    />
                                </View>
                            </View>
                            <View style={styles.todoButtonContainer}>
                                <Button
                                    accessibilityLabel="Todo添加修改按钮"
                                    title="提交"
                                    color={colors.primary}
                                    onPress={this.submitTodo}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}

const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            container: {
                flex: 1,
                position: 'relative',
                backgroundColor: colors.cardBackground
            },
            todo: {
                paddingBottom: safeAreaViewBottom
            },
            todoContainer: {
                paddingHorizontal: 30,
                paddingTop: 50
            },
            totdoDescContainer: {
                backgroundColor: colors.background,
                borderRadius: 2,
                marginLeft: 40,
                marginBottom: 40,
                color: colors.textSecondary
            },
            totdoItemContainer: {
                ...mixins.rowCenter,
                marginBottom: 40
            },
            todoIcon: {
                width: 30,
                ...mixins.colCenter
            },
            totdoItemInputContainer: {
                borderColor: colors.border,
                borderBottomWidth: sizes.borderWidth,
                flex: 1,
                marginLeft: 10,
                color: colors.textSecondary
            },
            todoButtonContainer: {
                paddingVertical: 20,
                width: 400,
                alignSelf: 'center'
            },
            textInput: {
                fontSize: baseFontSize
            }
        });
    }
});

export default TodoDetail;
