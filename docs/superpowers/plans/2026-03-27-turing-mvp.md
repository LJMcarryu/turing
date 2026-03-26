# Turing MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Turing MVP — a static Nuxt 3 content site with Learn tutorials, Blog, Projects showcase, and Newsletter signup, using the Deep Tech dark visual style.

**Architecture:** Nuxt 3 with Nuxt Content v3 for file-based Markdown CMS, Tailwind CSS for styling with a custom dark theme, fully SSG for zero-cost static deployment. Content lives in `content/` as Markdown files with structured frontmatter. No database, no auth, no backend.

**Tech Stack:** Nuxt 3, Nuxt Content v3, Tailwind CSS, Nuxt Icon (Iconify), Nuxt SEO, Vercel/Cloudflare Pages

---

## File Map

### Config & Root Files
- `nuxt.config.ts` — Nuxt configuration, module registration, SSG preset, site metadata
- `tailwind.config.ts` — Custom Deep Tech color palette, typography
- `app/app.config.ts` — App-level config (site name, social links, navigation)
- `package.json` — Dependencies and scripts

### Layout & Shared Components
- `app/layouts/default.vue` — Default layout: AppHeader + slot + AppFooter
- `app/components/AppHeader.vue` — Top navigation bar with logo, links, Subscribe CTA
- `app/components/AppFooter.vue` — Footer with links, social icons, copyright
- `app/components/HeroSection.vue` — Homepage hero banner with gradient, slogan, dual CTA
- `app/components/ContentCard.vue` — Reusable card for Learn/Blog/Project items
- `app/components/CategoryFilter.vue` — Filter pills for Learn categories and levels
- `app/components/NewsletterForm.vue` — Email input + submit button, reusable across pages
- `app/components/LevelBadge.vue` — Small badge showing beginner/intermediate/advanced

### Pages
- `app/pages/index.vue` — Homepage: Hero + Featured Learn + Featured Projects + Latest Blog
- `app/pages/learn/index.vue` — Learn hub: category grid + all tutorials with filtering
- `app/pages/learn/[category]/index.vue` — Category tutorials list with level filter
- `app/pages/learn/[category]/[slug].vue` — Tutorial detail page with Markdown rendering
- `app/pages/blog/index.vue` — Blog list page, reverse chronological
- `app/pages/blog/[slug].vue` — Blog post detail page
- `app/pages/projects/index.vue` — Project cards grid
- `app/pages/about.vue` — About page rendered from content
- `app/pages/newsletter.vue` — Newsletter landing page

### Content (Markdown)
- `content/learn/claude-code/_dir.yml` — Category metadata
- `content/learn/claude-code/01.getting-started.md` — Sample tutorial
- `content/learn/prompt-engineering/_dir.yml` — Category metadata
- `content/learn/prompt-engineering/01.basics.md` — Sample tutorial
- `content/blog/2026-03-welcome.md` — Sample blog post
- `content/projects/turing-website.md` — Sample project entry

### Static Assets
- `public/images/` — Image directory
- `public/favicon.ico` — Favicon

---

## Task 1: Project Scaffolding & Configuration

**Files:**
- Create: `package.json`, `nuxt.config.ts`, `tailwind.config.ts`, `app/app.config.ts`, `.gitignore`

- [ ] **Step 1: Initialize Nuxt 3 project**

Run:
```bash
cd C:/Users/Jimmy/Desktop/turing
npx nuxi@latest init . --force --packageManager npm
```

Expected: Nuxt 3 project scaffolded with `package.json`, `nuxt.config.ts`, etc.

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install
npm install -D @nuxt/content @nuxtjs/tailwindcss @nuxt/icon @nuxtjs/seo
```

Expected: All packages installed, `package-lock.json` updated.

- [ ] **Step 3: Configure nuxt.config.ts**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/seo',
  ],

  site: {
    url: 'https://jmliu6.com',
    name: 'Turing',
    description: 'AI 技术实践者的知识库与工具箱',
    defaultLocale: 'zh-CN',
  },

  content: {
    // Nuxt Content v3 uses default content/ directory
  },

  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/rss.xml'],
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      link: [
        { rel: 'icon', href: '/favicon.ico' },
      ],
    },
  },
})
```

- [ ] **Step 4: Configure Tailwind with Deep Tech theme**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0a0a0f',
          card: '#111118',
          border: '#1e293b',
          primary: '#4a9eff',
          accent: '#7c3aed',
          text: '#fafafa',
          muted: '#94a3b8',
          subtle: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
} satisfies Config
```

- [ ] **Step 5: Create app config**

```typescript
// app/app.config.ts
export default defineAppConfig({
  site: {
    name: 'Turing',
    slogan: 'AI 技术实践者的知识库与工具箱',
    author: 'Jimmy Liu',
  },
  nav: [
    { label: 'Learn', to: '/learn' },
    { label: 'Projects', to: '/projects' },
    { label: 'Blog', to: '/blog' },
    { label: 'About', to: '/about' },
  ],
  social: {
    github: 'https://github.com/jmliu6',
    // Add more social links as needed
  },
})
```

- [ ] **Step 6: Create global CSS**

```css
/* app/assets/css/main.css */
@import 'tailwindcss';

body {
  @apply bg-brand-bg text-brand-text;
}

/* Prose styling for markdown content */
.prose {
  @apply text-brand-muted;
}

.prose h1, .prose h2, .prose h3, .prose h4 {
  @apply text-brand-text;
}

.prose a {
  @apply text-brand-primary hover:underline;
}

.prose code {
  @apply bg-brand-card text-brand-primary px-1.5 py-0.5 rounded text-sm;
}

.prose pre {
  @apply bg-brand-card border border-brand-border rounded-lg;
}
```

Add to `nuxt.config.ts`:
```typescript
css: ['~/assets/css/main.css'],
```

- [ ] **Step 7: Verify dev server starts**

Run:
```bash
npm run dev
```

Expected: Dev server starts at `http://localhost:3000` without errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Nuxt 3 project with Tailwind, Content, SEO modules"
```

---

## Task 2: Layout, Header & Footer

**Files:**
- Create: `app/layouts/default.vue`, `app/components/AppHeader.vue`, `app/components/AppFooter.vue`

- [ ] **Step 1: Build AppHeader component**

```vue
<!-- app/components/AppHeader.vue -->
<script setup lang="ts">
const appConfig = useAppConfig()
const mobileMenuOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-brand-border bg-brand-bg/80 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="h-7 w-7 rounded-md bg-gradient-to-br from-brand-primary to-brand-accent" />
        <span class="text-lg font-bold tracking-tight">{{ appConfig.site.name }}</span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden items-center gap-6 md:flex">
        <NuxtLink
          v-for="item in appConfig.nav"
          :key="item.to"
          :to="item.to"
          class="text-sm text-brand-muted transition-colors hover:text-brand-text"
          active-class="text-brand-text"
        >
          {{ item.label }}
        </NuxtLink>
        <NuxtLink
          to="/newsletter"
          class="rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Subscribe
        </NuxtLink>
      </nav>

      <!-- Mobile Menu Button -->
      <button class="md:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
        <Icon :name="mobileMenuOpen ? 'lucide:x' : 'lucide:menu'" class="h-6 w-6" />
      </button>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="border-t border-brand-border px-4 pb-4 md:hidden">
      <nav class="flex flex-col gap-3 pt-3">
        <NuxtLink
          v-for="item in appConfig.nav"
          :key="item.to"
          :to="item.to"
          class="text-sm text-brand-muted hover:text-brand-text"
          @click="mobileMenuOpen = false"
        >
          {{ item.label }}
        </NuxtLink>
        <NuxtLink
          to="/newsletter"
          class="mt-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent px-4 py-2 text-center text-sm font-medium text-white"
          @click="mobileMenuOpen = false"
        >
          Subscribe
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
```

- [ ] **Step 2: Build AppFooter component**

```vue
<!-- app/components/AppFooter.vue -->
<script setup lang="ts">
const appConfig = useAppConfig()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-brand-border">
    <div class="mx-auto max-w-6xl px-4 py-12">
      <div class="flex flex-col items-center justify-between gap-6 md:flex-row">
        <!-- Brand -->
        <div>
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="h-6 w-6 rounded-md bg-gradient-to-br from-brand-primary to-brand-accent" />
            <span class="font-bold">{{ appConfig.site.name }}</span>
          </NuxtLink>
          <p class="mt-2 text-sm text-brand-subtle">{{ appConfig.site.slogan }}</p>
        </div>

        <!-- Links -->
        <nav class="flex gap-6">
          <NuxtLink
            v-for="item in appConfig.nav"
            :key="item.to"
            :to="item.to"
            class="text-sm text-brand-muted hover:text-brand-text"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Social -->
        <div class="flex gap-4">
          <a
            v-if="appConfig.social.github"
            :href="appConfig.social.github"
            target="_blank"
            rel="noopener"
            class="text-brand-subtle hover:text-brand-text"
          >
            <Icon name="lucide:github" class="h-5 w-5" />
          </a>
        </div>
      </div>

      <div class="mt-8 border-t border-brand-border pt-6 text-center text-sm text-brand-subtle">
        &copy; {{ year }} {{ appConfig.site.author }}. All rights reserved.
      </div>
    </div>
  </footer>
</template>
```

- [ ] **Step 3: Create default layout**

```vue
<!-- app/layouts/default.vue -->
<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
```

- [ ] **Step 4: Create minimal index page to verify layout**

```vue
<!-- app/pages/index.vue -->
<template>
  <div class="mx-auto max-w-6xl px-4 py-20 text-center">
    <h1 class="text-4xl font-bold">Turing</h1>
    <p class="mt-4 text-brand-muted">Coming soon...</p>
  </div>
</template>
```

- [ ] **Step 5: Verify in browser**

Run `npm run dev`, open `http://localhost:3000`.
Expected: Dark page with header (logo, nav links, Subscribe button), placeholder content, footer. Mobile responsive — hamburger menu on small screens.

- [ ] **Step 6: Commit**

```bash
git add app/layouts/default.vue app/components/AppHeader.vue app/components/AppFooter.vue app/pages/index.vue
git commit -m "feat: add default layout with AppHeader and AppFooter"
```

---

## Task 3: Shared Components

**Files:**
- Create: `app/components/ContentCard.vue`, `app/components/LevelBadge.vue`, `app/components/CategoryFilter.vue`, `app/components/NewsletterForm.vue`

- [ ] **Step 1: Build LevelBadge component**

```vue
<!-- app/components/LevelBadge.vue -->
<script setup lang="ts">
const props = defineProps<{
  level: 'beginner' | 'intermediate' | 'advanced'
}>()

const config = {
  beginner: { label: '入门', class: 'bg-green-500/10 text-green-400' },
  intermediate: { label: '进阶', class: 'bg-yellow-500/10 text-yellow-400' },
  advanced: { label: '专业', class: 'bg-red-500/10 text-red-400' },
}
</script>

<template>
  <span class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium" :class="config[level].class">
    {{ config[level].label }}
  </span>
</template>
```

- [ ] **Step 2: Build ContentCard component**

```vue
<!-- app/components/ContentCard.vue -->
<script setup lang="ts">
defineProps<{
  to: string
  label?: string
  title: string
  description?: string
  date?: string
  readingTime?: number
  level?: 'beginner' | 'intermediate' | 'advanced'
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="group block rounded-xl border border-brand-border bg-brand-card p-5 transition-colors hover:border-brand-primary/50"
  >
    <div class="mb-2 flex items-center gap-2">
      <span v-if="label" class="text-xs font-semibold uppercase tracking-wider text-brand-primary">
        {{ label }}
      </span>
      <LevelBadge v-if="level" :level="level" />
    </div>
    <h3 class="text-base font-semibold text-brand-text group-hover:text-brand-primary">
      {{ title }}
    </h3>
    <p v-if="description" class="mt-1.5 line-clamp-2 text-sm text-brand-subtle">
      {{ description }}
    </p>
    <div v-if="date || readingTime" class="mt-3 flex items-center gap-3 text-xs text-brand-subtle">
      <span v-if="date">{{ date }}</span>
      <span v-if="readingTime">{{ readingTime }} min</span>
    </div>
  </NuxtLink>
</template>
```

- [ ] **Step 3: Build CategoryFilter component**

```vue
<!-- app/components/CategoryFilter.vue -->
<script setup lang="ts">
const props = defineProps<{
  items: { label: string; value: string }[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="item in items"
      :key="item.value"
      class="rounded-full border px-3 py-1 text-sm transition-colors"
      :class="
        modelValue === item.value
          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
          : 'border-brand-border text-brand-muted hover:border-brand-primary/50 hover:text-brand-text'
      "
      @click="emit('update:modelValue', modelValue === item.value ? '' : item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
```

- [ ] **Step 4: Build NewsletterForm component**

```vue
<!-- app/components/NewsletterForm.vue -->
<script setup lang="ts">
const email = ref('')
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

async function subscribe() {
  if (!email.value) return
  status.value = 'loading'
  // TODO Phase 2: Connect to Buttondown/Resend API
  // For MVP, simulate success
  await new Promise((r) => setTimeout(r, 500))
  status.value = 'success'
  email.value = ''
}
</script>

<template>
  <form class="flex w-full max-w-md gap-2" @submit.prevent="subscribe">
    <input
      v-model="email"
      type="email"
      required
      placeholder="your@email.com"
      class="flex-1 rounded-lg border border-brand-border bg-brand-card px-4 py-2 text-sm text-brand-text placeholder-brand-subtle outline-none focus:border-brand-primary"
      :disabled="status === 'loading'"
    />
    <button
      type="submit"
      class="rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      :disabled="status === 'loading'"
    >
      {{ status === 'loading' ? '...' : status === 'success' ? '已订阅' : '订阅' }}
    </button>
  </form>
  <p v-if="status === 'success'" class="mt-2 text-sm text-green-400">
    感谢订阅！我们会将最新内容发送到你的邮箱。
  </p>
</template>
```

- [ ] **Step 5: Verify all components render**

Add temporary usage to `app/pages/index.vue`:
```vue
<template>
  <div class="mx-auto max-w-6xl space-y-8 px-4 py-20">
    <LevelBadge level="beginner" />
    <ContentCard to="#" label="LEARN" title="Test Card" description="A test description" level="intermediate" date="2026-03-27" :reading-time="10" />
    <CategoryFilter v-model="filter" :items="[{ label: 'All', value: '' }, { label: 'Claude Code', value: 'claude-code' }]" />
    <NewsletterForm />
  </div>
</template>

<script setup lang="ts">
const filter = ref('')
</script>
```

Run `npm run dev`, verify all components render correctly with dark theme styling.

- [ ] **Step 6: Commit**

```bash
git add app/components/ContentCard.vue app/components/LevelBadge.vue app/components/CategoryFilter.vue app/components/NewsletterForm.vue app/pages/index.vue
git commit -m "feat: add shared components — ContentCard, LevelBadge, CategoryFilter, NewsletterForm"
```

---

## Task 4: Homepage (Hero + Featured Content)

**Files:**
- Create: `app/components/HeroSection.vue`
- Modify: `app/pages/index.vue`

- [ ] **Step 1: Build HeroSection component**

```vue
<!-- app/components/HeroSection.vue -->
<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- Gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]" />
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(74,158,255,0.15),transparent_50%)]" />

    <div class="relative mx-auto max-w-6xl px-4 py-24 text-center md:py-32">
      <h1 class="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
        {{ appConfig.site.name }}
      </h1>
      <p class="mx-auto mt-4 max-w-xl text-lg text-brand-muted md:text-xl">
        {{ appConfig.site.slogan }}
      </p>
      <div class="mt-8 flex items-center justify-center gap-4">
        <NuxtLink
          to="/learn"
          class="rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
        >
          开始学习
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="rounded-lg border border-brand-border px-6 py-2.5 font-medium text-brand-muted transition-colors hover:border-brand-primary/50 hover:text-brand-text"
        >
          浏览项目
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 2: Build the full homepage**

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
useSeoMeta({
  title: 'Turing — AI 技术实践者的知识库与工具箱',
  description: '探索 AI 技术前沿，分享实践经验，构建开源工具。',
})

const { data: featuredLearn } = await useAsyncData('featured-learn', () =>
  queryCollection('learn').where('featured', '=', true).limit(3).all()
)

const { data: latestBlog } = await useAsyncData('latest-blog', () =>
  queryCollection('blog').order('date', 'DESC').limit(3).all()
)

const { data: projects } = await useAsyncData('projects', () =>
  queryCollection('projects').limit(3).all()
)
</script>

<template>
  <div>
    <HeroSection />

    <div class="mx-auto max-w-6xl px-4 py-16">
      <!-- Featured Learn -->
      <section v-if="featuredLearn?.length" class="mb-16">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold">AI 编程实践</h2>
          <NuxtLink to="/learn" class="text-sm text-brand-primary hover:underline">
            查看全部 →
          </NuxtLink>
        </div>
        <div class="grid gap-4 md:grid-columns-3">
          <ContentCard
            v-for="article in featuredLearn"
            :key="article.path"
            :to="article.path"
            label="LEARN"
            :title="article.title"
            :description="article.description"
            :level="article.level"
            :reading-time="article.readingTime"
          />
        </div>
      </section>

      <!-- Projects -->
      <section v-if="projects?.length" class="mb-16">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold">开源项目</h2>
          <NuxtLink to="/projects" class="text-sm text-brand-primary hover:underline">
            查看全部 →
          </NuxtLink>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <ContentCard
            v-for="project in projects"
            :key="project.path"
            :to="project.github || project.path"
            label="PROJECT"
            :title="project.title"
            :description="project.description"
          />
        </div>
      </section>

      <!-- Latest Blog -->
      <section v-if="latestBlog?.length" class="mb-16">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold">最新洞察</h2>
          <NuxtLink to="/blog" class="text-sm text-brand-primary hover:underline">
            查看全部 →
          </NuxtLink>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <ContentCard
            v-for="post in latestBlog"
            :key="post.path"
            :to="post.path"
            label="BLOG"
            :title="post.title"
            :description="post.description"
            :date="post.date"
            :reading-time="post.readingTime"
          />
        </div>
      </section>

      <!-- Newsletter -->
      <section class="rounded-xl border border-brand-border bg-brand-card p-8 text-center">
        <h2 class="text-xl font-bold">订阅 Turing Newsletter</h2>
        <p class="mt-2 text-sm text-brand-muted">获取最新的 AI 技术实践文章和开源项目更新</p>
        <div class="mt-6 flex justify-center">
          <NewsletterForm />
        </div>
      </section>
    </div>
  </div>
</template>
```

- [ ] **Step 3: Verify homepage renders**

Run `npm run dev`. Expected: Hero with gradient + placeholder sections (empty until content is added in Task 5). Newsletter form visible at bottom.

- [ ] **Step 4: Commit**

```bash
git add app/components/HeroSection.vue app/pages/index.vue
git commit -m "feat: build homepage with hero, featured sections, and newsletter"
```

---

## Task 5: Content Scaffold & Nuxt Content Collections

**Files:**
- Create: `content/learn/claude-code/_dir.yml`, `content/learn/claude-code/01.getting-started.md`, `content/learn/prompt-engineering/_dir.yml`, `content/learn/prompt-engineering/01.basics.md`, `content/blog/2026-03-welcome.md`, `content/projects/turing-website.md`, `content.config.ts`

- [ ] **Step 1: Define content collections**

```typescript
// content.config.ts
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    learn: defineCollection({
      type: 'page',
      source: 'learn/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        category: z.string(),
        tags: z.array(z.string()).default([]),
        level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
        date: z.string(),
        updated: z.string().optional(),
        readingTime: z.number().default(10),
        featured: z.boolean().default(false),
        cover: z.string().optional(),
        premium: z.boolean().default(false),
      }),
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()).default([]),
        date: z.string(),
        updated: z.string().optional(),
        readingTime: z.number().default(5),
        featured: z.boolean().default(false),
        cover: z.string().optional(),
      }),
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        github: z.string().optional(),
        tags: z.array(z.string()).default([]),
        status: z.enum(['active', 'archived', 'wip']).default('active'),
      }),
    }),
  },
})
```

- [ ] **Step 2: Create Learn category metadata**

```yaml
# content/learn/claude-code/_dir.yml
title: Claude Code
description: Claude Code 使用技巧与实战指南
icon: lucide:terminal
```

```yaml
# content/learn/prompt-engineering/_dir.yml
title: Prompt Engineering
description: 提示词工程方法论与最佳实践
icon: lucide:message-square
```

- [ ] **Step 3: Create sample Learn tutorial**

```markdown
---
title: "Claude Code 入门指南"
description: "从安装到第一个项目，快速上手 Claude Code AI 编程助手"
category: claude-code
tags: [claude-code, ai-coding, getting-started]
level: beginner
date: "2026-03-27"
readingTime: 15
featured: true
premium: false
---

# Claude Code 入门指南

Claude Code 是 Anthropic 推出的 CLI AI 编程助手，可以直接在终端中与 Claude 协作完成开发任务。

## 安装

Claude Code 可以通过 npm 全局安装：

```bash
npm install -g @anthropic-ai/claude-code
```

## 基本用法

在项目目录中直接运行 `claude` 即可启动交互式会话：

```bash
cd your-project
claude
```

## 核心优势

- **理解上下文**：Claude Code 会自动读取项目文件，理解代码结构
- **多工具协作**：支持文件编辑、终端命令、搜索等多种工具
- **对话式开发**：用自然语言描述需求，Claude 帮你实现

## 下一步

在下一篇教程中，我们将深入探讨 Claude Code 的高级用法，包括自定义配置、Hook 系统和 MCP 集成。
```

- [ ] **Step 4: Create sample Prompt Engineering tutorial**

```markdown
---
title: "Prompt Engineering 基础"
description: "掌握与大语言模型高效对话的核心技巧"
category: prompt-engineering
tags: [prompt-engineering, llm, basics]
level: beginner
date: "2026-03-25"
readingTime: 12
featured: true
premium: false
---

# Prompt Engineering 基础

Prompt Engineering 是与大语言模型（LLM）高效交互的关键技能。好的 prompt 可以让 AI 的输出质量产生质的飞跃。

## 核心原则

### 1. 明确具体

模糊的指令会得到模糊的结果。告诉 AI 你想要什么格式、什么风格、多长的内容。

### 2. 提供上下文

AI 不知道你的背景。提供足够的上下文信息，帮助它理解你的需求。

### 3. 分步拆解

复杂任务拆分成小步骤，每一步都清晰明确。

## 实用模板

```
你是一个 [角色]。
我需要你帮我 [任务]。
请按照以下格式输出：[格式要求]。
注意：[约束条件]。
```

## 总结

Prompt Engineering 不是玄学，而是一套可以学习和练习的技能。掌握这些基础原则后，你将能更高效地使用各种 AI 工具。
```

- [ ] **Step 5: Create sample blog post**

```markdown
---
title: "欢迎来到 Turing"
description: "Turing 是什么，为什么创建它，以及未来的方向"
tags: [announcement, turing]
date: "2026-03-27"
readingTime: 5
featured: true
---

# 欢迎来到 Turing

你好，我是 Jimmy Liu。Turing 是我创建的 AI 技术个人品牌，专注于 AI 编程工具实践、应用开发技术和开源项目。

## 为什么叫 Turing？

Alan Turing 是计算机科学和人工智能的奠基人之一。用他的名字命名这个项目，是对 AI 先驱的致敬，也代表了我对 AI 技术的热情。

## 你能在这里找到什么？

- **Learn**: 结构化的 AI 技术教程，从入门到专业
- **Projects**: 我的开源项目和工具
- **Blog**: AI 行业洞察和个人实践分享

## 接下来

我会持续发布高质量的 AI 技术内容。如果你也对 AI 技术感兴趣，欢迎订阅 Newsletter，第一时间获取更新。
```

- [ ] **Step 6: Create sample project entry**

```markdown
---
title: "Turing Website"
description: "你正在看的这个网站 — 基于 Nuxt 3 + Nuxt Content 构建的 AI 技术个人品牌站点"
github: "https://github.com/jmliu6/turing"
tags: [nuxt, vue, tailwind]
status: active
---

# Turing Website

Turing 的官方网站，使用现代 Web 技术栈构建。

## 技术栈

- **Nuxt 3** — Vue.js 全栈框架
- **Nuxt Content v3** — 文件驱动的 CMS
- **Tailwind CSS** — 原子化 CSS 框架
- **Vercel** — 静态部署

## 特性

- 全站 SSG，极致性能
- 暗色 Deep Tech 视觉风格
- 响应式设计
- SEO 优化
```

- [ ] **Step 7: Verify content loads**

Run `npm run dev`, open `http://localhost:3000`. Homepage should now show featured Learn articles, the project, and the blog post in the three content sections.

- [ ] **Step 8: Commit**

```bash
git add content/ content.config.ts
git commit -m "feat: add content collections config and sample content"
```

---

## Task 6: Learn Pages (Hub + Category + Detail)

**Files:**
- Create: `app/pages/learn/index.vue`, `app/pages/learn/[category]/index.vue`, `app/pages/learn/[category]/[slug].vue`

- [ ] **Step 1: Build Learn hub page**

```vue
<!-- app/pages/learn/index.vue -->
<script setup lang="ts">
useSeoMeta({
  title: 'Learn — Turing',
  description: 'AI 技术教程中心：Claude Code、Prompt Engineering、Agent 开发等',
})

const levelFilter = ref('')

const { data: articles } = await useAsyncData('learn-all', () =>
  queryCollection('learn').order('date', 'DESC').all()
)

const categories = [
  { label: 'Claude Code', value: 'claude-code', icon: 'lucide:terminal' },
  { label: 'Prompt Engineering', value: 'prompt-engineering', icon: 'lucide:message-square' },
  { label: 'Agent 开发', value: 'agent-development', icon: 'lucide:bot' },
  { label: 'MCP 协议', value: 'mcp', icon: 'lucide:plug' },
]

const levels = [
  { label: '入门', value: 'beginner' },
  { label: '进阶', value: 'intermediate' },
  { label: '专业', value: 'advanced' },
]

const filteredArticles = computed(() => {
  if (!articles.value) return []
  if (!levelFilter.value) return articles.value
  return articles.value.filter((a) => a.level === levelFilter.value)
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-12">
    <h1 class="text-3xl font-bold">Learn</h1>
    <p class="mt-2 text-brand-muted">从入门到专业，系统学习 AI 技术</p>

    <!-- Category Grid -->
    <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <NuxtLink
        v-for="cat in categories"
        :key="cat.value"
        :to="`/learn/${cat.value}`"
        class="group rounded-xl border border-brand-border bg-brand-card p-5 transition-colors hover:border-brand-primary/50"
      >
        <Icon :name="cat.icon" class="mb-3 h-8 w-8 text-brand-primary" />
        <h3 class="font-semibold group-hover:text-brand-primary">{{ cat.label }}</h3>
      </NuxtLink>
    </div>

    <!-- All Articles -->
    <section class="mt-12">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-bold">全部教程</h2>
        <CategoryFilter v-model="levelFilter" :items="levels" />
      </div>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ContentCard
          v-for="article in filteredArticles"
          :key="article.path"
          :to="article.path"
          :label="article.category"
          :title="article.title"
          :description="article.description"
          :level="article.level"
          :reading-time="article.readingTime"
        />
      </div>
      <p v-if="filteredArticles.length === 0" class="py-12 text-center text-brand-subtle">
        暂无此级别的教程
      </p>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Build category listing page**

```vue
<!-- app/pages/learn/[category]/index.vue -->
<script setup lang="ts">
const route = useRoute()
const category = route.params.category as string

const categoryNames: Record<string, string> = {
  'claude-code': 'Claude Code',
  'prompt-engineering': 'Prompt Engineering',
  'agent-development': 'Agent 开发',
  'mcp': 'MCP 协议',
}

const categoryName = categoryNames[category] || category

useSeoMeta({
  title: `${categoryName} — Learn — Turing`,
  description: `${categoryName} 相关教程和实践指南`,
})

const levelFilter = ref('')

const { data: articles } = await useAsyncData(`learn-${category}`, () =>
  queryCollection('learn').where('category', '=', category).order('date', 'DESC').all()
)

const levels = [
  { label: '入门', value: 'beginner' },
  { label: '进阶', value: 'intermediate' },
  { label: '专业', value: 'advanced' },
]

const filteredArticles = computed(() => {
  if (!articles.value) return []
  if (!levelFilter.value) return articles.value
  return articles.value.filter((a) => a.level === levelFilter.value)
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-12">
    <NuxtLink to="/learn" class="text-sm text-brand-primary hover:underline">
      ← 返回 Learn
    </NuxtLink>
    <h1 class="mt-4 text-3xl font-bold">{{ categoryName }}</h1>

    <div class="mt-6">
      <CategoryFilter v-model="levelFilter" :items="levels" />
    </div>

    <div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ContentCard
        v-for="article in filteredArticles"
        :key="article.path"
        :to="article.path"
        :title="article.title"
        :description="article.description"
        :level="article.level"
        :reading-time="article.readingTime"
      />
    </div>
    <p v-if="filteredArticles.length === 0" class="py-12 text-center text-brand-subtle">
      暂无教程
    </p>
  </div>
</template>
```

- [ ] **Step 3: Build tutorial detail page**

```vue
<!-- app/pages/learn/[category]/[slug].vue -->
<script setup lang="ts">
const route = useRoute()
const { data: article } = await useAsyncData(route.path, () =>
  queryCollection('learn').path(route.path).first()
)

if (!article.value) {
  throw createError({ statusCode: 404, message: '教程未找到' })
}

useSeoMeta({
  title: `${article.value.title} — Turing`,
  description: article.value.description,
})
</script>

<template>
  <article v-if="article" class="mx-auto max-w-3xl px-4 py-12">
    <NuxtLink :to="`/learn/${article.category}`" class="text-sm text-brand-primary hover:underline">
      ← {{ article.category }}
    </NuxtLink>

    <header class="mt-4">
      <div class="flex items-center gap-3">
        <LevelBadge :level="article.level" />
        <span class="text-sm text-brand-subtle">{{ article.readingTime }} min</span>
        <span class="text-sm text-brand-subtle">{{ article.date }}</span>
      </div>
      <h1 class="mt-3 text-3xl font-bold leading-tight">{{ article.title }}</h1>
      <p class="mt-2 text-lg text-brand-muted">{{ article.description }}</p>
    </header>

    <div class="prose mt-8 max-w-none">
      <ContentRenderer :value="article" />
    </div>
  </article>
</template>
```

- [ ] **Step 4: Verify Learn pages**

Run `npm run dev`:
- `http://localhost:3000/learn` — should show category grid + article list
- `http://localhost:3000/learn/claude-code` — should show Claude Code articles
- `http://localhost:3000/learn/claude-code/01.getting-started` — should render full tutorial

- [ ] **Step 5: Commit**

```bash
git add app/pages/learn/
git commit -m "feat: add Learn pages — hub, category listing, and tutorial detail"
```

---

## Task 7: Blog Pages (List + Detail)

**Files:**
- Create: `app/pages/blog/index.vue`, `app/pages/blog/[slug].vue`

- [ ] **Step 1: Build blog list page**

```vue
<!-- app/pages/blog/index.vue -->
<script setup lang="ts">
useSeoMeta({
  title: 'Blog — Turing',
  description: 'AI 行业洞察、实践分享和技术思考',
})

const { data: posts } = await useAsyncData('blog-all', () =>
  queryCollection('blog').order('date', 'DESC').all()
)
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-12">
    <h1 class="text-3xl font-bold">Blog</h1>
    <p class="mt-2 text-brand-muted">AI 行业洞察与实践分享</p>

    <div class="mt-8 space-y-6">
      <NuxtLink
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        class="group block border-b border-brand-border pb-6"
      >
        <h2 class="text-xl font-semibold group-hover:text-brand-primary">
          {{ post.title }}
        </h2>
        <p class="mt-1.5 text-brand-muted">{{ post.description }}</p>
        <div class="mt-2 flex items-center gap-3 text-sm text-brand-subtle">
          <span>{{ post.date }}</span>
          <span v-if="post.readingTime">{{ post.readingTime }} min</span>
        </div>
      </NuxtLink>
    </div>

    <p v-if="!posts?.length" class="py-12 text-center text-brand-subtle">
      暂无文章
    </p>
  </div>
</template>
```

- [ ] **Step 2: Build blog detail page**

```vue
<!-- app/pages/blog/[slug].vue -->
<script setup lang="ts">
const route = useRoute()
const { data: post } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)

if (!post.value) {
  throw createError({ statusCode: 404, message: '文章未找到' })
}

useSeoMeta({
  title: `${post.value.title} — Turing`,
  description: post.value.description,
})
</script>

<template>
  <article v-if="post" class="mx-auto max-w-3xl px-4 py-12">
    <NuxtLink to="/blog" class="text-sm text-brand-primary hover:underline">
      ← 返回 Blog
    </NuxtLink>

    <header class="mt-4">
      <h1 class="text-3xl font-bold leading-tight">{{ post.title }}</h1>
      <p class="mt-2 text-lg text-brand-muted">{{ post.description }}</p>
      <div class="mt-3 flex items-center gap-3 text-sm text-brand-subtle">
        <span>{{ post.date }}</span>
        <span v-if="post.readingTime">{{ post.readingTime }} min</span>
      </div>
    </header>

    <div class="prose mt-8 max-w-none">
      <ContentRenderer :value="post" />
    </div>
  </article>
</template>
```

- [ ] **Step 3: Verify blog pages**

Run `npm run dev`:
- `http://localhost:3000/blog` — shows blog list with the welcome post
- `http://localhost:3000/blog/2026-03-welcome` — renders the full blog post

- [ ] **Step 4: Commit**

```bash
git add app/pages/blog/
git commit -m "feat: add Blog pages — list and detail views"
```

---

## Task 8: Projects & Static Pages (About, Newsletter)

**Files:**
- Create: `app/pages/projects/index.vue`, `app/pages/about.vue`, `app/pages/newsletter.vue`

- [ ] **Step 1: Build projects page**

```vue
<!-- app/pages/projects/index.vue -->
<script setup lang="ts">
useSeoMeta({
  title: 'Projects — Turing',
  description: '开源项目与工具',
})

const { data: projects } = await useAsyncData('projects-all', () =>
  queryCollection('projects').all()
)
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-12">
    <h1 class="text-3xl font-bold">Projects</h1>
    <p class="mt-2 text-brand-muted">开源项目与工具</p>

    <div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="project in projects"
        :key="project.path"
        class="rounded-xl border border-brand-border bg-brand-card p-6"
      >
        <div class="mb-2 flex items-center gap-2">
          <span
            class="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
            :class="{
              'bg-green-500/10 text-green-400': project.status === 'active',
              'bg-yellow-500/10 text-yellow-400': project.status === 'wip',
              'bg-gray-500/10 text-gray-400': project.status === 'archived',
            }"
          >
            {{ project.status }}
          </span>
        </div>
        <h3 class="text-lg font-semibold">{{ project.title }}</h3>
        <p class="mt-1.5 text-sm text-brand-muted">{{ project.description }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="rounded-full border border-brand-border px-2 py-0.5 text-xs text-brand-subtle"
          >
            {{ tag }}
          </span>
        </div>
        <a
          v-if="project.github"
          :href="project.github"
          target="_blank"
          rel="noopener"
          class="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-primary hover:underline"
        >
          <Icon name="lucide:github" class="h-4 w-4" />
          GitHub
        </a>
      </div>
    </div>

    <p v-if="!projects?.length" class="py-12 text-center text-brand-subtle">
      暂无项目
    </p>
  </div>
</template>
```

- [ ] **Step 2: Build about page**

```vue
<!-- app/pages/about.vue -->
<script setup lang="ts">
const appConfig = useAppConfig()

useSeoMeta({
  title: 'About — Turing',
  description: '关于 Turing 和 Jimmy Liu',
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-12">
    <h1 class="text-3xl font-bold">About</h1>

    <div class="mt-8 space-y-6 text-brand-muted">
      <p>
        你好，我是 <strong class="text-brand-text">Jimmy Liu</strong>，Turing 的创建者。
      </p>

      <p>
        <strong class="text-brand-text">Turing</strong> 是一个聚焦 AI 技术实践的个人品牌。
        我相信 AI 正在重塑软件开发的方式，而掌握 AI 工具将成为每个开发者的核心竞争力。
      </p>

      <p>
        在这里，你可以找到：
      </p>

      <ul class="list-inside list-disc space-y-2">
        <li><strong class="text-brand-text">Learn</strong> — 从入门到专业的 AI 技术教程</li>
        <li><strong class="text-brand-text">Projects</strong> — 我的开源项目和工具</li>
        <li><strong class="text-brand-text">Blog</strong> — AI 行业洞察和实践分享</li>
      </ul>

      <p>
        如果你也对 AI 技术感兴趣，欢迎
        <NuxtLink to="/newsletter" class="text-brand-primary hover:underline">订阅 Newsletter</NuxtLink>
        获取最新更新。
      </p>
    </div>

    <!-- Contact -->
    <div class="mt-12 rounded-xl border border-brand-border bg-brand-card p-6">
      <h2 class="text-lg font-semibold">联系方式</h2>
      <div class="mt-4 space-y-2 text-sm text-brand-muted">
        <a
          v-if="appConfig.social.github"
          :href="appConfig.social.github"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-2 hover:text-brand-text"
        >
          <Icon name="lucide:github" class="h-4 w-4" />
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 3: Build newsletter page**

```vue
<!-- app/pages/newsletter.vue -->
<script setup lang="ts">
useSeoMeta({
  title: 'Newsletter — Turing',
  description: '订阅 Turing Newsletter，获取最新 AI 技术实践文章和开源项目更新',
})
</script>

<template>
  <div class="mx-auto max-w-xl px-4 py-20 text-center">
    <h1 class="text-3xl font-bold">订阅 Newsletter</h1>
    <p class="mt-4 text-brand-muted">
      每周精选 AI 技术实践文章、开源项目更新和行业洞察，直达你的收件箱。
    </p>

    <div class="mt-8 flex justify-center">
      <NewsletterForm />
    </div>

    <div class="mt-12 text-left">
      <h2 class="text-lg font-semibold">你会收到什么？</h2>
      <ul class="mt-4 space-y-3 text-sm text-brand-muted">
        <li class="flex items-start gap-3">
          <Icon name="lucide:book-open" class="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
          最新 AI 编程工具教程和实战指南
        </li>
        <li class="flex items-start gap-3">
          <Icon name="lucide:package" class="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
          开源项目发布和更新通知
        </li>
        <li class="flex items-start gap-3">
          <Icon name="lucide:trending-up" class="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
          AI 行业趋势解读和个人见解
        </li>
      </ul>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Verify all pages**

Run `npm run dev`:
- `http://localhost:3000/projects` — project cards with status badges and GitHub links
- `http://localhost:3000/about` — about page with contact info
- `http://localhost:3000/newsletter` — newsletter signup with benefits list

- [ ] **Step 5: Commit**

```bash
git add app/pages/projects/ app/pages/about.vue app/pages/newsletter.vue
git commit -m "feat: add Projects, About, and Newsletter pages"
```

---

## Task 9: SEO, RSS & Final Polish

**Files:**
- Modify: `nuxt.config.ts`
- Create: `server/routes/rss.xml.ts`

- [ ] **Step 1: Add RSS feed route**

```typescript
// server/routes/rss.xml.ts
import { defineEventHandler, setResponseHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Import content server utils
  const { queryCollection } = await import('#content/server')

  const learn = await queryCollection(event, 'learn').order('date', 'DESC').limit(20).all()
  const blog = await queryCollection(event, 'blog').order('date', 'DESC').limit(20).all()

  const allItems = [...learn, ...blog]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)

  const siteUrl = 'https://jmliu6.com'

  const rssItems = allItems
    .map(
      (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${siteUrl}${item.path}</link>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <guid>${siteUrl}${item.path}</guid>
    </item>`
    )
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Turing</title>
    <link>${siteUrl}</link>
    <description>AI 技术实践者的知识库与工具箱</description>
    <language>zh-CN</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`

  setResponseHeader(event, 'content-type', 'application/xml')
  return rss
})
```

- [ ] **Step 2: Add RSS link to head in nuxt.config.ts**

Add inside the `app.head` section of `nuxt.config.ts`:

```typescript
link: [
  { rel: 'icon', href: '/favicon.ico' },
  { rel: 'alternate', type: 'application/rss+xml', title: 'Turing RSS', href: '/rss.xml' },
],
```

- [ ] **Step 3: Create error page**

```vue
<!-- app/error.vue -->
<script setup lang="ts">
const props = defineProps<{
  error: { statusCode: number; message: string }
}>()
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-brand-bg px-4 text-center">
    <h1 class="text-6xl font-bold text-brand-primary">{{ error.statusCode }}</h1>
    <p class="mt-4 text-xl text-brand-muted">{{ error.message || '页面未找到' }}</p>
    <NuxtLink
      to="/"
      class="mt-8 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent px-6 py-2.5 font-medium text-white"
    >
      返回首页
    </NuxtLink>
  </div>
</template>
```

- [ ] **Step 4: Verify RSS and SEO**

Run `npm run dev`:
- `http://localhost:3000/rss.xml` — valid RSS XML with blog and learn items
- Check page source on any page — should have correct `<title>`, `<meta>` tags, Open Graph tags

- [ ] **Step 5: Commit**

```bash
git add server/routes/rss.xml.ts app/error.vue nuxt.config.ts
git commit -m "feat: add RSS feed, error page, and finalize SEO config"
```

---

## Task 10: Build Verification & SSG Test

**Files:** None new — verification only.

- [ ] **Step 1: Run static build**

```bash
npx nuxi generate
```

Expected: Static files generated in `.output/public/` without errors. All pages pre-rendered.

- [ ] **Step 2: Preview the built site**

```bash
npx serve .output/public
```

Expected: Full site accessible locally. Navigate through all pages:
- `/` — Homepage with hero and featured content
- `/learn` — Category grid and article list
- `/learn/claude-code/01.getting-started` — Full tutorial rendering
- `/blog` — Blog list
- `/blog/2026-03-welcome` — Blog post
- `/projects` — Project cards
- `/about` — About page
- `/newsletter` — Newsletter signup
- `/rss.xml` — RSS feed

- [ ] **Step 3: Verify responsive design**

Check all pages at mobile width (375px), tablet (768px), and desktop (1280px). Verify:
- Header collapses to hamburger menu on mobile
- Content cards stack on mobile, grid on desktop
- Text is readable at all sizes

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: verify SSG build and responsive design"
```
