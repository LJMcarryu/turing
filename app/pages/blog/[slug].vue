<script setup lang="ts">
const { t } = useI18n()
const { formatDate } = useFormatDate()

const route = useRoute()
const { data: post } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first(),
)
if (!post.value) throw createError({ statusCode: 404, message: t('error.notFound') })

useSeoMeta({
  title: `${post.value.title} — Turing`,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogImage: post.value.cover,
  ogType: 'article',
  articlePublishedTime: post.value.date,
  articleModifiedTime: post.value.updated || post.value.date,
  articleAuthor: ['Jimmy Liu'],
  articleTag: post.value.tags,
})

const heroImg = computed(() => post.value?.cover
  ? { src: post.value.cover, alt: post.value.title }
  : useArticleImage(route.path, 'hero'))
const sideImg = computed(() => useArticleImage(route.path, 'portrait', 1))

const { data: relatedPosts } = await useAsyncData(`related-${route.path}`, async () => {
  if (!post.value?.tags?.length) return []
  const all = await queryCollection('blog').order('date', 'DESC').limit(20).all()
  return all
    .filter(p => p.path !== post.value!.path && p.tags?.some(tag => post.value!.tags?.includes(tag)))
    .slice(0, 3)
})
</script>

<template>
  <article v-if="post">
    <!-- Header text on paper, hero image follows -->
    <header class="border-b border-[var(--rule)]">
      <div class="mx-auto max-w-[1100px] px-6 pt-12 pb-12">
        <nav class="meta mb-8 flex items-center gap-2">
          <NuxtLink to="/" class="hover:text-[var(--cobalt)]">Home</NuxtLink>
          <span>/</span>
          <NuxtLink to="/blog" class="hover:text-[var(--cobalt)]">{{ t('blog.title') }}</NuxtLink>
        </nav>
        <p class="kicker kicker--cobalt mb-5">Dispatch · {{ formatDate(post.date) }}</p>
        <h1 class="mag-1">{{ post.title }}</h1>
        <p class="dek mt-8">{{ post.description }}</p>

        <div class="meta mt-10 flex flex-wrap gap-x-6 gap-y-2">
          <span>By <span class="text-[var(--ink)]">Jimmy Liu</span></span>
          <span>{{ formatDate(post.date) }}</span>
          <span v-if="post.readingTime">{{ post.readingTime }} {{ t('common.readingTime') }}</span>
          <span v-if="post.updated">{{ t('common.updated') }} {{ formatDate(post.updated) }}</span>
        </div>

        <div v-if="post.tags?.length" class="mt-4 flex flex-wrap gap-x-4">
          <NuxtLink v-for="tag in post.tags" :key="tag" :to="`/blog?tag=${tag}`" class="tag hover:text-[var(--cobalt)]">{{ tag }}</NuxtLink>
        </div>
      </div>
    </header>

    <!-- Full-bleed hero image -->
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

    <!-- Body with floating sidebar image -->
    <section class="mx-auto max-w-[1100px] px-6 py-16">
      <div class="grid gap-x-10 md:grid-cols-12">
        <div class="prose md:col-span-8 max-w-none">
          <ContentRenderer :value="post" />
        </div>
        <aside class="mt-12 md:col-span-4 md:mt-0">
          <figure class="figure md:sticky md:top-12">
            <div class="ar-portrait overflow-hidden">
              <img :src="sideImg.src" :alt="sideImg.alt" loading="lazy">
            </div>
            <figcaption class="figure__caption">
              <span class="figure__caption-num">Fig. 02</span>
              <span>An accompanying image.</span>
            </figcaption>
          </figure>
        </aside>
      </div>
    </section>

    <!-- Related -->
    <section class="border-t border-[var(--rule)] bg-[var(--paper-2)]">
      <div class="mx-auto max-w-[1320px] px-6 py-20">
        <NuxtLink to="/blog" class="link-more mb-10 inline-flex">← {{ t('common.backTo') }} {{ t('blog.title') }}</NuxtLink>

        <div v-if="relatedPosts?.length" class="mt-10">
          <div class="section-head mb-10">
            <div>
              <p class="kicker kicker--cobalt mb-2">Further reading</p>
              <h2 class="mag-2">{{ t('blog.relatedArticles') }}</h2>
            </div>
          </div>

          <div class="grid gap-x-8 gap-y-12 md:grid-cols-3">
            <NuxtLink
              v-for="related in relatedPosts"
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
                <span class="meta">{{ formatDate(related.date) }}</span>
                <h3 class="mag-4 mt-2 transition-colors group-hover:text-[var(--cobalt)]">{{ related.title }}</h3>
                <p class="tile__dek mt-2 line-clamp-2">{{ related.description }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>
