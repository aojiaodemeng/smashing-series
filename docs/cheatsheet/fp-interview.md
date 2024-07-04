## 讲下函数式编程

- 函数式编程是一种“编程范式”，一种编写程序的方法论
- 编程范式有三种：命令式编程、声明式编程、函数式编程
  - 命令式：更关注过程。（每一步告诉计算机要做什么），比如 JQuery
  - 声明式：更关注结果。（告诉计算机要做什么，而不需要关注过程），比如 Vue/React
  - 函数式：函数式编程和声明式编程是有所关联的，因为他们思想是一致的：即只关注做什么而不是怎么做。函数式编程是以函数为核心来组织模块的一套编程方法。
- 函数式声明的相关概念
  - 函数是一等公民：函数可以存储在变量中、函数可以作为参数、函数可以作为返回值，因为后两个特质，所以有高阶函数的概念
  - 常用高阶函数：forEach、map、every、filter、reduce...
  - 纯函数：相同输入有相同输出。
  - 副作用：如果函数**依赖于外部**的状态就无法保证输出相同，就会带来副作用。比如：配置文件、获取用户的输入、数据库...
  - 纯函数的作用：可缓存、利于测试、方便并行处理（在多线程环境下并行操作共享的内存数据很可能会出现意外情况，而纯函数不需要访问共享的内存数据，所以在并行环境下可以任意运行纯函数 (Web Worker)）
  - 柯里化：当一个函数有多个参数的时候先传递一部分参数调用它（这部分参数以后永远不变），然后返回一个新的函数接收剩余的参数，返回结果
  - 纯函数和柯里化结合，可以将不同的函数进行重新组合形成新的函数（可以把多元函数转换成一元函数，可以组合使用函数产生强大的功能）

## slice 和 splice

数组的 slice 和 splice 分别是：纯函数和不纯的函数

- slice 返回数组中的指定部分，不会改变原数组
- splice 对数组进行操作返回该数组，会改变原数组

```js
let numbers = [1, 2, 3, 4, 5];
// 纯函数
numbers.slice(0, 3); // => [1, 2, 3]
numbers.slice(0, 3); // => [1, 2, 3]
numbers.slice(0, 3); // => [1, 2, 3]

// 不纯的函数
numbers.splice(0, 3); // => [1, 2, 3]
numbers.splice(0, 3); // => [4, 5]
numbers.splice(0, 3); // => []
```

## 实现一个 sum 函数

:::info{title=实现一个累加器函数}

- 请实现一个 sum 函数，要求满足如下用法：
- sum(1, 2)(3)(4)(2, 3).valueOf(); // => 15
  :::

### 1.先来实现一个简单 Currying

```js
function add(x, y) {
  return x + y;
}
add(2, 3);
// Currying后
function curringAdd(x) {
  return function (y) {
    return x + y;
  };
}
curringAdd(2)(3);
```

### 2.思路分析

- 获取不定参数
- 利用闭包创建一个数组保存参数
- 返回一个方法，用于接收下一个括号里的参数
- valueOf 方法，返回值为所有参数的和

### 3.解答

```js
function sum() {
  const args = Array.prototype.slice.call(arguments);
  const add = function () {
    args.push(...arguments);
    return add;
  };
  add.valueOf = () => args.reduce((a, b) => a + b);
  return add;
}
```

使用[ES6 的不定参数 rest](https://es6.ruanyifeng.com/#docs/function)的新特性，该特性可以让不定参数变成一个数组传入，不需要访问 arguments，也省去了使用 Array.prototype.slice.call(arguments);生成数组，更加优雅。

```js
function sum(...rest) {
  const args = rest;
  const add = function (...innerRest) {
    args.push(...innerRest);
    return add;
  };
  add.valueOf = () => args.reduce((a, b) => a + b);
  return add;
}
```
