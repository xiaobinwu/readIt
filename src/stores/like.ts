/**
 * App global like store
 * @file App 全局喜欢数据的存储
 * @module app/stores/like
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
 
import { observable, action } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { STORAGE } from '@app/constants/storage';
import storage from '@app/services/storage';

class LikeStore {
    @observable.shallow articles: number[] = []; 
    constructor() {
        this.resetStore();       
    }
    @boundMethod
    resetStore() {
        this.initArticles();
    }
    private initArticles() {
        storage.get<number[]>(STORAGE.ARTICLE_LIKES).then(this.updateArticles);
    }
    @action.bound
    updateArticles(articles: number[]) {
        this.articles = articles || [];
        this.syncArticles();
    }
    @action.bound
    likeArticle(articleId: number) {
        this.articles.push(articleId);
        this.syncArticles();
    }
    private syncArticles() {
        storage.set(STORAGE.ARTICLE_LIKES, this.articles.slice());
    }
}

export const likeStore = new LikeStore();
