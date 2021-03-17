/**
 * Detail
 * @file Todo操作页
 * @module pages/todo/todoDetail
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React, { Component, RefObject } from 'react';
import {  ScrollView, StyleSheet, View, SafeAreaView, TextInput, Image } from 'react-native';
import { observable, action } from 'mobx';
import { observer, Observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';   
import { Iconfont } from '@app/components/common/iconfont';
import { TouchableView } from '@app/components/common/touchable-view';
import { Text } from '@app/components/common/text';
import RNPickerSelect from 'react-native-picker-select';
import { DateObject, AgendaItemsMap } from 'react-native-calendars';
import { IPageProps, NavigationProps } from '@app/types/props';
import mixins, { getHeaderButtonStyle } from '@app/style/mixins';
import sizes, { safeAreaViewBottom } from '@app/style/sizes';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import colors from '@app/style/colors';
import { CustomHeaderTitle } from '@app/components/layout/title';
import AlarmClock from "react-native-alarm-clock";
import { LANGUAGE_KEYS } from '@app/constants/language';
import fonts from '@app/style/fonts';
import { STORAGE } from '@app/constants/storage';
import storage from '@app/services/storage';
import { showToast } from '@app/services/toast';
import i18n from '@app/services/i18n';
import { padNumber } from '@app/utils/filters';
import { agendaStore, IAgendaItem } from './components/agendaScreen';
import { getPrioritys, getIconTypes, getTagImg } from './components/agendaScreen/agendsFilter';

export interface ITodoDetailProps extends IPageProps {}

export enum ETodoPickerType {
    TAG = 0,
    PRIORITY = 1,
}


const baseFontSize = 16;

class ToDoStore {
    @observable dateStr: string = '';
    @observable title: string = '';
    @observable description: string = '';
    @observable tag: number = 3;
    @observable priority: number = 0;
    @observable isDatePickerVisible: boolean = false;

    @action.bound
    initParams(item: any = {}) {
        this.dateStr = item.dateStr || '';
        this.title = item.title || '';
        this.description = item.description || '';
        this.tag = (item.tag || item.tag === 0) ? item.tag : 3;
        this.priority = (item.priority || item.priority === 0) ? item.priority : 0;
        this.isDatePickerVisible = !!item.isDatePickerVisible;
    }

    @action.bound
    updateDate(date: Date) {
        const hour = padNumber(date.getHours());
        const minute = padNumber(date.getMinutes());
        this.dateStr = `${hour}:${minute}`;
    }
    
    @action.bound
    updateInputTitle(title: string) {
        this.title = title;
    }

    @action.bound
    updateInputDescrption(description: string) {
        this.description = description;
    }

    @action.bound
    updateTag(tag: number) {
        this.tag = tag;
    }

    @action.bound
    updatePriority(priority: number) {
        this.priority = priority;
    }

    @action.bound
    updateDatePickerVisibility(visible: boolean) {
        this.isDatePickerVisible = visible;
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

    constructor(props: ITodoDetailProps) {
        super(props);
        toDoStore.initParams(this.props.route.params?.item);
    }

    @boundMethod
    pickerChange(value: number, type: ETodoPickerType) {
        if (type === ETodoPickerType.TAG) {
            toDoStore.updateTag(value);
        }
        if (type === ETodoPickerType.PRIORITY) {
            toDoStore.updatePriority(value);
        }
    }

    @boundMethod
    async submitTodo() {
        const dateObject: DateObject | null = agendaStore.selectedDate;
        const dateStr = toDoStore.dateStr;
        const params: any = { hasClock: false, checked: false };
        if (dateObject) {
            // 设置闹钟
            if (dateStr) {
                const dateStrArr = dateStr.split(':');
                const date = new Date(dateObject.dateString);
                date.setHours(Number(dateStrArr[0]), Number(dateStrArr[1]));
                console.log(date.toISOString());
                console.log(date.toLocaleString());
                console.log(toDoStore.title, Number(dateStrArr[0]), Number(dateStrArr[1]));
                // 1.0.0的调用
                // AlarmClock.createAlarm(toDoStore.title, 17, 20);
                AlarmClock.createAlarm(date.toISOString(), toDoStore.title);
                params.hasClock = true;
            }
            params.title = toDoStore.title;
            params.description = toDoStore.description;
            params.dateTime = dateObject.dateString;
            params.tag = toDoStore.tag;
            params.priority = toDoStore.priority;
            params.dateStr = toDoStore.dateStr;
            const agendaItems = await storage.get<AgendaItemsMap<IAgendaItem>>(STORAGE.AGENDA_ITEMS_MAP);
            if (agendaItems) {
                if (agendaItems && agendaItems[dateObject.dateString] && Array.isArray(agendaItems[dateObject.dateString])) {
                    const len = agendaItems[dateObject.dateString].length;
                    if (this.props?.route?.params?.item) {
                        const item = this.props?.route?.params?.item;
                        agendaItems[dateObject.dateString][item.index] = { ...params, index: item.index };
                    } else {
                        params.index = len;
                        agendaItems[dateObject.dateString].push(params);
                    }
                } else {
                    params.index = 0;
                    agendaItems[dateObject.dateString] = [params];
                }
                storage.set(STORAGE.AGENDA_ITEMS_MAP, agendaItems);
                agendaStore.updateAgendaItems(agendaItems);
                console.log('更新的Item', agendaItems);
            } else {
                const items: any = {};
                params.index = 0;
                items[dateObject.dateString] = [params];
                storage.set(STORAGE.AGENDA_ITEMS_MAP, items);
                agendaStore.updateAgendaItems(items);
            }
            showToast(i18n.t(LANGUAGE_KEYS.SUBMITSUCCESS), {
                onHidden: () => {
                    this.props.navigation.goBack();
                    toDoStore.initParams();
                }
            });
        }
    }

    @boundMethod
    showDatePicker() {
        toDoStore.updateDatePickerVisibility(true);
    }
    
    @boundMethod
    hideDatePicker() {
        toDoStore.updateDatePickerVisibility(false);
    }
    
    @boundMethod
    handleConfirm(date: Date) {
        toDoStore.updateDate(date);
        this.hideDatePicker();
    }

    render() {
        const { styles } = obStyles;
        const { pickStylesObj } = pickerStyles;
        const ICON_TYPES = getIconTypes();
        const PRIORITYS = getPrioritys();
        console.log('ICON_TYPES', ICON_TYPES);
        console.log('PRIORITYS', PRIORITYS);
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
                                        placeholderTextColor={colors.textSecondary}
                                        placeholder={i18n.t(LANGUAGE_KEYS.WIRTEWATH)}
                                        style={styles.textInput}
                                        value={toDoStore.title}
                                        onChangeText={text => toDoStore.updateInputTitle(text)}
                                    />
                                </View>
                            </View>
                            <View style={styles.totdoDescContainer}>
                                <TextInput
                                    multiline
                                    numberOfLines={6}
                                    placeholder={i18n.t(LANGUAGE_KEYS.DESCRIPTION)}
                                    placeholderTextColor={colors.textSecondary}
                                    style={styles.textInput}
                                    value={toDoStore.description}
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
                                    <RNPickerSelect
                                        style={pickStylesObj}
                                        onValueChange={(value) => { this.pickerChange(value, ETodoPickerType.TAG); }}
                                        value={toDoStore.tag}
                                        items={ICON_TYPES}
                                        Icon={() => (
                                            <Image
                                                style={styles.itemIconImg}
                                                source={getTagImg(toDoStore.tag)}
                                            />
                                        )}
                                        placeholder={{}}
                                    />
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
                                    <RNPickerSelect
                                        value={toDoStore.priority}
                                        onValueChange={(value) => { this.pickerChange(value, ETodoPickerType.PRIORITY); }}
                                        items={PRIORITYS}
                                        placeholder={{}}
                                    />
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
                                <TouchableView
                                    accessibilityLabel="选择时间"
                                    accessibilityHint="选择时间"
                                    onPress={this.showDatePicker}
                                    style={styles.timeTouchContainer}
                                >
                                    <View style={styles.totdoItemInputContainer}>
                                        <TextInput
                                            editable={false}
                                            placeholder={i18n.t(LANGUAGE_KEYS.TIPTIME)}
                                            style={[styles.textInput, styles.textSelected]}
                                            value={toDoStore.dateStr}
                                            onChangeText={text => toDoStore.updateInputDescrption(text)}
                                            placeholderTextColor={colors.textSecondary}
                                        />
                                    </View>
                                </TouchableView>
                            </View>
                            {/* <View style={styles.totdoItemContainer}>
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
                            </View> */}
                            <View style={styles.todoButtonContainer}>
                                <TouchableView
                                    accessibilityLabel="Todo添加修改按钮"
                                    accessibilityHint="提交"
                                    onPress={this.submitTodo}
                                    style={styles.btnContainer}
                                >
                                    <Text style={styles.btnText}>{i18n.t(LANGUAGE_KEYS.SUBMIT)}</Text>
                                </TouchableView>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <DateTimePickerModal
                    isVisible={toDoStore.isDatePickerVisible}
                    mode="time"
                    onConfirm={this.handleConfirm}
                    onCancel={this.hideDatePicker}
                />
            </SafeAreaView>
        );
    }
}

const pickerStyles = observable({
    get pickStylesObj() {
        return StyleSheet.create({
            inputIOS: {
                color: colors.textDefault
            },
            inputAndroid: {
                color: colors.textDefault
            },
        });
    }
});

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
            },
            todoButtonContainer: {
                paddingVertical: 20,
                width: 400,
                alignSelf: 'center'
            },
            textInput: {
                fontSize: baseFontSize,
                color: colors.textDefault
            },
            itemIconImg: {
                width: 35,
                height: 35,
                marginTop: 8
            },
            timeTouchContainer: {
                flex: 1
            },
            textSelected: {
                color: colors.textDefault
            },
            btnContainer: {
                backgroundColor: colors.primary,
                flex: 1,
                ...mixins.center,
                height: 40,
                borderRadius: 2,
            },
            btnText: {
                fontSize: baseFontSize,
                color: colors.cardBackground,
            }
        });
    }
});

export default TodoDetail;
