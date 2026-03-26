<script setup lang="ts">
import { formatDate } from '~/composables/useFormatDate'

useSeoMeta({
  title: 'Blog — Turing',
  description: 'AI 行业洞察、实践分享和技术思考',
})

const { data: posts, error } = await useAsyncData('blog-all', () =>
  queryCollection('blog').order('date', 'DESC').all()
)

if (error.value) {
  throw createError({ statusCode: 500, message: '加载文章失败' })
}
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
          <span>{{ formatDate(post.date) }}</span>
          <span v-if="post.readingTime">{{ post.readingTime }} min</span>
        </div>
      </NuxtLink>
    </div>

    <p v-if="!posts?.length" class="py-12 text-center text-brand-subtle">
      暂无文章
    </p>
  </div>
</template>
