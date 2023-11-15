# 二、实现一个简单页面

## step1:lib 文件夹下新建 widgets/page_content.dart

```js
import 'package:flutter/material.dart';

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
    );
  }
}
```

## step2:lib 文件夹下新建 pages/home/index.dart

```js
import 'package:flutter/material.dart';
import 'package:rental_app/widgets/page_content.dart';

class HomePage extends StatelessWidget {
  // const HomePage({Key key}) : super(key: key);
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(child: PageContent(name: '首页'));
  }
}
```

## step3:lib 文件夹下新建 application.dart

```js
import 'package:flutter/material.dart';
import 'package:rental_app/pages/home/index.dart';

class Application extends StatelessWidget {
  // const Application({Key key}) : super(key: key);
  const Application({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: HomePage(),
    );
  }
}
```

## step4:更改 main.dart

```js
+ import 'package:rental_app/application.dart';

void main() {
- runApp(const MyApp());
+ runApp(const Application());
}

- class MyApp extends StatelessWidget {}
```
