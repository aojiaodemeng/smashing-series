# 十、城市选择器

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4421d696-37c6-4c9e-b286-536197d3b4fe/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8a041966-2978-4f54-8201-83f146131032/Untitled.png)

[city_pickers | Flutter Package](https://pub.dev/packages/city_pickers)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c848e398-4219-43c2-86b1-819c737bc6ab/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fb1b01fe-46a8-48a2-9097-c192bdb57498/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/824a42d0-8ca0-4220-92a6-bc828bcac0e1/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f0e43cd5-5041-43d8-928a-93ea7b9652a0/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a5f6fa66-df5e-4aa5-bfd6-de9e5b4097c7/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/053555e1-d131-42c7-be04-583444c651a9/Untitled.png)

# step1-1:引入第三方库 city_pickers

```js
city_pickers: ^1.3.0
```

## step1-2:设置开通的城市（可切换的城市）

config.dart

```js
+ import 'package:rental_app/pages/home/tab_search/filter_bar/data.dart';

class Config {

+  static List<GeneralType> AvailableCitys = [
    GeneralType('北京', 'AREA|88cff55c-aaa4-e2e0'),
    GeneralType('上海', 'AREA|dbf46d32-7e76-1196'),
    GeneralType('深圳', 'AREA|a6649a11-be98-b150'),
    GeneralType('广州', 'AREA|e4940177-c04c-383d'),
  ];
}
```

## step1-3:本地缓存里增加 city 的 key

store.dart

```js
enum StoreKeys {
	token,
+	city
}
```

## step1-4:增加 city.model

新增 lib/scoped_model/city.dart 文件

```js
import 'package:rental_app/pages/home/tab_search/filter_bar/data.dart';
import 'package:scoped_model/scoped_model.dart';
import 'package:rental_app/config.dart';

class CityModel extends Model {
  GeneralType _city = Config.AvailableCitys.first;

  set city(GeneralType data) {
    _city = data;
    notifyListeners();
  }

  GeneralType get city {
    return _city;
  }
}
```

## step1-5:增加获取城市 id 的方法

lib/utils/scoped_model_helper.dart

```js
+import 'package:rental_app/config.dart';
+import 'package:rental_app/scoped_model/city.dart';

class ScopedModelHelper {
+  static String getAreaId(context) {
    return ScopedModelHelper.getModel<CityModel>(context).city?.id ??
        Config.AvailableCitys.first.id;
  }
}
```

## step1-6:application 引入 CityModel

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5cd589de-7220-42ce-b58b-333178c5cf8b/Untitled.png)

## step2-1:实现城市选择功能

lib/widget/search_bar/index.dart

### 引入新的依赖：

```js
import 'dart:convert';
import 'package:city_pickers/city_pickers.dart';
import 'package:rental_app/config.dart';
import 'package:rental_app/pages/home/tab_search/filter_bar/data.dart';
import 'package:rental_app/scoped_model/city.dart';
import 'package:rental_app/utils/common_toast.dart';
import 'package:rental_app/utils/scoped_model_helper.dart';
import 'package:rental_app/utils/store.dart';
import 'package:scoped_model/scoped_model.dart';
import 'package:collection/collection.dart';
```

其中，还需要安装 collection 库，因为用到了 firstWhereOrNull 方法（firstWhere 方法无法返回 null，会出现类型报错）

### 编写方法：\_getCity、\_changeLocation、\_saveCity

```js
_changeLocation() async {
    Result? result = await CityPickers.showCitiesSelector(
        context: context, theme: ThemeData(primaryColor: Colors.green));

    if (null == result) return;
    String? cityName = result.cityName;

    if (cityName == null) return;

    GeneralType? city = Config.AvailableCitys.firstWhereOrNull(
        (city) => cityName.startsWith(city.name));
    print(city);
    if (city == null) {
      CommonToast.showToast('该城市未开通');
      return;
    }

    _saveCity(city);
  }

_saveCity(GeneralType city) async {
    if (city == null) return;
    // 存到了全局存储里
    ScopedModelHelper.getModel<CityModel>(context).city = city;
    // 存到本地缓存里
    var store = await Store.getInstance();
    var cityString = json.encode(city.toString());
    store.setString(StoreKeys.city, cityString);
  }

_getCity() async {
    var store = await Store.getInstance();
    var cityString = await store.getString(StoreKeys.city);
    if (null == cityString) return;
    // var city = GeneralType.fromJson(json.decode(cityString));
    var city = json.decode(cityString);
    ScopedModelHelper.getModel<CityModel>(context).city = city;
  }
```

### 页面使用动态数据：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9273414b-ce7d-46d9-ae3c-14b38cf24287/Untitled.png)

### 完整的 search_bar/index.dart

```js
import 'dart:convert';
import 'package:city_pickers/city_pickers.dart';
import 'package:flutter/material.dart';
import 'package:rental_app/config.dart';
import 'package:rental_app/pages/home/tab_search/filter_bar/data.dart';
import 'package:rental_app/scoped_model/city.dart';
import 'package:rental_app/utils/common_toast.dart';
import 'package:rental_app/utils/scoped_model_helper.dart';
import 'package:rental_app/utils/store.dart';
import 'package:scoped_model/scoped_model.dart';
import 'package:collection/collection.dart';

import '../common_image.dart';

class SearchBarWrapper extends StatefulWidget {
  final bool? showLocation;
  final Function? goBackCallback;
  final String? inputValue;
  final String defaultInputValue;
  final Function? onCancel;
  final bool? showMap;
  final Function? onSearch;
  final ValueChanged<String>? onSearchSubmit;

  const SearchBarWrapper(
      {Key? key,
      this.showLocation,
      this.goBackCallback,
      this.inputValue,
      this.defaultInputValue = '请输入搜索词',
      this.onCancel,
      this.showMap,
      this.onSearch,
      this.onSearchSubmit})
      : super(key: key);

  @override
  _SearchBarState createState() => _SearchBarState();
}

class _SearchBarState extends State<SearchBarWrapper> {
  String _searchWord = '';
  late TextEditingController _controller;
  late FocusNode _focus;
  void _onClean() {
    setState(() {
      _searchWord = '';
      _controller.clear();
    });
  }

  _saveCity(GeneralType city) async {
    if (city == null) return;
    // 存到了全局存储里
    ScopedModelHelper.getModel<CityModel>(context).city = city;
    // 存到本地缓存里
    var store = await Store.getInstance();
    var cityString = json.encode(city.toString());
    store.setString(StoreKeys.city, cityString);
  }

  _changeLocation() async {
    Result? result = await CityPickers.showCitiesSelector(
        context: context, theme: ThemeData(primaryColor: Colors.green));

    if (null == result) return;
    String? cityName = result.cityName;

    if (cityName == null) return;

    GeneralType? city = Config.AvailableCitys.firstWhereOrNull(
        (city) => cityName.startsWith(city.name));
    print(city);
    if (city == null) {
      CommonToast.showToast('该城市未开通');
      return;
    }

    _saveCity(city);
  }

  _getCity() async {
    var store = await Store.getInstance();
    var cityString = await store.getString(StoreKeys.city);
    if (null == cityString) return;
    // var city = GeneralType.fromJson(json.decode(cityString));
    var city = json.decode(cityString);
    ScopedModelHelper.getModel<CityModel>(context).city = city;
  }

  @override
  void initState() {
    // TODO: implement initState
    _controller = TextEditingController(text: widget.inputValue);
    _focus = FocusNode();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var city = ScopedModelHelper.getModel<CityModel>(context).city;
    print(city.name);
    if (city == null) {
      city = Config.AvailableCitys.first;
      _getCity();
    }
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        if (widget.showLocation != null)
          Padding(
            padding: EdgeInsets.only(right: 10),
            child: GestureDetector(
              onTap: () {
                _changeLocation();
              },
              child: Row(
                children: [
                  Icon(
                    Icons.room,
                    color: Colors.green,
                    size: 16,
                  ),
                  Text(
                    city.name,
                    style: TextStyle(color: Colors.black, fontSize: 14),
                  ),
                ],
              ),
            ),
          ),
        if (widget.goBackCallback != null)
          Padding(
            padding: EdgeInsets.only(right: 10),
            child: GestureDetector(
              onTap: widget.goBackCallback as GestureTapCallback,
              child: Icon(
                Icons.chevron_left,
                color: Colors.black,
                size: 16,
              ),
            ),
          ),
        Expanded(
          child: Container(
            height: 34,
            decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(17),
                color: Colors.grey[200]),
            child: TextField(
              focusNode: _focus,
              onChanged: (String value) {
                setState(() {
                  _searchWord = value;
                });
              },
              onTap: () {
                if (widget.onSearchSubmit == null) {
                  _focus.unfocus(); // 使之失去焦点
                }
                widget.onSearch!();
              },
              onSubmitted: widget.onSearchSubmit,
              controller: _controller,
              textInputAction: TextInputAction.search,
              style: TextStyle(fontSize: 14),
              decoration: InputDecoration(
                  contentPadding: EdgeInsets.only(top: 1, left: -10),
                  border: InputBorder.none,
                  icon: Padding(
                    padding: EdgeInsets.only(left: 10, top: 2),
                    child: Icon(
                      Icons.search,
                      size: 18,
                      color: Colors.grey,
                    ),
                  ),
                  suffixIcon: GestureDetector(
                    onTap: () {
                      print('清理');
                      _onClean();
                    },
                    child: Icon(
                      Icons.clear,
                      size: 18,
                      color: _searchWord == '' ? Colors.grey[200] : Colors.grey,
                    ),
                  ),
                  hintText: '请输入搜索词',
                  hintStyle: TextStyle(color: Colors.grey, fontSize: 14)),
            ),
          ),
        ),
        if (widget.onCancel != null)
          Padding(
            padding: const EdgeInsets.only(right: 10.0),
            child: GestureDetector(
              child: Text(
                '取消',
                style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                    fontSize: 14),
              ),
              onTap: widget.onCancel! as GestureTapCallback,
            ),
          ),
        if (widget.showMap != null)
          CommonImage(
            src: 'static/icons/widget_search_bar_map.png',
            width: 40,
            height: 40,
          ),
      ],
    );
  }
}
```
