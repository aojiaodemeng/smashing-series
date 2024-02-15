## 1.JavaScript 有哪些数据类型

一共八种：

- 原始数据类型：Boolean、String、Number、Undefined、Null
- 引用数据类型：Object
- ES6 新增的：
  - Bigint：使用 BigInt 存储和操作超出了安全范围的数据
  - Symbol：代表创建后独一无二且不可变的数据类型，用来解决全局变量冲突的问题

## 2.检测数据类型的方式

- **typeof** （注意数组、对象、null 都会被判断为 object）
- **instanceof** （用来判断<u>引用</u>数据类型，其内部运行机制是判断在其原型链中能否找到该类型的原型。）
- **constructor**（constructor 有两个作用，一是判断数据的类型，二是对象实例通过 constrcutor 对象访问它的构造函数。需要注意，如果创建一个对象来改变它的原型，constructor 就不能用来判断数据类型了）
- **Object.prototype.toString.call()**，使用 Object 对象的原型方法 toString 来判断数据类型。（不能直接用 obj.toString()检测，因为 Array、function 等类型作为 Object 的实例，都重写了 toString 方法）

```js
// 1.typeof
console.log(typeof 2); // number
console.log(typeof true); // boolean
console.log(typeof 'str'); // string
console.log(typeof []); // object
console.log(typeof function () {}); // function
console.log(typeof {}); // object
console.log(typeof undefined); // undefined
console.log(typeof null); // object

// 2.instanceof
console.log(2 instanceof Number); // false
console.log(true instanceof Boolean); // false
console.log('str' instanceof String); // false
console.log([] instanceof Array); // true
console.log(function () {} instanceof Function); // true
console.log({} instanceof Object); // true

// 3.constructor - 作用之判断数据类型
console.log((2).constructor === Number); // true
console.log(true.constructor === Boolean); // true
console.log('str'.constructor === String); // true
console.log([].constructor === Array); // true
console.log(function () {}.constructor === Function); // true
console.log({}.constructor === Object); // true
// 3.constructor - 作用之访问构造函数
function Fn() {}
Fn.prototype = new Array();
var f = new Fn();
console.log(f.constructor === Fn); // false
console.log(f.constructor === Array); // true

// 4.Object.prototype.toString.call()
var a = Object.prototype.toString;
console.log(a.call(2));
console.log(a.call(true));
console.log(a.call('str'));
console.log(a.call([]));
console.log(a.call(function () {}));
console.log(a.call({}));
console.log(a.call(undefined));
console.log(a.call(null));
```

## 3.判断数组的方式

- Array.isArray()
- instanceof
- 通过原型链
- Object.prototype.toString.call()
- Array.prototype.isPrototypeOf

```js
Object.prototype.toString.call(obj).slice(8, -1) === 'Array';
obj.__proto__ === Array.prototype;
Array.isArrray(obj);
obj instanceof Array;
Array.prototype.isPrototypeOf(obj);
```

## 4.实现一个 intanceof

实现原理：判断在其原型链中能否找到该类型的原型（判断构造函数的 prototype 属性是否出现在对象的原型链中）。

```js
function myInstanceof(left, right) {
  // 获取对象的原型
  let proto = Object.getPrototypeOf(left);
  // 获取构造函数的 prototype 对象
  let prototype = right.prototype;

  // 判断构造函数的 prototype 对象是否在对象的原型链上
  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;
    // 如果没有找到，就继续从其原型上找，Object.getPrototypeOf方法用来获取指定对象的原型
    proto = Object.getPrototypeOf(proto);
  }
}
```

## 5.null 与 undefined

- null：空对象
- undefined：未定义

```js
console.log(null == undefined); // 输出true
console.log(null === undefined); // 输出false
```

## 6.为什么 0.1+0.2 ! == 0.3

:::info{title=原因}

- 浮点数精度问题是指在计算机中使用二进制表示浮点数时，由于二进制无法精确表示某些十进制小数，导致计算结果可能存在舍入误差或不精确的情况。
- 二进制只能精准表达 2 除尽的数字 1/2, 1/4, 1/8，例如 0.1(1/10)和 0.2(1/5)，在二进制中都无法精准表示时，需要根据精度舍入。
  :::
  :::info{title=如何判断两边相等}
- ES6 中使用 `Number.EPSILON` 来代表一个误差范围值，如果两者相差(`0.1+0.2-0.3`)小于这个范围值`Number.EPSILON`就判定相等
  :::

## 7.object.assign 和扩展运算法是深拷贝还是浅拷贝

都是浅拷贝（两者对于第一层是深拷贝，对于更深层都是浅拷贝），区别：

- Object.assign()方法接收的第一个参数作为目标对象，后面的所有参数作为源对象。然后把所有的源对象合并到目标对象中。它会修改了一个对象，因此会触发 ES6 setter。
- 扩展操作符（…）使用它时，数组或对象中的每一个值都会被拷贝到一个新的数组或对象中。它不复制继承的属性或类的属性，但是它会复制 ES6 的 symbols 属性。

```js
// 扩展运算符
let outObj = {
  inObj: { a: 1, b: 2 },
  c: 4,
};
let newObj = { ...outObj };
newObj.inObj.a = 2;
newObj.c = 4;
console.log(outObj); // {inObj: {a: 2, b: 2},c:3}

// Object.assign()
let outObj = {
  inObj: { a: 1, b: 2 },
  c: 4,
};
let newObj = Object.assign({}, outObj);
newObj.inObj.a = 2;
newObj.c = 4;
console.log(outObj); // {inObj: {a: 2, b: 2},c:3}
```

## 8.forEach 与 map 的区别

这方法都是用来遍历数组的，两者区别如下：

- forEach()方法会针对每一个元素执行提供的函数，对数据的操作会改变原数组，该方法没有返回值；
- map()方法不会改变原数组的值，返回一个新数组，新数组中的值为原数组调用函数处理之后的值；
