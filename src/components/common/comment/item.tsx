/**
 * Comment list component
 * @file 评论列表子组件
 * @module app/components/comment
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React, { PureComponent } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { observable } from 'mobx';
import { Iconfont } from '@app/components/common/iconfont';
import { Text } from '@app/components/common/text';
import { TouchableView } from '@app/components/common/touchable-view';
import { IComment } from '@app/types/business';
import { LANGUAGE_KEYS } from '@app/constants/language';
import i18n, { TLanguage } from '@app/services/i18n';
import { dateToYMD } from '@app/utils/filters';
import colors from '@app/style/colors';
import sizes from '@app/style/sizes';
import fonts from '@app/style/fonts';
import mixins from '@app/style/mixins';
import { staticApi } from '@app/config';

export interface ICommentListItemProps {
    comment: IComment;
    liked: boolean;
    onLike(comment: IComment): void;
    darkTheme: boolean;
    language: TLanguage;
}

export class CommentItem extends PureComponent<ICommentListItemProps> {
    render() {
        const { props } = this;
        const { comment, liked } = props;
        const { styles } = obStyles;
        return (
            <View style={styles.container}>
                <Image
                    source={{ uri: `${staticApi}/images/9909704.jpg` }} 
                    style={styles.gravatar}
                />
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text
                            style={styles.userName}
                            numberOfLines={1}
                        >
                            {comment.author}
                        </Text>
                        <Text style={styles.storey} numberOfLines={1}>#{comment.id}</Text>
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                    <View style={styles.footer}>
                        <View style={styles.footerInfo}>
                            <Text
                                style={styles.footerInfoItem}
                                numberOfLines={1}
                            >
                                {dateToYMD(comment.create_at)}
                            </Text>
                        </View>
                        <View style={styles.footerActions}>
                            <TouchableView
                                style={styles.footerActionItem}
                                accessibilityLabel={`给评论点赞：${comment.content}`}
                                disabled={liked}
                                onPress={() => this.props.onLike(comment)}
                            >
                                <Iconfont
                                    name="dianzan"
                                    size={15}
                                    color={liked ? colors.red : colors.textSecondary}
                                />
                                <Text> {comment.likes}</Text>
                            </TouchableView>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            container: {
                flexDirection: 'row',
                padding: sizes.goldenRatioGap,
                borderColor: colors.border,
                borderBottomWidth: sizes.borderWidth
            },
            gravatar: {
                width: 36,
                height: 36,
                borderRadius: 18,
                resizeMode: 'cover',
                backgroundColor: colors.background
            },
            content: {
                flex: 1,
                marginLeft: sizes.goldenRatioGap
            },
            header: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5
            },
            userName: {
                ...fonts.h4,
                fontWeight: '900'
            },
            storey: {
                ...fonts.small,
                color: colors.textSecondary
            },
            commentContent: {
                lineHeight: 24,
                fontWeight: 'normal'
            },
            footer: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5
            },
            footerInfo: {
                ...mixins.rowCenter
            },
            footerInfoItem: {
                ...fonts.small,
                color: colors.textSecondary
            },
            footerActions: {
                ...mixins.rowCenter
            },
            footerActionItem: {
                ...mixins.rowCenter,
                marginLeft: sizes.goldenRatioGap
            }
        });
    }
});
