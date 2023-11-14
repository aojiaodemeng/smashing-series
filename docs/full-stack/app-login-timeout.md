# 十一、登陆过期处理

比如我们在点击“提交”按钮时，由于登陆信息过期了，造成后端给我们返回的信息未按预期。此时我们可以使用 dio 的拦截器来进行处理。

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/63763dd6-0b23-40d0-9aba-25f07b0bb870/Untitled.png)

dio.dart

> 注意：dio 里无法直接获取到 context，因此需要在请求 api 时将 context 添加到 extra 里

```js
import 'dart:convert';
import 'dart:js';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:rental_app/config.dart';
import 'package:rental_app/scoped_model/auth.dart';
import 'package:rental_app/utils/common_toast.dart';
import 'package:rental_app/utils/scoped_model_helper.dart';
import 'package:rental_app/routes.dart';

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
        extra: {
          'context': context
        }, // dio里无法直接获取到context，因此需要在请求api时将context添加到extra里
        headers: {});

    /// 请求拦截器 and 响应拦截机 and 错误处理
    dio.interceptors.add(InterceptorsWrapper(onRequest: (options, handler) {
      print("\n================== 请求数据 ==========================");
      print("url = ${options.uri.toString()}");
      print("headers = ${options.headers}");
      print("params = ${options.data}");
      return handler.next(options);
    }, onResponse: (Response res, handler) {
      print("\n================== 响应数据 ==========================");
      print("code = ${res.statusCode}");
      print("data = ${res.data}");
      print("\n");

      if (null == res) {
        handler.next(res);
      }
      var status = json.decode(res.toString())['status'];
      if (404 == status) {
        CommonToast.showToast('接口地址错误！');
        // return res;
        // handler.next(res);
      }
      if (status.toString().startsWith("4")) {
        var context = res.extra['context'];
        ScopedModelHelper.getModel<AuthModel>(context).logout();
        CommonToast.showToast('登陆过期');
        Navigator.pushNamed(context, Routes.login);
        // return res;
        // handler.next(res);
      }
      handler.next(res);
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
