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
