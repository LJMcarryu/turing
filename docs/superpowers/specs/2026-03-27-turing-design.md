# Turing — AI 技术个人 IP 网站设计文档

**日期**: 2026-03-27
**作者**: Jimmy Liu
**状态**: MVP Phase 1 设计

---

## 1. 项目概述

### 1.1 愿景

Turing 是一个综合型 AI 技术个人品牌网站，融合教学、行业洞察和开源工具三大方向，为从入门到专业的全层级用户提供价值。核心差异化在于"内容+工具结合"——不只是看，还能用。

### 1.2 品牌定位

- **名称**: Turing
- **Slogan**: AI 技术实践者的知识库与工具箱
- **受众**: 全栈覆盖（入门/进阶/专业）
- **差异化**: 内容+工具结合，亲身实践视角
- **现有资产**: jmliu6.com 博客（内容可迁入）

### 1.3 演进策略

采用混合渐进型路线：

- **Phase 1 (MVP)**: 内容站点 — 首页 + Learn教程 + Blog + 项目展示 + Newsletter
- **Phase 2**: 加入工具 — 全站搜索 + 付费内容 + 工具/模板下载
- **Phase 3**: 平台化 — Playground在线体验 + 社区互动

---

## 2. 站点架构（MVP Phase 1）

```
turing/
├── /                  — 首页（品牌展示 + 精选内容 + CTA）
├── /learn             — 教程中心
│   ├── /learn/:category       — 分类列表（如 claude-code）
│   └── /learn/:category/:slug — 教程详情
├── /blog              — 博客
│   └── /blog/:slug            — 博客文章
├── /projects          — 开源项目展示
├── /about             — 关于页（个人介绍、品牌故事）
└── /newsletter        — 邮件��阅落地页
```

**设计决策**:
- Learn 与 Blog 分离：Learn 是结构化教程（有分级、有顺序），Blog 是时间线驱动的随笔/洞察
- Newsletter 从第一天就做：邮件列表是最有价值的个人 IP 资产

---

## 3. 首页设计

**布局**: Hero + 内容流（方案A）

### 结构

1. **导航栏**: Turing Logo | Learn | Projects | Blog | About | Subscribe 按钮
2. **Hero Section**: 渐变深色背景，品牌名 + Slogan + 双 CTA（开始学习 / 浏览项目）
3. **精选内容三栏**: Learn（AI编程实践）| Projects（开源项目）| Blog（最新洞察）
4. **Newsletter 订阅**: 底部订阅栏
5. **Footer**: 链接 + 社交媒体 + 版权

---

## 4. 内容架构

### 4.1 目录结构

```
content/
├── learn/
│   ├── claude-code/
│   │   ├── _dir.yml
│   │   ├── 01.getting-started.md
│   │   └── 02.advanced-usage.md
│   ├── prompt-engineering/
│   ├── agent-development/
│   └── mcp/
├── blog/
│   ├── 2026-03-ai-toolbox.md
│   └── ...
├── projects/
│   ├── ai-workflow-kit.md
│   └── ...
└── pages/
    ├── about.md
    └── newsletter.md
```

### 4.2 Frontmatter 标准

```yaml
---
title: "文章标题"
description: "文章描述"
category: claude-code
tags: [claude-code, ai-coding, tutorial]
level: beginner | intermediate | advanced
date: 2026-03-20
updated: 2026-03-25
readingTime: 15
featured: true
cover: /images/learn/cover.jpg
premium: false
---
```

### 4.3 Learn 初始分类

| 分类 | Slug | 说明 |
|------|------|------|
| Claude Code | `claude-code` | Claude Code 使用技巧与实战 |
| Prompt Engineering | `prompt-engineering` | 提示词工程方法论 |
| Agent 开发 | `agent-development` | AI Agent 构建技术 |
| MCP 协议 | `mcp` | Model Context Protocol 相关 |

分类可随内容增长动态添加，无需改代码。

---

## 5. 技术架构

### 5.1 技术栈

| 层级 | 选择 | 理由 |
|------|------|------|
| 框架 | Nuxt 3 | Vue 生态，SSR/SSG 兼具 |
| 内容 | Nuxt Content v3 | 文件驱动 CMS，Markdown 原生支持 |
| 样式 | Tailwind CSS | 暗色主题，快速开发 |
| 图标 | Nuxt Icon (Iconify) | 按需加载 |
| SEO | Nuxt SEO 模块 | sitemap、meta、OG 一站式 |
| 部署 | Vercel 或 Cloudflare Pages | 免费额度大，全球 CDN |

### 5.2 渲染策略

全站 SSG（静态站点生成），部署为纯静态站点，零服务器成本。

### 5.3 项目结构

```
turing/
├── app/
│   ├── components/
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   ├── HeroSection.vue
│   │   ├── ContentCard.vue
│   │   ├── CategoryFilter.vue
│   │   └── NewsletterForm.vue
│   ├── layouts/
│   │   └── default.vue
│   └── pages/
│       ├── index.vue
│       ├── about.vue
│       ├── newsletter.vue
│       ├── blog/
│       │   ├── index.vue
│       │   └── [slug].vue
│       ├── learn/
│       │   ├── index.vue
│       │   └── [category]/
│       │       ├── index.vue
│       │       └── [slug].vue
│       └── projects/
│           └── index.vue
├── content/
├── public/
│   └── images/
├── nuxt.config.ts
├── tailwind.config.ts
└── package.json
```

### 5.4 Newsletter

MVP 阶段用轻量方案：表单收集邮箱，接第三方服务（Buttondown 或 Resend），不自建后端。

---

## 6. 视觉风格

**风格**: 深邃科技 (Deep Tech)

- **背景**: 深色 (#0a0a0f)
- **主色**: 蓝紫渐变 (#4a9eff → #7c3aed)
- **文字**: 白色/浅灰层级 (#fafafa / #94a3b8 / #64748b)
- **边框**: 深灰 (#1e293b)
- **卡片背景**: 深灰 (#111118)
- **风格参考**: Vercel / Linear
- **特征**: 沉稳专业，蓝紫渐变点缀，强调层次感

---

## 7. MVP 边界

### 做什么

| 模块 | 范围 |
|------|------|
| 首页 | Hero Banner + 精选内容三栏 + Newsletter 订阅入口 |
| Learn | 分类列表页 + 教程详情页，支持 level 筛选 |
| Blog | 时间线列表 + 文章详情页 |
| Projects | 项目卡片展示页（链接到 GitHub） |
| About | 个人介绍 + 品牌故事 |
| Newsletter | 邮箱收集表单（接第三方服务） |
| 通用 | 响应式设计、暗色主题、SEO、RSS |

### 不做什么

- 付费内容 / 支付系统
- 用户注册 / 登录
- 评论系统
- 搜索功能
- 在线 Playground / 工具
- 多语言 (i18n)
- CMS 后台

---

## 8. Phase 路线图

### Phase 2（MVP 上线后）

- 全站搜索（Nuxt Content 内置搜索或 Algolia）
- `premium: true` 文章的付费解锁（Stripe / Lemon Squeezy）
- 工具/模板下载区
- 评论或读者反馈机制

### Phase 3（远期）

- Playground 在线体验（Prompt 测试等）
- 社区互动功能
- 课程/系列教程体系

---

## 9. 成功标准（MVP 上线后 3 个月）

1. **内容量**: 至少 10 篇 Learn 教程 + 5 篇 Blog
2. **Newsletter**: 积累 100+ 订阅者
3. **流量**: 有自然搜索流量进入
4. **品牌**: "Turing" 在 AI 实践领域有初步认知
