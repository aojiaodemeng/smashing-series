import { defineConfig } from 'dumi';

export default defineConfig({
  locales: [{ id: 'en-US', name: '英文' }],
  themeConfig: {
    name: 'Smashing Series',
    logo: `/logo.png`,
    favicons: [`/public/favicon.ico`],
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
