## 项目准备

### step1: 初始化项目

- 1.新建仓库，并 clone 到本地
- 2.初始化项目：执行`pnpm init`初始化项目（本质上和 `npm init` 一致）

### step2: pnpm+monorepo 初始化项目架构

使用 pnpm workspace 来初始化 monorepo 项目的工程架构:

![](./img/file-structure.png)

在项目目录下分别创建 `app` 和 `package` 文件夹，以及`pnpm-workspace`配置文件：

```yaml
📦my-project
┣ 📂apps    // 存放应用
┃ ┗ ...
┣ 📂packages   // 存放类库
┃ ┗ ...
┣ 📜package.json
┣ 📜pnpm-workspace.yaml   // 配置文件，用来定义 monorepo 的工作区间
```

在 pnpm-workspace.yaml 中声明 app 和 packages 的工作区：

```yaml
packages:
  - 'apps/**'
  - 'packages/**'
```

### step3: 安装 ESLint 和 TS

对于 Monorepo 的仓库来说，可以在主仓库中创建 ESLint 的检查规则，然后作用于所有子项目。不需要在每一个子包里创建 ESLint。

**1. pnpm 命令根目录安装 ESLint 和 TypeScript**

```js
# -D 运行时依赖
# -w 表示安装到 workspace 根目录下
pnpm add eslint typescript -Dw    // pnpm add eslint@8.46.0 typescript@5.1.6  -Dw
// pnpm config set registry http://registry.npm.taobao.org
```

**2. 初始化项目的相关 ESLint 配置**

初始化 ESLint 配置：

```
npx eslint --init  // 因为eslint不是全局模块的依赖，无法直接执行eslint的脚本命令，需要在前面加npx
```

执行命令后，可以选择 Standard 规范库、以及支持 TS：
![](./img/eslint-init.png)
执行成功后，根目录会产生文件：`.eslintrc.js`，[ESLint 配置文档查阅](https://eslint.org/docs/latest/use/configure/)

**3. 检测**
通过执行 `eslint --ext .js,.jsx,.ts,.tsx` ，来试试看命令行的不规范代码检查是否是能够使用的，可以正常检测的话，将命令添加到根目录 package.json 执行脚本当中：

```yaml
"script": {

- "lint:js": "eslint --ext .js,.jsx,.ts,.tsx ./",
- "lint:fix": "eslint --fix --cache --ext .js,.jsx,.ts,.tsx ./"
  }
```

执行 lint 脚本后，会将 Error 和 Warning 都输出在控制台。
这里与小册子操作结果不符合。。实际报错了，tsconfig.json 文件咩有

### step4.pnpm+Vite 快速构建子项目

在项目开发中，需要构建我们的一些 Npm 包。Webpack、Rollup 这些打包工具配置无疑是繁琐的。因此，我们需要一个开箱即用的打包构建工具。

关于 `Vite` 作为依赖库的构建工具，原因有以下几个方面：

- 都是通过预置 Rollup 配置作为构建工具，Vite 不仅仅支持类库的打包，同时还可以作为 Bundless 构建器，后续快速移动 Demo 服务，有利于调试；
- Vite 社区生态好，维护力度大，插件维护也可观，方便后续进行集成扩展。

通过 `pnpm create` 使用 vite 套件新建一个以 react-ts 为模版的项目

```js
cd packages
pnpm create vite core --template react-ts
```

然后：

```js
cd core
pnpm install
pnpm run dev
```

![](./img/create-core.png)

### step5.加入 Turborepo

由于我们是一个 Monorepo 的项目，必不可少的就是子包与子包之间的相互依赖，子包与应用之间的相互依赖，所以为了更好的流程化构建项目，对整个工程需要一个好的工具来管理工作区和任务，标准杯构建的工作流程。

[Add Turborepo to your existing monorepo](https://turbo.build/repo/docs/getting-started/existing-monorepo)

根目录下执行：

```
pnpm install turbo  -D
```

然后在根目录下创建`turbo.json`：

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["test/**/*.ts", "test/**/*.tsx"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
```

主要是用于构建 CI 使用。在工程 package 中执行 turbo run build --filter @lgnition-web/editor 即可完成构建编辑器应用的相关任务。

## 拖拽功能

绝大部分的可视化搭建平台都会使用拖拉拽来完成对应页面的布局，减少非研发成员对于选择物料进行整体布局的学习成本，所以流畅的拖拽功能是基于 GUI 的低代码平台中编辑器模块的核心功能之一。

### 拖拽方案选择

#### 1.HTML5 原生拖拽方案

[![](../img/juejin.svg)](https://code.juejin.cn/pen/7335454046758961161)

#### 2.第三方库

- 网格拖拽布局：react-gird-layout
- 任意位置拖拽：react-dnd, dnd-kit

[低代码编辑器通用框架——craft.js](https://zhuanlan.zhihu.com/p/649243455?utm_id=0)

总结：

- 使用 `craft.js` 这个开源组件来作为一个中间层实现编辑器相关的拖拽与编排关联
- iframe 实现编辑器画布预览

### step1. 安装 craftjs

根目录执行：

```js
// -w 为全局安装模式，安装后在所有的子包当中都可以直接引用到它，无需重复进行安装。
pnpm add @craftjs/core -w
```

### step2.
