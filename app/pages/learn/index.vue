<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({ title: `${t('learn.title')} — Turing`, description: t('learn.subtitle') })

const levelFilter = ref('')

const { articles } = await useLearnArticles()

const categories = [
  { value: 'claude-code' },
  { value: 'prompt-engineering' },
  { value: 'agent-development' },
  { value: 'mcp' },
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
  return articles.value.filter(a => a.level === levelFilter.value)
})
</script>

<template>
  <article>
    <header class="border-b border-[var(--ink)]">
      <div class="mx-auto max-w-[1536px] px-6 pt-10 pb-12">
        <div class="mb-6 flex flex-wrap items-baseline gap-4 border-b border-[var(--rule)] pb-3">
          <span class="meta text-[var(--cobalt)]">№ 01 — Field Manual</span>
          <span class="meta">{{ articles?.length ?? 0 }} tutorials</span>
        </div>
        <p class="kicker kicker--cobalt mb-5">A working manual</p>
        <h1 class="mag-1">{{ t('learn.title') }}<span class="mag-italic text-[var(--cobalt)]">.</span></h1>
        <p class="dek mt-6 max-w-[44ch]">{{ t('learn.subtitle') }}</p>
      </div>
    </header>

    <!-- Departments as image-led tiles -->
    <section class="mx-auto max-w-[1536px] px-6 py-16">
      <div class="section-head mb-12">
        <div>
          <p class="kicker kicker--cobalt mb-2">Departments</p>
          <h2 class="mag-2">{{ t('learn.learningPath') }}</h2>
        </div>
      </div>

      <div class="grid gap-x-8 gap-y-10 md:grid-cols-4">
        <NuxtLink
          v-for="(cat, i) in categories"
          :key="cat.value"
          :to="`/learn/${cat.value}`"
          class="tile group"
        >
          <figure class="figure figure--zoom">
            <div class="ar-square overflow-hidden">
              <img :src="useArticleImage(cat.value, 'square').src" :alt="useArticleImage(cat.value, 'square').alt" loading="lazy">
            </div>
          </figure>
          <div>
            <span class="meta text-[var(--cobalt)]">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="mag-4 mt-1 transition-colors group-hover:text-[var(--cobalt)]">{{ t(`learn.categories.${cat.value}`) }}</h3>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- All tutorials, asymmetric magazine grid -->
    <section class="border-t border-[var(--rule)] bg-[var(--paper-2)]">
      <div class="mx-auto max-w-[1536px] px-6 py-16">
        <div class="section-head mb-12">
          <div>
            <p class="kicker kicker--cobalt mb-2">Index</p>
            <h2 class="mag-2">{{ t('learn.allTutorials') }}</h2>
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
              <div class="mb-2 flex flex-wrap items-baseline gap-3">
                <span class="meta text-[var(--cobalt)]">{{ article.category }}</span>
                <LevelBadge v-if="article.level" :level="article.level" />
              </div>
              <h3 class="mag-4 transition-colors group-hover:text-[var(--cobalt)]">{{ article.title }}</h3>
              <p class="tile__dek mt-2 line-clamp-2">{{ article.description }}</p>
              <p v-if="article.readingTime" class="meta mt-3">{{ article.readingTime }} {{ t('common.min') }}</p>
            </div>
          </NuxtLink>
        </div>

        <div v-else class="py-20 text-center">
          <p class="kicker mb-3">No entries</p>
          <p class="dek">{{ t('learn.noTutorialsLevel') }}</p>
        </div>
      </div>
    </section>
  </article>
</template>
