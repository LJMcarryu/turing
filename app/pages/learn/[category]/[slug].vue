<script setup lang="ts">
const { t } = useI18n()
const { formatDate } = useFormatDate()

const route = useRoute()
const article = await getLearnArticle(route.path)

useSeoMeta({
  title: `${article.value.title} — Turing`,
  description: article.value.description,
  ogTitle: article.value.title,
  ogDescription: article.value.description,
  ogImage: article.value.cover,
  ogType: 'article',
  articlePublishedTime: article.value.date,
  articleAuthor: ['Jimmy Liu'],
})

const categoryName = computed(() => t(`learn.categories.${article.value!.category}`) || article.value!.category)
const heroImg = computed(() => article.value?.cover
  ? { src: article.value.cover, alt: article.value.title }
  : useArticleImage(route.path, 'hero'))
const sideImg = computed(() => useArticleImage(route.path, 'portrait', 1))

const { data: relatedArticles } = useRelatedArticles(article)
</script>

<template>
  <article v-if="article">
    <header class="border-b border-[var(--rule)]">
      <div class="mx-auto max-w-[1100px] px-6 pt-12 pb-12">
        <nav class="meta mb-8 flex items-center gap-2">
          <NuxtLink to="/" class="hover:text-[var(--cobalt)]">Home</NuxtLink>
          <span>/</span>
          <NuxtLink to="/learn" class="hover:text-[var(--cobalt)]">{{ t('learn.title') }}</NuxtLink>
          <span>/</span>
          <NuxtLink :to="`/learn/${article.category}`" class="hover:text-[var(--cobalt)]">{{ categoryName }}</NuxtLink>
        </nav>
        <div class="mb-5 flex flex-wrap items-baseline gap-4">
          <span class="meta text-[var(--cobalt)]">{{ categoryName }}</span>
          <LevelBadge v-if="article.level" :level="article.level" />
        </div>
        <h1 class="mag-1">{{ article.title }}</h1>
        <p class="dek mt-8">{{ article.description }}</p>

        <div class="meta mt-10 flex flex-wrap gap-x-6 gap-y-2">
          <span>By <span class="text-[var(--ink)]">Jimmy Liu</span></span>
          <span>{{ formatDate(article.date) }}</span>
          <span v-if="article.readingTime">{{ article.readingTime }} {{ t('common.readingTime') }}</span>
        </div>

        <div v-if="article.tags?.length" class="mt-4 flex flex-wrap gap-x-4">
          <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </header>

    <figure class="figure">
      <div class="ar-cinema overflow-hidden">
        <img :src="heroImg.src" :alt="heroImg.alt" loading="eager">
      </div>
      <figcaption class="mx-auto max-w-[1100px] px-6">
        <div class="figure__caption">
          <span class="figure__caption-num">Fig. 01</span>
          <span>Opening plate.</span>
        </div>
      </figcaption>
    </figure>

    <section class="mx-auto max-w-[1100px] px-6 py-16">
      <div class="grid gap-x-10 md:grid-cols-12">
        <div class="prose md:col-span-8 max-w-none">
          <ContentRenderer :value="article" />
        </div>
        <aside class="mt-12 md:col-span-4 md:mt-0">
          <figure class="figure md:sticky md:top-12">
            <div class="ar-portrait overflow-hidden">
              <img :src="sideImg.src" :alt="sideImg.alt" loading="lazy">
            </div>
            <figcaption class="figure__caption">
              <span class="figure__caption-num">Fig. 02</span>
              <span>A reference image.</span>
            </figcaption>
          </figure>
        </aside>
      </div>
    </section>

    <section class="border-t border-[var(--rule)] bg-[var(--paper-2)]">
      <div class="mx-auto max-w-[1536px] px-6 py-20">
        <NuxtLink :to="`/learn/${article.category}`" class="link-more mb-10 inline-flex">← {{ t('common.backTo') }} {{ categoryName }}</NuxtLink>

        <div v-if="relatedArticles?.length" class="mt-10">
          <div class="section-head mb-10">
            <div>
              <p class="kicker kicker--cobalt mb-2">Continue</p>
              <h2 class="mag-2">{{ t('learn.relatedTutorials') }}</h2>
            </div>
          </div>

          <div class="grid gap-x-8 gap-y-12 md:grid-cols-3">
            <NuxtLink
              v-for="related in relatedArticles"
              :key="related.path"
              :to="related.path"
              class="tile group"
            >
              <figure class="figure figure--zoom">
                <div class="ar-card overflow-hidden">
                  <img :src="useArticleImage(related.path, 'card').src" :alt="useArticleImage(related.path, 'card').alt" loading="lazy">
                </div>
              </figure>
              <div>
                <div class="mb-2"><LevelBadge v-if="related.level" :level="related.level" /></div>
                <h3 class="mag-4 transition-colors group-hover:text-[var(--cobalt)]">{{ related.title }}</h3>
                <p class="tile__dek mt-2 line-clamp-2">{{ related.description }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>
