# 枚举

Dart 枚举是预定义的命名常量。使用它们时，代码会变得更清晰、更容易理解。在枚举中，有限类型存储在单一类型定义下。这些是使用关键字 enum 声明的。

**使用**

```
enum Status {
	element 1,
	element 2,
	element 3
}

```

> 与数组一样，Dart 枚举索引从 0 开始作为第一个值

## 为什么要使用枚举？

在 Flutter 开发中，枚举是表示有状态小部件状态变化的绝佳选择。您可以使用枚举，而不是单独声明每个状态。例如：

```
const WINTER = 'Winter',
const SPRING = 'Spring',
const SUMMER = 'Summer',
```

通过使用枚举，您可以将这段代码编写为：

```
enum Weather {
	winter,
	spring,
	summer
}
```

> 使用 UpperCamelCase 声明枚举状态，如天气。而 lowerCamelCase 用于枚举列表。

其次，如果您知道变量的固定值，则应该使用枚举。在上面的例子中，天气状态是已知的，使枚举成为最佳选择。

大多数时候，开发人员使用 int 变量来描述状态。例如，0 表示加载，1 表示运行，2 表示错误。您可以改用枚举来编写更紧凑的代码。布尔值也是如此。

以下是 Dart enum 的正确使用方式：

```
enum Weather {
	winter,
	spring,
	summer
}
Void main() {
For (Weather x in Weather.values){
print(x); }
}
```

## 结合 Switch

枚举的最佳用途是在 Switch 块中。代码如下所示：

```
void mainSwitchEnum() {
  var weather = Weather.winter;

  switch (weather) {
    case Weather.winter:
      print("Wow, winter has come!");
      break;
    case Weather.spring:
      print("Wow, Spring has come!");
      break;
    case Weather.summer:
      print("It’s too hot today!");
      break;
     default:
     print("Current weather:${weather}");
  }
}
```

## 可扩展的 Enum

Dart 提供了非常有用的扩展方法。当您结合枚举和扩展方法时，您可以编写更清晰、更健壮的代码。

下面是 Dart 枚举中扩展的实现：

```
extension enumExtension on Weather {
  String get text {
    switch (this) {
      case Weather.winter:
        return 'Wow, winter has come!';
      case Weather.spring:
        return 'Wow, Spring has come!';
      case Weather.summer:
        return "It's too hot today!";
      default:
        return 'Current Weather $this';
    }
  }
}

/// Usage
void showText() {
  var weather = Weather.winter;
  print(weather.text);
}
```

## 枚举类型转换成字符串

Flutter 不能对枚举类型使用默认的 toString() 。所以，这是将枚举转换为字符串的方法：

```
extension stringExtension on Weather {
  String get name {
    return this.toString().split('.').last;
  }
}

/// Usage
void showText() {
  var weather = Weather.winter;
  print(weather.name);
}
```

## 枚举类型转换成 Int 类型

枚举是用于存储常量值的类类型，可以是字符串或数字。相比之下，Int 是 Dart 中预定义的数字类型。因此，您不能直接将枚举自动转换为 Int。

以下是将枚举转换为 Int 的方法：

```
// converting enum to int
void showIndex() {
  var weather = Weather.winter;
  print(weather.index);
}

/// converting int to enum
extension weatherExtension on int {
  Weather get weather {
    return Weather.values[0];
  }
}

void showEnum() {
  var index = 0;
  var weather = index.weather;
  print(weather);
}
```
