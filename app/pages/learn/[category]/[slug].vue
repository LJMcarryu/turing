<script setup lang="ts">
const { t } = useI18n()
const { formatDate } = useFormatDate()

const route = useRoute()
const { data: article } = await useAsyncData(route.path, () =>
  queryCollection('learn').path(route.path).first()
)

if (!article.value) {
  throw createError({ statusCode: 404, message: t('error.notFound') })
}

useSeoMeta({
  title: `${article.value.title} — Turing`,
  description: article.value.description,
  ogTitle: article.value.title,
  ogDescription: article.value.description,
  ogImage: article.value.cover,
  ogType: 'article',
  articlePublishedTime: article.value.date,
  articleAuthor: 'Jimmy Liu',
})

const categoryName = computed(() => t(`learn.categories.${article.value.category}`) || article.value.category)

const { data: relatedArticles } = await useAsyncData(`related-${route.path}`, async () => {
  const all = await queryCollection('learn')
    .where('category', '=', article.value.category)
    .order('date', 'DESC')
    .limit(4)
    .all()

  return all
    .filter(a => a.path !== article.value.path)
    .slice(0, 3)
})
</script>

<template>
  <article v-if="article" class="min-h-screen">
    <!-- Header -->
    <section class="gradient-bg px-4 py-20">
      <div class="mx-auto max-w-4xl">
        <nav class="flex items-center gap-2 text-sm text-brand-subtle">
          <NuxtLink to="/" class="hover:text-brand-primary">{{ t('nav.home') }}</NuxtLink>
          <Icon name="heroicons:chevron-right" class="h-4 w-4" />
          <NuxtLink to="/learn" class="hover:text-brand-primary">{{ t('learn.title') }}</NuxtLink>
          <Icon name="heroicons:chevron-right" class="h-4 w-4" />
          <NuxtLink :to="`/learn/${article.category}`" class="hover:text-brand-primary">
            {{ categoryName }}
          </NuxtLink>
        </nav>

        <div class="mt-8">
          <div class="flex flex-wrap items-center gap-3">
            <span class="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold uppercase text-brand-primary">
              {{ article.category }}
            </span>
            <LevelBadge :level="article.level" />
            <span class="flex items-center gap-1 text-sm text-brand-subtle">
              <Icon name="heroicons:clock" class="h-4 w-4" />
              {{ article.readingTime }} {{ t('common.readingTime') }}
            </span>
            <span class="text-sm text-brand-subtle">
              {{ formatDate(article.date) }}
            </span>
          </div>

          <h1 class="mt-6 text-4xl font-bold leading-tight md:text-5xl">
            {{ article.title }}
          </h1>
          <p class="mt-4 text-xl text-brand-muted">
            {{ article.description }}
          </p>

          <div v-if="article.tags?.length" class="mt-6 flex flex-wrap gap-2">
            <span
              v-for="tag in article.tags"
              :key="tag"
              class="rounded-full bg-brand-surface px-3 py-1 text-sm text-brand-muted"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="px-4 py-12">
      <div class="mx-auto max-w-4xl">
        <div class="prose prose-lg max-w-none">
          <ContentRenderer :value="article" />
        </div>
      </div>
    </section>

    <!-- Related Articles -->
    <section v-if="relatedArticles?.length" class="px-4 py-12">
      <div class="mx-auto max-w-4xl">
        <div class="mb-8 border-t border-brand-border pt-8">
          <h2 class="text-3xl font-bold">{{ t('learn.relatedTutorials') }}</h2>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <NuxtLink
            v-for="related in relatedArticles"
            :key="related.path"
            :to="related.path"
            class="card group p-6"
          >
            <div class="mb-3 flex items-center justify-between">
              <LevelBadge :level="related.level" />
            </div>
            <h3 class="font-bold leading-tight group-hover:text-brand-primary">
              {{ related.title }}
            </h3>
            <p class="mt-2 line-clamp-2 text-sm text-brand-muted">
              {{ related.description }}
            </p>
            <div class="mt-3 text-xs text-brand-subtle">
              {{ related.readingTime }} {{ t('common.readingTime') }}
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Back to Category -->
    <section class="px-4 py-8">
      <div class="mx-auto max-w-4xl border-t border-brand-border pt-8">
        <NuxtLink
          :to="`/learn/${article.category}`"
          class="group inline-flex items-center gap-2 text-brand-primary transition-all hover:gap-3"
        >
          <Icon name="heroicons:arrow-left" class="h-5 w-5" />
          <span class="font-semibold">{{ t('common.backTo') }} {{ categoryName }}</span>
        </NuxtLink>
      </div>
    </section>
  </article>
</template>
