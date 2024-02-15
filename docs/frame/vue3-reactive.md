## Proxy VS Object.defineProxy

`Proxy`和`Object.defineProperty`都可以监听对象的读写，但 Vue3 放弃使用了 Vue2 种的选择使用了`Object.defineProperty`而选择了`Proxy`。`Proxy`比`Object.defineProperty`更强大。

- `Object.defineProperty`是对象的方法，无法监听数组
- `Object.defineProperty`并非所有行为都能监听到，比如新增新属性、删除属性：`obj.newKey=value` 或`delete obj.curValue`
- `Proxy`写法更优雅：1.采用非侵入式的方式进行监听 2.对对象的所有属性实现监听一个代理方法即可搞定

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
