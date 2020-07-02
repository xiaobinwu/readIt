import { appApi } from '@app/config';
import { HttpService } from './http';


class Request extends HttpService {
    // 获取文章列表
    async fetchArticles<T>(params = {}) {
        console.log(params);
        const { data } = await this.get<T>(`${appApi}/article/list`, params);
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

}

export default new Request();
