### 背景

一款轻阅读应用ReadIT，支持功能：优质文章推送、评论点赞、计划制定、计划闹钟、天气预报、收藏文章、深浅两套主题、多语言切换、极光推送等功能。后续还会继续集成功能。前后端均自主研发，借鉴市面较好的种子工程，目前未上应用市场，文章目前也比较少，后续会持续补充优质文章。

### 展示效果

[点我](https://read-it.oss-cn-shenzhen.aliyuncs.com/sys/5972ebea149738f80f8ed11aed7dec22.mp4)

### 下载体验（目前只有安卓版）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e1c24680e184065bc0288b7018ffc2a~tplv-k3u1fbpfcp-zoom-1.image)

### Github
https://github.com/xiaobinwu/readIt

### 技能树
1、客户端（react-native、@react-navigation、react-native第三方库、typescript、mobx、marked等技术）  

2、中台后管系统（antd4、react、redux、react-router4、hook等技术）  

3、后端程序（koa、mongoDb、jsonwebtoken、ali-oss等技术）  

### react-devtools调试（安卓模拟器）
1、开发者菜单中选择"Debug JS Remotely"选项  
2、自动打开调试页面 http://localhost:8081/debugger-ui（可做断点调试)  
3、打开有异常时暂停（Pause On Caught Exceptions）选项，能够获得更好的开发体验  
4、设置环境变量`ELECTRON_MIRROR='https://npm.taobao.org/mirrors/electron/'`，防止下载`react-devtool`卡住  
5、安装react-devtools，package.json配置npm script，执行`npm run react-devtools`  
6、执行`adb reverse tcp:8097 tcp:8097`  
7、目前react-native => 0.61.5，react-devtool => 3.6.3  
8、参考资料：[参考资料](https://reactnative.cn/docs/debugging.html)  

> 注意：react-devtools v4 需要 react-native 0.62 或更高版本才能正常工作。一升级就报错，后续跟进  

### iconfont字体图标使用  
1、下载Iconfont字体图标项目，下载至本地，获取`iconfont.ttf`  
2、放至`src/assets/fonts`目录  
3、配置`react-native.config.js`,[参考资料](https://github.com/react-native-community/cli/blob/master/docs/configuration.md),如下：  
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
7、参考资料：[参考资料](https://reactnative.cn/docs/debugging.html)  


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
14、`react-native-calendars` => 日历，[前往](https://github.com/wix/react-native-calendars)  
15、`jcore-react-native`、`jpush-react-native` => 极光推送  
16、`react-native-alarm-clock` => 闹钟，[前往](https://github.com/kmorales13/react-native-alarm-clock)  
17、`react-native-amap-geolocation` => 高德地址服务，[前往](https://github.com/qiuxiang/react-native-amap-geolocation)  
18、 `react-native-device-info` => 获取设备信息，[前往](https://github.com/react-native-device-info/react-native-device-info)  
19、 `react-native-image-picker` => 上传图片，[前往](https://github.com/react-native-image-picker/react-native-image-picker)  
20、`react-native-modal-datetime-picker` => 时间选择器，[前往](https://github.com/mmazzarolo/react-native-modal-datetime-picker)  
21、`react-native-picker-select` => 下拉框选择器，[前往](https://github.com/lawnstarter/react-native-picker-select)  
22、`react-native-splash-screen` => 应用启动图，[前往](https://github.com/crazycodeboy/react-native-splash-screen)
23、`react-native-modal` => 弹框，[前往](https://github.com/react-native-community/react-native-modal)

### 第三方库躺坑  

#### 如何获取当前天气、未来三天天气？  
使用的是和风天气API，需要经纬入参，所以必须先获取位置，需要申请和风天气的appKey。

#### 推送服务
极光推送服务 `jcore-react-native`、`jpush-react-native`，需要申请AppKey。

#### 如何获取位置？    
Part1，使用`react-native-geolocation-service`第三方库，获取经纬度进行高德逆地理编码API调用，获取城市，开启google play服务，需要有处理获取位置的服务程序`app/services/location`（参考`react-native-geolocation-service` github example），以及修改`android/app/src/main/AndroidManifest.xml`，添加`<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>` 安卓添加权限。结果不行，针对google play服务国内不能使用，所以该方案得摒弃掉，对应`app/services/location`会删除。

Part2，使用`react-native-amap-geolocation`第三方库，[接口文档](https://qiuxiang.github.io/react-native-amap-geolocation/api/globals.html#setgpsfirst)，[使用指南](https://qiuxiang.github.io/react-native-amap-geolocation/#/?id=%e5%bf%ab%e9%80%9f%e4%b8%8a%e6%89%8b)

#### 图片上传问题  

对于`react-native-image-picker`第三方库， 对于`3.1.4`版本，`minSdkVersion`最少要21以上，在使用的`react-native 0.61.5`下，修改`android/build.gradle`的`minSdkVersion`配置  

阿里oss `aliyun-oss-rn`，需要更改`aliyun-oss-rn` npm包的`android/build.gradle`（如下配置）,提高SDK版本号，以及修改主项目`AndroidManifest.xml`,添加`android:allowBackup="true"`,目前使用上仍有问题，于是放弃该方案，改用oss postObject直传方式，[参考资料](https://help.aliyun.com/document_detail/31988.html)，使用sts临时授权、policy、Signature配合上传。



``` javascript
buildscript {
    repositories {
        jcenter()
    }

    dependencies {
        classpath 'com.android.tools.build:gradle:1.3.1'
    }
}

apply plugin: 'com.android.library'

android {
    compileSdkVersion 28
    buildToolsVersion '28.0.3'

    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 28
        versionCode 1
        versionName "1.0"
    }
    lintOptions {
        abortOnError false
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'com.facebook.react:react-native:+'
    implementation 'com.aliyun.dpa:oss-android-sdk:+'
}
  
  
```


#### 日历问题
`react-native-calendars`的`Agenda`问题如下：  
一、国际化切换、主题切换时，日历没有对应切换，对应HACK处理方法，给`Agenda`组件设置`key`，强制组件卸载，重新加载  
二、`Agenda`在国际化切换、主题切换、添加日程的时候，会导致`Agenda`组件内部`View`组件`onLayout`重复触发（我是不需要其一直触发），导致`this.viewHeight`一直发生变化，导致每次动画执行定位不准问题，处理方法，用个变量存储`this.viewHeight`，示例代码如下：  

```javascript
let VIEW_HEIGHT = 0;

constructor(props) {
    this.viewHeight = VIEW_HEIGHT || windowSize.height;
}

onLayout = event => {
    if (!VIEW_HEIGHT) {
        VIEW_HEIGHT = event.nativeEvent.layout.height;
        this.viewHeight = event.nativeEvent.layout.height;
        this.viewWidth = event.nativeEvent.layout.width;
        this.forceUpdate();
    }
};

```  
三、日程列表改造，只显示当前选中日期的的日程，`Agenda`组件代码改造如下：  

```javascript

  renderReservations() {
    const reservationListProps = extractComponentProps(ReservationList, this.props);
    let reservations = {};
    const { items } = this.props;
    if (this.props.selected && items[this.props.selected.dateString]) {
      reservations = { [this.props.selected.dateString]: items[this.props.selected.dateString] };
    }
    console.log(this.props.selected, '选中的时间');

    return (
      <ReservationList
        {...reservationListProps}
        ref={c => (this.list = c)}
        reservations={reservations}
        selectedDay={this.state.selectedDay}
        topDay={this.state.topDay}
        onDayChange={this.onDayChange}
        onScroll={() => {}}
      />
    );
  }


```


#### 闹钟问题  

`react-native-alarm-clock`,目前yarn、npm均不能下载`1.0.0`，只能将`2.0.0`版本下载至本地，替换`node_moudules`中的对应`npm`包，功能使用还未考证，仍有问题。  


#### 选择下拉框问题

`react-native-picker-select`，报错信息 `"RNCAndroidDialogPicker" was not found in the UIManager`，参考[Issues](https://github.com/lawnstarter/react-native-picker-select/issues/402)，解决办法，降级`@react-native-picker/picker` 至 `1.8.3`  


#### 打包 APK 问题 


管理员CMD，[参考](https://reactnative.cn/docs/signed-apk-android)
```
#keytool -genkey -dname "CN=wushaobin,OU=个人,O=个人,L=深圳,ST=广东,C=CN" -alias test -keyalg RSA -validity 400000 -keystore test.keystore  
#keytool -importkeystore -srckeystore test.keystore -destkeystore test.keystore -deststoretype pkcs12  
#keytool -list -v -keystore test.keystore -storepass xxxxxxxxx  
或 keytool -genkeypair -v -keystore test.keystore -alias test -keyalg RSA -keysize 2048 -validity 400000  

```

#### app应用启动图  

1、下载`react-native-splash-screen`  

2、`android/app/src/main/java/com/readit/MainActivity.java`，配置如下：  

```
import com.facebook.react.ReactActivity;

+ import org.devio.rn.splashscreen.SplashScreen;
+ import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
@@ -12,4 +15,11 @@
  protected String getMainComponentName() {
    return "readIt";
  }

  // 添加下面方法
  + @Override
  + protected void onCreate(Bundle savedInstanceState) {
      + SplashScreen.show(this);  // here
      + super.onCreate(savedInstanceState);
  + }
}
```  
3、`android/app/src/main/res/layout/launch_screen.xml`配置如下(没有就添加)：  

```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              android:layout_width="match_parent"
              android:layout_height="match_parent"
              android:orientation="vertical">
    <ImageView android:layout_width="match_parent" android:layout_height="match_parent" android:src="@drawable/launch_screen" android:scaleType="centerCrop" />
</LinearLayout> 
```  

4、`android/app/src/main/res/values/styles.xml`配置如下：  

```
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <!-- Customize your theme here. -->
        <item name="android:textColor">#000000</item>
        + <!--添加这一行-->
        + <item name="android:windowIsTranslucent">true</item>
    </style>
```  

5、使用如下：  

```
import SplashScreen from 'react-native-splash-screen';

...

componentDidMount() {
    SplashScreen.hide();
}


```  


#### app应用图标问题
替换android/app/src/main/res/mipmap-*文件夹中图标图片

./gradlew assembleRelease失败问题  
1、先执行./gradlew clean，卸载上一个debug版本  
2、再执行./gradlew assembleRelease，生成release版本  

常用指令 `./gradlew clean`、`./gradlew build`


####  编译错误：The Kotlin Gradle plugin was loaded multiple times in different subprojects, which is not supported and may break the build. 问题解决方案：
参考： https://forums.expo.io/t/kotlin-error-when-build-or-install/38868



#### ./gradlew assembleRelease 编译失败  

失败信息： Error: ENOENT: no such file or directory, open 'F:\Project\reactnative\readIt\android\app\build\generated\sourcemaps\react\release\index.android.bundle.map'  

问题解决方案：  
参考： https://stackoverflow.com/questions/56808518/android-gradlew-assemblerelease-sourcemap-output-fail-because-bundle-doesnt-e


#### 发布版本时，删除`build/debug.apk`，执行`./gradlew clean`


#### React Native Android9.0以上打包apk后http请求不到解决方法
[参考资料](https://blog.csdn.net/Cui_xing_tian/article/details/103874265?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-2.control&dist_request_id=&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-2.control)


