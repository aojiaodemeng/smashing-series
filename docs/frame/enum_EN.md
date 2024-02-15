# What is a Dart Enum?

Dart enum are predefined named constants. Code becomes cleaner and easier to understand when they are used. In enumeration, finite types are stored under a single-type definition. These are declared by using a keyword enum.

**Usage of Dart Enum Constructor**

```
enum Status {
	element 1,
	element 2,
	element 3
}

```

> As with arrays, the Dart enum index starts at 0 for the first value.

## Why Use Enums in Flutter?

Enums are great alternatives for representing a change of states in Stateful widgets in Flutter development. Instead of declaring each state separately, you can use an enum. For instance:

```
const WINTER = 'Winter',
const SPRING = 'Spring',
const SUMMER = 'Summer',
```

By using an enum, you can write this piece of code as:

```
enum Weather {
	winter,
	spring,
	summer
}
```

> Use UpperCamelCase for declaring an enum state like the weather. While lowerCamelCase for the enumeration list.

Secondly, if you know the fixed values for a variable, you should use an enum. In the above example, the weather states are already known, making an enum the best option.

Most times, developers use int variables for describing states. For instance, 0 for loading, 1 for running, and 2 for error. You can instead use an enum to write more compact code. The same can be said for booleans.

Here is how Dart enum proper use looks like:

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

## Enum in Switch Block

The best use of an enum is in the Switch block. However, to run the code correctly, you must use case blocks. Here is what the code looks like:

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

## Dart Enum with Extensions

Dart provides extension methods that can be very useful. When you combine enums and extension methods, you can write cleaner and more robust code.

Here is the implementation of extensions in Dart enums:

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

## Dart Enum To String

Flutter can’t use the default toString() for enum types. So, here is how you convert an enum to a String:

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

## Dart Enum To Int

Enums are class types for storing constant values, which can be either strings or numbers. In comparison, an Int is a numeric type predefined in Dart. Therefore, you can’t automatically convert an enum to an Int directly.

Here is how you can easily convert an enum to Int:

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
