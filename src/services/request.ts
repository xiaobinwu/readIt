import { appApi, baseApi, weatherKey, weatherCurUrl, weather3dUrl, geocodeRegeoUrl, geocodeRegeoKey } from '@app/config';
import { TIHttpArticleResultOrdinary, TIHttpUserResultOrdinary } from '@app/types/http';
import { optionStore } from '@app/stores/option';
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
        // @ts-ignore
        const { deviceId, _id } = params;
        const updateUserResult = await this.fetchUpdateUser<TIHttpUserResultOrdinary>({
            deviceId,
            articleId: _id,
            type: 'view'
        });
        const viewArticleResult = await this.fetchViewArticle<TIHttpArticleResultOrdinary>(params);

        if (updateUserResult && viewArticleResult && updateUserResult.code === 0 && viewArticleResult.code === 0) {
            const { data } = await this.post<T>(`${appApi}/article/detail`, params);
            return data;
        }
    }

    // 阅读文章
    async fetchViewArticle<T>(params = {}) {
        console.log(params);
        const { data } = await this.post<T>(`${appApi}/article/view`, params);
        return data;
    }

    // 评论文章
    async fetchCommentArticle<T>(params = {}) {
        console.log(params);
        const { data } = await this.post<T>(`${appApi}/article/comment`, params);
        return data;
    }

    // 喜欢文章
    async fetchLikeArticle<T>(params  = {}) {
        console.log(params);
        // @ts-ignore
        const { deviceId, _id } = params;
        const updateUserResult = await this.fetchUpdateUser<TIHttpUserResultOrdinary>({
            deviceId,
            articleId: _id,
            type: 'like'
        });
        if (updateUserResult && updateUserResult.code === 0) {
            const { data } = await this.post<T>(`${appApi}/article/like`, params);
            return data;
        }
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
        // @ts-ignore
        const { deviceId, articleId, email, author } = params;
        const updateUserResult = await this.fetchUpdateUser<TIHttpUserResultOrdinary>({
            deviceId,
            articleId,
            nickName: author,
            email,
            type: 'comment'
        });
        const commentArticleResult = await this.fetchCommentArticle<TIHttpArticleResultOrdinary>({
            ...params,
            _id: articleId
        });
        console.log(updateUserResult, 'updateUserResult');
        console.log(commentArticleResult, 'commentArticleResult');
        if (updateUserResult && commentArticleResult && updateUserResult.code === 0 && commentArticleResult.code === 0) {
            const { data } = await this.post<T>(`${appApi}/comment/add`, params);
            return data;
        }
    }

    // 喜欢评论
    async fetchUpdateComment<T>(params  = {}) {
        console.log(params);
        // @ts-ignore
        const { deviceId, _id, articleId, } = params;
        const updateUserResult = await this.fetchUpdateUser<TIHttpUserResultOrdinary>({
            deviceId,
            articleId,
            commentId: _id,
            type: 'fabulous'
        });
        if (updateUserResult && updateUserResult.code === 0) {
            const { data } = await this.post<T>(`${appApi}/comment/like`, params);
            return data;
        }
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
            // @ts-ignore
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
            // @ts-ignore
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
    
    // 上传oss，PostObject直传
    async uploadToOSS(url: string, formData: any) {
        console.log(formData, 'formData');
        const res = await this.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res;
    }

    // 上传图片
    async uploadFile(file: any) {
        console.log(file);
        const STATUS_OSS_CODE = 201;
        const creds: any = await this.getSTSAuth();
        console.log(creds, 'creds');
        if (creds.code === 0) {
            try {
                const deviceId = optionStore.userInfo.deviceId;
                const host = `http://${creds.bucket}.${creds.region}.aliyuncs.com`;
                const key = `images/${deviceId}-${file.fileSize}-${file.width}x${file.height}.${file.fileName?.split('.')[1]}`;
                const uploadMediaData = new FormData();
                uploadMediaData.append('key', key);                
                uploadMediaData.append('success_action_status', String(STATUS_OSS_CODE));
                uploadMediaData.append('x-oss-content-type', 'multipart/form-data');
                uploadMediaData.append('x-oss-security-token', creds.securityToken);
                uploadMediaData.append('OSSAccessKeyId', creds.accessKeyId);
                uploadMediaData.append('policy', creds.formPolicy);
                uploadMediaData.append('Signature', creds.formSignature);
                uploadMediaData.append('file', {
                  uri: file.uri,
                  type: 'multipart/form-data',
                  name: file.fileName,
                });
                const res: any = await this.uploadToOSS(host, uploadMediaData);
                if (res.status === STATUS_OSS_CODE) {
                    optionStore.updateUserInfo({
                        ...optionStore.userInfo,
                        avatar: `${host}/${key}`
                    });
                    return Promise.resolve(`${host}/${key}`);
                }
                return Promise.resolve(null);
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
