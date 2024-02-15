## 参考链接

[History API-MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)  
[前端路由实现方法](https://www.jianshu.com/p/5231e7e125da)  
[深入理解前端中的 hash 和 history 路由](https://zhuanlan.zhihu.com/p/130995492)  
[React 系列十九 - 掌握 react-router](https://www.bilibili.com/read/cv8542053)  
[彻底搞懂路由跳转：location 和 history 接口](https://segmentfault.com/a/1190000014120456)

## 前端路由原理

前端路由是如何做到 URL 和内容进行映射呢？监听 URL 的改变。
目前前端路由的实现方法主要有两种方法，location.hash 和 window.history。

- hashchange：hash 路由变化
- popstate：监听活动的历史记录项变化

### 1.hash

思路：

- step1.url 上的 hash 值发生变化(页面不发生刷新)
- step2.触发 hashchange 事件，通过 window.location.hash 拿到当前的 hash 值，然后渲染对应的页面内容

### 2.html5 的 history

浏览器窗口会为用户提供一个 history 对象，用来保存用户操作页面的历史，我们在浏览网页时的前进后退操作都是基于这个对象来实现的。在前端路由的实现过程中主要用到了 history 对象里的 history.pushState()和 history.replaceState()，这两个接口。

设计思路：当想要跳转到指定 url 的时候，将目标 url 通过 pushState()或者 replaceState()方法填入到 history 和地址栏中，此时由于上述两种方法不会主动进行页面刷新，因此页面仍停留在当前页面，只是 url 地址发生了改变。之后通过 popstate 事件响应（不会主动触发，不过可以用 window.dispatchEvent 事件达到监听路由变化的功能），执行相应的回调函数，实现前端组件间的切换。

- step1：通过调用 pushState()或者 replaceState()方法更改 url
- step2：不会触发 popState 方法，但是可以用 window.dispatchEvent 事件达到监听路由变化的功能，进而实现组件切换

history 接口是 HTML5 新增的, 它有六种模式改变 URL 而不刷新页面：

- back()：后退到上一个路由；
- forward()：前进到下一个路由，如果有的话；
- go(number)：进入到任意一个路由，正数为前进，负数为后退；
- pushState(obj, title, url)：前进到指定的 URL，不刷新页面；- 不会触发 popstate 与 hashchange 事件
- replaceState(obj, title, url)：用 url 替换当前的路由，不刷新页面；- 不会触发 popstate 与 hashchange 事件

## pushState 和 replaceState 两个方法跟 location.href 和 location.replace 两个方法有什么区别呢？

- location.href 和 location.replace 切换时要向服务器发送请求，而 pushState 和 replace 仅修改 url，除非主动发起请求；

## react-router 最主要的 API 是给我们提供的一些组件：

- BrowserRouter 或 HashRouter
  - Router 中包含了对路径改变的监听，并且会将相应的路径传递给子组件；
  - BrowserRouter 使用 history 模式；
  - HashRouter 使用 hash 模式；
- Link 和 NavLink：
  - 通常路径的跳转是使用 Link 组件，最终会被渲染成 a 元素；
  - NavLink 是在 Link 基础之上增加了一些样式属性；比如 activeStyle、activeClassName
  - to 属性：Link 中最重要的属性，用于设置跳转到的路径；
- Route：
  - Route 用于路径的匹配；
  - path 属性：用于设置匹配到的路径；
  - component 属性：设置匹配到路径后，渲染的组件；
  - exact：精准匹配，只有精准匹配到完全一致的路径，才会渲染对应的组件；
- Switch
  - 避免多个匹配到路径的组件同时渲染
- Redirect
  - 重定向

## react-router 里的 Link 标签和 a 标签的区别

- 有 onclick 那就执行 onclick
- click 的时候阻止 a 标签默认事件
- 用 to 属性接收跳转的路径，用 history 路由方式进行跳转
