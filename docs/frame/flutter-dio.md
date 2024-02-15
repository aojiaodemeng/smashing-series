# 常用库

## Dio

Flutter 中网络请求有三种实现方式：

- 自带的 HttpClient
- 第三方库 Http
- 第三方库 Dio

原生 HttpClient 使用非常麻烦，如果涉及到上传、下载、断点续传等复杂需求，还需要手动处理。

Dio 是目前比较流行的网络请求库，支持 Restful API、FormData、拦截器、请求取消、Cookie 管理、文件上传/下载、超时、自定义适配器等。

### Dio 的简单使用

#### step1:添加依赖

```yaml
dependencies:
  dio: ^5.1.2
```

#### step2:发送请求

```dart
import 'package:dio/dio.dart';

final dio = Dio();

void getHttp() async {
  final response = await dio.get('https://dart.dev');
  print(response);
}
```

#### 完整代码

```dart
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

class DioExample extends StatelessWidget {

  void _getUserInfo() async {
    try {
      var response = await Dio().get('http://localhost:8080/getUserInfo');
      print(response);
    } catch (e) {
      print(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("DioExample"),
      ),
      body: Center(
        child: Column(
          children: [
            TextButton(
              onPressed: _getUserInfo,
              child: Text("发送get请求"),
            )
          ],
        ),
      ),
    );
  }
}
```

### HttpClient 的使用

在分析 Dio 之前，最好先了解下 HttpClient。

语言内置的 HttpClient，使用步骤如下：

#### step1: 创建一个 HttpClient

```dart
HttpClient httpClient = HttpClient();
```

#### step2: 打开 http 连接,设置请求头

```dart
HttpClientRequest request = await httpClient.getUrl(Uri.parse("http://localhost:8080/getUserInfo"));
```

#### step3: 通过 HttpClientRequest 可以设置请求 header

```dart
request.headers.add("token", "123456");
```

#### step4: 等待连接服务器

```dart
HttpClientResponse response = await request.close();
```

#### step5: 读取响应内容

```dart
// 响应流数据以utf8编码格式返回
String responseBody = await response.transform(utf8.decoder).join();
```

#### step6:请求结束,关闭 httpClient

```dart
httpClient.close();

```

#### 完整代码

```dart
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
class HttpClientExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {

    void _getUserInfo() async {
      try {
        // 1. 创建httpClient
        HttpClient httpClient = HttpClient();
        // 2. 打开http连接,设置请求头
        HttpClientRequest request = await httpClient.getUrl(Uri.parse("http://localhost:8080/getUserInfo"));
        // 3. 通过HttpClientRequest可以设置请求header
        request.headers.add("token", "123456");
        // 4. 等待连接服务器
        HttpClientResponse response = await request.close();
        // 5. 读取响应内容
        String responseBody = await response.transform(utf8.decoder).join();
        // 6. 请求结束,关闭httpClient
        httpClient.close();

        print(responseBody);
      } catch (e) {
        print(e);
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: Text("DioExample"),
      ),
      body: Center(
        child: Column(
          children: [
            TextButton(
              onPressed: _getUserInfo,
              child: Text("发送get请求"),
            )
          ],
        ),
      ),
    );
  }
```
