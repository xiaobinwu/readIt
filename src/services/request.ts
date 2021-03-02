import { appApi, baseApi, weatherKey, weatherCurUrl, weather3dUrl, geocodeRegeoUrl, geocodeRegeoKey } from '@app/config';
import AliyunOSS from 'aliyun-oss-rn';
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
        const { deviceId, _id } = params;
        await this.fetchUpdateUser<T>({
            deviceId,
            articleId: _id,
            type: 'view'
        });
        await this.fetchViewArticle<T>(params);
        const { data } = await this.post<T>(`${appApi}/article/detail`, params);
        return data;
    }

    // 阅读文章
    async fetchViewArticle<T>(params = {}) {
        console.log(params);
        const { data } = await this.post<T>(`${appApi}/article/view`, params);
        return data;
    }

    // 喜欢文章
    async fetchLikeArticle<T>(params  = {}) {
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
        if (code === 0) {
            const { data } = await this.post<T>(`${appApi}/users/create`, { ...params, e: encoded }, { headers: {
                signature: md5Str
            } });
            return data;
        }
    }

    // 更新用户信息
    async fetchUpdateUser<T>(params = {}) {
        console.log(params);
        const {  code, encrypt } = await this.fetchRegEncrypt<any>(params);
        const { encoded, md5Str } = encrypt;
        if (code === 0) {
            const { data } = await this.post<T>(`${appApi}/users/edit`, { ...params, e: encoded }, { headers: {
                signature: md5Str
            } });
            return data;
        }
    }


    // 获取STS临时授权签名
    async getSTSAuth(params = {}) {
        const { data } = await this.get(`${baseApi}/ram/sts`, params);
        return data;
    }
    
    // 上传OSS
    async uploadFile(file: any) {
        const creds: any = await this.getSTSAuth();
        if (creds.code === 0) {
            try {
                const configuration = {
                    maxRetryCount: 3,
                    timeoutIntervalForRequest: 30,
                    timeoutIntervalForResource: 24 * 60 * 60,
                };
                console.log(file.uri, 'uri');
                // 根据AliyunOss配置AccessKey
                AliyunOSS.enableDevMode();
                AliyunOSS.initWithPlainTextAccessKey(creds.accessKeyId, creds.accessKeySecret, `${creds.region}.aliyuncs.com`, configuration);
                AliyunOSS.asyncUpload(creds.bucket, `images/${file.fileName?.split('.')[0]}-${file.fileSize}-${file.width}x${file.height}.${file.fileName?.split('.')[1]}`, file.uri).then(res => {
                    console.log('upload success: %j', res);
                }).catch((error: any) => {
                    console.log(error);
                });
                
            } catch (error) {
                console.log('upload error: %j', error);
                return Promise.reject(error);
            }
        } else {
            return Promise.reject(new Error('STS临时授权签名获取失败'));
        }
    }

}

export default new Request();
