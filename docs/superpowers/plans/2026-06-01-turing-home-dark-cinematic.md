# Turing 首页「显影台·卷宗放映」实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 turing 首页从亮色编辑杂志风重做为「暗黑电影感编辑风」(暗场 token + 签名时刻 + 电影级动效 + 定制光标)，目标 top-design ≥ 9.4/10。

**Architecture:** 暗场 token 经 `[data-theme="noir"]` 作用域化，只套在首页根，不动全局亮场（增量、可回滚）。视觉用 Tailwind v4 `@theme` + 自定义 CSS 基元；交互(Lenis 平滑滚动、定制光标、滚动揭示)全部 client-only 插件/组件，`matchMedia(pointer:fine)` + `prefers-reduced-motion` 双守卫，SSG 安全、渐进增强。

**Tech Stack:** Nuxt 3 (Vue3 SSG) · Tailwind v4 · @nuxt/content v3 · @nuxtjs/i18n · Lenis(新增) · Playwright(已有)

**对应设计文档:** `docs/superpowers/specs/2026-06-01-turing-home-dark-cinematic-design.md`

---

## 前置约定

- **基线**：当前工作区 `app/pages/index.vue`、`app/assets/css/main.css` 已是「亮色编辑杂志风」的未提交改动 —— 本计划在此之上叠加。执行前建议在**独立分支/worktree**（`superpowers:using-git-worktrees`）里做，避免污染主工作区。
- **提交策略**：每个任务结束 `git add` **仅本任务触碰的文件**后提交，不要 `git add -A`（工作区还有别的未完成改动）。
- **每任务通用验证命令**：
  - `npm run lint`（eslint，期望 0 error）
  - `npx nuxt typecheck`（期望无新增类型错误）
  - `npm run dev` 起本地 `http://localhost:3000` 实看（描述里给具体观察点）
- **真机/无障碍验证**：在 §Task 13 统一做（Playwright + 手动截图）。

---

## 文件结构（决策锁定）

| 文件                                     | 职责                                                                         | 新建/改 |
| ---------------------------------------- | ---------------------------------------------------------------------------- | ------- |
| `app/assets/css/main.css`                | 暗场 token、缓动变量、`.duotone`、keyframes、机器层字体、reduced-motion 退化 | 改      |
| `i18n/locales/zh-CN.json` · `en-US.json` | Cover 标语文案                                                               | 改      |
| `app/composables/useScrollReveal.ts`     | IntersectionObserver 滚动揭示（守卫）                                        | 新建    |
| `app/plugins/lenis.client.ts`            | Lenis 平滑滚动（守卫）                                                       | 新建    |
| `app/components/TheCursor.client.vue`    | 定制光标双层准星 + 磁吸（守卫）                                              | 新建    |
| `app/components/TheReel.client.vue`      | Projects 横向卷宗带（锁滚 + 键盘 + 列表切换）                                | 新建    |
| `app/layouts/default.vue`                | 挂载 `<TheCursor>`                                                           | 改      |
| `app/pages/index.vue`                    | 套 `data-theme="noir"`；Cover/Learn/Projects/Blog/Newsletter 暗场重构        | 改      |
| `package.json`                           | 新增 `lenis` 依赖                                                            | 改      |
| `e2e/home-dark.spec.ts`                  | reduced-motion / 键盘 / 渲染冒烟守卫                                         | 新建    |

---

## Task 1: 暗场 token 基座（main.css）

**Files:**

- Modify: `app/assets/css/main.css`（在 `@theme {...}` 块后、`html` 规则前插入新块）

- [ ] **Step 1: 追加暗场 token + 缓动 + duotone + keyframes**

在 `app/assets/css/main.css` 的 `@theme { ... }` 闭合 `}`（约 line 60）之后插入：

```css
/* =============================================================
   NOIR — 暗黑电影感主题（作用域化，仅 [data-theme="noir"] 生效）
   ============================================================= */
[data-theme='noir'] {
  /* 画布 / 表面 — 暖近黑 60° */
  --paper: oklch(0.145 0.014 60);
  --paper-2: oklch(0.185 0.013 60);
  --paper-3: oklch(0.225 0.012 62);
  /* 文字 — 反白象牙调 */
  --ink: oklch(0.93 0.012 75); /* 主文/标题 ≈14:1 */
  --ink-soft: oklch(0.74 0.012 72); /* 次文 ≈7:1 */
  --ink-faint: oklch(0.6 0.011 70); /* meta ≥4.5:1，仅 ≥0.8rem */
  /* 分隔线 */
  --rule: oklch(0.3 0.012 62);
  --rule-soft: oklch(0.24 0.012 62);
  /* 强调色 — 暗场提亮才发光 */
  --cobalt: oklch(0.62 0.17 258);
  --cobalt-deep: oklch(0.52 0.16 258);
  --cobalt-bright: oklch(0.7 0.18 258);
  --cobalt-soft: oklch(0.3 0.06 258);
  --amber: oklch(0.8 0.135 72);
  --amber-deep: oklch(0.66 0.13 72);
  /* 反白板块用 */
  --ink-dark: oklch(0.985 0.003 80); /* Newsletter 亮卡底 */
  --paper-dark: oklch(0.16 0.011 255); /* 亮卡上的文字 */
  color-scheme: dark;
  background: var(--paper);
  color: var(--ink);
}

/* 缓动语言（禁 ease/linear） */
:root {
  --ease-develop: cubic-bezier(0.22, 0.61, 0.16, 1);
  --ease-cut: cubic-bezier(0.85, 0, 0.15, 1);
  --ease-scrub: cubic-bezier(0.33, 0, 0.07, 1);
  --ease-reel: cubic-bezier(0.16, 1, 0.3, 1);
}

/* duotone 救图 — 纯静态 CSS，无动画 */
[data-theme='noir'] .duotone {
  filter: grayscale(1) sepia(0.45) brightness(0.82) contrast(1.08);
  background: var(--amber-deep);
}
[data-theme='noir'] .duotone img {
  mix-blend-mode: luminosity;
  opacity: 0.92;
}

/* keyframes */
@keyframes develop-spot {
  from {
    --spot-r: 0%;
  }
  to {
    --spot-r: 130%;
  }
}
@keyframes period-pulse {
  0%,
  100% {
    opacity: 1;
    filter: drop-shadow(0 0 6px var(--cobalt));
  }
  50% {
    opacity: 0.85;
    filter: drop-shadow(0 0 14px var(--cobalt-bright));
  }
}
@keyframes line-reveal {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 广色域护栏 */
@media (color-gamut: srgb) {
  [data-theme='noir'] {
    --paper: #131210;
    --ink: #ece7df;
    --cobalt: #5a6ff0;
    --amber: #e3b15a;
  }
}

/* reduced-motion 全链路退化 */
@media (prefers-reduced-motion: reduce) {
  [data-theme='noir'] [class*='reveal'],
  [data-theme='noir'] .arc {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

- [ ] **Step 2: 验证暗场生效**

Run: `npm run dev`，浏览器开 `http://localhost:3000`，临时在 devtools 给 `<body>` 加 `data-theme="noir"`。
Expected: 背景变暖近黑、文字变象牙白；移除属性后恢复亮色（证明作用域化未污染全局）。

- [ ] **Step 3: lint + 提交**

Run: `npm run lint`，Expected: 0 error。

```bash
git add app/assets/css/main.css
git commit -m "feat(home): add noir dark theme tokens, easing, duotone, keyframes"
```

---

## Task 2: 字体接入（机器层等宽 + 中文显示字栈）

**Files:**

- Modify: `app/assets/css/main.css`（顶部 `@import` 字体行；新增 `.machine`、`.mag-cjk`）

- [ ] **Step 1: 加 JetBrains Mono 到字体 @import**

把 `main.css` 第 1 行的 Google Fonts `@import` URL 追加 `&family=JetBrains+Mono:wght@400;500`（拼到现有 `family=` 串里，保持单条 @import）。

- [ ] **Step 2: 更新 mono 变量 + 新增机器层/中文显示类**

在 `@theme` 块里把 `--font-mono` 改为：

```css
--font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', monospace;
```

在「Editorial primitives」区追加：

```css
/* 机器层等宽 — meta/dateline/时间码/帧码；红线：暗场禁 amber 小字 */
.machine {
  font-family: var(--font-mono);
  font-feature-settings: 'tnum' 1;
  letter-spacing: 0.02em;
}
[data-theme='noir'] .machine {
  color: var(--ink-soft);
}

/* 中文显示字 — 暗场宋体压实，关掉逐字 hairline 戏剧 */
:lang(zh) .mag-cjk {
  font-family: 'Source Han Serif SC', 'Songti SC', STSong, ui-serif, Georgia, serif;
  font-weight: 600;
  letter-spacing: 0.02em;
  font-feature-settings: 'ss01' 1;
}
```

- [ ] **Step 3: 验证 + 提交**

Run: `npm run dev`，确认 `.machine` 文本渲染为等宽、数字不跳。Run: `npm run lint`。

```bash
git add app/assets/css/main.css
git commit -m "feat(home): add JetBrains Mono machine layer + CJK display stack"
```

---

## Task 3: i18n Cover 标语改动

**Files:**

- Modify: `i18n/locales/zh-CN.json`、`i18n/locales/en-US.json`

- [ ] **Step 1: 先确认现有 key 形态**

Run: `grep -n "hero" i18n/locales/zh-CN.json`
Expected: 看到 `home.hero.title` / `home.hero.subtitle` 等现有结构（据此对齐缩进与父级 key）。

- [ ] **Step 2: 改 zh-CN（title 改短标语，新增 eyebrow）**

把 `home.hero.title` 的值改为 `以意图，构建机器之思`，并在同级新增 `"eyebrow": "AI 技术实践者的知识库与工具箱"`。保留现有 `subtitle`（作 dek）。

- [ ] **Step 3: 改 en-US（对齐）**

`home.hero.title` → `Build with intent`；同级新增 `"eyebrow": "Knowledge Base & Toolbox for AI Practitioners"`。

- [ ] **Step 4: 验证 + 提交**

Run: `npx nuxt typecheck`（i18n 类型不报错）。Run: `npm run dev`，首页 hero 文案为新标语（句点在 Task 7 单独成 span）。

```bash
git add i18n/locales/zh-CN.json i18n/locales/en-US.json
git commit -m "feat(home): cover headline slogan + eyebrow i18n"
```

---

## Task 4: 滚动揭示 composable

**Files:**

- Create: `app/composables/useScrollReveal.ts`

- [ ] **Step 1: 写 composable**

```ts
// app/composables/useScrollReveal.ts
// 给元素加 .reveal（初始隐藏），进入视口后加 .is-in 触发揭示。
// reduced-motion 时直接显示，不挂 observer。
export function useScrollReveal() {
  if (import.meta.server) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  onMounted(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (reduce) {
      els.forEach(el => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    )
    els.forEach(el => io.observe(el))
    onBeforeUnmount(() => io.disconnect())
  })
}
```

- [ ] **Step 2: 加配套 CSS（main.css）**

```css
.reveal {
  opacity: 0;
  transform: translateY(18px);
}
.reveal.is-in {
  animation: line-reveal 600ms var(--ease-reel) both;
}
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 3: 验证 + 提交**

Run: `npm run lint` + `npx nuxt typecheck`（composable 自动导入、无类型错误）。

```bash
git add app/composables/useScrollReveal.ts app/assets/css/main.css
git commit -m "feat(home): scroll reveal composable + styles"
```

---

## Task 5: Lenis 平滑滚动插件

**Files:**

- Modify: `package.json`（新增依赖）
- Create: `app/plugins/lenis.client.ts`

- [ ] **Step 1: 装依赖**

Run: `npm i lenis`
Expected: `package.json` dependencies 出现 `lenis`。

- [ ] **Step 2: 写 client 插件（双守卫）**

```ts
// app/plugins/lenis.client.ts
import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  const fine = window.matchMedia('(pointer: fine)').matches
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduce) return // 移动端/降级走原生滚动

  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true, syncTouch: false })
  let id = 0
  const raf = (t: number) => {
    lenis.raf(t)
    id = requestAnimationFrame(raf)
  }
  id = requestAnimationFrame(raf)

  const router = useRouter()
  router.afterEach(() => lenis.scrollTo(0, { immediate: true }))

  return { provide: { lenis } }
})
```

- [ ] **Step 3: 验证 + 提交**

Run: `npm run dev`。桌面滚动应有平滑惯性；devtools 模拟 reduced-motion 后恢复原生滚动；移动模拟器原生滚动。

```bash
git add package.json package-lock.json app/plugins/lenis.client.ts
git commit -m "feat(home): lenis smooth scroll plugin (guarded)"
```

---

## Task 6: 定制光标（双层准星 + 磁吸）

**Files:**

- Create: `app/components/TheCursor.client.vue`
- Modify: `app/layouts/default.vue`（挂载组件）

- [ ] **Step 1: 写光标组件**

```vue
<!-- app/components/TheCursor.client.vue -->
<script setup lang="ts">
const ring = ref<HTMLElement | null>(null)
const cross = ref<HTMLElement | null>(null)
let raf = 0
const pos = { x: -100, y: -100 }
const cur = { x: -100, y: -100 }

onMounted(() => {
  if (!window.matchMedia('(pointer: fine)').matches) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  document.documentElement.classList.add('has-cursor')
  const move = (e: MouseEvent) => {
    pos.x = e.clientX
    pos.y = e.clientY
  }
  const over = (e: MouseEvent) => {
    const hit = (e.target as HTMLElement).closest('a, button, [data-magnet]')
    ring.value?.classList.toggle('is-hot', !!hit)
  }
  window.addEventListener('mousemove', move, { passive: true })
  window.addEventListener('mouseover', over, { passive: true })
  const loop = () => {
    cur.x += (pos.x - cur.x) * 0.18
    cur.y += (pos.y - cur.y) * 0.18
    if (cross.value) cross.value.style.transform = `translate(${pos.x}px, ${pos.y}px)`
    if (ring.value) ring.value.style.transform = `translate(${cur.x}px, ${cur.y}px)`
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseover', over)
  })
})
</script>

<template>
  <div aria-hidden="true">
    <div ref="cross" class="cur-cross" />
    <div ref="ring" class="cur-ring" />
  </div>
</template>

<style>
.has-cursor,
.has-cursor a,
.has-cursor button {
  cursor: none;
}
.cur-cross,
.cur-ring {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
  margin: -1px 0 0 -1px;
}
.cur-cross {
  width: 2px;
  height: 14px;
  margin-left: -1px;
  margin-top: -7px;
  background: var(--cobalt, #5a6ff0);
  box-shadow: 0 0 0 1px color-mix(in oklch, var(--paper) 60%, transparent);
}
.cur-cross::after {
  content: '';
  position: absolute;
  left: -6px;
  top: 6px;
  width: 14px;
  height: 2px;
  background: inherit;
}
.cur-ring {
  width: 30px;
  height: 30px;
  margin: -15px 0 0 -15px;
  border: 1px solid var(--ink-soft);
  border-radius: 999px;
  opacity: 0.5;
  transition:
    width 0.2s var(--ease-reel),
    height 0.2s var(--ease-reel),
    opacity 0.2s;
}
.cur-ring.is-hot {
  width: 46px;
  height: 46px;
  margin: -23px 0 0 -23px;
  opacity: 0.9;
  border-color: var(--cobalt);
}
@media (pointer: coarse) {
  .cur-cross,
  .cur-ring {
    display: none;
  }
}
</style>
```

- [ ] **Step 2: 挂载到 layout**

在 `app/layouts/default.vue` 模板末尾（根容器内）加 `<TheCursor />`（`.client.vue` 自动仅客户端渲染，无需手动 ClientOnly）。

- [ ] **Step 3: 验证 + 提交**

Run: `npm run dev`。桌面：系统光标隐藏、出现准星 + 跟随环，悬停链接/按钮时环放大变蓝。移动模拟器/reduced-motion：系统光标照常。

```bash
git add app/components/TheCursor.client.vue app/layouts/default.vue
git commit -m "feat(home): custom dual-layer cursor with magnet (guarded)"
```

---

## Task 7: Cover 签名时刻（index.vue 重构）⭐

**Files:**

- Modify: `app/pages/index.vue`（`<template>` 根 + COVER section + `<script setup>` 加光弧逻辑 + `<style scoped>`）

- [ ] **Step 1: 根容器套主题 + 调用揭示**

`<script setup>` 顶部加 `useScrollReveal()`。模板根 `<div>` 改为 `<div data-theme="noir">`。

- [ ] **Step 2: 重写 COVER section 文字列**

把现有文字列（约 `index.vue:35-58`）替换为下列结构（保留 i18n key，句点单独成 span 作活节点）：

```vue
<div class="reveal md:col-span-7 md:pr-6">
  <div class="mb-5 flex flex-wrap items-baseline gap-4 border-b border-[var(--rule)] pb-3">
    <span class="machine meta">{{ dateline }}</span>
    <span class="machine meta text-[var(--cobalt)]">№ 04 · Cover Story</span>
  </div>
  <p class="kicker kicker--cobalt mb-5">{{ t('home.hero.eyebrow') }}</p>
  <h1 class="mag-1 mag-cjk headline">
    {{ t('home.hero.title') }}<span ref="periodEl" class="period text-[var(--cobalt)]">.</span>
  </h1>
  <div class="arc" aria-hidden="true" />
  <p class="dek dek--cjk mt-8">{{ t('home.hero.subtitle') }}</p>
  <div class="mt-10 flex flex-wrap items-center gap-4">
    <NuxtLink to="/learn" class="btn-ink" data-magnet>{{ t('home.hero.startLearning') }} <span aria-hidden="true">→</span></NuxtLink>
    <NuxtLink to="/projects" class="link-ed text-base">{{ t('home.hero.exploreProjects') }} →</NuxtLink>
  </div>
  <!-- dispatch 微条：坐实「内容站有货」 -->
  <p v-if="latestBlog?.[0]" class="machine mt-8 text-[0.72rem] text-[var(--ink-faint)]">
    NOW READING · <NuxtLink :to="latestBlog[0].path" class="text-[var(--cobalt)]">{{ latestBlog[0].title }}</NuxtLink>
  </p>
</div>
```

- [ ] **Step 3: hero 图列加 duotone + 显影**

图列 `<figure>` 内包图的 `<div class="ar-portrait overflow-hidden">` 加 `duotone reveal` 两个类。

- [ ] **Step 4: 光弧跟随鼠标 Y（script）**

`<script setup>` 内加：

```ts
const periodEl = ref<HTMLElement | null>(null)
onMounted(() => {
  if (import.meta.server) return
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !window.matchMedia('(pointer: fine)').matches
  )
    return
  const arc = document.querySelector<HTMLElement>('.arc')
  if (!arc) return
  let y = 0.5,
    cur = 0.5,
    raf = 0
  const onMove = (e: MouseEvent) => {
    y = Math.min(1, Math.max(0, e.clientY / window.innerHeight))
  }
  const loop = () => {
    cur += (y - cur) * 0.08
    arc.style.setProperty('--arc-y', String(cur))
    raf = requestAnimationFrame(loop)
  }
  window.addEventListener('mousemove', onMove, { passive: true })
  raf = requestAnimationFrame(loop)
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('mousemove', onMove)
  })
})
```

- [ ] **Step 5: scoped 样式（聚光 / 光弧 / 句点 / 显影入场）**

`<style scoped>` 追加（含 `:deep` 因作用于动态/全局类）：

```css
.headline {
  position: relative;
  line-height: 0.9;
}
.period {
  display: inline-block;
  animation: period-pulse 6s var(--ease-develop) infinite;
}
.arc {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  top: calc(var(--arc-y, 0.5) * 9rem);
  background: linear-gradient(90deg, transparent, var(--cobalt-bright), transparent);
  mix-blend-mode: screen;
  filter: drop-shadow(0 0 8px var(--cobalt));
  pointer-events: none;
  animation: line-reveal 800ms var(--ease-reel) 700ms both;
}
.headline.reveal,
.headline {
  /* 英文逐字交给 JS 可选；MVP 用整体揭示 */
}
.dek--cjk {
  font-style: normal;
  border-left: 2px solid var(--cobalt);
  padding-left: 0.9em;
}
:lang(en) .dek--cjk {
  border-left: 0;
  padding-left: 0;
  font-style: italic;
}
@media (prefers-reduced-motion: reduce) {
  .period {
    animation: none;
  }
  .arc {
    animation: none;
    top: 4.5rem;
  }
}
```

- [ ] **Step 6: 验证（签名时刻）**

Run: `npm run dev`。刷新看：暗场 + hero 图显影 + 标题揭示 + 光弧扫出 + 句点呼吸；鼠标上下移动光弧跟随；中文 dek 是正体 + 钴蓝左竖线；切 EN 看 dek 变斜体。reduced-motion 下全部静止可读。
Run: `npm run lint`。

```bash
git add app/pages/index.vue
git commit -m "feat(home): cover signature moment — spotlight, arc, period node, duotone hero"
```

---

## Task 8: Learn 板块（暗场 + 幽灵编号 + entry 加密）

**Files:**

- Modify: `app/pages/index.vue`（LEARN section，约 line 73-129）

- [ ] **Step 1: 注入巨大琥珀幽灵编号**

LEARN `<section>` 改为 `relative overflow-clip`，在 `.section-head` 前插入：

```vue
<span aria-hidden="true" class="ghost-num">01</span>
```

- [ ] **Step 2: 大图加显影、副条加 .reveal**

featured 大图的 `ar-wide` 容器加 `duotone`；副 stack 每个 `<NuxtLink>` 加 `reveal`；缩略图容器加 `duotone`。

- [ ] **Step 3: 幽灵编号样式（index.vue scoped）**

```css
.ghost-num {
  position: absolute;
  right: 2%;
  top: -2.5rem;
  z-index: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(8rem, 22vw, 20rem);
  color: transparent;
  -webkit-text-stroke: 1.5px var(--amber);
  opacity: 0.14;
  font-feature-settings: 'onum';
  pointer-events: none;
  line-height: 1;
}
.section-head,
.grid {
  position: relative;
  z-index: 1;
}
```

- [ ] **Step 4: 验证 + 提交**

Run: `npm run dev`，Learn 区有暗场显影大图 + 右上巨大琥珀描边「01」水印（压在内容后、不溢出横向滚动条）。Run: `npm run lint`。

```bash
git add app/pages/index.vue
git commit -m "feat(home): learn section noir + amber ghost numeral + densified entries"
```

---

## Task 9: Projects 横向卷宗带 TheReel ⭐

**Files:**

- Create: `app/components/TheReel.client.vue`
- Modify: `app/pages/index.vue`（PROJECTS section 用组件替换网格）

- [ ] **Step 1: 写卷宗带组件（锁滚 + 键盘 + 列表切换）**

```vue
<!-- app/components/TheReel.client.vue -->
<script setup lang="ts">
interface ReelItem {
  path: string
  title: string
  description?: string
  status?: string
  src: string
  alt: string
}
const props = defineProps<{ items: ReelItem[] }>()
const mode = ref<'reel' | 'list'>('reel')
const track = ref<HTMLElement | null>(null)
const idx = ref(0)

function go(n: number) {
  idx.value = Math.min(props.items.length - 1, Math.max(0, idx.value + n))
  track.value?.children[idx.value]?.scrollIntoView({
    behavior: 'smooth',
    inline: 'center',
    block: 'nearest',
  })
}
function onKey(e: KeyboardEvent) {
  if (mode.value !== 'reel') return
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    go(1)
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    go(-1)
  }
}
const tc = computed(
  () => String(idx.value + 1).padStart(2, '0') + ' / ' + String(props.items.length).padStart(2, '0')
)
</script>

<template>
  <div class="reel" @keydown="onKey" tabindex="0" :aria-label="'项目放映 ' + tc">
    <div class="reel-bar machine">
      <span>REEL · {{ tc }}</span>
      <button
        type="button"
        class="reel-toggle"
        data-magnet
        @click="mode = mode === 'reel' ? 'list' : 'reel'"
      >
        {{ mode === 'reel' ? '列表视图' : '放映视图' }}
      </button>
    </div>

    <div v-if="mode === 'reel'" ref="track" class="reel-track" role="list">
      <NuxtLink
        v-for="(it, i) in items"
        :key="it.path"
        :to="it.path"
        class="reel-cell"
        role="listitem"
        data-magnet
      >
        <span class="reel-no machine" aria-hidden="true"
          >№ {{ String(i + 1).padStart(2, '0') }}</span
        >
        <div class="ar-wide overflow-hidden duotone">
          <img :src="it.src" :alt="it.alt" loading="lazy" />
        </div>
        <h3 class="mag-4 mag-cjk mt-3">{{ it.title }}</h3>
        <p v-if="it.description" class="tile__dek mt-1 line-clamp-2">{{ it.description }}</p>
      </NuxtLink>
    </div>

    <div v-else class="reel-list" role="list">
      <NuxtLink v-for="(it, i) in items" :key="it.path" :to="it.path" class="entry" role="listitem">
        <span class="entry__num">{{ String(i + 1).padStart(2, '0') }}</span>
        <div>
          <h3 class="entry__title">{{ it.title }}</h3>
          <p class="entry__dek">{{ it.description }}</p>
        </div>
        <span class="entry__meta machine">{{ it.status }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.reel:focus-visible {
  outline: 2px solid var(--cobalt);
  outline-offset: 6px;
}
.reel-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--rule);
  padding-bottom: 0.6rem;
  font-size: 0.72rem;
  color: var(--ink-soft);
}
.reel-toggle {
  border: 1px solid var(--rule);
  padding: 0.3em 0.8em;
  border-radius: 999px;
  color: var(--ink);
}
.reel-toggle:hover {
  border-color: var(--cobalt);
  color: var(--cobalt);
}
.reel-track {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 1.5rem 0;
  scrollbar-width: thin;
}
.reel-cell {
  flex: 0 0 min(72vw, 460px);
  scroll-snap-align: center;
  position: relative;
}
.reel-no {
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  z-index: 1;
  color: var(--amber);
  font-size: 0.72rem;
}
.reel-list {
  display: flex;
  flex-direction: column;
}
</style>
```

- [ ] **Step 2: index.vue 用组件替换 PROJECTS 网格**

把 PROJECTS `<section>`（约 line 131-185）内那段非对称 grid 换成：

```vue
<ClientOnly>
  <TheReel :items="(projects ?? []).map(p => ({ path: p.path, title: p.title, description: p.description, status: p.status, src: useArticleImage(p.path,'wide').src, alt: useArticleImage(p.path,'wide').alt }))" />
  <template #fallback>
    <!-- SSG/无 JS 兜底：静态横向列表 -->
    <div class="grid gap-8 md:grid-cols-2">
      <NuxtLink v-for="p in projects" :key="p.path" :to="p.path" class="tile"><h3 class="mag-4 mag-cjk">{{ p.title }}</h3></NuxtLink>
    </div>
  </template>
</ClientOnly>
```

section 外层保留 `border-y bg-[var(--paper-2)]`（暗场 token 自动变深）。

- [ ] **Step 3: 验证 + 提交**

Run: `npm run dev`。Projects 为横向卷宗带：时间码 `01 / 04`、琥珀 № 编号、duotone 图、scroll-snap；点「列表视图」切换为 entry 列表；卷宗聚焦后 ←/→ 切换；移动端原生横滑。Run: `npm run lint` + `npx nuxt typecheck`。

```bash
git add app/components/TheReel.client.vue app/pages/index.vue
git commit -m "feat(home): projects horizontal reel with keyboard + list-view escape hatches"
```

---

## Task 10: Blog 板块（暗场卡片）

**Files:**

- Modify: `app/pages/index.vue`（BLOG section，约 line 187-217）

- [ ] **Step 1: 卡片图加 duotone、卡片加 reveal**

每个 blog `<NuxtLink class="tile group">` 加 `reveal`；其 `ar-card` 容器加 `duotone`；标题 `<h3 class="mag-4 ...">` 加 `mag-cjk`。section 外层无需改（token 自动变暗）。

- [ ] **Step 2: 验证 + 提交**

Run: `npm run dev`，Blog 三栏卡片在暗场下显影、hover 标题转钴蓝。Run: `npm run lint`。

```bash
git add app/pages/index.vue
git commit -m "feat(home): blog section noir cards with duotone"
```

---

## Task 11: Newsletter 明度反转亮卡

**Files:**

- Modify: `app/pages/index.vue`（NEWSLETTER section，约 line 219-256）

- [ ] **Step 1: 反转为暖白实体亮卡**

NEWSLETTER `<section>` 外层去掉 `bg-[var(--ink-dark)] text-[var(--paper-dark)]`，改为 `py-24`（暗场）。内层包一张亮卡：

```vue
<div class="mx-auto max-w-[1320px] px-6">
  <div class="news-card md:grid md:grid-cols-12 md:gap-x-12 p-10 md:p-16">
    <div class="md:col-span-6">
      <p class="kicker mb-4 text-[var(--cobalt)]">A letter, on occasion</p>
      <h2 class="mag-1 mag-cjk">{{ t('home.newsletter.title') }} <span class="mag-italic text-[var(--cobalt)]">{{ t('home.newsletter.titleHighlight') }}</span></h2>
    </div>
    <div class="md:col-span-6 md:pl-8 md:border-l md:border-[var(--rule)]">
      <p class="dek mb-8">{{ t('home.newsletter.description') }}</p>
      <NewsletterForm />
    </div>
  </div>
</div>
```

- [ ] **Step 2: 亮卡样式（scoped，局部翻回亮场）**

```css
.news-card {
  --paper: oklch(0.985 0.003 80);
  --ink: oklch(0.16 0.011 255);
  --ink-soft: oklch(0.4 0.012 255);
  --rule: oklch(0.88 0.006 80);
  --cobalt: oklch(0.45 0.18 258);
  background: var(--paper);
  color: var(--ink);
  box-shadow: 0 40px 80px -40px oklch(0 0 0 / 0.6);
  border-radius: 2px;
}
.news-card ::selection {
  background: var(--cobalt);
  color: var(--paper);
}
```

删掉旧 `<style scoped>` 里那段 `section.bg-\[var\(--ink-dark\)\]` 的 `:deep` 反相规则（已不适用），如需保留表单暗→亮适配，`NewsletterForm` 在亮卡内已自动用亮场 token。

- [ ] **Step 3: 验证 + 提交**

Run: `npm run dev`，Newsletter 是暗场里浮起的一张暖白聚光卡（大投影），卡内文字深色、选中反相。Run: `npm run lint`。

```bash
git add app/pages/index.vue
git commit -m "feat(home): newsletter inverted bright card (brightness scale shift)"
```

---

## Task 12: 无障碍 / 性能 / 双语验收

**Files:**

- Create: `e2e/home-dark.spec.ts`

- [ ] **Step 1: 写 Playwright 守卫**

```ts
// e2e/home-dark.spec.ts
import { test, expect } from '@playwright/test'

test('homepage renders dark theme root', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-theme="noir"]').first()).toBeVisible()
  await expect(page.locator('h1')).toContainText(/意图|intent/)
})

test('reduced-motion disables arc animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const arc = page.locator('.arc')
  if (await arc.count()) {
    await expect(arc).toHaveCSS('animation-name', 'none')
  }
})

test('projects reel keyboard escape hatch works', async ({ page }) => {
  await page.goto('/')
  const reel = page.locator('.reel')
  await reel.scrollIntoViewIfNeeded()
  await reel.focus()
  await page.keyboard.press('ArrowRight') // 不应抛错；卷宗推进
  await expect(page.getByRole('button', { name: /列表视图|放映视图/ })).toBeVisible()
})
```

- [ ] **Step 2: 跑 e2e**

Run: `npm run test:e2e -- home-dark`
Expected: 3 个用例 PASS（首启需 `npx playwright install` 一次）。

- [ ] **Step 3: 手动验收清单（记录到 PR 描述）**

逐项实看/截图：

- [ ] 桌面 Chrome：签名时刻完整（显影/光弧/句点/光标）
- [ ] **中文 vs 英文各一张 Cover 截图**——确认中文思源宋体在暖近黑反白下不糊、与 Bodoni 气质一致（若糊：中文标题字重 600→650 或加 `text-shadow: 0 0 8px var(--amber)` 轻描边，记录最终值）
- [ ] 移动模拟器：光弧静态、原生滚动、系统光标、卷宗原生横滑
- [ ] reduced-motion：全静止可读、卷宗为列表
- [ ] 键盘：Tab 可达所有链接、卷宗 ←/→、focus 环可见
- [ ] Lighthouse（移动）：LCP < 2.5s、CLS ≈ 0、无对比度告警

- [ ] **Step 4: 提交**

```bash
git add e2e/home-dark.spec.ts
git commit -m "test(home): e2e guards for dark theme, reduced-motion, reel keyboard"
```

---

## Self-Review（已执行）

- **Spec 覆盖**：§3 字体→T2/T7；§4 色彩→T1；§5 构图→T7-11；§6 动效→T4/T5/T7；§7 光标→T6；§8 i18n→T3；§9 逐板块→T7-11；§10 无障碍/性能→T1(reduced-motion)/T12；duotone→T1+各板块。✅ 无遗漏主项。
- **占位符扫描**：无 TBD/TODO；每个改 CSS/代码的 step 都给了具体代码或精确改动指令。✅
- **类型/命名一致**：`useScrollReveal`(T4)、`$lenis`/`lerp 0.085`(T5)、`.reveal/.is-in`(T4↔T7-10)、`.duotone`(T1↔各板块)、`.machine/.mag-cjk/.ghost-num/.arc/.period`(定义与引用一致)、`TheReel` props `ReelItem`(T9 内自洽)、i18n key `home.hero.title/eyebrow`(T3↔T7) 全部对齐。✅
- 已知留到实现期定的真机项（中文巨字最终字重/描边）在 T12-Step3 明确为验收动作，非纸面占位。✅
