# 五、首页

# step1: 轮播

https://github.com/best-flutter/flutter_swiper

`flutter_swiper`版本不兼容，出现‘null safety’提示，改用下面：

[card_swiper | Flutter Package](https://pub.dev/packages/card_swiper)

`pubspec.yaml`添加：

```js
card_swiper: '^2.0.4';
```

## 细节处理 1——轮播图的高度跟随屏幕宽度动态变化

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/eeb070cd-b2d5-4148-8782-384d09310e26/Untitled.png)

- MediaQuery.of(context).size.width —— 获取屏幕宽度

## step2——如何引入静态图片

在项目根目录下新建 static/images 文件夹，将静态文件图片拷贝到此文件夹下，然后在`pubspec.yaml`文件里引入：

```js
assets:
    # 首页——第一个tab-导航图标
    - static/images/home_index_navigator_total.png
    - static/images/home_index_navigator_map.png
    - static/images/home_index_navigator_share.png
    ...
```

## step3——组件 CommonImage 封装

目前存在的问题：

- 轮播图使用网络图片时，偶尔会出现超时，如何解决？
- 涉及到图片方面的优化，是否需要修改很多处？

解决方法：封装一个组件

### 细化方案：

1.根据资源地址是可以区分本地资源和网络的资源的（网络图片地址以 http 开头，本地图片地址以 static 开头），所以无论是使用本地图片还是网络图片，都可以共用一个图片组件

2.网络图片添加本地缓存，延长图片网络请求超时时间！可以使用第三方组件：[AdvancedNetworkImage](https://pub.flutter-io.cn/packages/flutter_advanced_networkimage/changelog)（但是版本不匹配，改使用**[cached_network_image](https://pub.flutter-io.cn/packages/cached_network_image)**）

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/19975c21-9473-4183-924b-e7d41577bf75/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e99aebf0-bf31-4e02-baf1-af311af3155e/Untitled.png)

## step3: SearchBar 封装

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/621c7067-6ff0-4157-8884-fa30bf16ff1a/Untitled.png)

### 有状态组件里，取参数

```js
通过 widget.*** 获取参数
```

### 优化

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e44f9e44-e5d4-41ec-a3a2-6e7186915ed0/Untitled.png)

存在问题：

- 当点击搜索框时，代码逻辑是跳转到 search 页面，但是点击返回后，发现搜索框还是聚焦状态。

```js
onTap: () {
+  if (widget.onSearchSubmit == null) {
+   _focus.unfocus(); // 使之失去焦点
+  }
   widget.onSearch!();
},
```

## step4: 已登陆/未登陆视图切换
