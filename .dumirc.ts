import { defineConfig } from 'dumi';

const repo = 'smashing-series';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  base: isProd ? `/${repo}/` : '/',
  publicPath: isProd ? `/${repo}/` : '/',
  locales: [{ id: 'en-US', name: '英文' }],
  themeConfig: {
    name: 'Smashing Series',
    logo: isProd ? `/${repo}/logo.png` : `/logo.png`,
    favicon: isProd ? `/${repo}/favicon.ico` : `/favicon.ico`,
    favicons: [
      isProd ? `/smashing-series/favicon.ico` : `/smashing-series/favicon.ico`,
    ],
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
    },
  },
});
