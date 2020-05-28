### 参数配置

下面为扩展参数，`axios`的所有参数都可用
```javascript
{
  method: 'post', // 请求参数
  isFilterEmptyField: false, // 是否过滤空字段
  errorPop: false, // 是否弹出默认错误信息

  isCancel: false, // 如果第二次请求发起在第一次请求结束之前，取消第一次请求
  useLoacalCache: 0, // 通过本地缓存cache接口数据，0 不缓存，单位（s） 3 * 24 * 60 * 60
  usePreResult: false, // 多次请求同一个接口，皆返回第一次请求的数据，不会判断参数变更，谨慎使用
  additional: (params) => { return params },  // 等待前置条件完成，再发起请求
}
```

### 用法一

```javascript
  // 不支持使用isCancel、useLoacalCache、usePreResult、additional配置
  import request from './http';
  request({
    url: '/a/b',
    method: 'post',
    timeout: 20 * 1000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    errorPop: true,
    loading: true
  }).then((res) => {
    console.log(res);
  })
```

### 用法二

```javascript
  import Service from './http/service';
  const serviceA = new Service({
    timeout: 20 * 1000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  // 使用
  serviceA.http({
    url: '/a/b',
    method: 'post',
    errorPop: true,
    loading: true
  }).then((res) => {
    console.log(res);
  })
```

### 用法三

```javascript
  import Service from './http/service';

  // 继承暂时只支持get、post
  class ServiceA extends Service {

    static config = {
      
    }
    getA(params = {}, config1) {
      return this.get('/a/b', params, {});
    }
    postB(params = {}) {
      return this.post('/a/c', params);
    }
  }

  // 使用
  const serviceA = new ServiceA();
  serviceA.getA(params);
  serviceA.postB(params);
```