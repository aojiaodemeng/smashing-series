## 1.大文件分片上传与文件秒传

- [b 站-大文件分片上传](https://www.bilibili.com/video/BV1u94y187Aj/?spm_id_from=333.788.recommend_more_video.0&vd_source=7ee2eb32d377b22069c6dc587637a207)

大文件上传，前端主要分为 3 个步骤：

- 对文件进行分片（使用 file.slice 方法对 File 对象进行分片）
- 计算分片文件的 hash （用 spark-md5 库）
- 调用服务端判断上传的文件的 hash 是否一致

### step1.使用 slice 对 File 对象进行分片

```js
const inp = document.querySelector('input[name="inp"]');
inp.onchange = (e) => {
  const file = inp.files[0]; // 这里返回一个File对象
  if (!file) {
    return;
  }
  createChunks(file, 10 * 1024 * 1024);

  function createChunks(file, chunkSize) {
    const result = [];
    for (let i = 0; i < file.size; i += chunkSize) {
      // const piece = file.slice(0, 100);
      // 使用slice对File对象切片，比如取0-99个字节，得到的piece是Blob对象
      result.push(file.slice(i, i + chunkSize));
    }
  }
};
```

- File 和 Blob：File 对象只是保存了文件的信息，但是并没有保存数据，Blob 也是只保存了文件信息。

### step2. 实现秒传

- 对每个分片的小文件，做一个 hash 值，每次后端就根据这个 hash 值来判断当前的小文件是否已经上传过，断网续传的时候就可以进行判断
- 对于 hash 的计算，常见的加密算法是 MD5，可以使用第三方库：spark-md5
- 注意不太推荐计算整个大文件的 hash，因为这样做就必须拿到全部文件的数据，内存会比较大，所以通常是对小文件进行 hash，用完就清除，这个过程叫**增量运算**
- 实现一个递归函数，依次读取小分块，读完之后就去递归调用自身再去读下一个分块

```js
const inp = document.querySelector('input[name="inp"]');
inp.onchange = async (e) => {
  const file = inp.files[0]; // 这里返回一个File对象
  if (!file) {
    return;
  }
  const chunks = createChunks(file, 10 * 1024 * 1024);
  const result = await hash(chunks);

  function createChunks(file, chunkSize) {
    const result = [];
    for (let i = 0; i < file.size; i += chunkSize) {
      // const piece = file.slice(0, 100);
      // 使用slice对File对象切片，比如取0-99个字节，得到的piece是Blob对象
      result.push(file.slice(i, i + chunkSize));
    }
  }
  function hash(chunks) {
    return new Promise((resolve) => {
      const spark = new SparkMD5();
      function _read(i) {
        if (i >= chunks.length) {
          // 读取完成
          resolve(spark.end()); // 全部读取完成之后，就可以输出整个的hash计算
          return;
        }
        const blob = chunks[i];
        const reader = new FileReader(); // 拿到分块之后，用FileReader去读，读取的过程是异步的
        reader.onload = (e) => {
          const bytes = e.target.result; // 读取到的字节数
          spark.append(bytes); // 把字节加到运算中，spark.append方法会对其做增量运算
          _read(i + 1); // 完成一个分片追加之后，调用_read函数自身，完成下一个分片
        };
        reader.readAsArrayBuffer(); // 读取字节
      }
      _read(0);
    });
  }
};
```

### step3.web worker 优化

如果是比较大的文件的话，计算 hash 的时间会比较长，因此在实际开发中，上面的运算过程一般不会放到主线程里，而是放到 web worker，单独的去开一个线程，避免浏览器卡死。放到 web worker 里可能也会有卡顿，因为是一个 CPU 特别密集的任务，比如 b 站就做了个优化，对大的文件先做个中等的分块，然后在继续密分。可以看这里视频的介绍：[b 站-大文件分片上传](https://www.bilibili.com/video/BV1u94y187Aj/?spm_id_from=333.788.recommend_more_video.0&vd_source=7ee2eb32d377b22069c6dc587637a207)

## 2.AJAX 进度监控

- [AJAX 进度监控【渡一教育】](https://www.bilibili.com/video/BV1WX4y1j7BB/?spm_id_from=333.788.recommend_more_video.20&vd_source=7ee2eb32d377b22069c6dc587637a207)

## 3.请求的取消

- [请求的取消](https://www.bilibili.com/video/BV1vT4y1h7jn/?spm_id_from=333.788.recommend_more_video.9&vd_source=7ee2eb32d377b22069c6dc587637a207)

## 4.网络状态监控

-[网络状态监控【渡一教育】](https://www.bilibili.com/video/BV1gz4y1F7ki/?spm_id_from=333.337.search-card.all.click&vd_source=7ee2eb32d377b22069c6dc587637a207)

## 3.

## 1.如何进行前端项目的打包和部署？

前端的打包部署，就是把开发完成的代码，转化成可以在生产环境当中运行的过程。过程中有以下步骤：

- 1.优化代码和压缩
- 2.配置打包工具（webpack、vite 这些，配置入口文件、模块加载等）
- 3.执行打包命令
- 4.静态资源处理（可以使用合适的插件处理，比如图片压缩、字体文件引入）
- 5.配置服务器环境
- 6.部署到服务器
- 7.配置域名和路由规则
- 8.监控和测试

## 2.如何进行前端项目的错误监测和处理？

- 1.try-catch 捕获异常
- 2.全局错误处理
- 3.错误日志记录
- 4.监听网络请求（请求超时、网络断开）
- 5.错误页面和友好提示
- 6.使用断言和检查
- 7.单元测试和集成测试

兼容性问题如何检测？

## 3.如何保证代码的质量和可维护性？

- 1.使用合适的命名规范
- 2.编写清晰的注释
- 3.使用设计模式、单一责任原则、开闭原则、依赖倒置原则
- 4.模块化和组件化
- 5.单元测试和集成测试
- 6.使用代码管理控制工具
- 7.代码审查和静态分析
- 8.文档和知识分享

## 4.在前端项目中使用过的前端安全措施，以及你是如何确保项目的安全性。

- 1.数据传输加密（比如使用 ssl、tls 加密协议，确保数据在传输过程中不被窃取、篡改或者劫持），前端中使用 HTTPS 协议来实现数据传输加密
- 2.输入验证和过滤（避免 XSS、XSRF 等）
- 3.访问控制和权限管理（根据用户角色和权限状态限制页面访问以及操作权限）
- 4.安全编码（比如避免直接操作 dom、缓存敏感信息时应该加密）
- 5.扫描漏洞和安全测试

## 5.无感刷新

## 6.横竖屏切换时保证

- 组件库搭建
- 无感刷新
- 代码规范
- 自动化部署
- 微前端
- 错误监控
- 断点续传、分片下载
- 监听网络请求（请求超时、网络断开），增加错误页面，进行浏览器兼容性提示
- 全局错误处理
- react 中，传递引用数据类型

如何处理浏览器的兼容性问题

1.严格按照 W3C 标准编写代码

2.利用工具对代码进行兼容性检查，比如 CANIUSE

3.使用 JS 库或者框架，例如 jQuery，react，vue

4.针对具体的浏览器使用具体的代码方案进行解决。包括重置浏览器的默认样式等等

5.在不同的浏览器和不同设备上进行测试 ​

sort 背后的原理

- [前端小妙招】妙用 module/nomodule 技术实现优雅降级和性能优化](https://www.bilibili.com/video/BV1w341197KT/?spm_id_from=333.337.search-card.all.click&vd_source=7ee2eb32d377b22069c6dc587637a207)
- [Performance 对象与性能监控讲解](https://www.bilibili.com/video/BV1wP4y187fJ/?spm_id_from=333.337.search-card.all.click&vd_source=7ee2eb32d377b22069c6dc587637a207)

## 错误处理

- axios.interceptors

## 前端监控 SDK

- [黑马前端监控 SKD 实战，设计前端监控体系](https://www.bilibili.com/video/BV1MY4y1D75D/?spm_id_from=333.337.search-card.all.click&vd_source=7ee2eb32d377b22069c6dc587637a207)

前端监控方案：

- 接入现成的
  - 1. [sentry](https://docs.sentry.io/)
  - 2. [fundebug](https://www.fundebug.com/)
- 自己封装
