## 双向数据绑定和数据响应式是相同的吗？

- [【前端知识之 Vue】双向数据绑定以及响应式的原理](https://blog.csdn.net/weixin_44337386/article/details/125397018)
- [ue 当中响应式 对 Dep 和 Watcher 详细解释（手搓）](https://blog.csdn.net/weixin_69810763/article/details/135478552)
- [Vue 双向数据绑定和 Vue 响应式](https://blog.csdn.net/m0_66637749/article/details/130244249?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-4-130244249-blog-125397018.235^v43^pc_blog_bottom_relevance_base8&spm=1001.2101.3001.4242.3&utm_relevant_index=5)
  不相同，原因如下：

- 响应式是指通过数据区驱动 DOM 视图的变化，是单向的过程。
- 双向数据绑定就是无论用户更新 View 还是 Model，另一个都能跟着自动更新。

例如：当用户填写表单时，View 的状态就被更新了，如果此时可以自动更新 Model 的状态，那就相当于我们把 Model 和 View 做了双向绑定。
双向数据绑定的数据和 DOM 是一个双向的关系。
响应式是双向绑定的一环。

## 双向数据绑定的原理

双向绑定由三个重要部分（MVVM）构成：

- 数据层（Model）：应用的数据及业务逻辑；
- 视图层（View）：应用的展示效果，各类 UI 组件；
- 业务逻辑层（ViewModel）：框架封装的核心，它负责将数据与视图关联起来。

ViewModel 的主要职责是：数据变化后更新视图；视图变化后更新数据。
ViewModel 有两个主要组成部分：

- 监听器（Observer）：对所有数据的属性进行监听；
- 解析器（Compiler）：对每个元素节点的指令进行扫描跟解析，根据指令模板替换数据，以及绑定响应的更新函数。

当一个 Vue 实例创建时，Vue 会遍历 data 中的属性，通过 proxy 对其实现数据劫持，当访问属性的时候，会有一个自己的 dep 属性，收集依赖，每个

在初始化每个组件时，会遍历 data 中的属性(每个属性都有自己的 dep，来管理依赖)，将普通对象变成响应式对象，在这个过程中会进行依赖收集。在 getter 中收集依赖，在 setter 中触发依赖更新，这两个操作主要由两个类来完成：Dep 和 Watcher、Dep 内部有个静态属性 target 指向了全局唯一的 Watcher，

双向数据绑定可以通过指令 v-model 和修饰符 .sync 两种方式实现。Vue 会在该指令所在的元素上注册一个事件监听器，该事件监听器会在用户输入时触发。当用户输入时，事件监听器会调用该元素的 updateModelValue() 方法，该方法会将输入框的值赋给对应的 data 属性，并通知该属性的 Dep 对象。Dep 对象会遍历其收集的所有观察者对象，并依次调用它们的 update() 方法，通知它们数据已经改变，需要更新视图。

简述：
在初始化每个组件时，会遍历 data 中的属性，每个属性都有自己的 dep，来管理依赖，利用 proxy 实现数据劫持，在 getter 中收集依赖，在 setter 中触发依赖更新，这两个操作由两个类完成：dep 和 watcher，dep 内部有个静态属性 target 指向全局唯一的 Watcher。
双向数据绑定可以通过指令 v-model 和修饰符 .sync 两种方式实现，vue 会在该指令所在的元素上注册事件监听器，在用户输入时触发，此时会调用 updateModelValue 方法，将输入框的值赋给对应的 data 属性，同时通知该属性的 Dep 对象。Dep 对象会遍历其收集的所有观察者对象，并依次调用它们的 update() 方法，通知它们数据已经改变，需要更新视图。

## Vue2 响应式的缺陷

众所周知，Vue2.0 对于数据响应式的实现上是有一些局限性的，比如：

- 无法检测数组和对象的新增
- 无法检测通过索引改变数组的操作

### 1.无法响应对象新增属性

如下代码，给 data 中的对象添加一个新的属性，视图并不会刷新，这是因为在 Vue 实例创建时，obj.b 并未声明，因此就没有被 Vue 转换为响应式的属性，自然就不会触发视图的更新。

```vue
<template>
  <div>
    <ul>
      <li v-for="value in obj" :key="value">{{ value }}</li>
    </ul>
    <button @click="addObjB">添加 obj.b</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      obj: {
        a: 'obj.a',
      },
    };
  },
  methods: {
    addObjB() {
      this.obj.b = 'obj.b';
      console.log(this.obj);
    },
  },
};
</script>
```

可以使用 Vue 的全局 api：`Vue.set`或`Vue.$set`解决这个问题，$set()方法相当于手动的去把 obj.b 处理成一个响应式的属性，此时视图也会跟着改变了。

```js
addObjB () {
   this.$set(this.obj, 'b', 'obj.b')
   // Vue.delete(obj, key)
   // this.$delete(obj,key)
   console.log(this.obj)
}
```

### 2.无法响应数组索引和 length 的变化

ue2 无法检测到通过索引设置数组元素的变化，以及直接修改数组的 length 属性。为了解决这个问题，你需要使用特定的数组方法，如 push，pop，splice 等，或者通过使用 Vue.set 方法来修改数组。
比如：

```js
arr[i] = value; // 直接通过下标赋值
arr.length = newLen; // 直接修改数组长度
```

解决方法：

- 1. Vue.set(arr, index, newvalue)
- 2. vm.$set(arr, index, newvalue)
- 3. arr.splice(index, 1, newvalue) // 修改数组长度

调用数组的 pop、push、shift、unshift、splice、sort、reverse 等方法时是可以监听到数组的变化的 vue 内部相当于重写了数组的原型，劫持了这七个方法。

⚠️ 但是注意：数组中的元素是引用类型时是会被监听的

### 3.需要使用$watch 来监听嵌套属性

Vue2 中，如果你需要监听一个嵌套属性的变化，你需要使用$watch 方法，并指定要观察的属性路径。这样会导致代码变得冗长，并且需要手动管理观察者。

## Proxy VS Object.defineProxy

`Proxy`和`Object.defineProperty`都可以监听对象的读写，但 Vue3 放弃使用了 Vue2 种的选择使用了`Object.defineProperty`而选择了`Proxy`。`Proxy`比`Object.defineProperty`更强大。

- `Object.defineProperty`是对象的方法，无法监听数组
- `Object.defineProperty`并非所有行为都能监听到，比如新增新属性、删除属性：`obj.newKey=value` 或`delete obj.curValue`
- `Proxy`写法更优雅：1.采用非侵入式的方式进行监听 2.对对象的所有属性实现监听一个代理方法即可搞定

### 1.Vue2 中是如何实现对数组的监听的？

已经知道 Object.defineProxy 方法是属于对象的方法，只能监听对象，无法监听数组，那么 Vue2 中是如何实现对数组的监听？

- 利用 defineReactive 方法，通过 defineProperty 对属性进行劫持，数组则是通过重写其方法来进行劫持，每个属性值都拥有自己的 dep 属性，用来存取所依赖的 watch，当数据发生改变时，触发相应的 watch 去更新数据

### 2.Vue3 响应式的优势

Vue3 用 Proxy 和 Reflect 来代替 vue2 中的 Object.definepeoperty()方法来重写响应式。

- vue3 中可以监听动态新增的属性
- vue3 中可以监听删除的属性
- vue3 中可以监听数组的索引和 length 属性
- 代码的执行效果更快
- Proxy 可以直接监听对象而非属性
- Proxy 可以直接监听数组的变化

Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的 Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改 Proxy 不需要初始化的时候遍历所有属性，另外有多层属性嵌套的话，只有访问某个属性的时候，才会递归处理下一级的属性。

## Reflect 与 Proxy

Vue 引入了反射和代理的概念，所谓反射指的是 Reflect，所谓代理指的是 Proxy。

## reactive 与 shallowReactive（深响应与浅响应）

### 1.shallowReactive

```js
function shallowReactive(obj){
  return new Proxy(obj {
    get(target,key,receiver){
      if(key==='raw'){
        return target
      }
      track(target,key)
      // 当读取属性值时，直接返回结果
      return Reflect.get(target,key,receiver)
    }
    // 省略其他拦截函数
  })
}
```

所谓浅响应，指的是只有对象的第一层属性是响应的：

```js
const obj = shallowReactive({ foo: { bar: 1 } });
effect(() => {
  console.log(obj.foo.bar);
});
obj.foo = { bar: 2 };
ibj.foo.bar = 3;
```

### 2.如何实现深响应的？

当读取属性值时，首先检测该值是否是对象，如果是对象，则递归地调用 reactive 函数将其包装成响应式数据并返回。

```js
function shallowReactive(obj){
  return new Proxy(obj {
    get(target,key,receiver){
      if(key==='raw'){
        return target
      }
      track(target,key)
      // 得到原始值结果
      const res = Reflect.get(target, key,receiver)
      if(typeof res ==='object' && res !== null){
        return reactive(res)  // 调用reactive将结果包装成响应式数据再返回
      }
      return res
    }
    // 省略其他拦截函数
  })
}
```

## Ref

Proxy 只能代理 Object 数据（包含了 function、array 等），所以 Vue3 提供了`ref`方法用来处理原始值的响应。
ref 的本质是将原始值赋值给对象的 value 属性，再将这个对象进行响应监听。

```js
function ref(val){
  cons wrapper = {
    value: val
  }
  Object.defineProperty(wrapper, '__v_isRef', {value: true})   // 用来区分一个数据是否是ref
  return reactive(wrapper)
}

const refVal = ref(1)
console.log(refVal.value)
```
