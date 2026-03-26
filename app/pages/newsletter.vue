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
