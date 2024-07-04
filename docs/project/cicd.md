## 参考文档

- [掘金-作为前端 leader，怎么快速搭建多环境 CICD 自动化部署？](https://juejin.cn/post/7250083673189253176?searchId=20240313170552B3FC05156770F1006E54)
- [b 站-作为前端 leader，怎么快速搭建多环境 CICD 自动化部署？](https://www.bilibili.com/video/BV1u14y1o7DW/?spm_id_from=333.788&vd_source=7ee2eb32d377b22069c6dc587637a207)
- [前端基础建设与架构 30 讲](https://www.bilibili.com/video/BV1rP411f7Wn?p=32&vd_source=7ee2eb32d377b22069c6dc587637a207)
- [大公司里怎样开发和部署前端代码？](https://www.zhihu.com/question/20790576)
- [大公司怎样部署前端代码？](https://www.bilibili.com/video/BV1rP411e7Us/?spm_id_from=333.337.search-card.all.click&vd_source=7ee2eb32d377b22069c6dc587637a207)

## 我的博客是如何实现自动化部署的

在 push 代码的时候，github 会读取项目里的`.github/workflows/**.yml`文件，

.github\workflows 目录下可以有多个 .yml 文件，不同过的 .yml 监听不同分支的 push，进行不同的部署逻辑，即可形成两套环境部署。如下图

## 使用 ssh 命令操作部署远程服务器

原始的部署方法很繁琐，就是用 ssh 命令进行手动部署。 1.使用 ssh 在远程服务器上执行命令

```yaml
# 在 ip 为 47.107.49.197 的服务器上执行 "pwd;git pull" 等命令
ssh root@47.107.49.197 "pwd;git pull;npm install;npm run build;"
```

2.使用 scp 将本地文件部署到服务器（scp 可以简单理解为 cp + ssh 的组合）

```yaml
# 将当前目录下的 dist 文件内容部署到服务器的 /root/demo.zuo11.com 目录
scp -r ./dist/* root@47.107.49.197:/root/demo.zuo11.com）
```
