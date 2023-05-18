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
      '/babel': [
        {
          title: 'Basic Info',
          children: [{ title: 'What is Babel?', link: '/babel' }],
        },
        {
          title: 'Plus',
          children: [{ title: 'English Words', link: '/babel/words' }],
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
