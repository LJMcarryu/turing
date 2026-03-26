<script setup lang="ts">
import { formatDate } from '~/composables/useFormatDate'

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
        <span class="text-sm text-brand-subtle">{{ formatDate(article.date) }}</span>
      </div>
      <h1 class="mt-3 text-3xl font-bold leading-tight">{{ article.title }}</h1>
      <p class="mt-2 text-lg text-brand-muted">{{ article.description }}</p>
    </header>

    <div class="prose mt-8 max-w-none">
      <ContentRenderer :value="article" />
    </div>
  </article>
</template>
