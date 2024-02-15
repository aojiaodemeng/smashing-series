## 1.Vue 组件为什么只能有一个根元素？

- **结论：** vue2 中组件确实只能有一个根，但 vue3 中组件已经可以多根节点了。
- **原因：** 之所以需要这样是因为 vdom 是一颗单根树形结构，patch 方法在遍历的时候从根节点开始遍历，它要求只有一个根节点。组件也会转换为一个 vdom，自然应该满足这个要求。
- **Vue3 解决方法以及原理：** vue3 中之所以可以写多个根节点，是因为引入了 Fragment 的概念，这是一个抽象的节点，如果发现组件是多根的，就创建一个 Fragment 节点，把多个根节点作为它的 children。将来 patch 的时候，如果发现是一个 Fragment 节点，则直接遍历 children 创建或更新。

## 2.组件通信

- 父子组件：props 与 $emit
- eventBus 事件总线
- 依赖注入（provide / inject）
- ref / $refs
- $parent / $children
- $attrs / $listeners
- vuex
