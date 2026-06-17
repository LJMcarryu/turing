<script setup lang="ts">
const { t } = useI18n()
const { formatDate } = useFormatDate()

const route = useRoute()
const post = await getBlogPost(route.path)

const heroImg = computed(() => useArticleImageFromEntry(post.value, 'hero'))

useSeoMeta({
  title: `${post.value.title} — Turing`,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogImage: post.value.cover || heroImg.value.src,
  ogType: 'article',
  articlePublishedTime: post.value.date,
  articleModifiedTime: post.value.updated || post.value.date,
  articleAuthor: ['Jimmy Liu'],
  articleTag: post.value.tags,
})

const { data: relatedPosts } = useRelatedPosts(post)

// 目录：取 @nuxt/content 的 body.toc（SSR 友好）；章节数 ≥3 才启用「正文 + 右侧 TOC」两列版式
const tocLinks = computed(() => getTocLinks(post.value))
const hasToc = computed(() => tocCount(tocLinks.value) >= 3)
</script>

<template>
  <article v-if="post">
    <!-- Header text on paper, hero image follows -->
    <header class="border-b border-[var(--rule)]">
      <div class="mx-auto max-w-[1200px] px-6 pt-12 pb-12">
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
      <figcaption class="mx-auto max-w-[1200px] px-6">
        <div class="figure__caption">
          <span class="figure__caption-num">Fig. 01</span>
          <a
            v-if="heroImg.creditUrl"
            :href="heroImg.creditUrl"
            target="_blank"
            rel="noopener noreferrer nofollow"
            class="hover:text-[var(--cobalt)]"
          >{{ heroImg.credit }}</a>
          <span v-else>Opening plate.</span>
        </div>
      </figcaption>
    </figure>

    <!-- Body — readable column with optional sticky TOC -->
    <section class="mx-auto max-w-[1200px] px-6 py-16">
      <div v-if="hasToc" class="article-layout">
        <div class="article-main">
          <ArticleToc :links="tocLinks" variant="inline" class="lg:hidden" />
          <div class="prose max-w-none">
            <ContentRenderer :value="post" />
          </div>
        </div>
        <aside class="hidden lg:block">
          <ArticleToc :links="tocLinks" variant="sticky" />
        </aside>
      </div>
      <div v-else class="prose max-w-none">
        <ContentRenderer :value="post" />
      </div>
    </section>

    <!-- Related -->
    <section class="border-t border-[var(--rule)] bg-[var(--paper-2)]">
      <div class="mx-auto max-w-[1536px] px-6 py-20">
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
