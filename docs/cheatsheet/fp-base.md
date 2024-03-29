## 参考资料

[函数式编程指北](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch1.html)
[阮一峰-函数式编程入门教程](http://www.ruanyifeng.com/blog/2017/02/fp-tutorial.html)
[阮一峰-Pointfree 编程风格指南](http://www.ruanyifeng.com/blog/2017/03/pointfree.html)
[阮一峰-图解 Monad](http://www.ruanyifeng.com/blog/2015/07/monad.html)
[Functors, Applicatives, And Monads In Pictures](https://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html)

## 为什么要学函数式编程

函数式编程是非常古老的一个概念，早于第一台计算机的诞生，可以查看此文章：[函数式编程的历史](https://zhuanlan.zhihu.com/p/24648375?refer=marisa)

那我们为什么还要学函数式编程？

- 函数式编程是随着 React 的流行受到越来越多的关注
- Vue 3 也开始拥抱函数式编程
- 函数式编程可以抛弃 this
- 打包过程中可以更好的利用 tree shaking 过滤无用代码
- 方便测试、方便并行处理
- 有很多库可以帮助我们进行函数式开发：lodash、underscore、ramda

## 什么是函数式编程

函数式编程(Functional Programming, FP)，FP 是编程范式之一，我们常听说的编程范式还有面向过程
编程、面向对象编程。

- 面向对象编程的思维方式：把现实世界中的事物抽象成程序世界中的类和对象，通过封装、继承和
  多态来演示事物事件的联系
- 函数式编程的思维方式：把现实世界的事物和事物之间的**联系**抽象到程序世界（对运算过程进行抽
  象）
  - 程序的本质：根据输入通过某种运算获得相应的输出，程序开发过程中会涉及很多有输入和
    输出的函数
  - x -> f(联系、映射) -> y，y=f(x)
  - **函数式编程中的函数指的不是程序中的函数(方法)**，而是数学中的函数即映射关系，例如：y = sin(x)，x 和 y 的关系
  - **相同的输入始终要得到相同的输出**(纯函数)
  - 函数式编程用来描述数据(函数)之间的映射

```javascript
// 非函数式
let num1 = 2;
let num2 = 3;
let sum = num1 + num2;
console.log(sum);

// 函数式
function add(n1, n2) {
  return n1 + n2;
}
let sum = add(2, 3);
console.log(sum);
```

## 前置知识

- 函数是一等公民
- 高阶函数
- 闭包

### 1.函数是一等公民

[MDN-First-class Function（头等函数）](https://developer.mozilla.org/zh-CN/docs/Glossary/First-class_Function)

对于函数是一等公民，可以从以下三个方面解释：

- 函数可以存储在变量中
- 函数作为参数
- 函数作为返回值

在 JavaScript 中函数就是一个普通的对象(可以通过 new Function()生成)，我们可以把函数存储到变量/数组中，它还可以作为另一个函数的参数和返回值，甚至我们可以在程序运行的时候通过 new Function('alert(1)')来构造一个新的函数。

#### 把函数赋值给变量

```javascript
// 把函数赋值给变量
let fn = function () {
  console.log('Hello First-class Function');
};
fn();

// 再来看一个稍微复杂点的例子:
const BlogController = {
  index(posts) {
    return Views.index(posts);
  },
  show(post) {
    return Views.show(post);
  },
  create(attrs) {
    return Db.create(attrs);
  },
  update(post, attrs) {
    return Db.update(post, attrs);
  },
  destroy(post) {
    return Db.destroy(post);
  },
};
// BlogController中的index方法与Views.index有相同的形式（参数、返回值一样），如果遇到一个函数包裹了另一个函数，且形式相同，就可以认为是一样的函数。因此可以进行优化。
// 优化
const BlogController = {
  index: Views.index,
  show: Views.show,
  create: Db.create,
  update: Db.update,
  destroy: Db.destroy,
};
```

函数是一等公民是学习高阶函数、柯里化等的基础。

### 2.高阶函数

什么是高阶函数？

- 可以把函数作为参数传递给另一个函数
- 可以把函数作为另一个函数的返回结果

#### 函数作为参数

```javascript
// forEach
function forEach(array, fn) {
  for (let i = 0; i < array.length; i++) {
    fn(array[i]);
  }
}
// filter
function filter(array, fn) {
  let results = [];
  for (let i = 0; i < array.length; i++) {
    if (fn(array[i])) {
      results.push(array[i]);
    }
  }
  return results;
}
```

#### 函数作为返回值

```javascript
function makeFn() {
  let msg = 'Hello function';
  return function () {
    console.log(msg);
  };
}
const fn = makeFn();
fn();

// once：支付时的应用场景，控制支付这个功能只会执行一次
function once(fn) {
  let done = false;
  return function () {
    if (!done) {
      done = true;
      return fn.apply(this, arguments);
    }
  };
}
let pay = once(function (money) {
  console.log(`支付：${money} RMB`);
});

// 只会支付一次
pay(5);
pay(5);
pay(5);
```

#### 使用高阶函数的意义

- 抽象可以帮我们屏蔽细节，只需要关注与我们的目标
- 高阶函数是用来抽象通用的问题，利于复用

```javascript
// 面向过程的方式
let array = [1, 2, 3, 4];
for (let i = 0; i < array.length; i++) {
  console.log(array[i]);
}
// 高阶高阶函数
let array = [1, 2, 3, 4];
forEach(array, (item) => {
  console.log(item);
});
let r = filter(array, (item) => {
  return item % 2 === 0;
});
```

#### 常用高阶函数

- forEach
- map
- filter
- every
- some
- find/findIndex
- reduce
- sort
- ……

```javascript
const map = (array, fn) => {
  let results = [];
  for (const value of array) {
    results.push(fn(value));
  }
  return results;
};

const every = (array, fn) => {
  let result = true;
  for (const value of array) {
    result = fn(value);
    if (!result) {
      break;
    }
  }

  return result;
};

const some = (array, fn) => {
  let result = false;
  for (const value of array) {
    result = fn(value);
    if (result) {
      break;
    }
  }
  return result;
};
```

### 3.闭包

闭包 (Closure)：函数和其周围的状态(词法环境)的引用捆绑在一起形成闭包。（可以在另一个作用域中调用一个函数的内部函数并访问到该函数的作用域中的成员）

闭包的本质：函数在执行的时候会放到一个执行栈上当函数执行完毕之后会从执行栈上移除，但是堆上的作用域成员因为被外部引用不能释放，因此内部函数依然可以访问外部函数的成员

闭包案例

```javascript
// 生成计算数字的多少次幂的函数
function makePower(power) {
  return function (x) {
    return Math.pow(x, power);
  };
}

let power2 = makePower(2);
let power3 = makePower(3);
console.log(power2(4))
console.log(power3(4))

// 第一个数是基本工资，第二个数是绩效工资
function makeSalary (x) {
  return function (y) {
    return x + y
  }
}
let salaryLevel1 = makeSalary(1500)
let salaryLevel2 = makeSalary(2500))
console.log(salaryLevel1(2000))
console.log(salaryLevel1(3000))
```
