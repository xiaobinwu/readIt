/**
 * I18n service
 * @file 多语言服务
 * @module app/services/i18n
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import * as RNLocalize from 'react-native-localize'; // 用于React Native应用本地化的工具箱
import { observable, action } from 'mobx';
import { LANGUAGES, LANGUAGE_KEYS } from '@app/constants/language';
import en from '@app/languages/en';
import zh from '@app/languages/zh';

// 语言类型
export type TLanguage = LANGUAGES;

// 语言包
export type TLanguages = Record<LANGUAGES, Record<LANGUAGE_KEYS, string>>;

// UI层使用的语言列表（一般用于切换语言的UI展示）
type TLanguageList = {
    [key in LANGUAGES]: {
      name: string
      english: string
    }
};

export const languageMaps: TLanguageList = {
    [LANGUAGES.ZH]: {
      name: zh[LANGUAGE_KEYS.CHINESE],
      english: en[LANGUAGE_KEYS.CHINESE]
    },
    [LANGUAGES.EN]: {
      name: en[LANGUAGE_KEYS.ENGLISH],
      english: en[LANGUAGE_KEYS.ENGLISH]
    }
};

const languages: TLanguages = { en, zh };

class I18nStore {
    @observable
    private language: TLanguage = LANGUAGES.ZH;

    @action.bound
    public updateLanguage(language: TLanguage) {
        this.language = language;
    }

    public t(key: LANGUAGE_KEYS): string {
        return languages[this.language][key];
    }

    public translate(key: LANGUAGE_KEYS, language: TLanguage = this.language): string {
        return languages[language][key];
    }
}

export const i18n = new I18nStore();

export default i18n;

export const updateLanguage = i18n.updateLanguage.bind(i18n); // 需要绑定this指向

// 获取设备当前语言环境
export const getDeviceLanguage = (): TLanguage => {
  const localTags = RNLocalize.getLocales().map(local => local.languageCode);
  return localTags.some(tag => tag.toLocaleLowerCase().includes(LANGUAGES.ZH)) ? LANGUAGES.ZH : LANGUAGES.EN;
};

