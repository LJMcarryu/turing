<script setup lang="ts">
const { t } = useI18n()
const { formatDate } = useFormatDate()

useSeoMeta({
  title: `${t('blog.title')} — Turing`,
  description: t('blog.subtitle'),
})

const { data: posts, error } = await useAsyncData('blog-all', () =>
  queryCollection('blog').order('date', 'DESC').all()
)

if (error.value) {
  throw createError({ statusCode: 500, message: t('error.loadFailed') })
}

const allTags = computed(() => {
  const tags = new Set<string>()
  posts.value?.forEach(post => {
    post.tags?.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
})

const selectedTag = ref<string | null>(null)
const filteredPosts = computed(() => {
  if (!selectedTag.value) return posts.value
  return posts.value?.filter(post =>
    post.tags?.includes(selectedTag.value!)
  )
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-12">
    <!-- Header -->
    <div class="mb-12 text-center">
      <h1 class="text-4xl font-bold">{{ t('blog.title') }}</h1>
      <p class="mt-3 text-lg text-brand-muted">
        {{ t('blog.subtitle') }}
      </p>
    </div>

    <!-- Tag Filter -->
    <div v-if="allTags.length" class="mb-8 flex flex-wrap justify-center gap-2">
      <button
        @click="selectedTag = null"
        :class="[
          'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
          !selectedTag
            ? 'bg-brand-primary text-white'
            : 'bg-brand-surface text-brand-muted hover:bg-brand-border'
        ]"
      >
        {{ t('common.all') }}
      </button>
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="selectedTag = tag"
        :class="[
          'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
          selectedTag === tag
            ? 'bg-brand-primary text-white'
            : 'bg-brand-surface text-brand-muted hover:bg-brand-border'
        ]"
      >
        {{ tag }}
      </button>
    </div>

    <!-- Blog Grid -->
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="post in filteredPosts"
        :key="post.path"
        :to="post.path"
        class="group flex flex-col overflow-hidden rounded-xl border border-brand-border bg-brand-surface transition-all hover:border-brand-primary hover:shadow-lg"
      >
        <!-- Cover Image -->
        <div class="aspect-video w-full overflow-hidden bg-gradient-to-br from-brand-primary/20 to-brand-accent/20">
          <img
            v-if="post.cover"
            :src="post.cover"
            :alt="post.title"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div v-else class="flex h-full items-center justify-center">
            <Icon name="heroicons:document-text" class="h-16 w-16 text-brand-muted" />
          </div>
        </div>

        <!-- Content -->
        <div class="flex flex-1 flex-col p-6">
          <h2 class="text-xl font-semibold leading-tight group-hover:text-brand-primary">
            {{ post.title }}
          </h2>
          <p class="mt-2 line-clamp-2 flex-1 text-sm text-brand-muted">
            {{ post.description }}
          </p>

          <!-- Meta -->
          <div class="mt-4 flex items-center justify-between text-xs text-brand-subtle">
            <span>{{ formatDate(post.date) }}</span>
            <span v-if="post.readingTime" class="flex items-center gap-1">
              <Icon name="heroicons:clock" class="h-4 w-4" />
              {{ post.readingTime }} {{ t('common.min') }}
            </span>
          </div>

          <!-- Tags -->
          <div v-if="post.tags?.length" class="mt-3 flex flex-wrap gap-1.5">
            <span
              v-for="tag in post.tags.slice(0, 3)"
              :key="tag"
              class="rounded-md bg-brand-bg px-2 py-0.5 text-xs text-brand-muted"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-if="!filteredPosts?.length" class="py-20 text-center">
      <Icon name="heroicons:document-text" class="mx-auto h-16 w-16 text-brand-subtle" />
      <p class="mt-4 text-brand-muted">
        {{ selectedTag ? t('blog.noArticlesWithTag', { tag: selectedTag }) : t('blog.noArticles') }}
      </p>
    </div>
  </div>
</template>
