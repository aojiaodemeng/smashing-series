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
          title: '引言',
          children: [{ title: '介绍', link: '/flutter/basic' }],
        },
        {
          title: '基础知识',
          children: [
            { title: '枚举', link: '/flutter/enum' },
            { title: '面向对象编程', link: '/flutter/oop' },
          ],
        },
        // {
        //   title: 'UI组件篇',
        //   children: [{ title: '枚举', link: '/flutter/enum' }],
        // },
        {
          title: '常用库',
          children: [{ title: 'Dio', link: '/flutter/dio' }],
        },
      ],
      '/full-stack': [
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
