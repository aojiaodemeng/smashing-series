# 九、登陆页联调

# A、先来完成注册页面的简单联调

修改`pages/register.dart`页面：

```js
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:rental_app/utils/common_toast.dart';
import 'package:rental_app/widgets/page_content.dart';

import '../services/login.dart';
import '../utils/string_is_null_or_empty.dart';
import 'package:dio/dio.dart';

class _RegisterPageState extends State<RegisterPage> {
+	 var passwordController = TextEditingController();
+  var repeatPasswordController = TextEditingController();

+  _registerHandler() async {
    var username = usernameController.text;
    var password = passwordController.text;
    var repeatPassword = repeatPasswordController.text;
    if (password != repeatPassword) {
      CommonToast.showToast('两次输入密码不一致');
      return;
    }
    if (stringIsNullOrEmpty(username) || stringIsNullOrEmpty(password)) {
      CommonToast.showToast('用户名或密码不能为空');
      return;
    }

    const url = '/user/registered';
    var params = {'username': username, 'password': password, "role": 1};
    LoginService.register(params).then((res) {
      int status = res["status"];
      String message = res["message"] ?? "内部错误";
      CommonToast.showToast(message);
      if (status.toString().startsWith('2')) {
        Navigator.of(context).pushReplacementNamed('login');
      }
    });
  }

	...

	TextField(
              obscureText: true,
+              controller: passwordController,
              decoration: InputDecoration(
                labelText: '密码',
                hintText: '请输入密码',
              )),
	...
}
```

此时，可以调试成功，实现基本的注册功能。

# B、问题与分析、封装 Store

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9b72495b-3698-4151-932a-2a9b08f66b10/Untitled.png)

[shared_preferences | Flutter Package](https://pub.dev/packages/shared_preferences)

[scoped_model | Flutter Package](https://pub-web.flutter-io.cn/packages/scoped_model/install)

shared_preferences 能够实现本地缓存，但是我们也需要将其进行封装：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c84100e0-00bf-41b2-84d4-40eb836f156f/Untitled.png)

## step1:新建文件 utils/store.dart

```js
import 'package:shared_preferences/shared_preferences.dart';

enum StoreKeys {
  token,
}

class Store {
  static late StoreKeys storeKeys;
  final SharedPreferences _store;
  static Future<Store> getInstance() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return Store._internal(prefs);
  }

  Store._internal(this._store);

  getString(StoreKeys key) async {
    return _store.get(key.toString());
  }

  setString(StoreKeys key, String value) async {
    return _store.setString(key.toString(), value);
  }

  getStringList(StoreKeys key) async {
    return _store.getStringList(key.toString());
  }

  setStringList(StoreKeys key, List<String> value) async {
    return _store.setStringList(key.toString(), value);
  }
}
```

# C、实现 AuthModel

我们需要共享存储 App 的登陆状态，需要实现一个 AuthModel。

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/69f0aafb-0f66-4cfe-8d2f-43be92014194/Untitled.png)

## step1：新建 scoped_model/auth.dart

```js
import 'package:flutter/material.dart';
import 'package:rental_app/utils/store.dart';
import 'package:rental_app/utils/string_is_null_or_empty.dart';
import 'package:scoped_model/scoped_model.dart';

class AuthModel extends Model {
  String _token = '';
  String get token => _token;

  bool get isList => _token is String && _token != '';

  void initApp(BuildContext context) async {
    Store store = await Store.getInstance();
    String token = store.getString(StoreKeys.token);
    if (stringIsNullOrEmpty(token)) {
      login(token, context);
    }
  }

  void login(String token, BuildContext context) {
    _token = token;
    notifyListeners();
  }

  void logout() {
    _token = '';
    notifyListeners();
  }
}
```

## step2:在 application 里使用 AuthModel

```js
import 'package:fluro/fluro.dart';
import 'package:flutter/material.dart';
import 'package:rental_app/routes.dart';
import 'package:rental_app/scoped_modal/auth.dart';
import 'package:rental_app/scoped_modal/room_filter.dart';
import 'package:scoped_model/scoped_model.dart';

class Application extends StatelessWidget {
  const Application({super.key});
  @override
  Widget build(BuildContext context) {
    FluroRouter router = FluroRouter();
    Routes.configureRoutes(router);

    return ScopedModel<AuthModel>(
        model: AuthModel(),
        child: ScopedModel<FilterBarModel>(
            model: FilterBarModel(),
            child: MaterialApp(
              theme: ThemeData(primarySwatch: Colors.green),
              onGenerateRoute: router.generator,
            )));
  }
}
```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/85a10a75-00b0-4c04-8b3d-32b6489b4e51/Untitled.png)

# D、登陆页联调

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7107486d-0e6c-4646-bf7f-e67d0905b743/Untitled.png)

login.dart

```js
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:rental_app/scoped_modal/auth.dart';
import 'package:rental_app/utils/scoped_model_helper.dart';
import 'package:rental_app/widgets/page_content.dart';
import 'package:scoped_model/scoped_model.dart';
import '../services/login.dart';
import '../utils/store.dart';
import '../utils/string_is_null_or_empty.dart';
import 'package:rental_app/utils/common_toast.dart';
import 'package:dio/dio.dart';

class LoginPage extends StatefulWidget {
  // const HomePage({Key key}) : super(key: key);
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool showPassword = false;
  var usernameController = TextEditingController();
  var passwordController = TextEditingController();

  _loginHandler() async {
    var username = usernameController.text;
    var password = passwordController.text;

    if (stringIsNullOrEmpty(username) || stringIsNullOrEmpty(password)) {
      CommonToast.showToast('用户名或密码不能为空');
      return;
    }

    var params = {'username': username, 'password': password};

    LoginService.login(params).then((res) async {
      int status = res["status"];
      print(res);
      String message = res["message"] ?? "内部错误";
      print(status);
      print(message);
      CommonToast.showToast(message);
      if (status.toString().startsWith('2')) {
        String token = res['token'];
        Store store = await Store.getInstance();
        await store.setString(StoreKeys.token, token);

        ScopedModelHelper.getModel<AuthModel>(context).login(token, context);
        Timer(Duration(seconds: 1), () {
          Navigator.of(context).pop();
        });
      }
    });

  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('登陆')),
      body: SafeArea(
        minimum: EdgeInsets.all(30),
        child: ListView(children: <Widget>[
          TextField(
              controller: usernameController,
              decoration:
                  InputDecoration(labelText: '用户名', hintText: '请输入用户名')),
          Padding(padding: EdgeInsets.all(10)),
          TextField(
              obscureText: !showPassword,
              controller: passwordController,
              decoration: InputDecoration(
                  labelText: '密码',
                  hintText: '请输入密码',
                  suffixIcon: IconButton(
                    icon: Icon(
                        showPassword ? Icons.visibility_off : Icons.visibility),
                    onPressed: () => {
                      setState(() {
                        showPassword = !showPassword;
                      })
                    },
                  ))),
          Padding(padding: EdgeInsets.all(10)),
          SizedBox(
              child: ElevatedButton(
                  onPressed: () {
                    _loginHandler();
                  },
                  child: Text('登陆'))),
          Padding(padding: EdgeInsets.all(10)),
          Row(mainAxisAlignment: MainAxisAlignment.center, children: <Widget>[
            Text('还没有账号，'),
            TextButton(
                child: Text('去注册'),
                onPressed: () =>
                    {Navigator.pushReplacementNamed(context, 'register')})
          ])
        ]),
      ),
    );
  }
}
```

# E、使用 AuthModel，退出登陆

看 git 提交

# F、完善个人信息

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a3fb9e4d-6bd2-494c-9a83-00aa1593331c/Untitled.png)

## step1:新建 lib/models/user_info.dart

```js
class UserInfo {
  final String avatar;
  final String gender;
  final String nickname;
  final String phone;
  final int id;

  UserInfo(this.avatar, this.gender, this.nickname, this.phone, this.id);

  factory UserInfo.fromJson(Map<String, dynamic> json) => UserInfo(
        json["avatar"] as String,
        json["gender"] as String,
        json["nickname"] as String,
        json["phone"] as String,
        json["id"] as int,
      );
}
```

## step2:在 lib/scoped_model/auth.dart 增加\_getUserInfo 方法

```js
import 'package:flutter/material.dart';
import 'package:rental_app/models/user_info.dart';
import 'package:rental_app/services/login.dart';
import 'package:rental_app/utils/store.dart';
import 'package:rental_app/utils/string_is_null_or_empty.dart';
import 'package:scoped_model/scoped_model.dart';

class AuthModel extends Model {
  String _token = '';
  late UserInfo _userInfo;

  String get token => _token;
  UserInfo get userInfo => _userInfo;

  bool get isLogin => _token is String && _token != '';

  void initApp(BuildContext context) async {
    Store store = await Store.getInstance();
    String token = store.getString(StoreKeys.token);
    if (stringIsNullOrEmpty(token)) {
      login(token, context);
    }
  }

  _getUserInfo(BuildContext context) async {
    // TODO:
    // var res = await LoginService.getArticles();
    // var userInfo = UserInfo.fromJson(res);
    var userInfo = UserInfo.fromJson({
      'nickname': 'hh',
      'gender': 'male',
      'avatar':
          "https://tva1.sinaimg.cn/large/006y8mN6ly1g6tbnovh8jj30hr0hrq3l.jpg",
      'id': 1,
      'phone': '198',
    });
    _userInfo = userInfo;
    notifyListeners();
  }

  void login(String token, BuildContext context) {
    _token = token;
    notifyListeners();
    _getUserInfo(context);
  }

  void logout() {
    _token = '';
    // _userInfo = null;
    notifyListeners();
  }
}
```

## step3:修改 header.dart 方法

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9ff632d4-d8fc-49cd-88eb-4d71af075861/Untitled.png)

```js
import 'package:flutter/material.dart';
import 'package:rental_app/config.dart';
import 'package:rental_app/scoped_modal/auth.dart';
import 'package:rental_app/utils/scoped_model_helper.dart';

var longinRegisterStyle = TextStyle(fontSize: 20, color: Colors.white);

class Header extends StatelessWidget {
  @override
  Widget _loginBuilder(BuildContext context) {
    var userInfo = ScopedModelHelper.getModel<AuthModel>(context).userInfo;

    String userName = userInfo?.nickname ?? '傲娇的萌';
    String userImage = userInfo?.avatar ??
        'https://tva1.sinaimg.cn/large/006y8mN6ly1g6tbnovh8jj30hr0hrq3l.jpg';

    // 头像是相对地址，所以需要做些处理
    if (!userImage.startsWith('http')) {
      userImage = Config.LocalUrl + userImage;
    }

    return Container(
      padding: EdgeInsets.only(left: 20, top: 10, bottom: 20),
      decoration: BoxDecoration(color: Colors.green),
      height: 95,
      child: Row(
        children: [
          Container(
            height: 65,
            width: 65,
            margin: EdgeInsets.only(right: 15),
            child: CircleAvatar(
                backgroundImage: NetworkImage(
                    'https://tva1.sinaimg.cn/large/006y8mN6ly1g6tbnovh8jj30hr0hrq3l.jpg')),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                userName,
                style: longinRegisterStyle,
              ),
              Text(
                '查看个人资料',
                style: TextStyle(color: Colors.white),
              )
            ],
          )
        ],
      ),
    );
  }

  @override
  Widget _notLoginBuilder(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(left: 20, top: 10, bottom: 20),
      decoration: BoxDecoration(color: Colors.green),
      height: 95,
      child: Row(
        children: [
          Container(
            height: 65,
            width: 65,
            margin: EdgeInsets.only(right: 15),
            child: CircleAvatar(
                backgroundImage: NetworkImage(
                    'https://tva1.sinaimg.cn/large/006y8mN6ly1g6tbgbqv2nj30i20i2wen.jpg')),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Padding(padding: EdgeInsets.only(top: 6)),
                  GestureDetector(
                    child: Text('登录', style: longinRegisterStyle),
                    onTap: () {
                      Navigator.of(context).pushNamed('login');
                    },
                  ),
                  Text(
                    '/',
                    style: longinRegisterStyle,
                  ),
                  GestureDetector(
                    child: Text('注册', style: longinRegisterStyle),
                    onTap: () {
                      Navigator.of(context).pushNamed('register');
                    },
                  ),
                ],
              ),
              Text(
                '登录后可以体验更多',
                style: TextStyle(color: Colors.white),
              )
            ],
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    var isLogin = ScopedModelHelper.getModel<AuthModel>(context).isLogin;
    return isLogin ? _loginBuilder(context) : _notLoginBuilder(context);
  }
}
```

# G、model 生成半自动化

问题：已经定义了 UserInfo 里的字段，但是在红框部分又要写一遍。

[](https://github.com/google/json_serializable.dart/tree/master/example)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/88e7888c-bfc1-4e41-9850-62e7833acae5/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d74db701-b9ff-4283-8aab-db9e1d55f028/Untitled.png)

修改 lib/models/user_info.dart

```js
import 'package:json_annotation/json_annotation.dart';
part 'user_info.g.dart';

@JsonSerializable()
class UserInfo {
  final String avatar;
  final String gender;
  final String nickname;
  final String phone;
  final int id;

  UserInfo(this.avatar, this.gender, this.nickname, this.phone, this.id);

  // 不使用json_annotation
  // factory UserInfo.fromJson(Map<String, dynamic> json) => UserInfo(
  //       json["avatar"] as String,
  //       json["gender"] as String,
  //       json["nickname"] as String,
  //       json["phone"] as String,
  //       json["id"] as int,
  //     );

  // 使用json_annotation
  factory UserInfo.fromJson(Map<String, dynamic> json) =>
      _$UserInfoFromJson(json);

  Map<String, dynamic> toJson() => _$UserInfoToJson(this);
}
```

然后终端执行：

```js
dart run build_runner build
```

就会自动生成 user_info.g.dart 文件：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dcf31ece-8e8b-4352-97b6-d1fa9f433cba/Untitled.png)

### 延伸：如果后端返回的字段，不是我们前端定义的，比如前端是 phone，后端返回的对应字段确实 telephone，怎么办？

### 1.加入一行代码：

```js
@JsonKey(name: 'telephone')
```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1d238ea7-fd95-4e64-8090-0b1a8886bbf4/Untitled.png)

然后重新执行：

```js
dart run build_runner build
```

重新生成 user_info.g.dart 文件。

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/160fc2bd-4966-4e2c-b51c-44f095418395/Untitled.png)

# H、优化现有 model

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a03382be-d697-440a-a1a9-f65286b2ede2/Untitled.png)

首先以 GeneralType 为例，前端定义的 GeneralType 数据类型是这样的：

```js
class GeneralType {
  final String name;
  final String id;

  GeneralType(this.name, this.id);
}
```

但是后端返回的数据类型 key 分别是 lable、value，这时我们就可以跟 user_info 一样。

## step1:新建 lib/models/general_type.dart

```js
import 'package:json_annotation/json_annotation.dart';
part 'general_type.g.dart';

@JsonSerializable()
class GeneralType {
  @JsonKey(name: 'label')
  final String name;
  @JsonKey(name: 'value')
  final String id;

  GeneralType(this.name, this.id);

  factory GeneralType.fromJson(Map<String, dynamic> json) =>
      _$GeneralTypeFromJson(json);

  Map<String, dynamic> toJson() => _$GeneralTypeToJson(this);
}
```

然后执行：

```js
dart run build_runner build
```

然后将之前的 GeneralType 注释或删除，在引入 GeneralType 的地方，更改引入 models 里的 GeneralType：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0962b2c7-1b9a-4e09-a1f7-bb7238d2103d/Untitled.png)

同理，还有 RoomListItemData、RoomDetailData。这里省略。
