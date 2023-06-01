# 类

在 Dart 中编写的几乎所有代码都将包含在类中，类描述了开发者创建的对象，对象本身就是保存一些数据和逻辑的东西。例如，一个 Cat 类可以如下表示：

```
class Cat {
    String name;
    String color;
}
```

其中，name 和 color 是类的属性，属性可以引用类中的函数、getter 和 setter。

## 类的实例

类可以通过`new`关键字来创建：

```
Cat nora = new Cat(); // 注意：new关键字在Dart 2中为可选项
nora.name = 'Nora';
nora.color = 'Orange';
```

在大部分面向对象的语言中，用于创建类的新实例的 `new` 关键字随处可见，而在 Dart 中，这个 `new` 关键字以相同的方式工作，但它不是必需的。在 Dart 2 中，并不需要使用 `new` 或 `const` 来创建对象，编译器会自动进行推断。

```
class Cat {
    String name;
    String color;
}

void main() {
    var nora = Cat();
    nora.name = 'Nora';
    nora.color = 'Orange';

    print(nora);
    print(nora.name);
    print(nora.color);
}
```

## 构造函数

构造函数用于创建具有预先确定的属性值的对象。
构造函数分为三种类型：

- 标准构造函数
- 命名构造函数
- 工厂构造函数

```
class Cat {
    String name;
    String color;

    // a simple constructor
    Cat(this.name, this.color);

    // named constructors are used to define additional constructors
    // they return a new instance of the class, (but not with a 'return' statement)
    // usually with some values given defined values.
    Cat.orange(this.name) {
        color = 'Orange';
    }

    // this is another named constructor example
    Cat.black(this.name) {
        color = 'Black';
    }

    @override
    String toString() => "Cat: ${this.name}, ${this.color}";
}

void main() {
    print(Cat('nora', 'orange'));
    print(Cat.orange('nora'));
    print(Cat.black('nora'));
    print(Cat.fromJson({'name': 'Nora', 'color':'Orange'}));
}

```

## 属性和方法

对象的接口通过实例属性和实例方法暴露出去。这些属于类中最基本的成员。

### 属性

属性是在类上定义的任何类型的变量。

```
class Cat {
  String name; // property
  String color; // property
  int age; // property
}

// useage:
var cat = Cat();
cat.name = 'Wallace';
print(cat.name);
```

### 方法

方法是为对象提供行为的类的函数。对象的实例方法通过类的实例公开。他们可以访问实例上的其他变量和方法，以及关键字 this。

```
class Cat {
  String name; // property
  String color; // property
  int age; // property

  void talk() {
   print('meow!');
  }
}

// useage:
var cat = Cat();
cat.talk();
```

## 方法：静态、私有等

在类上可以定义多种类型的方法。首先，让我们看一下每个的基本示例：

```
class Microwave {
  // 基本方法
  void startCooking (){}

  // 私有方法
  // 除了类本身可以调用，外界不能调用；不会通过类的实例暴露出去
  void _startTimer() {}

    // 静态方法：不能访问this
  static bool compareWatts(Microwave a, Microwave b) {
    if (a.power > b.power) return -1;
    if (b.power > a.power) return 1;

    return 0;
  }
}
```

```
class Microwave {
  final int power;

  Microwave(this.power);

  void startCooking() {
    _startTimer();
    print('starting cooking!')
  }

  void _startTimer() {
    print('starting timer!');
  }

  static int compareWatts(Microwave a, Microwave b) {
    if (a.power > b.power) return -1;
    if (b.power > a.power) return 1;

    // else they're the same
    return 0;
  }
}
void main() {
  var averageMicrowave = Microwave(1100);
  var miniMicrowave = Microwave(800);
  var superMicrowave = Microwave(1500);

  // 通过实例调用类的基本方法
  averageMicrowave.startCooking();

  // 调用静态方法：通过类调用而不是通过实例调用
  print(Microwave.compareWatts(averageMicrowave, superMicrowave));
}
```

## Getters 和 Setters

getter 和 setter 是提供对对象属性的显式读写访问的特殊方法。

### Getters

Getter 通常对设置计算属性很有用。换句话说，实例变量依赖于其他非常量变量。

```
class Rectangle {
  final int width, height;

  Rectangle(this.width, this.height);

  // 这个计算属性就像是一个会返回值的函数
  int get area => width * height;
}
```

### Setters

setter 不提供对变量的读取访问权限，用于设置变量的值。当想要执行一些代码以响应为变量赋值时，或者当需要在设置时计算属性值时，setter 就很有用。

```dart
class Rectangle {
  final int width, height;

  Rectangle(this.width, this.height);

  int get area => width * height;

   // Use a private variable to
   // expose the value with a getter;
   Point _center;
   Point get center => _center;
   set center(Point origin) {
     _center = Point(
       origin.x + width / 2,
       origin.y + height / 2,
     );
   }
}

void main() {
  var rectangle = Rectangle(12,6);
  print(rectangle.area);
  // The setter will calculate the center based on what we tell it is the
  // _origin_ (top left corner) of the rectangle on a plot.
  // in this case, we're setting the origin at (4,4).
  rectangle.center = Point(4,4);
  print(rectangle.center);
}
```

## Extends

使用关键字`extends`继承或扩展类。这样可以在相似但不完全相同的类之间共享属性和方法。此外，它允许不同的子类型共享一个公共的运行时类型，这样静态分析就不会失败。

以下是使用不同类型动物的例子：

```
class Animal {
  Animal(this.name, this.age);

  int age;
  String name;

  void talk() {
    print('grrrr');
  }
}

class Cat extends Animal {
  Cat(String name, int age) : super(name, age);

  void talk() {
    print('meow');
  }
}

class Dog extends Animal {
  Dog(String name, int age) : super(name, age);

  void talk() {
    print('bark');
  }
}

void main() {
  var cat = Cat("Phoebe",1);
  var dog = Dog("Cowboy", 2);

  dog.talk();
  cat.talk();
}
```

在这里，Dog 和 Cat 类共享 Animal 的公共属性，从而减少了在每个类中重复代码的需要。
但是，他们的叫声不一样，也就是 talk 方法执行的逻辑不一样，因此，谈话在不同的类上分别定义，并在每只动物上正确实施。

### Extends 扩展

以上面的代码为例，如果需要将上述的`talk`方法更改，比如声音上制造噪音，那么我们就需要在每一个类上去更改`talk`方法，这样显然不是很好方便。

我们可以通过将 Cat 实例传递给 Animal 实例，进行方法改造：

```
recordAnimalNoise(Animal animal) {
  _recordNoise(animal.talk());
}

main() {
  recordAnimalNoise(Cat('Wallace', 1)); // OK!
  recordAnimalNoise(Dog('Lizard', 3)); // OK!
}
```

当然，这个问题可以使用 Dart 类的其他特性来解决，后续会讲到。

## final 属性

将字段标记为`final`，告诉 Dart 这个变量永远不能被重新赋值。但这并不意味着变量必须同时声明和赋值。

通常，会为类属性使用关键字 final，并在构造函数中才进行赋值。

```
class Rectangle {
  // these are assigned in the constructor,
  // and can never be changed.
  final int width;
  final int height;

  Rectangle(this.width, this.height);
}
```
