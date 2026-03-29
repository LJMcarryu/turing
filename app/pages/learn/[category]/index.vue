<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const category = route.params.category as string

const categoryName = computed(() => t(`learn.categories.${category}`) || category)

useSeoMeta({
  title: `${categoryName.value} — ${t('learn.title')} — Turing`,
  description: `${categoryName.value} ${t('learn.tutorialList')}`,
})

const levelFilter = ref('')

const { data: articles, error } = await useAsyncData(`learn-${category}`, () =>
  queryCollection('learn').where('category', '=', category).order('date', 'DESC').all()
)

if (error.value) {
  throw createError({ statusCode: 500, message: t('error.loadFailed') })
}

const levels = computed(() => [
  { label: t('common.all'), value: '' },
  { label: t('learn.levels.beginner'), value: 'beginner' },
  { label: t('learn.levels.intermediate'), value: 'intermediate' },
  { label: t('learn.levels.advanced'), value: 'advanced' },
])

const filteredArticles = computed(() => {
  if (!articles.value) return []
  if (!levelFilter.value) return articles.value
  return articles.value.filter((a) => a.level === levelFilter.value)
})
</script>

<template>
  <div class="gradient-bg min-h-screen">
    <!-- Header -->
    <section class="px-4 py-20">
      <div class="mx-auto max-w-6xl">
        <NuxtLink
          to="/learn"
          class="group inline-flex items-center gap-2 text-brand-primary transition-all hover:gap-3"
        >
          <Icon name="heroicons:arrow-left" class="h-5 w-5" />
          <span class="font-semibold">{{ t('common.backTo') }} {{ t('learn.title') }}</span>
        </NuxtLink>
        <h1 class="mt-6 text-5xl font-bold md:text-6xl">
          <span class="text-gradient">{{ categoryName }}</span>
        </h1>
      </div>
    </section>

    <!-- Tutorials -->
    <section class="px-4 py-12">
      <div class="mx-auto max-w-6xl">
        <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-3xl font-bold">{{ t('learn.tutorialList') }}</h2>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="level in levels"
              :key="level.value"
              @click="levelFilter = level.value"
              :class="[
                'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                levelFilter === level.value
                  ? 'bg-brand-primary text-brand-bg'
                  : 'bg-brand-surface text-brand-muted hover:bg-brand-card hover:text-brand-text'
              ]"
            >
              {{ level.label }}
            </button>
          </div>
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="(article, index) in filteredArticles"
            :key="article.path"
            :to="article.path"
            class="card group p-6"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="mb-3 flex items-center justify-between">
              <span class="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold uppercase text-brand-primary">
                {{ article.category }}
              </span>
              <LevelBadge v-if="article.level" :level="article.level" />
            </div>
            <h3 class="text-xl font-bold leading-tight group-hover:text-brand-primary">
              {{ article.title }}
            </h3>
            <p class="mt-3 line-clamp-2 text-sm text-brand-muted">
              {{ article.description }}
            </p>
            <div class="mt-4 flex items-center gap-3 text-xs text-brand-subtle">
              <span v-if="article.readingTime" class="flex items-center gap-1">
                <Icon name="heroicons:clock" class="h-4 w-4" />
                {{ article.readingTime }} {{ t('common.readingTime') }}
              </span>
              <span v-if="article.tags?.length" class="flex items-center gap-1">
                <Icon name="heroicons:tag" class="h-4 w-4" />
                {{ article.tags.length }} {{ t('common.tags') }}
              </span>
            </div>
          </NuxtLink>
        </div>

        <div v-if="filteredArticles.length === 0" class="py-20 text-center">
          <Icon name="heroicons:academic-cap" class="mx-auto h-16 w-16 text-brand-subtle" />
          <p class="mt-4 text-brand-muted">{{ t('learn.noTutorials') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
