import { defineConfig } from 'dumi';

const repo = 'smashing-series'; // git仓库名

const isProd = process.env.NODE_ENV === 'production';

// locales: [{ id: 'en-US', name: '英文' }],
// locales: [{ id: 'zh-CN', name: '中文' }],
export default defineConfig({
  base: isProd ? `/${repo}/` : '/',
  publicPath: isProd ? `/${repo}/` : '/',
  favicons: [isProd ? `/${repo}/favicon.ico` : `/favicon.ico`],
  locales: [
    // { id: 'en-US', name: '英文' },
    { id: 'zh-CN', name: '中文' },
  ],
  themeConfig: {
    name: 'Smashing Series',
    logo: isProd ? `/${repo}/logo.png` : `/logo.png`,
    nav: [],
    socialLinks: {
      github: 'https://github.com/aojiaodemeng/smashing-series',
    },
    sidebar: {
      '/react': [
        {
          title: 'group1',
          children: [{ title: '标题1', link: '/react/index' }],
        },
      ],
      '/flutter': [
        {
          title: 'Flutter',
          children: [{ title: '介绍', link: '/flutter/basic' }],
        },
        {
          title: '基础知识',
          children: [
            { title: '枚举', link: '/flutter/enum' },
            { title: '面向对象编程', link: '/flutter/oop' },
          ],
        },
        {
          title: '常用库',
          children: [{ title: 'Dio', link: '/flutter/dio' }],
        },
        {
          title: '开发一个通用App',
          children: [
            { title: '1.环境搭建', link: '/flutter/app-init' },
            {
              title: '2.Flutter实现一个简单页面',
              link: '/flutter/app-simple-page',
            },
            { title: '3.引入路由框架fluro', link: '/flutter/app-add-fluro' },
            { title: '4.登陆页/注册页', link: '/flutter/app-login' },
            { title: '5.首页', link: '/flutter/app-home' },
            {
              title: '6.设置页/管理发布页',
              link: '/flutter/app-manage',
            },
            { title: '7.详情页', link: '/flutter/app-detail' },
            { title: '8.dio封装', link: '/flutter/app-dio' },
            { title: '9.登陆页联调', link: '/flutter/app-login-golang' },
            { title: '10.城市选择器', link: '/flutter/app-select' },
            { title: '11.登陆过期处理', link: '/flutter/app-login-timeout' },
            { title: '12.启动页', link: '/flutter/app-landing-page' },
            { title: '12.构建打包', link: '/flutter/app-build' },
          ],
        },
      ],
      '/cheatsheet': [
        {
          title: 'FE Cheatsheet',
          children: [
            { title: 'HTML', link: '/cheatsheet/html' },
            { title: 'CSS', link: '/cheatsheet/css' },
            { title: 'ECMAScript', link: '/cheatsheet/es' },
            { title: 'Asynchronous Programming', link: '/cheatsheet/ap' },
          ],
        },
        {
          title: 'ECMAScript',
          children: [
            { title: '箭头函数', link: '/cheatsheet/es-arrow' },
            { title: '迭代器', link: '/cheatsheet/es-iterator' },
            { title: '异步编程', link: '/cheatsheet/es-async' },
          ],
        },
        {
          title: 'JavaScript',
          children: [
            { title: '数据类型', link: '/cheatsheet/js-data' },
            { title: '异步编程', link: '/' },
            { title: '错误监控与代码调试', link: '/cheatsheet/js-error' },
            { title: '手写Promise', link: '/cheatsheet/js-promise' },
          ],
        },
        {
          title: 'JavaScript',
          children: [
            { title: '数据类型', link: '/cheatsheet/js-data' },
            { title: '异步编程', link: '/' },
            { title: '错误监控与代码调试', link: '/cheatsheet/js-error' },
          ],
        },
        {
          title: 'TypeScript',
          children: [
            { title: '类型系统', link: '/cheatsheet/ts-sys' },
            { title: '概述', link: '/cheatsheet/ts-base' },
            { title: '类型', link: '/cheatsheet/ts-type' },
            { title: '类', link: '/cheatsheet/ts-class' },
          ],
        },
        {
          title: '函数式编程',
          children: [
            { title: '前置知识', link: '/cheatsheet/fp-base' },
            { title: '纯函数与柯里化', link: '/cheatsheet/fp-curry' },
            { title: '函数组合', link: '/cheatsheet/fp-combine' },
            { title: '函子', link: '/cheatsheet/fp-functor' },
          ],
        },
        {
          title: 'English Words Map',
          children: [{ title: 'English Words Map', link: '/cheatsheet/words' }],
        },
      ],
      '/algorithm': [
        {
          title: '算法',
          children: [
            { title: '基础', link: '/algorithm/base' },
            { title: '数学运算', link: '/algorithm/math' },
            { title: '位运算', link: '/algorithm/xor' },
            { title: '数据结构', link: '/algorithm/structure' },
            { title: '二叉树', link: '/algorithm/tree' },
            { title: '排序与搜索', link: '/algorithm/simple-sort' },
            { title: '动态规划', link: '/algorithm/dp' },
            { title: '动态规划之子序列问题', link: '/algorithm/subsequence' },
            { title: '动态规划之背包问题', link: '/algorithm/knapsack' },
            { title: '贪心算法', link: '/algorithm/greedy' },
            { title: '回溯算法', link: '/algorithm/backtrack' },
            { title: '拓扑排序', link: '/algorithm/topology-sort' },
          ],
        },
      ],
      '/project': [
        {
          title: '基础设施',
          children: [
            { title: '包管理基础package.json', link: '/project/package' },
            { title: '包管理工具与Monorepo', link: '/project/pnpm' },
            { title: '从零打造一个CLI脚手架', link: '/project/cli' },
          ],
        },
        {
          title: '性能优化',
          children: [
            { title: '基础', link: '/project/performance' },
            { title: '性能测试', link: '/project/performance-tool' },
            { title: '请求和响应优化', link: '/project/http-performance' },
            { title: '输入URL到页面展示', link: '/project/url-loaded' },
          ],
        },
      ],
      '/network': [
        {
          title: ' 计算机网络',
          children: [
            { title: 'HTTP基础', link: '/network/base' },
            { title: '前端缓存', link: '/network/cache' },
          ],
        },
        {
          title: '设计模式',
          children: [{ title: '单例模式', link: '/network/singleton' }],
        },
        {
          title: 'Devops',
          children: [{ title: 'CI/CD', link: '/devops/' }],
        },
      ],
      '/frame': [
        {
          title: '《Vue3框架》',
          children: [
            { title: '框架设计', link: '/frame/vue3-design' },
            { title: '响应系统', link: '/frame/vue3-reactive' },
            { title: '渲染器 Renderer', link: '/frame/vue3-renderer' },
            { title: '组件化', link: '/frame/vue3-component' },
            { title: '编译器 Compiler', link: '/frame/vue3-compiler' },
            { title: '巩固题', link: '/frame/vue3-cheat' },
          ],
        },
        {
          title: '《React框架》',
          children: [
            { title: 'React基础', link: '/frame/react-base' },
            { title: 'VDom', link: '/frame/react-vdom' },
            { title: 'React-Router', link: '/frame/react-router' },
            { title: '事件处理机制', link: '/frame/react-system' },
            { title: '通信与数据管理', link: '/frame/react-redux' },
            { title: '从setState到性能优化', link: '/frame/react-setstate' },
            { title: '实现简易版React', link: '/frame/react-handle' },
          ],
        },
        // {
        //   title: '《Flutter框架》',
        //   children: [
        //     { title: '介绍', link: '/frame/flutter-basic' },
        //     { title: '基础知识', link: '/frame/flutter-entry' },
        //     { title: '常用库', link: '/frame/flutter-dio' },
        //     { title: '开发一个通用APP', link: '/frame/flutter-app' },
        //   ],
        // },
      ],
      '/lowcode': [
        {
          title: '前端部分',
          children: [{ title: '项目准备', link: '/lowcode/fe-init' }],
        },
      ],
      '/full-stack': [
        {
          title: 'Golang基础知识',
          children: [
            { title: '数据类型', link: '/full-stack/data' },
            { title: '函数与方法', link: '/full-stack/function' },
            { title: '变量和常量', link: '/full-stack/variables' },
            { title: '数组和切片', link: '/full-stack/slice' },
            { title: 'Map', link: '/full-stack/map' },
            { title: '占位符', link: '/full-stack/placeholder' },
          ],
        },
        {
          title: 'Golang+React18+Gin+Gorm构建全栈博客系统',
          children: [
            {
              title: '1.初始化项目、配置参数',
              link: '/full-stack/blog-rd-init',
            },
            {
              title: '2.配置数据库、数据模型',
              link: '/full-stack/blog-rd-gorm',
            },
            {
              title: '3.构架错误处理模块和路由接口',
              link: '/full-stack/blog-rd-route',
            },
            {
              title: '4.编写用户模块接口，实现初步验证+分页功能',
              link: '/full-stack/blog-rd-user',
            },
            {
              title: '5.用户密码加密存储策略介绍及选择',
              link: '/full-stack/blog-rd-bcrypt',
            },
            {
              title: '6.编写编辑用户信息+删除用户接口',
              link: '/full-stack/blog-rd-user2',
            },
            {
              title: '7.完成博客分类接口编写',
              link: '/full-stack/blog-rd-category',
            },
            {
              title: '8.编写博客文章接口（新增、编辑、删除）',
              link: '/full-stack/blog-rd-article',
            },
            {
              title: '9.完成博客文章接口（文章和分类的关联查询）',
              link: '/full-stack/blog-rd-tomany',
            },
            {
              title: '10.编写登录接口，完成JWT中间件',
              link: '/full-stack/blog-rd-jwt',
            },
            {
              title: '11.完成登录接口',
              link: '/full-stack/blog-rd-login',
            },
            {
              title: '12.完成上传接口',
              link: '/full-stack/blog-rd-upload',
            },
            {
              title:
                '13.处理日志系统（自定义日志、按时间分割日志、软连接最新日志）',
              link: '/full-stack/blog-rd-log',
            },
            {
              title: '14.后端数据验证、跨域参数配置、增加列表查询的总数返回',
              link: '/full-stack/blog-rd-cross',
            },
          ],
        },
        {
          title: 'Backend',
          children: [
            { title: 'Start', link: '/full-stack' },
            { title: 'Config Mysql and Gorm', link: '/full-stack/mysql' },
          ],
        },
      ],
    },
  },
});
