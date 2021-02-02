import { appApi, weatherKey, weatherCurUrl, weather3dUrl, geocodeRegeoUrl, geocodeRegeoKey } from '@app/config';
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

    // 新增评论
    async addComment<T>(params = {}) {
        console.log(params);
        const { data } = await this.post<T>(`${appApi}/comment/add`, params);
        return data;
    }

    // 喜欢评论
    async fetchUpdateComment<T>(params  = {}) {
        console.log(params);
        const { data } = await this.post<T>(`${appApi}/comment/like`, params);
        return data;
    }

    // 获取实况天气
    async fetchCurrentWeatherMessage<T>(params = {}) {
        const finalParams = {
            key: weatherKey,
            ...params,
        };
        const { data } = await this.get<T>(weatherCurUrl, finalParams);
        return data;
    }

    // 获取未来三天的天气
    async fetch3dWeatherMessage<T>(params = {}) {
        const finalParams = {
            key: weatherKey,
            ...params,
        };
        const { data } = await this.get<T>(weather3dUrl, finalParams);
        return data;
    }

    // 逆地理编码API
    async fetchGeocodeRegeo<T>(params = {}) {
        const finalParams = {
            key: geocodeRegeoKey,
            ...params,
        };
        const { data } = await this.get<T>(geocodeRegeoUrl, finalParams);
        return data;
    }

    // 判断是否创建用户
    async fetchHasLogin<T>(params = {}) {
        console.log(params);
        const { data } = await this.post<T>(`${appApi}/users/detail`, params);
        console.log(data, '111');
        return data;
    }

    // 获取签名牌
    async fetchRegEncrypt<T>(params = {}) {
        console.log(params);
        const { data } = await this.post<T>(`${appApi}/users/encrypt`, params);
        return data;
    }

    // 添加用户
    async fetchAddUser<T>(params = {}) {
        console.log(params);
        const {  code, encrypt } = await this.fetchRegEncrypt<any>(params);
        const { encoded, md5Str } = encrypt;
        params.e = encoded;
        if (code === 0) {
            const { data } = await this.post<T>(`${appApi}/users/create`, params, { headers: {
                signature: md5Str
            } });
            return data;
        }

    }
}

export default new Request();
