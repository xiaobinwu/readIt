/**
 * @file 日程工具函数
 * @module app/components/common/agendaScreen/agendsFilter
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import { ETodoIconType, ETodoPriority } from '@app/types/state';
import colors from '@app/style/colors';
import { LANGUAGE_KEYS } from '@app/constants/language';
import i18n from '@app/services/i18n';
import { observable } from 'mobx';

// 优先级color对象
export const PRIORITY_COLOR = {
    [ETodoPriority.None]: colors.grey,
    [ETodoPriority.First]: colors.green,
    [ETodoPriority.Second]: colors.yellow,
    [ETodoPriority.Third]: colors.red
};

// 优先级
export const getPriorityColor = (index: number): string => {
    return PRIORITY_COLOR[index];
};

// 标签图片对象
export const TAG_IMGS = {
    [ETodoIconType.Learning]: require('@app/assets/images/learn.png'),
    [ETodoIconType.Matter]: require('@app/assets/images/shixiang.png'),
    [ETodoIconType.Meeting]: require('@app/assets/images/huiyi.png'),
    [ETodoIconType.Plan]: require('@app/assets/images/plan.png'),
    [ETodoIconType.Remind]: require('@app/assets/images/tixing.png'),
    [ETodoIconType.Work]: require('@app/assets/images/work.png')
};

// 标签
export const getTagImg = (index: number): any => {
    return TAG_IMGS[index];
};

export const getIconTypes = () => {
    return [
        { label: i18n.t(LANGUAGE_KEYS.LEARNING), value: ETodoIconType.Learning },
        { label: i18n.t(LANGUAGE_KEYS.MATTER), value: ETodoIconType.Matter },
        { label: i18n.t(LANGUAGE_KEYS.MEETING), value: ETodoIconType.Meeting },
        { label: i18n.t(LANGUAGE_KEYS.PLAN), value: ETodoIconType.Plan },
        { label: i18n.t(LANGUAGE_KEYS.REMIND), value: ETodoIconType.Remind },
        { label: i18n.t(LANGUAGE_KEYS.WORK), value: ETodoIconType.Work }
    ];
};

export const getPrioritys = () => {
    return [
        { label: i18n.t(LANGUAGE_KEYS.NOPRIORITY), value: ETodoPriority.None, color: colors.textSecondary },
        { label: i18n.t(LANGUAGE_KEYS.FIRST), value: ETodoPriority.First, color: colors.green },
        { label: i18n.t(LANGUAGE_KEYS.SECOND), value: ETodoPriority.Second, color: colors.yellow },
        { label: i18n.t(LANGUAGE_KEYS.THIRD), value: ETodoPriority.Third, color: colors.red }
    ];
};

