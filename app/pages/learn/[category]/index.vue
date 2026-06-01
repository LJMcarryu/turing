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
  queryCollection('learn').where('category', '=', category).order('date', 'DESC').all(),
)
if (error.value) throw createError({ statusCode: 500, message: t('error.loadFailed') })

const heroImg = useArticleImage(category, 'hero')

const levels = computed(() => [
  { label: t('common.all'), value: '' },
  { label: t('learn.levels.beginner'), value: 'beginner' },
  { label: t('learn.levels.intermediate'), value: 'intermediate' },
  { label: t('learn.levels.advanced'), value: 'advanced' },
])
const filteredArticles = computed(() => {
  if (!articles.value) return []
  if (!levelFilter.value) return articles.value
  return articles.value.filter(a => a.level === levelFilter.value)
})
</script>

<template>
  <article>
    <!-- Department cover w/ hero image -->
    <header class="border-b border-[var(--rule)]">
      <div class="mx-auto grid max-w-[1320px] grid-cols-1 gap-0 px-6 pt-8 md:grid-cols-12 md:gap-x-10">
        <div class="md:col-span-6 md:pr-6">
          <nav class="meta mb-6 flex items-center gap-2">
            <NuxtLink to="/" class="hover:text-[var(--cobalt)]">Home</NuxtLink>
            <span>/</span>
            <NuxtLink to="/learn" class="hover:text-[var(--cobalt)]">{{ t('learn.title') }}</NuxtLink>
          </nav>
          <p class="kicker kicker--cobalt mb-5">Sub-department</p>
          <h1 class="mag-1">{{ categoryName }}</h1>
          <p class="meta mt-8">{{ articles?.length ?? 0 }} tutorials filed</p>
        </div>
        <figure class="figure mt-10 md:col-span-6 md:mt-0 md:pb-12">
          <div class="ar-wide overflow-hidden">
            <img :src="heroImg.src" :alt="heroImg.alt" loading="eager">
          </div>
        </figure>
      </div>
    </header>

    <section class="mx-auto max-w-[1320px] px-6 py-16">
      <div class="section-head mb-12">
        <div>
          <p class="kicker kicker--cobalt mb-2">Index</p>
          <h2 class="mag-3">{{ t('learn.tutorialList') }}</h2>
        </div>
        <div class="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <span class="meta mr-1">Level</span>
          <button
            v-for="level in levels"
            :key="level.value"
            class="text-sm font-medium transition-colors"
            :class="levelFilter === level.value ? 'text-[var(--cobalt)] underline underline-offset-4 decoration-1' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'"
            @click="levelFilter = level.value"
          >
            {{ level.label }}
          </button>
        </div>
      </div>

      <div v-if="filteredArticles.length" class="grid gap-x-8 gap-y-14 md:grid-cols-3">
        <NuxtLink
          v-for="article in filteredArticles"
          :key="article.path"
          :to="article.path"
          class="tile group"
        >
          <figure class="figure figure--zoom">
            <div class="ar-card overflow-hidden">
              <img :src="useArticleImage(article.path, 'card').src" :alt="useArticleImage(article.path, 'card').alt" loading="lazy">
            </div>
          </figure>
          <div>
            <div class="mb-2"><LevelBadge v-if="article.level" :level="article.level" /></div>
            <h3 class="mag-4 transition-colors group-hover:text-[var(--cobalt)]">{{ article.title }}</h3>
            <p class="tile__dek mt-2 line-clamp-2">{{ article.description }}</p>
            <div v-if="article.tags?.length" class="mt-3 flex flex-wrap gap-x-3">
              <span v-for="tag in article.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="py-20 text-center">
        <p class="kicker mb-3">No entries</p>
        <p class="dek">{{ t('learn.noTutorials') }}</p>
      </div>
    </section>
  </article>
</template>
