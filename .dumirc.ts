import { defineConfig } from 'dumi';

const repo = 'smashing-series'; // git仓库名

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  base: isProd ? `/${repo}/` : '/',
  publicPath: isProd ? `/${repo}/` : '/',
  favicons: [isProd ? `/${repo}/favicon.ico` : `/favicon.ico`],
  locales: [{ id: 'en-US', name: '英文' }],
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
      '/cheatsheet': [
        {
          title: 'FE Cheatsheet',
          children: [
            { title: 'ECMAScript', link: '/cheatsheet/es' },
            { title: 'JavaScript', link: '/cheatsheet/js' },
            { title: 'Asynchronous Programming', link: '/cheatsheet/ap' },
            { title: 'Functional Programming', link: '/cheatsheet/fp' },
            { title: 'TypeScript', link: '/cheatsheet/ts' },
            { title: 'ReactJs', link: '/cheatsheet/react' },
            { title: 'VueJs', link: '/cheatsheet/vue' },
            { title: 'English Words Map', link: '/cheatsheet/words' },
          ],
        },
      ],
      '/algorithm': [
        {
          title: '算法',
          children: [
            { title: '复杂度', link: '/algorithm/complexity' },
            { title: '比较器', link: '/algorithm/comparator' },
            { title: '异或(Exclusive or, XOR)', link: '/algorithm/xor' },
          ],
        },
      ],
    },
  },
});
