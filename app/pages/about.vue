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
