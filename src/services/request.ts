import { appApi } from '@app/config';
import { HttpService } from './http';


class Request extends HttpService {
    // 获取文章列表
    async fetchArticles<T>(params = {}) {
        console.log(params);
        const { data } = await this.get<T>(`${appApi}/article/list`, params);
        return data;
    }

    // 获取文章详情
    async fetchArticleDetail<T>(params = {}) {
        console.log(params);
        const { data } = await this.post<T>(`${appApi}/article/detail`, params);
        return data;
    }

    // 喜欢文章
    async fetchUpdateArticle<T>(params  = {}) {
        console.log(params);
        const { data } = await this.post<T>(`${appApi}/article/like`, params);
        return data;
    }

    // 获取文章标签列表
    async fetchTags<T>(params = {}) {
        console.log(params);
        const { data } = await this.get<T>(`${appApi}/tag/list`, params);
        return data;
    }

    // 获取文章类型列表
    async fetchCategories<T>(params = {}) {
        console.log(params);
        const { data } = await this.get<T>(`${appApi}/category/list`, params);
        return data;
    }

    // 获取评论列表
    async fetchComments<T>(params = {}) {
        console.log(params);
        const { data } = await this.get<T>(`${appApi}/comment/list`, params);
        return data;
    }

    // 喜欢评论
    async fetchUpdateComment<T>(params  = {}) {
        console.log(params);
        const { data } = await this.post<T>(`${appApi}/comment/like`, params);
        return data;
    }

}

export default new Request();
