## Vue 组件为什么只能有一个根元素？

- **结论：** vue2 中组件确实只能有一个根，但 vue3 中组件已经可以多根节点了。
- **原因：** 之所以需要这样是因为 vdom 是一颗单根树形结构，patch 方法在遍历的时候从根节点开始遍历，它要求只有一个根节点。组件也会转换为一个 vdom，自然应该满足这个要求。
- **Vue3 解决方法以及原理：** vue3 中之所以可以写多个根节点，是因为引入了 Fragment 的概念，这是一个抽象的节点，如果发现组件是多根的，就创建一个 Fragment 节点，把多个根节点作为它的 children。将来 patch 的时候，如果发现是一个 Fragment 节点，则直接遍历 children 创建或更新。

## 生命周期

### 1.Vue2 生命周期

- `beforeCreate`：数据观测和初始化事件还未开始，此时 data 的响应式追踪、event/watcher 都还没有被设置，也就是说不能访问到 data、computed、watch、methods 上的方法和数据。
- `created` :实例创建完成，实例上配置的 options 包括 data、computed、watch、methods 等都配置完成（可以访问到 this），但是此时渲染得节点还未挂载到 DOM，所以不能访问到$el 属性
- `beforeMount`：相关 render 函数首次被调用，完成了编译模板这个步骤（把 data 里面的数据和模板生成 html），模板已经在内存中渲染好，但还未渲染到页面中
- `mounted`：将内存中渲染好的模板, 真实的替换到浏览器中，此过程中进行 ajax 交互
- `beforeUpdate`：响应式数据更新时调用，此时虽然响应式数据更新了，但是对应的真实 DOM 还没有被渲染。（页面显示的数据还是旧的, 但是 data 数据已经是最新的）
- `updated`：更新后的数据已经渲染到视图中（调用时，组件 DOM 已经更新，所以可以执行依赖于 DOM 的操作），然而在大多数情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环。该钩子在服务器端渲染期间不被调用。
- `beforeDestroy`：实例销毁之前调用。这一步，实例仍然完全可用，this  仍能获取到实例。此时 data 、methods 、指令等还是可用状态。
- `destroyed`：实例销毁后调用，调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁，此时 data 、methods 、指令等都不可用。该钩子在服务端渲染期间不被调用。

另外：

- `keep-alive`：用于保留组件状态或避免重新渲染
- `activated`：只有在 keep-alive 组件激活时调用（使用 keep-alive 的组件就会多出 activated 和 deactivated 两个生命周期）
- `deactivated`：只有在 keep-alive 组件停用时调用
- `errorCapured`： 当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回  `false`  以阻止该错误继续向上传播。

### 2.created 和 mounted 的区别

- `created`:在模板渲染成 html 前调用，即通常初始化某些属性值，然后再渲染成视图。
- `mounted`:在模板渲染成 html 后调用，通常是初始化页面完成后，再对 html 的 dom 节点进行一些需要的操作。

### 3.关于 keep-alive

如果为一个组件包裹了 keep-alive，那么它会多出两个生命周期：deactivated、activated。同时，beforeDestroy 和 destroyed 就不会再被触发了，因为组件不会被真正销毁。
当组件被换掉时，会被缓存到内存中、触发 deactivated 生命周期；当组件被切回来时，再去缓存里找这个组件、触发 activated 钩子函数。

### 4.Vue3 生命周期

从 Vue2 到 Vue3 的生命周期映射是直接从[Vue 3 Composition API 文档](https://vuejs.org/guide/extras/composition-api-faq.html#watcheffect)中获得的:

setup 创建实例前
onBeforeMount 挂载 DOM 前
onMounted 挂载 DOM 后
onBeforeUpdate 更新组件前
onUpdated 更新组件后
onBeforeUnmount 卸载销毁前
onUnmounted 卸载销毁后

- `beforeCreate` -> 使用 `setup()`
- `created` -> 使用 `setup()`

beforeMount -> onBeforeMount

mounted -> onMounted

beforeUpdate -> onBeforeUpdate

updated -> onUpdated

beforeDestroy -> onBeforeUnmount

destroyed -> onUnmounted

errorCaptured -> onErrorCaptured

### 5.一般在哪个生命周期请求异步数据

我们可以在钩子函数 `created`、`beforeMount`、`mounted` 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。
​
推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

能更快获取到服务端数据，减少页面加载时间，用户体验更好；
SSR 不支持 beforeMount 、mounted 钩子函数，放在 created 中有助于一致性。

### 6.Vue 子组件和父组件执行顺序

- 1.加载渲染过程
  `父beforeCreate`->`父created`->`父beforeMount`->`子beforeCreate`->`子created`->`子beforeMount`->`子mounted`->`父mounted`
- 2.子组件更新过程
  `父beforeUpdate`->`子beforeUpdate`->`子updated-`>`父updated`
- 3.销毁过程
  `父beforeDestroy`->`子beforeDestroy`->`子destroyed`->`父destroyed`

## 组件通信

- 父子组件：props 与 $emit
- eventBus 事件总线
- 依赖注入（provide / inject）
- ref / $refs
- $parent / $children
- $attrs / $listeners
- vuex

## 双向数据绑定的原理
