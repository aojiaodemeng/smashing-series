# 三、引入路由框架 fluro

## step1：在 pubspec.yaml 文件中添加 Fluro 依赖

```js
dependencies: fluro: '^2.0.5';
```

保存文件之后会自动下载。

## step2：在 lib 文件夹下新建 pages/login.dart

```js
import 'package:flutter/material.dart';
import 'package:rental_app/widgets/page_content.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(child: PageContent(name: '登陆'));
  }
}
```

## step3:使用 fluro，配置路由

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/45a7b010-9456-4adb-aaba-fae9b0d13085/Untitled.png)

### step3-1:新建 routes.dart 文件

```js
import 'package:fluro/fluro.dart';
import 'package:flutter/material.dart';
import 'package:rental_app/pages/home/index.dart';
import 'package:rental_app/pages/login.dart';

class Routes {
  static String home = '/';
  static String login = '/login';

  static Handler _homeHandler = Handler(
      handlerFunc: (BuildContext? context, Map<String, dynamic> params) {
    return HomePage();
  });

  static Handler _loginHandler = Handler(
      handlerFunc: (BuildContext? context, Map<String, dynamic> params) {
    return LoginPage();
  });

  static void configureRoutes(FluroRouter router) {
    router.define(home, handler: _homeHandler);
    router.define(login, handler: _loginHandler);
  }
}
```

### step3-2:修改 application.dart 文件

```js
import 'package:fluro/fluro.dart';
import 'package:rental_app/pages/login.dart';
import 'package:rental_app/routes.dart';

class Application extends StatelessWidget {
	Widget build(BuildContext context) {

+		FluroRouter router = FluroRouter();
+   Routes.configureRoutes(router);

    return MaterialApp(
-      home: HomePage(),
+			 onGenerateRoute: router.generator,
    );
  }
}
```

### step3-3:修改页面 page_content.dart

```js
class PageContent extends StatelessWidget {
	Widget build(BuildContext context) {
		return Scaffold(
				appBar: AppBar(
          title: Text('当前页面：$name'),
        ),
+       body: ListView(children: <Widget>[
+          TextButton(
+             child: Text(Routes.home),
+             onPressed: () => {Navigator.pushNamed(context, Routes.home)}),
+         TextButton(
+             child: Text(Routes.login),
+             onPressed: () => {Navigator.pushNamed(context, Routes.login)})
        ]));
		)
	}
}
```

### 效果：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/27c32db5-72d1-4610-9520-06a41c26e634/Untitled.png)

## step4: 优化路由配置

需要解决的问题：

- 错误页面如何处理？
- 带参数的页面如何处理？

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ec8f3a33-78fa-42a5-aafa-78e44807225d/Untitled.png)

### step4-1:新建 not_found.dart 文件

```js
import 'package:flutter/material.dart';

class NotFoundPage extends StatelessWidget {
  const NotFoundPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: Text('404')),
        body: Center(child: Text('您访问的页面不存在')));
  }
}
```

### step4-2.新建 room_detail/index.dart 文件

```js
import 'package:flutter/material.dart';
import 'package:rental_app/widgets/page_content.dart';

class RoomDetailPage extends StatelessWidget {
  final String roomId;
  const RoomDetailPage({super.key, required this.roomId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: AppBar(title: Text('roomId: $roomId')));
  }
}
```

### step4-3.更改 routes.dart 文件，加入以下内容

```js
import 'package:rental_app/pages/not_found.dart';
import 'package:rental_app/pages/room_detail/index.dart';

class Routes {
  static String roomDetail = '/room/:roomId';


  static Handler _notFoundHandler = Handler(
      handlerFunc: (BuildContext? context, Map<String, dynamic> params) {
    return NotFoundPage();
  });
  static Handler _roomDetailHandler = Handler(
      handlerFunc: (BuildContext? context, Map<String, dynamic> params) {
    return RoomDetailPage(roomId: params['roomId'][0]);
  });
  static void configureRoutes(FluroRouter router) {
    router.define(roomDetail, handler: _roomDetailHandler);
    router.notFoundHandler = _notFoundHandler;
  }
}
```

### step4-4:修改 page_content.dart 测试

```js
import 'package:flutter/material.dart';
import 'package:rental_app/routes.dart';

class PageContent extends StatelessWidget {
  final String name;

  // 添加name参数
  // const PageContent({Key key, this.name}) : super(key: key);
  const PageContent({super.key, required this.name});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('当前页面：$name'),
        ),
        body: ListView(children: <Widget>[
          TextButton(
              child: Text(Routes.home),
              onPressed: () => {Navigator.pushNamed(context, Routes.home)}),
          TextButton(
              child: Text(Routes.login),
              onPressed: () => {Navigator.pushNamed(context, Routes.login)}),
          TextButton(
              child: Text('不存在的页面'),
              onPressed: () =>
                  {Navigator.pushNamed(context, '/testNotfoundaaaaa')}),
          TextButton(
              child: Text('房屋详情页，id:22'),
              onPressed: () => {Navigator.pushNamed(context, '/room/22')})
        ]));
  }
}
```
