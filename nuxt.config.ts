// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  srcDir: 'app/',

  modules: [
    '@nuxt/content',
    '@nuxt/icon',
    '@nuxtjs/seo',
    '@nuxtjs/i18n',
  ],

  i18n: {
    locales: [
      { code: 'zh-CN', iso: 'zh-CN', file: 'zh-CN.json', name: '中文' },
      { code: 'en-US', iso: 'en-US', file: 'en-US.json', name: 'English' },
    ],
    defaultLocale: 'zh-CN',
    lazy: true,
    langDir: 'locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: 'https://jmliu6.com',
      sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN || '',
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
      crawlLinks: true,
      routes: ['/sitemap.xml', '/rss.xml'],
    },
    routeRules: {
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        },
      },
    },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    build: {
      sourcemap: false,
    },
    server: {
      fs: {
        strict: false,
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'Turing RSS', href: '/rss.xml' },
      ],
    },
  },
})
