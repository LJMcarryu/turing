# Turing 项目前端学习指南

> 面向移动端开发者的 Vue 3 / Nuxt 3 前端学习文档
> 基于本项目实际代码，对照移动端开发概念进行讲解

---

## 目录

1. [项目整体架构](#1-项目整体架构)
2. [核心概念对照表（移动端 vs 前端）](#2-核心概念对照表)
3. [Vue 3 核心语法](#3-vue-3-核心语法)
4. [Nuxt 3 框架机制](#4-nuxt-3-框架机制)
5. [路由系统](#5-路由系统)
6. [组件化开发](#6-组件化开发)
7. [状态管理与响应式](#7-状态管理与响应式)
8. [Composables（组合式函数）](#8-composables组合式函数)
9. [内容管理（Nuxt Content）](#9-内容管理nuxt-content)
10. [国际化 i18n](#10-国际化-i18n)
11. [样式系统（Tailwind CSS）](#11-样式系统tailwind-css)
12. [SEO 与元数据](#12-seo-与元数据)
13. [插件系统](#13-插件系统)
14. [数据获取](#14-数据获取)
15. [TypeScript 在 Vue 中的使用](#15-typescript-在-vue-中的使用)
16. [测试](#16-测试)
17. [工程化配置](#17-工程化配置)

---

## 1. 项目整体架构

### 目录结构

```
stockholm/
├── app/                    # 源代码目录（类似 iOS 的 Sources/、Android 的 src/main/）
│   ├── app.vue             # 根组件（类似 AppDelegate / Application）
│   ├── app.config.ts       # 应用配置（类似 Info.plist / AndroidManifest）
│   ├── error.vue           # 全局错误页面
│   ├── assets/css/         # 样式文件
│   ├── components/         # 可复用组件（类似自定义 View / Widget）
│   ├── composables/        # 组合式函数（类似 ViewModel / UseCase）
│   ├── layouts/            # 布局模板（类似 BaseActivity / 基类 ViewController）
│   ├── pages/              # 页面路由（类似各个 Activity / ViewController）
│   └── plugins/            # 插件（类似 Application.onCreate 中的初始化）
├── content/                # Markdown 内容（CMS 数据源）
├── i18n/                   # 国际化文件
├── server/                 # 服务端 API
├── public/                 # 静态资源（类似 Assets.xcassets / res/）
└── nuxt.config.ts          # 框架主配置
```

### 数据流概览

```
用户请求 → Nuxt 路由匹配 → Layout 包裹 → Page 渲染 → 组件树
                                                    ↓
                                            Composables（逻辑复用）
                                            Content（Markdown 数据）
                                            i18n（多语言文本）
```

---

## 2. 核心概念对照表

| 前端概念 | iOS (Swift/UIKit) | Android (Kotlin) | 本项目示例 |
|---------|-------------------|-------------------|-----------|
| **Vue 组件** | UIViewController / SwiftUI View | Activity / Fragment / Compose | `AppHeader.vue` |
| **模板 (template)** | Storyboard / SwiftUI body | XML Layout / Compose UI | `<template>...</template>` |
| **响应式数据 (ref)** | @Published / @State | LiveData / MutableState | `const email = ref('')` |
| **计算属性 (computed)** | 计算属性 get { } | Flow.map { } | `const allTags = computed(...)` |
| **watch** | didSet / onChange | observe / collectAsState | `watch(() => route.path, ...)` |
| **Props** | init 参数 / @Binding | Bundle arguments / 参数传递 | `defineProps<{ level: string }>()` |
| **Emit 事件** | Delegate / Closure 回调 | Interface 回调 / Flow | `emit('submit', data)` |
| **生命周期** | viewDidLoad / onAppear | onCreate / onResume | `onMounted`, `onUnmounted` |
| **路由 (Router)** | NavigationController / NavigationStack | NavController / Navigation | 文件系统路由 `pages/` |
| **Layout** | 基类 ViewController | BaseActivity | `layouts/default.vue` |
| **Composable** | Protocol Extension / ViewModel | UseCase / ViewModel | `useFormatDate()` |
| **Plugin** | AppDelegate 初始化 | Application.onCreate | `sentry.client.ts` |
| **Middleware** | 路由拦截器 | Interceptor | Nuxt middleware |
| **SSR/SSG** | 无直接对应 | 无直接对应 | 服务端渲染/静态生成 |

---

## 3. Vue 3 核心语法

### 3.1 单文件组件 (SFC) 结构

Vue 的 `.vue` 文件是"单文件组件"，将 **逻辑、模板、样式** 放在一个文件中。

**类比**：类似 SwiftUI 把 View 的 body（UI）和状态（@State）放在一个 struct 中。

```vue
<!-- 三段式结构 -->

<script setup lang="ts">
// 1. 逻辑部分（类似 ViewModel）
// 这里写 TypeScript/JavaScript 代码
const count = ref(0)
</script>

<template>
  <!-- 2. 模板部分（类似 XML Layout / SwiftUI body） -->
  <!-- 这里写 HTML + Vue 指令 -->
  <div>{{ count }}</div>
</template>

<style scoped>
/* 3. 样式部分（scoped 表示仅作用于当前组件） */
/* 本项目用 Tailwind CSS，所以很少写这里 */
</style>
```

### 3.2 `<script setup>` 语法

`<script setup>` 是 Vue 3 的语法糖，自动导出所有顶层变量给模板使用。

```vue
<script setup lang="ts">
// ✅ 所有顶层声明自动可在 template 中使用，无需 return
const { t } = useI18n()          // 国际化函数
const { formatDate } = useFormatDate()  // 日期格式化

// 响应式数据
const email = ref('')            // 类似 @State var email = ""
const status = ref<'idle' | 'loading' | 'success'>('idle')
</script>
```

### 3.3 模板语法

```vue
<template>
  <!-- 文本插值：{{ }} 双花括号 -->
  <h1>{{ t('home.hero.title') }}</h1>

  <!-- 属性绑定：v-bind 或简写 : -->
  <img :src="post.cover" :alt="post.title" />

  <!-- 条件渲染：v-if / v-else -->
  <div v-if="post.cover">有封面</div>
  <div v-else>无封面</div>

  <!-- 列表渲染：v-for（类似 ForEach / LazyColumn） -->
  <div v-for="post in posts" :key="post.path">
    {{ post.title }}
  </div>

  <!-- 事件绑定：v-on 或简写 @ -->
  <button @click="subscribe">{{ t('subscribe') }}</button>

  <!-- 表单双向绑定：v-model（类似 @Binding / two-way binding） -->
  <input v-model="email" type="email" />

  <!-- 动态 class 绑定 -->
  <button :class="[
    'base-class',
    isActive ? 'bg-blue-500' : 'bg-gray-500'
  ]">
    按钮
  </button>
</template>
```

### 3.4 响应式系统

Vue 3 的响应式是自动追踪依赖并更新 UI 的机制，类似 SwiftUI 的 `@State` / `@Published`。

```typescript
// ref() — 基础响应式引用
// 类似 @State var mobileMenuOpen = false
const mobileMenuOpen = ref(false)

// 读取/修改值要用 .value（模板中自动解包，不用写 .value）
mobileMenuOpen.value = true

// computed() — 计算属性，依赖变化时自动重算
// 类似 Swift 的计算属性 var filteredPosts: [Post] { ... }
const filteredPosts = computed(() => {
  if (!selectedTag.value) return posts.value
  return posts.value?.filter(post =>
    post.tags?.includes(selectedTag.value!)
  )
})

// watch() — 监听变化并执行副作用
// 类似 didSet { } 或 .onChange { }
watch(() => route.path, () => {
  mobileMenuOpen.value = false  // 路由变化时关闭菜单
})
```

**重点**：`ref` 在 `<script>` 中需要 `.value`，在 `<template>` 中自动解包。

---

## 4. Nuxt 3 框架机制

### 4.1 什么是 Nuxt？

Nuxt 之于 Vue，类似 **Next.js 之于 React**。它在 Vue 基础上提供：

| Nuxt 特性 | 作用 | 移动端类比 |
|-----------|------|-----------|
| 文件系统路由 | `pages/` 下的文件自动变成路由 | Storyboard 自动注册 VC |
| 自动导入 | 组件、composable 自动可用 | 无需 import |
| SSR/SSG | 服务端渲染/静态生成 | 无直接对应 |
| API 路由 | `server/` 下自动创建后端 API | 内嵌后端服务 |
| SEO 优化 | 自动管理 meta 标签 | 无直接对应 |

### 4.2 自动导入机制

Nuxt 最"神奇"的特性之一：**不需要写 import 语句**。

```typescript
// ❌ 普通 Vue 需要手动 import
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '~/components/AppHeader.vue'

// ✅ Nuxt 中自动导入，直接用！
const route = useRoute()
const count = ref(0)
// <AppHeader /> 组件也自动可用
```

自动导入的来源：
- **Vue API**：`ref`, `computed`, `watch`, `onMounted` 等
- **Nuxt API**：`useRoute`, `useAsyncData`, `useSeoMeta` 等
- **`components/` 目录**：所有 Vue 组件
- **`composables/` 目录**：所有 `use*` 函数
- **已注册模块**：如 `useI18n()`, `queryCollection()` 等

### 4.3 渲染模式

```
┌─────────────────────────────────────────────────┐
│                  渲染模式对比                      │
├─────────────┬───────────────────────────────────┤
│ CSR (客户端)  │ 浏览器下载 JS → 执行 → 渲染页面     │
│             │ 类似 App 下载后本地渲染               │
├─────────────┼───────────────────────────────────┤
│ SSR (服务端)  │ 服务器生成 HTML → 发送 → 浏览器激活   │
│             │ 类似服务端下发 UI 描述               │
├─────────────┼───────────────────────────────────┤
│ SSG (静态)   │ 构建时生成所有 HTML 文件             │
│             │ 类似预编译所有页面                    │
└─────────────┴───────────────────────────────────┘

本项目使用 SSG（npm run generate），适合博客/文档站。
```

---

## 5. 路由系统

### 5.1 文件系统路由

Nuxt 的路由基于 `pages/` 目录的文件结构自动生成，**不需要手动配置路由表**。

```
pages/
├── index.vue              → /               （首页）
├── about.vue              → /about          （关于页）
├── newsletter.vue         → /newsletter     （订阅页）
├── blog/
│   ├── index.vue          → /blog           （博客列表）
│   └── [slug].vue         → /blog/:slug     （博客详情，动态路由）
├── learn/
│   ├── index.vue          → /learn          （学习首页）
│   └── [category]/
│       ├── index.vue      → /learn/:category      （分类页）
│       └── [slug].vue     → /learn/:category/:slug（具体教程）
└── projects/
    ├── index.vue          → /projects       （项目列表）
    └── [slug].vue         → /projects/:slug （项目详情）
```

**类比**：
- iOS: 类似 SwiftUI 的 `NavigationStack` 自动根据 View 构建导航
- Android: 类似 Navigation Component 的 nav_graph，但用文件系统代替 XML

### 5.2 动态路由参数

`[slug].vue` 中的方括号 `[]` 表示**动态参数**，类似 RESTful URL 的 `:slug`。

```vue
<!-- pages/blog/[slug].vue -->
<script setup lang="ts">
const route = useRoute()
// route.params.slug 获取动态参数
// 访问 /blog/hello-world → route.params.slug = "hello-world"

const { data: post } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)
</script>
```

**类比**：类似 iOS deep link 的路径参数，或 Android Intent 的 extras。

### 5.3 NuxtLink 导航

```vue
<!-- 声明式导航（推荐） -->
<NuxtLink to="/blog">博客</NuxtLink>
<NuxtLink :to="post.path">{{ post.title }}</NuxtLink>

<!-- active-class：当前路由匹配时自动添加 class -->
<NuxtLink to="/blog" active-class="text-brand-primary">
  博客
</NuxtLink>
```

**类比**：
- iOS: `NavigationLink(destination:)` in SwiftUI
- Android: `NavController.navigate()`

---

## 6. 组件化开发

### 6.1 组件就是可复用的 UI 块

每个 `.vue` 文件就是一个组件。本项目的组件：

| 组件 | 用途 | 移动端类比 |
|------|------|-----------|
| `AppHeader.vue` | 顶部导航栏 | UINavigationBar / Toolbar |
| `AppFooter.vue` | 底部信息栏 | TabBar / BottomNavigationView |
| `LevelBadge.vue` | 难度标签 | 自定义 UILabel / Chip |
| `NewsletterForm.vue` | 邮件订阅表单 | 自定义 UIView / Custom View |

### 6.2 Props：父组件向子组件传数据

```vue
<!-- LevelBadge.vue —— 子组件 -->
<script setup lang="ts">
// defineProps 声明接收的属性（类似 init 参数）
const props = defineProps<{
  level: 'beginner' | 'intermediate' | 'advanced'
}>()

// 根据 level 值选择不同样式
const config = {
  beginner: { class: 'bg-green-500/10 text-green-400' },
  intermediate: { class: 'bg-yellow-500/10 text-yellow-400' },
  advanced: { class: 'bg-red-500/10 text-red-400' },
}
</script>

<template>
  <span :class="config[level].class">
    {{ t(`learn.levels.${level}`) }}
  </span>
</template>
```

```vue
<!-- 父组件使用 -->
<LevelBadge level="beginner" />
<LevelBadge :level="article.level" />  <!-- 动态绑定 -->
```

**类比**：
- iOS: `LevelBadge(level: .beginner)` 构造方法传参
- Android: `LevelBadge(level = Level.BEGINNER)` Compose 参数

### 6.3 状态管理示例：NewsletterForm

```vue
<script setup lang="ts">
const email = ref('')                                    // 输入框绑定值
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')  // 状态机

async function subscribe() {
  if (!email.value) return
  status.value = 'loading'           // 设为加载状态
  try {
    await new Promise((r) => setTimeout(r, 500))  // 模拟 API 调用
    status.value = 'success'         // 成功
    email.value = ''                 // 清空输入
  } catch {
    status.value = 'error'           // 失败
  }
}
</script>

<template>
  <form @submit.prevent="subscribe">   <!-- .prevent 阻止默认提交行为 -->
    <input v-model="email" type="email" :disabled="status === 'loading'" />
    <button type="submit" :disabled="status === 'loading'">
      <!-- 根据状态显示不同文本 -->
      {{ status === 'loading' ? '提交中...' : status === 'success' ? '已订阅' : '订阅' }}
    </button>
  </form>
  <!-- 条件渲染提示信息 -->
  <p v-if="status === 'success'" class="text-green-400">订阅成功!</p>
  <p v-if="status === 'error'" class="text-red-400">出错了</p>
</template>
```

**类比**：这就是一个完整的 MVVM 模式——
- `ref` 是 ViewModel 中的 state
- `subscribe()` 是 ViewModel 中的 action
- `<template>` 是 View，自动根据 state 更新

---

## 7. 状态管理与响应式

### 7.1 响应式核心 API

```typescript
// ========== ref() ==========
// 创建响应式变量，修改时 UI 自动更新
const count = ref(0)
count.value++  // → UI 自动更新

// ========== computed() ==========
// 派生状态，依赖变化时自动重新计算（有缓存）
const selectedTag = ref<string | null>(null)
const filteredPosts = computed(() => {
  if (!selectedTag.value) return posts.value
  return posts.value?.filter(post =>
    post.tags?.includes(selectedTag.value!)
  )
})
// 当 selectedTag 或 posts 变化时，filteredPosts 自动更新

// ========== watch() ==========
// 监听特定值的变化并执行副作用
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
```

### 7.2 移动端类比

```
Vue 3 响应式                     SwiftUI                    Jetpack Compose
─────────────────────────────────────────────────────────────────────────
ref(0)                          @State var x = 0           mutableStateOf(0)
computed(() => a + b)           var sum: Int { a + b }     derivedStateOf { a + b }
watch(source, callback)         .onChange(of: x) { }       LaunchedEffect(key) { }
v-model="email"                 $email (Binding)           value / onValueChange
```

---

## 8. Composables（组合式函数）

Composable 是 Vue 3 中**复用逻辑**的核心方式，类似移动端的 ViewModel 或 UseCase。

### 8.1 本项目示例：useFormatDate

```typescript
// composables/useFormatDate.ts
export function useFormatDate() {
  const { locale } = useI18n()          // 获取当前语言

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString(locale.value, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return { formatDate }                 // 返回可用的函数
}
```

```vue
<!-- 在任意组件中使用（Nuxt 自动导入） -->
<script setup>
const { formatDate } = useFormatDate()
</script>

<template>
  <span>{{ formatDate('2026-03-01') }}</span>
  <!-- 输出: "2026年3月1日" (中文) 或 "March 1, 2026" (英文) -->
</template>
```

### 8.2 Composable 的命名约定

- 文件名和函数名以 `use` 开头
- 放在 `composables/` 目录下
- Nuxt 自动导入，无需 import

**类比**：
- iOS: 类似自定义 `ObservableObject` / property wrapper
- Android: 类似 `UseCase` 或自定义 `@Composable` 函数

---

## 9. 内容管理（Nuxt Content）

### 9.1 概念

Nuxt Content 是一个**基于文件的 CMS**：用 Markdown 文件作为数据源，自动解析并提供查询 API。

```
content/
├── blog/
│   ├── 2026-03-welcome.md           # 中文文章
│   ├── 2026-03-welcome.en-US.md     # 英文版本
│   ├── claude-code-guide.md
│   └── ai-programming-future.md
├── learn/
│   ├── claude-code/
│   │   └── 01.getting-started.md
│   └── prompt-engineering/
│       └── 01.basics.md
└── projects/
    └── turing-website.md
```

### 9.2 内容集合定义（Schema）

```typescript
// content.config.ts
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',     // 匹配 content/blog/ 下所有 md 文件
      schema: z.object({          // Zod 验证：确保每篇文章都有这些字段
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()).default([]),
        date: z.string(),
        readingTime: z.number().default(5),
        featured: z.boolean().default(false),
        cover: z.string().optional(),
      }),
    }),
    // learn, projects 类似...
  },
})
```

**类比**：类似定义数据库表结构（CoreData Entity / Room Entity），Zod 做数据验证。

### 9.3 查询内容

```typescript
// 获取所有博客文章，按日期降序
const { data: posts } = await useAsyncData('blog-all', () =>
  queryCollection('blog').order('date', 'DESC').all()
)

// 获取单篇文章
const { data: post } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)

// 带条件查询
const { data: featuredLearn } = await useAsyncData('featured-learn', () =>
  queryCollection('learn').where('featured', '=', true).limit(3).all()
)
```

**类比**：类似 CoreData 的 NSFetchRequest 或 Room 的 @Query。

### 9.4 渲染 Markdown 内容

```vue
<!-- 用 ContentRenderer 将 Markdown 渲染为 HTML -->
<div class="prose">
  <ContentRenderer :value="post" />
</div>
```

`prose` 是 Tailwind Typography 插件的 class，自动美化 Markdown 生成的 HTML。

---

## 10. 国际化 i18n

### 10.1 配置

```typescript
// nuxt.config.ts
i18n: {
  locales: [
    { code: 'zh-CN', file: 'zh-CN.json', name: '中文' },
    { code: 'en-US', file: 'en-US.json', name: 'English' },
  ],
  defaultLocale: 'zh-CN',
  strategy: 'prefix_except_default',
  // 中文: /blog, /about
  // 英文: /en-US/blog, /en-US/about
}
```

### 10.2 语言文件

```json
// i18n/locales/zh-CN.json
{
  "nav": {
    "learn": "学习",
    "projects": "项目",
    "blog": "博客",
    "about": "关于"
  },
  "home": {
    "hero": {
      "title": "AI 技术实践者的知识库与工具箱"
    }
  }
}
```

### 10.3 在组件中使用

```vue
<script setup>
const { t } = useI18n()           // 获取翻译函数
const { locale, setLocale } = useI18n()  // 获取/设置当前语言
</script>

<template>
  <!-- 使用 t() 函数获取翻译文本 -->
  <h1>{{ t('home.hero.title') }}</h1>

  <!-- 切换语言 -->
  <button @click="setLocale('en-US')">English</button>
</template>
```

**类比**：
- iOS: `NSLocalizedString("key", comment: "")` / String Catalog
- Android: `getString(R.string.key)` / `stringResource()`

---

## 11. 样式系统（Tailwind CSS）

### 11.1 什么是 Tailwind CSS？

Tailwind 是**原子化 CSS 框架**：不写传统的 CSS 类名，而是直接在 HTML 中用工具类组合样式。

```html
<!-- 传统 CSS -->
<div class="hero-section">...</div>
<!-- .hero-section { padding: 2rem; text-align: center; max-width: 64rem; } -->

<!-- Tailwind CSS（本项目方式） -->
<div class="px-4 py-32 text-center max-w-6xl mx-auto">...</div>
```

### 11.2 常用 Tailwind 类名速查

```
布局:
  flex              → display: flex（弹性布局）
  grid              → display: grid（网格布局）
  items-center      → align-items: center（垂直居中）
  justify-between   → justify-content: space-between（两端对齐）
  gap-4             → gap: 1rem（间距）

尺寸:
  w-full            → width: 100%
  h-20              → height: 5rem
  max-w-6xl         → max-width: 72rem
  min-h-screen      → min-height: 100vh

间距（p=padding, m=margin, x=水平, y=垂直）:
  px-4              → padding-left/right: 1rem
  py-12             → padding-top/bottom: 3rem
  mt-6              → margin-top: 1.5rem
  mx-auto           → margin-left/right: auto（水平居中）

文字:
  text-xl           → font-size: 1.25rem
  font-bold         → font-weight: 700
  text-brand-muted  → color: 自定义颜色
  text-center       → text-align: center
  leading-tight     → line-height: 1.25

颜色:
  bg-brand-primary  → background: 自定义主色
  text-white        → color: white
  border-brand-border → border-color: 自定义边框色

响应式前缀（移动优先）:
  md:grid-cols-3    → 屏幕 ≥ 768px 时 3 列
  lg:text-8xl       → 屏幕 ≥ 1024px 时超大文字

交互:
  hover:text-brand-primary  → 悬停时变色
  transition-colors         → 颜色过渡动画
  group-hover:scale-110     → 父元素 hover 时缩放
```

### 11.3 自定义主题

```css
/* app/assets/css/main.css */
@theme {
  --color-brand-bg: #0d0d12;        /* 深色背景 */
  --color-brand-primary: #00e5ff;    /* 电青色主色 */
  --color-brand-accent: #ff6b6b;     /* 珊瑚色点缀 */
  --font-display: 'Syne', sans-serif;   /* 标题字体 */
  --font-body: 'Space Mono', monospace;  /* 正文字体 */
}
```

定义后，可以在 Tailwind 类中使用：`text-brand-primary`, `bg-brand-bg` 等。

### 11.4 自定义 CSS 类

项目中定义了几个复用的 CSS 类：

```css
/* 主按钮：带渐变光效和悬停上浮 */
.btn-primary { /* ... */ }

/* 次按钮：透明背景 + 边框 */
.btn-secondary { /* ... */ }

/* 卡片：悬停时边框变色 + 上浮 + 阴影 */
.card { /* ... */ }

/* 渐变文字 */
.text-gradient { /* ... */ }
```

**类比**：类似 iOS 中自定义 `ButtonStyle` 或 Android 中的 `MaterialTheme` 自定义。

---

## 12. SEO 与元数据

### 12.1 useSeoMeta

```typescript
// 设置页面 SEO 信息
useSeoMeta({
  title: `${post.value.title} — Turing`,
  description: post.value.description,
  ogTitle: post.value.title,          // Open Graph（社交分享标题）
  ogDescription: post.value.description,
  ogImage: post.value.cover,          // 社交分享图片
  ogType: 'article',
  articlePublishedTime: post.value.date,
  articleAuthor: 'Jimmy Liu',
  articleTag: post.value.tags,
})
```

这些元数据影响：
- 搜索引擎显示的标题和描述
- 微信/Twitter/Facebook 分享时的卡片展示
- SEO 排名

**类比**：类似 App Store 的应用标题、描述、截图，但是给搜索引擎和社交平台看的。

---

## 13. 插件系统

### 13.1 Nuxt 插件

插件用于在应用启动时初始化第三方服务。文件名中的 `.client` 后缀表示**仅在客户端（浏览器）运行**。

#### Sentry 错误监控

```typescript
// plugins/sentry.client.ts
import * as Sentry from '@sentry/nuxt'

export default defineNuxtPlugin(() => {
  const dsn = useRuntimeConfig().public.sentryDsn

  if (!dsn) return  // 没有配置就跳过

  Sentry.init({
    dsn,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    environment: process.env.NODE_ENV || 'development',
  })
})
```

**类比**：类似 iOS 的 `AppDelegate.didFinishLaunching` 中初始化 Firebase Crashlytics。

#### Web Vitals 性能监控

```typescript
// plugins/web-vitals.client.ts
export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
    onCLS(reportWebVitals)   // 累积布局偏移
    onINP(reportWebVitals)   // 交互到下一帧绘制
    onFCP(reportWebVitals)   // 首次内容绘制
    onLCP(reportWebVitals)   // 最大内容绘制
    onTTFB(reportWebVitals)  // 首字节时间
  })
})
```

**类比**：类似 MetricKit (iOS) / Android Vitals 的性能监控。

---

## 14. 数据获取

### 14.1 useAsyncData

Nuxt 提供 `useAsyncData` 在 SSR/SSG 时获取数据，避免重复请求。

```typescript
// 参数1: 唯一 key（缓存标识）
// 参数2: 异步函数
const { data, error } = await useAsyncData('blog-all', () =>
  queryCollection('blog').order('date', 'DESC').all()
)

// data 是 Ref<T | null>，模板中直接用
// error 包含错误信息
```

**特点**：
- SSR 时在服务端执行，结果序列化传给客户端（不会重复请求）
- 基于 key 自动缓存和去重
- 返回值是 `Ref` 类型，模板中自动响应式更新

**类比**：
- iOS: 类似 SwiftUI 的 `.task { }` 修饰符
- Android: 类似 `LaunchedEffect` + `collectAsState`

### 14.2 错误处理

```typescript
const { data: post } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)

// 数据不存在时抛出 404
if (!post.value) {
  throw createError({ statusCode: 404, message: t('error.notFound') })
}

// 加载失败时抛出 500
if (error.value) {
  throw createError({ statusCode: 500, message: t('error.loadFailed') })
}
```

---

## 15. TypeScript 在 Vue 中的使用

### 15.1 Props 类型定义

```typescript
// 使用泛型定义 props 类型
const props = defineProps<{
  level: 'beginner' | 'intermediate' | 'advanced'
}>()
```

### 15.2 Ref 类型

```typescript
// 显式指定 ref 的类型
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const selectedTag = ref<string | null>(null)
```

### 15.3 Zod Schema（运行时类型验证）

```typescript
import { z } from 'zod'

const blogSchema = z.object({
  title: z.string(),
  tags: z.array(z.string()).default([]),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  featured: z.boolean().default(false),
  cover: z.string().optional(),
})
```

**类比**：类似 Swift 的 `Codable` / Kotlin 的 `@Serializable`，但增加了验证能力。

---

## 16. 测试

### 16.1 单元测试（Vitest）

```typescript
// composables/useFormatDate.test.ts
import { describe, it, expect } from 'vitest'

describe('useFormatDate', () => {
  it('应正确格式化日期字符串', () => {
    const { formatDate } = useFormatDate()
    const result = formatDate('2026-03-01')
    expect(result).toContain('2026')
  })
})
```

**类比**：类似 XCTest (iOS) / JUnit (Android)

### 16.2 E2E 测试（Playwright）

```typescript
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('首页应显示标题', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Turing')
})
```

**类比**：类似 XCUITest (iOS) / Espresso (Android)，模拟用户操作。

---

## 17. 工程化配置

### 17.1 关键配置文件一览

| 文件 | 作用 | 移动端类比 |
|------|------|-----------|
| `nuxt.config.ts` | 框架主配置 | `Info.plist` + `build.gradle` |
| `content.config.ts` | 内容集合 Schema | 数据库 Entity 定义 |
| `tsconfig.json` | TypeScript 配置 | Swift 编译设置 |
| `vitest.config.ts` | 单元测试配置 | XCTest / JUnit 配置 |
| `playwright.config.ts` | E2E 测试配置 | XCUITest 配置 |
| `eslint.config.mjs` | 代码规范检查 | SwiftLint / ktlint |
| `.prettierrc` | 代码格式化 | swift-format 配置 |
| `.husky/` | Git hooks | Git hooks |
| `package.json` | 依赖和脚本 | `Podfile` / `build.gradle` |

### 17.2 常用命令

```bash
npm run dev          # 启动开发服务器（热重载）
npm run build        # 构建生产版本
npm run generate     # 静态站点生成
npm run lint         # 代码规范检查
npm run lint:fix     # 自动修复规范问题
npm run test         # 运行单元测试
npm run test:e2e     # 运行 E2E 测试
npm run typecheck    # TypeScript 类型检查
```

---

## 附录：学习路径建议

作为移动端开发者，建议按以下顺序学习：

### 第一阶段：理解基础
1. **Vue 3 模板语法** — 理解 `{{ }}`, `v-if`, `v-for`, `@click`, `:bind`
2. **响应式系统** — 掌握 `ref()`, `computed()`, `watch()`
3. **组件通信** — 理解 `props` 和 `emit`

### 第二阶段：掌握框架
4. **Nuxt 路由** — 文件系统路由、动态路由
5. **数据获取** — `useAsyncData`, `queryCollection`
6. **Layout 系统** — 理解布局嵌套

### 第三阶段：样式与工程化
7. **Tailwind CSS** — 原子化 CSS、响应式设计
8. **Composables** — 逻辑复用模式
9. **i18n 国际化** — 多语言支持

### 第四阶段：进阶
10. **SSR/SSG 原理** — 理解服务端渲染
11. **SEO 优化** — 元数据管理
12. **测试** — 单元测试 + E2E 测试
13. **TypeScript** — 类型安全

### 推荐修改练习

| 练习 | 涉及知识点 | 难度 |
|------|-----------|------|
| 修改首页 Hero 区文案 | 模板语法、i18n | 入门 |
| 给 LevelBadge 新增一个等级 | Props、条件样式 | 入门 |
| 新增一个 About 页面段落 | 模板语法、Tailwind | 入门 |
| 给博客列表添加搜索功能 | ref, computed, v-model | 中级 |
| 新增一个 Composable | 组合式函数、自动导入 | 中级 |
| 添加新的内容集合 | Nuxt Content, Zod | 中级 |
| 实现暗色/亮色主题切换 | CSS 变量、响应式状态 | 高级 |
| 接入真实的 Newsletter API | 异步请求、错误处理 | 高级 |

---

> 文档生成时间：2026-04-02
> 基于 Turing 项目 (Nuxt 3.16 + Vue 3 + Tailwind CSS v4)
