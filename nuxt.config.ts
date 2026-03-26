// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/icon',
    '@nuxtjs/seo',
  ],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  site: {
    url: 'https://jmliu6.com',
    name: 'Turing',
    description: 'AI 技术实践者的知识库与工具箱',
    defaultLocale: 'zh-CN',
  },

  content: {
    // Nuxt Content v3 uses default content/ directory
    experimental: {
      sqliteConnector: 'native',
    },
  },

  ogImage: {
    enabled: false,
  },

  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/rss.xml'],
    },
  },

  css: ['./app/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'Turing RSS', href: '/rss.xml' },
      ],
    },
  },
})
