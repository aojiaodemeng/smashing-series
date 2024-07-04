## 相关面试题

- sort 背后原理是什么
- 神拷贝和浅拷贝
- localstorage、cookie、sessionStroage 区别

## 原型的来源

在面向对象编程中，**继承**是非常实用也非常核心的功能，但 JavaScript 中只有对象没有类(ES6 中添加了类 Class，之前是没有的)，为了解决共享数据的问题，JavaScript 的开发者们提出了原型这一概念，来实现数据和方法的共享。

## 原型与原型链的理解

[继承与原型链｜ MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain):
当谈到继承时，JavaScript 只有一种结构：对象。每个对象（object）都有一个私有属性指向另一个名为原型（prototype）的对象。原型对象也有一个自己的原型，层层向上直到一个对象的原型为 null。根据定义，null 没有原型，并作为这个原型链（prototype chain）中的最后一个环节。

> 《 javascript 高级程序设计 》中这样描述原型：
> 每个函数都会创建一个 prototype 属性，这个属性是一个对象，包含应该由特定引用类型的实例共享的属性和方法。实际上，这个对象就是通过调用构造函数创建的对象的原型。使用原型对象的好处是，在它上面定义的属性和方法都可以被对象实例共享。原来在构造函数中直接赋给对象实例的值，可以直接赋值给它们的原型。

> 网络：
> 在 JavaScript 中是使用构造函数来新建一个对象的，每一个构造函数的内部都有一个 prototype 属性，它的属性值是一个对象，这个对象包含了可以由该构造函数的所有实例共享的属性和方法。当使用构造函数新建一个对象后，在这个对象的内部将包含一个指针，这个指针指向构造函数的 prototype 属性对应的值，在 ES5 中这个指针被称为对象的原型。一般来说不应该能够获取到这个值的，但是现在浏览器中都实现了 proto 属性来访问这个属性，但是最好不要使用这个属性，因为它不是规范中规定的。ES5 中新增了一个 Object.getPrototypeOf() 方法，可以通过这个方法来获取对象的原型。
> 当访问一个对象的属性时，如果这个对象内部不存在这个属性，那么它就会去它的原型对象里找这个属性，这个原型对象又会有自己的原型，于是就这样一直找下去，也就是原型链的概念。原型链的尽头一般来说都是 Object.prototype 所以这就是新建的对象为什么能够使用 toString() 等方法的原因。

## 基本概念

首先先记住几个概念：

- 隐式原型：所有引用类型（函数、数组、对象）都有\_\_proto\_\_属性，例如 arr.\_\_proto\_\_
- 显式原型：所有函数拥有 prototype 属性，例如：func.prototype
- 原型对象：拥有 prototype 属性的对象，在定义函数时被创建

再理解一下 prototype 与\_\_proto\_\_:

js 中所有的函数都有一个 prototype 的属性，该属性引用了一个对象，该对象叫做原型对象
js 中每个对象都有一个\_\_proto\_\_属性，该属性指向它构造函数的 prototype
使用 Object.getPrototypeOf()代替\_\_proto\_\_!!!

## new 关键字

### 箭头函数的 this 指向哪⾥？

箭头函数不同于传统 JavaScript 中的函数，箭头函数并没有属于⾃⼰的 this，它所谓的 this 是**捕获其所在上下⽂的 this 值**，作为⾃⼰的 this 值，并且由于没有属于⾃⼰的 this，所以是不会被 new 调⽤的，这个所谓的 this 也不会被改变。

可以⽤ Babel 理解⼀下箭头函数:

```js
const obj = {
  getArrow() {
    return () => {
      console.log(this === obj);
    };
  },
};
// 转化后（ES5，由 Babel 转译）：
var obj = {
  getArrow: function getArrow() {
    var _this = this;
    return function () {
      console.log(_this === obj);
    };
  },
};
```

### 箭头函数和普通函数

- 箭头函数比普通函数更加简洁
- 箭头函数没有自己的 this，它所谓的 this 是捕获其所在上下⽂的 this 值
- call()、apply()、bind()等方法不能改变箭头函数中 this 的指向
- 箭头函数不能作为构造函数、Generator 函数使用
- 箭头函数没有自己的 arguments、prototype

### new 操作符的实现原理/实现步骤

- 1.创建一个新的对象
- 2.将构造函数的作用域赋给对象（将对象的\_\_proto\_\_属性指向构造函数的 prototype 属性）
- 3.执行构造函数的代码，将构造函数中的 this 指向对象（也是为这个对象添加属性和方法）
- 4.判断函数返回值，如果是值类型，就返回创建的对象，如果是引用类型

## instanceof

用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

### instanceof 的用法

```js
function Person() {}
function Person2() {}
const usr = new Person();
console.log(usr instanceof Person); // true
console.log(usr instanceof Object); // true
console.log(usr instanceof Person2); // false
```

### 实现 instanceof

```js
// myInstanceof函数接收两个参数：实例对象obj和构造函数constructor
function myInstanceof(obj, constructor) {
  let proto = Object.getPrototypeOf(obj); // 拿到实例对象obj的隐式原型，这行代码相当于let implicitPrototype = obj?.__proto__;
  const prototype = constructor.prototype; // 构造函数的原型
  // 遍历原型链
  while (proto) {
    // 找到，返回true
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto); // 相当于 proto = proto.__proto__;
  }
  return false; // 遍历结束还没找到，返回false
}
```

## call、bind、apply 的区别以及本质

### 基本使用

- apply 和 call 基本类似，区别在于传参方式不同，apply 只能接受数组参数，而 call 接受的是连续参数。
- bind 的作用也差不多，但是 bind 不是立即执行的，会创建一个新的函数并返回

```js
function add(a,b){
	return a+b;
}
add.call(undefined,1,2); //3
add.apply(undefined,[1，2]); // 3
let x = add.bind(undefined,1,2)
x();  //3
```

### 实现 call、apply、bind

```js
Function.prototype.myCall = function (targetObj, ...args) {
  let key = Symbol('key'); // symbol优化
  targetObj[key] = this;
  let result = targetObj[key](...args);
  delete targetObj[key];
  return result;
};
Function.prototype.myApply = function (targetObj, args) {
  let key = Symbol('keys'); // symbol优化
  targetObj[key] = this;
  let result = targetObj[key](...args);
  delete targetObj[key];
  return result;
};
Function.prototype.myBind = function (targetObj, ...args) {
  return (...argus) => this.call(targetObj, ...args, ...argus);
};
let obj = { name: '白衣' };
function getYear(age) {
  let nextYear = `${this.name}，明年${age + 1}岁`;
  console.log('函数内的this', this, nextYear);
  return nextYear;
}
getYear.myCall(obj, 3);
getYear.myApply(obj, [3]);
a = getYear.myBind(obj, 3);
a();
```

## JS 继承的方式

在 ES2015 之前，都是使用原型的方式去实现继承，而在 ES2015 中，新增了一个专门用于继承的关键词 extends。

### 1.原型链继承

将父类的实例作为子类的原型。

```js
function Parent() {
  this.isShow = true;
  this.info = {
    name: 'yhd',
    age: 18,
  };
}

Parent.prototype.getInfo = function () {
  console.log(this.info);
  console.log(this.isShow); // true
};

function Child() {}
Child.prototype = new Parent();

let Child1 = new Child();
Child1.info.gender = '男';
Child1.getInfo(); // {name: "yhd", age: 18, gender: "男"}

let child2 = new Child();
child2.getInfo(); // {name: "yhd", age: 18, gender: "男"}
child2.isShow = false;

console.log(child2.isShow); // false
```

### 2.构造函数继承

在子类型的构造函数内部调用父类型构造函数。

```js
function Parent() {
  this.info = {
    name: 'yhd',
    age: 19,
  };
}

function Child() {
  Parent.call(this);
}

let child1 = new Child();
child1.info.gender = '男';
console.log(child1.info); // {name: "yhd", age: 19, gender: "男"};

let child2 = new Child();
console.log(child2.info); // {name: "yhd", age: 19}
```

### 3.组合继承

- 组合继承综合了原型链继承和构造函数继承两者的优点
- 基本的思路就是使用原型链继承原型上的属性和方法，而通过构造函数继承实例属性，这样既可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性

```js
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'yellow'];
}
Parent.prototype.sayName = function () {
  console.log(this.name);
};

function Child(name, age) {
  // 继承父类属性
  Parent.call(this, name);
  this.age = age;
}
// 继承父类方法
Child.prototype = new Parent();

Child.prototype.sayAge = function () {
  console.log(this.age);
};

let child1 = new Child('yhd', 19);
child1.colors.push('pink');
console.log(child1.colors); // ["red", "blue", "yellow", "pink"]
child1.sayAge(); // 19
child1.sayName(); // "yhd"

let child2 = new Child('wxb', 30);
console.log(child2.colors); // ["red", "blue", "yellow"]
child2.sayAge(); // 30
child2.sayName(); // "wxb"
```

### 4.原型式继承

对参数对象的一种浅复制

```js
function objectCopy(obj) {
  function Fun() {}
  Fun.prototype = obj;
  return new Fun();
}

let person = {
  name: 'yhd',
  age: 18,
  friends: ['jack', 'tom', 'rose'],
  sayName: function () {
    console.log(this.name);
  },
};

let person1 = objectCopy(person);
person1.name = 'wxb';
person1.friends.push('lily');
person1.sayName(); // wxb

let person2 = objectCopy(person);
person2.name = 'gsr';
person2.friends.push('kobe');
person2.sayName(); // "gsr"

console.log(person.friends); // ["jack", "tom", "rose", "lily", "kobe"]
```

### 5.寄生式继承

使用原型式继承对一个目标对象进行浅复制，增强这个浅复制的能力

```js
function objectCopy(obj) {
  function Fun() {}
  Fun.prototype = obj;
  return new Fun();
}

function createAnother(original) {
  let clone = objectCopy(original);
  clone.getName = function () {
    console.log(this.name);
  };
  return clone;
}

let person = {
  name: 'yhd',
  friends: ['rose', 'tom', 'jack'],
};

let person1 = createAnother(person);
person1.friends.push('lily');
console.log(person1.friends);
person1.getName(); // yhd

let person2 = createAnother(person);
console.log(person2.friends); // ["rose", "tom", "jack", "lily"]
```

### 6.寄生式组合继承

```js
function objectCopy(obj) {
  function Fun() {}
  Fun.prototype = obj;
  return new Fun();
}

function inheritPrototype(child, parent) {
  let prototype = objectCopy(parent.prototype); // 创建对象
  prototype.constructor = child; // 增强对象
  Child.prototype = prototype; // 赋值对象
}

function Parent(name) {
  this.name = name;
  this.friends = ['rose', 'lily', 'tom'];
}

Parent.prototype.sayName = function () {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

inheritPrototype(Child, Parent);
Child.prototype.sayAge = function () {
  console.log(this.age);
};

let child1 = new Child('yhd', 23);
child1.sayAge(); // 23
child1.sayName(); // yhd
child1.friends.push('jack');
console.log(child1.friends); // ["rose", "lily", "tom", "jack"]

let child2 = new Child('yl', 22);
child2.sayAge(); // 22
child2.sayName(); // yl
console.log(child2.friends); // ["rose", "lily", "tom"]
```

### 7.ES6 中类的继承

```js
class Person {
  constructor(name) {
    this.name = name;
  }
  say() {
    console.log(this.name);
  }
}
class Tom extends Person {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
  hello() {
    super.say();
    console.log(this.age);
  }
}
const a = new Tom('Tom', 24);
a.hello(); // 先后输出 Tom 、 24
```

## this 指向

### 1.全局普通函数（非严格和严格模式）

- 非严格模式下，全局普通函数的 this 指向 window
  ```js
  var a = 0; // 相当于window.a = 0
  function testWindow() {
    this.a = 1; //相当于window.a
    console.log(this.a); //1
    console.log(window.a); // 1
    console.log(this); //Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
  }
  testWindow();
  ```
- 严格模式下，全局普通函数的 this 指向 undefined
  ```js
  var a = 1;
  function testStrict() {
    'use strict';
    console.log(this); //undefined
    console.log(this.a); // Uncaught TypeError: Cannot read property 'a' of undefined
  }
  testStrict();
  ```

### 2.全局箭头函数

箭头函数在全局环境下，无论是严格模式，还是非严格模式，始终指向 window

```js
let testES6 = () => {
  console.log(this); //Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
};

testES6();

let testES6Strict = () => {
  'use strict';
  console.log(this); //Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
};

testES6Strict();
```

### 3.函数作为对象的属性

- 对象的属性是普通函数，不管是严格模式还是非严格模式，函数中的 this 永远指向这个对象

  ```js
  var a = 2;
  var obj = {
    a: 1,
    b: function () {
      console.log(this);
      console.log(this.a);
    },
    d: {
      ddstr: 'hhh',
      dd: function () {
        console.log(this);
      },
    },
  };
  obj.b(); // 先后输出{"a":1,"d":{"ddstr":"hhh"}} 、 1
  obj.d.dd(); // 输出 {"ddstr":"hhh"}

  var foo = obj.b;
  var foo2 = obj.d;
  foo(); // 先后输出 [object Window]、2， 此时相当于指向了window
  foo2.dd(); // 输出{"ddstr":"hhh"}， 指向的是obj.d这个对象
  ```

- 对象的属性是箭头函数，箭头函数里的 this 指向该对象所处的执行上下文

  ```js
  var a = 2;
  var obj = {
    a: 1,
    b: () => {
      console.log(this);
      console.log(this.a);
    },
    d: {
      ddstr: 'hhh',
      dd: () => {
        console.log(this);
      },
    },
  };
  obj.b(); // 先后输出 [object Window] 、 2
  obj.d.dd(); // 输出 [object Window]

  var foo = obj.b;
  var foo2 = obj.d;
  foo(); // 先后输出 [object Window]、2
  foo2.dd(); // 输出 [object Window]
  ```

  注意，其中`[object Window]`代表 window 对象；箭头函数作为对象的属性，无论这个属性是有多深，最终都是指向根对象所处的执行上下文

### 4.构造函数

不管是严格模式还是非严格模式，构造函数中的 this 都是指向构造函数创建的对象实例。

```js
function Test(a) {
  this.a = a;
  console.log('构造函数', this.a);
}
Test.prototype.say = function () {
  console.log(this);
  console.log(this.a);
};
var t = new Test(1);
console.log('最外层的打印', t);
t.say();
```

打印结果：

```json
构造函数 1
最外层的打印 {"a":1}
{"a":1}
1
```

### 5.事件

- React 合成事件：
- 原生事件：如果绑定的是普通函数，this 指向被绑定的目标对象，如果绑定的是箭头函数，this 指向 window（外层执行上下文）

```html
<body>
  <button id="btn">click</button>
  <button id="btn1">click1</button>
  <script>
    /**
     * this指向被绑定的目标对象
     * */
    var btn = document.getElementById('btn');
    btn.onclick = function () {
      console.log(this); // <button id="btn">click</button>
      this.innerHTML = 'loading..';
      this.disabled = true;
    };

    var btn1 = document.getElementById('btn1');
    btn1.onclick = () => {
      console.log(this); //window
    };
  </script>
</body>
```
