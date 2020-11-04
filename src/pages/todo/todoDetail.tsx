/**
 * Detail
 * @file Todo操作页
 * @module pages/todo/todoDetail
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React, { Component, RefObject } from 'react';
import {  ScrollView, StyleSheet, View, SafeAreaView, TextInput, Button } from 'react-native';
import { observable } from 'mobx';
import { observer, Observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';   
import { Iconfont } from '@app/components/common/iconfont';
import { TouchableView } from '@app/components/common/touchable-view';
import { Text } from '@app/components/common/text';
import { IPageProps, NavigationProps } from '@app/types/props';
import mixins, { getHeaderButtonStyle } from '@app/style/mixins';
import sizes, { safeAreaViewBottom } from '@app/style/sizes';
import DatePicker from 'react-native-datepicker';
import { agendaStore } from '@app/components/common/agendaScreen';
import colors from '@app/style/colors';
import { CustomHeaderTitle } from '@app/components/layout/title';
import { LANGUAGE_KEYS } from '@app/constants/language';
import fonts from '@app/style/fonts';
import { CommonActions } from '@react-navigation/native';
import { TodoRoutes } from '@app/constants/routes';

export interface ITodoDetailProps extends IPageProps {}

const headerHeight = sizes.gap * 3;

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

    submitTodo = () => {
        console.log(11111);
    }

    render() {
        const { styles } = obStyles;
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.container, styles.todo]}>
                    <ScrollView
                        ref={this.scrollContentElement}
                        style={styles.container}
                        scrollEventThrottle={16}
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
                                        name="pinglun1" 
                                        color={colors.primary}
                                        size={20}
                                    />
                                </View>
                                <View style={styles.totdoItemInputContainer}>
                                    <TextInput
                                        placeholder="写点什么？"
                                        style={{ fontSize: 18 }}
                                    />
                                </View>
                            </View>
                            <View style={styles.totdoDescContainer}>
                                <TextInput
                                    multiline
                                    numberOfLines={6}
                                    placeholder="描述"
                                />
                            </View>
                            <View style={styles.totdoItemContainer}>
                                <View style={styles.todoIcon}>
                                    <Iconfont
                                        name="lingdang"
                                        color={colors.primary}
                                        size={23}
                                    />
                                </View>
                                <View style={styles.totdoItemInputContainer}>
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        mode="time"
                                        placeholder="请选择时间"
                                        androidMode="spinner"
                                        showIcon={false}
                                        customStyles={{
                                            dateInput: {
                                              borderWidth: 0
                                            },
                                            dateText: {
                                                color: colors.textMuted,
                                                textAlign: 'left'
                                            },
                                            placeholderText: {
                                                color: colors.textSecondary,
                                                textAlign: 'left'
                                            }
                                        }}
                                     
                                        
                                    />
                                </View>
                            </View>
                            <View style={styles.totdoItemContainer}>
                                <View style={styles.todoIcon}>
                                    <Iconfont
                                        name="zhongfu"
                                        color={colors.primary}
                                        size={22}
                                    />
                                </View>
                                <View style={styles.totdoItemInputContainer}>
                                    <TextInput
                                        placeholder="重复"
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
                marginBottom: 40
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
                marginLeft: 10
            },
            todoButtonContainer: {
                paddingVertical: 20,
                width: 400,
                alignSelf: 'center'
            }
        });
    }
});

export default TodoDetail;
