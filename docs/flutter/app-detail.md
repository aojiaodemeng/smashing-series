# 七、房源详情页

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f7d7e7c0-299e-4b06-a11d-4c05e1b27cc5/Untitled.png)

## 分享功能

- 需要安装[share 库](https://pub.flutter-io.cn/packages/share)

## CommonTag 改造：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/db48902f-79bd-4e7b-9060-e6d9952b7dbb/Untitled.png)

改造前代码：

```js
import 'package:flutter/material.dart';

class CommonTag extends StatelessWidget {
  final String title;
  final Color color;
  final Color backgroundColor;

  static const Color defaultBGcolor = Color.fromRGBO(245, 245, 245, 1.0);

  const CommonTag(
      {Key? key,
      required this.title,
      this.color = Colors.black,
      this.backgroundColor = defaultBGcolor})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(right: 4),
      padding: EdgeInsets.only(left: 5, right: 5, top: 2, bottom: 2),
      child: Text(title, style: TextStyle(fontSize: 10, color: color)),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        color: backgroundColor,
      ),
    );
  }
}
```

改造后代码：

```js
import 'package:flutter/material.dart';

class CommonTag extends StatelessWidget {
  final String title;
  final Color color;
  final Color backgroundColor;

  static const Color defaultBGcolor = Color.fromRGBO(245, 245, 245, 1.0);

  const CommonTag.origin(
      {Key? key,
      required this.title,
      this.color = Colors.black,
      this.backgroundColor = Colors.grey})
      : super(key: key);

  factory CommonTag(String title) {
    switch (title) {
      case '近地铁':
        return CommonTag.origin(
          title: title,
          color: Colors.red,
          backgroundColor: Colors.red.shade100,
        );
      case '随时看房':
        return CommonTag.origin(
          title: title,
          color: Colors.green,
          backgroundColor: Colors.green.shade100,
        );
      case '集中供暖':
        return CommonTag.origin(
          title: title,
          color: Colors.teal,
          backgroundColor: Colors.teal.shade100,
        );
      case '新上':
        return CommonTag.origin(
          title: title,
          color: Colors.pink,
          backgroundColor: Colors.pink.shade100,
        );
      default:
        return CommonTag.origin(title: title);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(right: 4),
      padding: EdgeInsets.only(left: 5, right: 5, top: 2, bottom: 2),
      child: Text(title, style: TextStyle(fontSize: 10, color: color)),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        color: backgroundColor,
      ),
    );
  }
}
```

## FilterBar

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/407cc847-9711-411c-b985-11a8ae35bb43/Untitled.png)

## Flutter 状态管理

安装库[scoped_model](https://pub.flutter-io.cn/packages/scoped_model/example)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6d0735ac-3e19-401c-a024-e5f674e43857/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9a43615b-09d3-4b48-932a-6b86365261fc/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fac92a0b-a355-4a16-aa63-a1219626ef54/Untitled.png)
