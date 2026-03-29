<script setup lang="ts">
const { t } = useI18n()
const { formatDate } = useFormatDate()

const route = useRoute()
const { data: post } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)

if (!post.value) {
  throw createError({ statusCode: 404, message: t('error.notFound') })
}

useSeoMeta({
  title: `${post.value.title} — Turing`,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogImage: post.value.cover,
  ogType: 'article',
  articlePublishedTime: post.value.date,
  articleModifiedTime: post.value.updated || post.value.date,
  articleAuthor: 'Jimmy Liu',
  articleTag: post.value.tags,
})

const { data: relatedPosts } = await useAsyncData(`related-${route.path}`, async () => {
  if (!post.value?.tags?.length) return []

  const all = await queryCollection('blog')
    .order('date', 'DESC')
    .limit(20)
    .all()

  return all
    .filter(p =>
      p.path !== post.value.path &&
      p.tags?.some(tag => post.value.tags?.includes(tag))
    )
    .slice(0, 3)
})
</script>

<template>
  <article v-if="post" class="min-h-screen">
    <!-- Cover Image -->
    <div
      v-if="post.cover"
      class="relative h-[40vh] w-full overflow-hidden bg-gradient-to-br from-brand-primary/20 to-brand-accent/20"
    >
      <img
        :src="post.cover"
        :alt="post.title"
        class="h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-brand-bg/80 to-transparent" />
    </div>

    <!-- Content Container -->
    <div class="mx-auto max-w-4xl px-4">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 py-6 text-sm text-brand-subtle">
        <NuxtLink to="/" class="hover:text-brand-primary">{{ t('nav.home') }}</NuxtLink>
        <Icon name="heroicons:chevron-right" class="h-4 w-4" />
        <NuxtLink to="/blog" class="hover:text-brand-primary">{{ t('blog.title') }}</NuxtLink>
        <Icon name="heroicons:chevron-right" class="h-4 w-4" />
        <span class="text-brand-muted">{{ post.title }}</span>
      </nav>

      <!-- Article Header -->
      <header class="border-b border-brand-border pb-8">
        <h1 class="text-4xl font-bold leading-tight md:text-5xl">
          {{ post.title }}
        </h1>
        <p class="mt-4 text-xl text-brand-muted">
          {{ post.description }}
        </p>

        <!-- Meta Info -->
        <div class="mt-6 flex flex-wrap items-center gap-4 text-sm">
          <div class="flex items-center gap-2 text-brand-subtle">
            <Icon name="heroicons:calendar" class="h-5 w-5" />
            <span>{{ formatDate(post.date) }}</span>
          </div>
          <div v-if="post.readingTime" class="flex items-center gap-2 text-brand-subtle">
            <Icon name="heroicons:clock" class="h-5 w-5" />
            <span>{{ post.readingTime }} {{ t('common.readingTime') }}</span>
          </div>
          <div v-if="post.updated" class="flex items-center gap-2 text-brand-subtle">
            <Icon name="heroicons:arrow-path" class="h-5 w-5" />
            <span>{{ t('common.updated') }} {{ formatDate(post.updated) }}</span>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="post.tags?.length" class="mt-4 flex flex-wrap gap-2">
          <NuxtLink
            v-for="tag in post.tags"
            :key="tag"
            :to="`/blog?tag=${tag}`"
            class="rounded-full bg-brand-surface px-3 py-1 text-sm text-brand-muted hover:bg-brand-border hover:text-brand-primary"
          >
            #{{ tag }}
          </NuxtLink>
        </div>
      </header>

      <!-- Article Content -->
      <div class="prose prose-lg mt-12 max-w-none pb-12">
        <ContentRenderer :value="post" />
      </div>

      <!-- Back to Blog -->
      <div class="border-t border-brand-border py-8">
        <NuxtLink
          to="/blog"
          class="inline-flex items-center gap-2 text-brand-primary hover:underline"
        >
          <Icon name="heroicons:arrow-left" class="h-5 w-5" />
          <span>{{ t('common.backTo') }} {{ t('blog.title') }}</span>
        </NuxtLink>
      </div>

      <!-- Related Posts -->
      <div v-if="relatedPosts?.length" class="border-t border-brand-border py-12">
        <h2 class="text-2xl font-bold">{{ t('blog.relatedArticles') }}</h2>
        <div class="mt-6 grid gap-6 md:grid-cols-3">
          <NuxtLink
            v-for="related in relatedPosts"
            :key="related.path"
            :to="related.path"
            class="group flex flex-col rounded-lg border border-brand-border bg-brand-surface p-4 transition-all hover:border-brand-primary hover:shadow-md"
          >
            <h3 class="font-semibold leading-tight group-hover:text-brand-primary">
              {{ related.title }}
            </h3>
            <p class="mt-2 line-clamp-2 text-sm text-brand-muted">
              {{ related.description }}
            </p>
            <div class="mt-3 text-xs text-brand-subtle">
              {{ formatDate(related.date) }}
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </article>
</template>
