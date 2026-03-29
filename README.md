# Turing

> AI 技术实践者的知识库与工具箱 | Knowledge Base & Toolbox for AI Practitioners

[![Nuxt](https://img.shields.io/badge/Nuxt-3.16-00DC82?logo=nuxt.js)](https://nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

一个基于 Nuxt 3 构建的现代化个人技术博客，专注于 AI 编程工具、提示工程和智能应用开发。

## ✨ 特性

- 🌍 **完整国际化** - 中英文双语支持，基于 @nuxtjs/i18n
- 📝 **内容驱动** - 使用 Nuxt Content v3 管理 Markdown 内容
- 🎨 **现代设计** - Tailwind CSS v4 + 自定义主题系统
- ⚡ **性能优化** - SSG 静态生成 + 图片懒加载
- 🔍 **SEO 友好** - 完整的 meta 标签 + Open Graph + RSS 订阅
- ♿ **无障碍** - 支持 prefers-reduced-motion + ARIA 标签
- 🛠️ **开发体验** - TypeScript + ESLint + Prettier + Husky

## 📦 技术栈

- **框架**: [Nuxt 3](https://nuxt.com) - Vue 3 全栈框架
- **内容**: [Nuxt Content](https://content.nuxt.com) - 基于文件的 CMS
- **样式**: [Tailwind CSS v4](https://tailwindcss.com) - 实用优先的 CSS 框架
- **国际化**: [@nuxtjs/i18n](https://i18n.nuxtjs.org) - Vue I18n 集成
- **SEO**: [@nuxtjs/seo](https://nuxtseo.com) - SEO 工具集
- **图标**: [@nuxt/icon](https://github.com/nuxt/icon) - 图标组件
- **代码质量**: ESLint + Prettier + Husky + lint-staged

## 🚀 快速开始

### 环境要求

- Node.js >= 18.x
- npm >= 9.x

### 安装

```bash
# 克隆仓库
git clone https://github.com/LJMcarryu/turing.git
cd turing

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器 (http://localhost:3000)
npm run dev

# 代码检查
npm run lint

# 代码格式化
npm run lint:fix

# 类型检查
npm run typecheck
```

### 构建

```bash
# 生产构建
npm run build

# 预览生产构建
npm run preview

# 静态站点生成
npm run generate
```

## 📁 项目结构

```
turing/
├── app/                      # 应用源码 (srcDir)
│   ├── assets/              # 静态资源
│   │   └── css/            # 全局样式
│   ├── components/          # Vue 组件
│   │   ├── AppHeader.vue   # 头部导航
│   │   ├── AppFooter.vue   # 页脚
│   │   ├── LevelBadge.vue  # 难度标签
│   │   └── NewsletterForm.vue # 订阅表单
│   ├── composables/         # 组合式函数
│   │   └── useFormatDate.ts # 日期格式化
│   ├── layouts/             # 布局组件
│   │   └── default.vue     # 默认布局
│   ├── pages/               # 页面路由
│   │   ├── index.vue       # 首页
│   │   ├── about.vue       # 关于页
│   │   ├── newsletter.vue  # 订阅页
│   │   ├── blog/           # 博客
│   │   ├── learn/          # 教程
│   │   └── projects/       # 项目
│   ├── app.config.ts        # 应用配置
│   ├── app.vue             # 根组件
│   └── error.vue           # 错误页面
├── content/                 # Markdown 内容
│   ├── blog/               # 博客文章
│   ├── learn/              # 教程文档
│   └── projects/           # 项目介绍
├── i18n/                    # 国际化
│   └── locales/            # 语言文件
│       ├── zh-CN.json      # 简体中文
│       └── en-US.json      # 英文
├── public/                  # 公共静态文件
├── server/                  # 服务端
│   └── routes/             # API 路由
│       └── rss.xml.ts      # RSS 订阅
├── .husky/                  # Git hooks
├── content.config.ts        # Content 配置
├── eslint.config.mjs        # ESLint 配置
├── nuxt.config.ts           # Nuxt 配置
├── package.json             # 依赖配置
└── tsconfig.json            # TypeScript 配置
```

## 📝 内容管理

### 添加博客文章

在 `content/blog/` 目录下创建 Markdown 文件：

```markdown
---
title: '文章标题'
description: '文章描述'
tags: [tag1, tag2]
date: '2026-03-29'
readingTime: 5
featured: false
cover: 'https://example.com/cover.jpg'
---

# 文章内容

正文内容...
```

### 添加教程

在 `content/learn/[category]/` 目录下创建 Markdown 文件：

```markdown
---
title: '教程标题'
description: '教程描述'
category: 'claude-code'
level: 'beginner'
tags: [tag1, tag2]
date: '2026-03-29'
readingTime: 10
featured: true
---

# 教程内容

正文内容...
```

### 多语言内容

为内容添加英文版本，使用 `.en-US.md` 后缀：

```
content/blog/
├── article.md           # 中文版
└── article.en-US.md     # 英文版
```

## 🌍 国际化

项目支持中英文双语：

- 默认语言：简体中文 (zh-CN)
- 备选语言：英文 (en-US)
- 语言切换：右上角语言切换按钮
- URL 策略：`prefix_except_default` (中文无前缀，英文 `/en-US/`)

### 添加翻译

编辑 `i18n/locales/zh-CN.json` 和 `i18n/locales/en-US.json`：

```json
{
  "nav": {
    "home": "首页",
    "blog": "博客"
  }
}
```

在组件中使用：

```vue
<template>
  <div>{{ t('nav.home') }}</div>
</template>

<script setup>
const { t } = useI18n()
</script>
```

## 🎨 主题定制

主题配置在 `app/assets/css/main.css`：

```css
@theme {
  --color-brand-primary: #00e5ff;
  --color-brand-accent: #ff6b6b;
  --font-display: 'Syne', system-ui, sans-serif;
  --font-body: 'Space Mono', monospace;
}
```

## 🔧 配置

### 站点信息

编辑 `nuxt.config.ts`：

```typescript
export default defineNuxtConfig({
  site: {
    url: 'https://your-domain.com',
    name: 'Your Site Name',
    description: 'Your site description',
  },
})
```

### 社交链接

编辑 `app/app.config.ts`：

```typescript
export default defineAppConfig({
  site: {
    name: 'Turing',
    author: 'Your Name',
  },
  social: {
    github: 'https://github.com/yourusername',
  },
})
```

## 📊 SEO

项目包含完整的 SEO 优化：

- ✅ Meta 标签 (title, description)
- ✅ Open Graph (og:title, og:image, og:type)
- ✅ Article 标签 (article:published_time, article:author)
- ✅ RSS 订阅 (/rss.xml)
- ✅ Sitemap (/sitemap.xml)
- ✅ 结构化数据 (待实现)

## 🚢 部署

### Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### Netlify

```bash
# 构建命令
npm run generate

# 发布目录
.output/public
```

### 静态托管

```bash
# 生成静态文件
npm run generate

# 部署 .output/public 目录到任意静态托管服务
```

## 🤝 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 提交前会自动运行 ESLint 和 Prettier
- 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范
- 确保所有测试通过

## 📄 许可证

[MIT License](LICENSE) © 2026 Jimmy Liu

## 🙏 致谢

- [Nuxt](https://nuxt.com) - 强大的 Vue 框架
- [Tailwind CSS](https://tailwindcss.com) - 实用优先的 CSS 框架
- [Nuxt Content](https://content.nuxt.com) - 基于文件的 CMS
- [Vue I18n](https://vue-i18n.intlify.dev) - 国际化解决方案

## 📮 联系方式

- GitHub: [@LJMcarryu](https://github.com/LJMcarryu)
- Website: [jmliu6.com](https://jmliu6.com)

---

Built with ❤️ using Nuxt 3
