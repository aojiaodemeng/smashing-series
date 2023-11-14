![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0f7dcb7b-fb13-4e48-91b8-c10658f17774/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/08436c2f-4b6a-4faa-9523-2aa7a819e9d6/Untitled.png)

## step1: 新建 pages/loading.dart 文件

```js
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:rental_app/scoped_model/auth.dart';
import 'package:rental_app/utils/scoped_model_helper.dart';

class LoadingPage extends StatefulWidget {
  const LoadingPage({super.key});

  @override
  State<LoadingPage> createState() => _LoadingPageState();
}

class _LoadingPageState extends State<LoadingPage> {
  // 生命周期里实现延迟跳转和调用initApp
  @override
  void initState() {
    Timer(Duration(seconds: 3), () {
      Navigator.of(context).pushReplacementNamed('/');
    });
    Timer.run(() {
      ScopedModelHelper.getModel<AuthModel>(context).initApp(context);
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: BoxDecoration(
            image: DecorationImage(
                fit: BoxFit.fill,
                image: AssetImage('static/images/loading.jpg'))));
  }
}
```

## step2:注册 loading 页面

lib/routes.dart 加入以下代码：

```js
import 'package:rental_app/pages/loading.dart';

class Routes {
	static String loading = '/loading';

	static Handler _loadingHandler = Handler(
      handlerFunc: (BuildContext? context, Map<String, dynamic> params) {
    return LoadingPage();
  });

	router.define(loading, handler: _loadingHandler);
}
```

## step3:application 配置 initialRoute

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/943ad765-f8a3-4aff-9eb9-e4e5c36bf779/Untitled.png)

## step3-1: 修改之前的错误代码

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/528400b9-8c92-4204-941c-cab0fe8b0423/Untitled.png)

## 问题 1：

此时就可以看到启动页面了，但是有个新的问题，左上角出现了一个返回按钮：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4491f853-f223-4fbf-9a76-ef5a53e0d6b4/Untitled.png)

解决方法：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ab2c25f5-5079-4da8-a569-8e7dbc9771e2/Untitled.png)

## 问题 2: 退出登陆之后，然后重启 app，发现还是登陆状态

原因：退出登录时没有清除缓存

auth.dart

```js

void logout() async {
    _token = '';
    _userInfo = null;
    notifyListeners();

+    Store store = await Store.getInstance();
+   await store.setString(StoreKeys.token, '');
  }
```

## 问题 3:token 存在但过期了，那么从落地页进来时就会跳到登陆页，登陆成功之后会再次回到落地页，但此时落地页没办法到首页

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2810afd5-745c-403e-ba99-71feba3c0e64/0e2ecc25-75a5-4f5b-af89-a299a1d08b55/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2810afd5-745c-403e-ba99-71feba3c0e64/0ba41d5b-1d9b-480e-b661-b48ff61b9596/Untitled.png)

```js
// 如果当前在落地启动页
if (ModalRoute.of(context).settings.name == Routes.loading) {
  return res;
}
```
