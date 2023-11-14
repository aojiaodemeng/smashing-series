# 八、dio 封装

[dio | Dart Package](https://pub.dev/packages/dio)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9881d755-326f-4428-906c-1063639a3396/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/83cc9c6e-6d0e-4491-84f9-9cdf7734b3e0/Untitled.png)

# 封装 DioHttp

为什么要封装？

- dio 的 api 变了或者后续使用其他组件替代 dio 时，需要修改的代码较多

参考文章：

[[Example code] - Dio Interceptors in flutter Example](https://www.flutterdecode.com/dio-interceptors-in-flutter-example/)

[Flutter Dio 源码分析(一)–Dio 介绍](https://www.liujunmin.com/flutter/dio_introduce.html)

[Flutter Dio 源码分析(三)--深度剖析](https://www.jianshu.com/p/f1f2c2116d67)

[Efficient CRUD Operations in Flutter: A Guide to Implementing HTTP Requests with Clean Architecture and Dio](https://clouds.hashnode.dev/efficient-crud-operations-in-flutter-a-guide-to-implementing-http-requests-with-clean-architecture-and-dio?ref=hackernoon.com#heading-understanding-clean-architecture)

## step1:`config.dart`文件里 url 常量设置

```js
class Config {
  static const CommonIcon = 'CommonIcon';
  static const BaseUrl = 'https://mock.apifox.cn/m1/2965656-0-default';
  static const LocalUrl = 'http://0.0.0.0:3000/api/v1';
}
```

## step1: 新建 utils/dio.dart 文件

```js
import 'package:dio/dio.dart';
import 'package:rental_app/config.dart';

/// dio网络请求配置表 自定义
class DioConfig {
  static const baseURL = Config.LocalUrl; //域名
  static const timeout = 10000; //超时时间
}

// 网络请求工具类
class DioRequest {
  late Dio dio;
  static DioRequest? _instance;

  /// 构造函数
  DioRequest() {
    dio = Dio();
    dio.options = BaseOptions(
        baseUrl: DioConfig.baseURL,
        connectTimeout: const Duration(seconds: 5),
        receiveTimeout: const Duration(seconds: 3),
        contentType: 'application/json; charset=utf-8',
        headers: {});

    /// 请求拦截器 and 响应拦截机 and 错误处理
    dio.interceptors.add(InterceptorsWrapper(onRequest: (options, handler) {
      print("\n================== 请求数据 ==========================");
      print("url = ${options.uri.toString()}");
      print("headers = ${options.headers}");
      print("params = ${options.data}");
      return handler.next(options);
    }, onResponse: (response, handler) {
      print("\n================== 响应数据 ==========================");
      print("code = ${response.statusCode}");
      print("data = ${response.data}");
      print("\n");
      handler.next(response);
    }, onError: (DioError e, handler) {
      print("\n================== 错误响应数据 ======================");
      print("type = ${e.type}");
      print("message = ${e.message}");
      print("\n");
      return handler.next(e);
    }));
  }
  static DioRequest getInstance() {
    return _instance ??= DioRequest();
  }
}
```

## step3:新建 service/login.dart

```js

import 'dart:convert';
import 'package:rental_app/utils/dio.dart';

class LoginService {

  /// 登录接口
  static login(value) async {
    var response =
        await DioRequest.getInstance().dio.post('/login', data: value);
    var data = jsonDecode(response.toString());

    // 对返回的身份凭证全局持久化存储
    return data;
  }

  // 登录接口
  static register(value) async {
    var response =
        await DioRequest.getInstance().dio.post('/user/add', data: value);
    var data = jsonDecode(response.toString());

    /// 对返回的身份凭证全局持久化存储
    return data;
  }


}
```
