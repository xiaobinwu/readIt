### react-devtools调试（安卓模拟器）
1、开发者菜单中选择"Debug JS Remotely"选项
2、自动打开调试页面 http://localhost:8081/debugger-ui（可做断点调试）
3、打开有异常时暂停（Pause On Caught Exceptions）选项，能够获得更好的开发体验
4、设置环境变量`ELECTRON_MIRROR='https://npm.taobao.org/mirrors/electron/'`，防止下载`react-devtool`卡住
5、安装react-devtools，package.json配置npm script，执行`npm run react-devtools`
6、执行`adb reverse tcp:8097 tcp:8097`
7、目前react-native => 0.61.5，react-devtool => 3.6.3
8、参考资料：![参考资料](https://reactnative.cn/docs/debugging.html)

> 注意：react-devtools v4 需要 react-native 0.62 或更高版本才能正常工作。一升级就报错，后续跟进

### iconfont字体图标使用
1、下载Iconfont字体图标项目，下载至本地，获取`iconfont.ttf`
2、放至`src/assets/fonts`目录
3、配置`react-native.config.js`,![参考资料](https://github.com/react-native-community/cli/blob/master/docs/configuration.md),如下：
```javascript
    module.exports = {
        project: {
            ios: {},
            android: {}, // grouped into "project"
        },
        assets: ["./src/assets/fonts/"], // stays the same
    };
```
4、运行`npm run link`，将对应`iconfont.ttf`分别添加至`iOS`（`Info.plist`中`Fonts provided by application`下添加一行`iconfont.ttf`）、`Android`（复制至`app/src/main/assets/fonts`文件夹中，并且`app/src/build.gradle`添加配置）
5、将`iconfont.json`复制至`src/components/common/iconfont`
6、字体图标封装可参考第4步目录相对应组件文件
7、参考资料：![参考资料](https://reactnative.cn/docs/debugging.html)


### tsconfig.json配置
1、详细各个配置项解析，可查看`tsconfig.json`
2、配置`paths`,结果不起效，需在`src`目录添加`package.json`，配置如下
```javascript
{
  "name": "@app"
}
```

### 第三方库
1、`autobind-decorator` => 自动将方法绑定到类实例，针对babel7需额外配置插件，如下：
```javascript
    {
      plugins:  ["@babel/plugin-proposal-decorators", { legacy: true }]
    }
```  
2、`mobx` / `mobx-react` => 简单、可扩展的状态管理，[前往](https://cn.mobx.js.org/)  
3、`@react-navigation/bottom-tabs` / `@react-navigation/native` / `@react-navigation/stack` => 跨平台导航方案，[前往](https://reactnavigation.org/)  
4、`react-native-appearance` => 在iOS，Android和Web上访问操作系统外观信息。目前支持检测首选配色方案（浅色/深色），[前往](https://github.com/expo/react-native-appearance)  
5、`react-native-localize` => 用于React Native应用本地化的工具箱，[前往](https://github.com/zoontek/react-native-localize)  
6、`@react-native-community/async-storage` => 简单的、异步的、持久化的 Key-Value 存储系统，[前往](https://reactnative.cn/docs/next/asyncstorage.html)  
7、`react-native-actionsheet` => 跨平台ActionSheet，[前往](https://github.com/beefe/react-native-actionsheet)  
8、`react-native-webview` => WebView,旨在替代内置WebView，[前往](https://github.com/react-native-webview/react-native-webview)  
9、`marked` => markdown编译器，[前往](https://marked.js.org/)  
10、`highlight.js` => 代码高亮工具，[前往](https://www.fenxianglu.cn/highlight.html)  
11、`react-native-autoheight-webview` => React Native的自动高度webview，[前往](https://github.com/iou90/react-native-autoheight-webview)  
12、`react-native-image-viewing` => 图片滑动浏览控件，[前往](https://github.com/jobtoday/react-native-image-viewing)  
13、`react-native-root-toast` => 吐司控件，[前往](https://github.com/magicismight/react-native-root-toast)  