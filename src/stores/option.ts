/**
 * App global option store
 * @file App 全局公共存储
 * @module app/stores/option
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import { observable, action, computed } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { LANGUAGES } from '@app/constants/language';
import { STORAGE } from '@app/constants/storage';
import { getDeviceLanguage, updateLanguage, TLanguage } from '@app/services/i18n';
import storage from '@app/services/storage';
import { updateTheme, isDarkSystemTheme } from '@app/style/colors';
import { Iuser } from '@app/types/business';

type Tuser = Iuser | {};
export interface IOptionStore {
    language: TLanguage;
    darkTheme: boolean;
    userInfo: Tuser;
}

class OptionStore {
    constructor() {
        this.resetStore();
    }

    @observable.ref language: TLanguage = LANGUAGES.ZH;
    @observable.ref darkTheme: boolean = isDarkSystemTheme;
    // 初始值
    @observable.ref userInfo: Iuser = {
        deviceId: '',
        _id: '',
        nickName: '',
        motto: '',
        email: '',
        avatar: '',
        os: '',
        brand: '',
        deviceName: '',
        manufacturer: '',
        systemVersion: '',
        likeArticles: [],
        commentArticles: [],
        viewArticles: []
    };

    @computed get isEnlang() {
        return this.language === LANGUAGES.EN;
    }


    @action.bound
    updateLanguageWithOutStorage(language: TLanguage) {
        this.language = language;
        updateLanguage(language);
    }

    @action.bound
    updateLanguage(language: TLanguage) {
      this.updateLanguageWithOutStorage(language);
      storage.set(STORAGE.LOCAL_LANGUAGE, language);
    }
  
    @action.bound
    updateDarkTheme(darkTheme: boolean) {
        this.darkTheme = darkTheme;
        storage.set(STORAGE.LOCAL_DARK_THEME, darkTheme);
        updateTheme(darkTheme);
    }

    @action.bound
    updateUserInfo(userInfo: Iuser) {
        this.userInfo = userInfo;
    }


    @boundMethod
    resetStore() {
        this.initLanguage();
        this.initDarkTheme();
    }

    private async initLanguage() {
        // 获取本地存储的用户设置语言，若用户未设置语言，则首选本机语言
        let localLanguage = await storage.get<TLanguage>(STORAGE.LOCAL_LANGUAGE);
        localLanguage = localLanguage || getDeviceLanguage();
        console.log('Init app language:', localLanguage);
        this.updateLanguageWithOutStorage(localLanguage);
    }

    private async initDarkTheme() {
        const darkTheme = await storage.get<boolean>(STORAGE.LOCAL_DARK_THEME);
        if (darkTheme !== null) {
            console.log('Init app darkTheme:', darkTheme);
            this.updateDarkTheme(darkTheme);
        }
    }
}

export const optionStore = new OptionStore();
