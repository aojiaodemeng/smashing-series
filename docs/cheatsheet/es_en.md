## Proxy

Proxy 对象对另一个对象创建代理，对该对象的基本操作行为可以进行拦截并对其重新定义。

```javascript
const person = {
  name: 'zce',
  age: 20,
};

const personProxy = new Proxy(person, {
  get(target, property) {
    console.log(target, property);
    return property in target ? target[property] : undefined;
  },
  set(target, property, value) {
    if (property === 'age') {
      throw new TypeError(`${value} is not an int`);
    }
    console.log(target, property, value);
    return true;
  },
});

console.log(personProxy.name);
console.log(personProxy.xxx);
personProxy.age = '100';
```

### Proxy vs Object.defineProperty

众所周知，`Proxy`和`Object.defineProperty`都可以监听对象的读写，但为什么 Vue3 放弃使用了 Vue2 种的选择使用了`Object.defineProperty`而选择了`Proxy` 呢？

阅读了这篇文章[Understanding the New Reactivity System in Vue 3](https://www.sitepoint.com/vue-3-reactivity-system/)，可以很确定：因为`Object.defineProperty`的诸多局限性，有些操作是无法监听到的，比如：

- 对对象增加新属性，或删除某属性，比如`obj.newKey=value` 或`delete obj.curValue`
- 无法监听数组的任何行为，比如通过 index 更改数组中的某个值：arr[index] = newValue，或者更改数组的长度：`arr.length = newLength`

为了解决`Object.defineProperty`的以上局限性，Vue2 提供了`Vue.set` API，来实现对象的更多操作监听，并使用了一些 hacky 的方法，比如原生`splice`数组方法去更改数组的长度，但这破坏了代码的规范性，写法上跟其他地方不一致，而这些问题，`Proxy` 完美避开。

> 总结：`Proxy` 相对于`Object.defineProperty`更强大：
>
> - `Object.defineProperty`是属于对象的方法，无法监听数组。`Proxy`可以
> - `Object.defineProperty`并非所有行为都能监听到（比如 `obj.newKey=value` or `delete obj.curValue`）
> - `Proxy`更优雅。对对象的所有属性实现监听一个代理方法即可搞定，但是`Object.defineProperty`却需要遍历对象的属性，因为这个方法是对单个属性单独监听。此外，前者是以非侵入式的方法进行监听，不需要对源对象进行操作。

**CodePen 示例**:
[![CodePen example](https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico)](https://codepen.io/aojiaodemeng/pen/JjmmrKm)

## Reflect

Reflect 属于一个静态类，即不能通过 new 构建实例对象（new Reflect()），只能通过调用 Reflect 的静态方法(Reflect.get())。在 Reflect 内部封装了一系列对对象的底层操作，Reflect 成员方法就是 Proxy 处理对象的默认实现。

Reflect 的存在意义——统一提供一套用于操作对象的 API

```javascript
const obj = { foo: '123', bar: '456' };

const proxy = new Proxy(obj, {
  // 如果没有定义get方法，就相当于使用默认的：
  get(target, property) {
    return Reflect.get(target, property);
  },
});
```

```javascript
const obj = { foo: "123", bar: "456" };

// 以下都是操作对象，但是方法却截然不同
console.log('name' in obj);
console.log(delete obj['age']));
console.log(Object.keys(obj)));

// 使用Reflect
console.log(Reflect.has(obj, 'name'))
console.log(Reflect.deleteProperty(obj, 'name'))
console.log(Reflect.ownKeys(obj))
```

## for...of

在 ECMAScript 中，遍历数组有很多方法：

- for——适合遍历普通数组
- for...in——适合遍历键值对
- forEach 等一些对象的遍历方法

for...in

```js
let arr = ['aa', 'bbb'];
for (let i in arr) {
  console.log(i, arr[i]); // 输出0 aa，1 bbb
  if (i > 0) break; // break不生效，继续执行
}

var person = { fname: 'John', lname: 'Doe', age: 25 };
for (let item in person) {
  console.log(item, person[item]); // 输出fname John，lname Doe，age 25
}
```

以上遍历方式都有一定的局限性，所以 ES2015 借鉴了其他语言，引入了 for...of 循环。这种方式以后会作为遍历所有数据结构的统一方式。

```javascript
let arr = ['aa', 'bbb'];
for (const item of arr) {
  console.log(item); // 输出 aa bbb
  if (item > 100) {
    break; // for...of可以用break、throw、return终止循环/关闭迭代器，但是forEach是不可以的，some、every中可以返回true终止。
  }
}

let iterable = [10, 20, 30];
for (let value of iterable) {
  value += 1;
  console.log(value); // 先后输出11 21 31
}
// 如果不想修改语句块中的变量，let就改成const
for (const value of iterable) {
  console.log(value); // 先后输出10 20 30
}

const s = new Set(['foo', 'bar']);
for (const item of s) {
  console.log(item); // 输出foo bar
}

const m = new Map();
m.set('foo', '123');
m.set('bar', '345');
for (let entry of m) {
  console.log(entry); // 先后输出["foo", "123"],["bar", "345"]
}
for (const [key, value] of m) {
  console.log(key, value); // 先后输出foo 123，bar 345
}
```
