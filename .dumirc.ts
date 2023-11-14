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
          title: 'FlutterApp',
          children: [
            { title: '1.环境搭建', link: '/full-stack/app-init' },
            {
              title: '2.Flutter实现一个简单页面',
              link: '/full-stack/app-simple-page',
            },
            { title: '3.引入路由框架fluro', link: '/full-stack/app-add-fluro' },
            { title: '4.登陆页/注册页', link: '/full-stack/app-login' },
            { title: '5.首页', link: '/full-stack/app-home' },
            {
              title: '6.设置页/管理发布页',
              link: '/full-stack/app-manage',
            },
            { title: '7.详情页', link: '/full-stack/app-detail' },
            { title: '8.dio封装', link: '/full-stack/app-dio' },
            { title: '9.登陆页联调', link: '/full-stack/app-login-golang' },
            { title: '10.城市选择器', link: '/full-stack/app-select' },
            { title: '11.登陆过期处理', link: '/full-stack/app-login-timeout' },
            { title: '12.启动页', link: '/full-stack/app-landing-page' },
            { title: '12.构建打包', link: '/full-stack/app-build' },
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
