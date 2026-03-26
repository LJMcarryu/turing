<script setup lang="ts">
import { formatDate } from '~/composables/useFormatDate'

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
        <span>{{ formatDate(post.date) }}</span>
        <span v-if="post.readingTime">{{ post.readingTime }} min</span>
      </div>
    </header>

    <div class="prose mt-8 max-w-none">
      <ContentRenderer :value="post" />
    </div>
  </article>
</template>
