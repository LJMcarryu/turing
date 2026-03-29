<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: `${t('learn.title')} — Turing`,
  description: t('learn.subtitle'),
})

const levelFilter = ref('')

const { data: articles, error } = await useAsyncData('learn-all', () =>
  queryCollection('learn').order('date', 'DESC').all()
)

if (error.value) {
  throw createError({ statusCode: 500, message: t('error.loadFailed') })
}

const categories = [
  { value: 'claude-code', icon: 'heroicons:command-line', color: 'primary' },
  { value: 'prompt-engineering', icon: 'heroicons:chat-bubble-left-right', color: 'accent' },
  { value: 'agent-development', icon: 'heroicons:cpu-chip', color: 'secondary' },
  { value: 'mcp', icon: 'heroicons:puzzle-piece', color: 'primary' },
]

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
        <div class="text-center">
          <h1 class="text-5xl font-bold md:text-6xl">
            <span class="text-gradient">{{ t('learn.title') }}</span>
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-xl text-brand-muted">
            {{ t('learn.subtitle') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="px-4 py-12">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-8 text-3xl font-bold">{{ t('learn.learningPath') }}</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-for="(cat, index) in categories"
            :key="cat.value"
            :to="`/learn/${cat.value}`"
            class="card group p-6 text-center"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-surface">
              <Icon :name="cat.icon" class="h-8 w-8 text-brand-primary" />
            </div>
            <h3 class="text-lg font-bold group-hover:text-brand-primary">
              {{ t(`learn.categories.${cat.value}`) }}
            </h3>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- All Tutorials -->
    <section class="px-4 py-12">
      <div class="mx-auto max-w-6xl">
        <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-3xl font-bold">{{ t('learn.allTutorials') }}</h2>
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
          <p class="mt-4 text-brand-muted">{{ t('learn.noTutorialsLevel') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
