## src 和 href 的区别

- src - source 的缩写，表示对资源的引用，它指向的内容会嵌入到当前标签所在的位置。常用在 js、img、frame 元素上。当浏览器解析到该元素时，会暂停其他资源的加载，直到将该资源加载、编译、执⾏完毕。
- href - 表示超文本引用，它指向一些网络资源，建立和当前元素或本文档的链接关系。当浏览器识别到它他指向的⽂件时，就会并⾏下载资源，不会停⽌对当前⽂档的处理。 常用在 a、link 等标签上。

## script 标签中 defer 和 async 的区别

- 没有这两个属性，js 脚本就是同步加载，会阻塞后续文档的执行。
- defer 和 async 属性都是代表 js 脚本异步加载，不同的是，当有多个 defer 时，能保证其加载顺序，但是多个 async 属性无法保证顺序。

defer 与 async 都是异步加载 js，都不会阻塞页面的解析。

- defer，脚本会在纯 html 加载和解析完毕后，DOMContentLoaded 事件调用前执行。能保证顺序
- async，脚本会在资源加载完成之后就立即执行，无法保证多个 async 时的执行顺序

## onload 和 DOMContentLoaded 的区别

- DOMContentLoaded 事件是在纯 HTML 加载和解析之后触发；（而不必等待样式表，图片或者子框架完成加载。）
- window.onload 事件不但文档完全加载和解析完毕，相关资源都要加载完毕，比如图片和 CSS 文件等；

## 浏览器是如何对 HTML5 的离线储存资源进行管理和加载？

```javascript
<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
```

- 在线时，浏览器发现 html 头部有 manifest 属性，会请求 manifest 文件。如果是首次访问网页就会下载相应资源并进行离线存储，如果是已经访问过的网页，就会使用离线的资源加载页面，然后会比对新的 manifest 文件，如果有改变，就重新下载文件中的资源并存储。
- 离线情况下直接使用离线存储的资源。
