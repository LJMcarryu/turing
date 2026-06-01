<script setup lang="ts">
const { t } = useI18n()
const { formatDate } = useFormatDate()

useSeoMeta({ title: `${t('blog.title')} — Turing`, description: t('blog.subtitle') })

const { data: posts, error } = await useAsyncData('blog-all', () =>
  queryCollection('blog').order('date', 'DESC').all(),
)
if (error.value) throw createError({ statusCode: 500, message: t('error.loadFailed') })

const allTags = computed(() => {
  const tags = new Set<string>()
  posts.value?.forEach(p => p.tags?.forEach(tag => tags.add(tag)))
  return Array.from(tags).sort()
})
const selectedTag = ref<string | null>(null)
const filteredPosts = computed(() => {
  if (!selectedTag.value) return posts.value
  return posts.value?.filter(p => p.tags?.includes(selectedTag.value!))
})
</script>

<template>
  <article>
    <header class="border-b border-[var(--ink)]">
      <div class="mx-auto max-w-[1320px] px-6 pt-10 pb-12">
        <div class="mb-6 flex flex-wrap items-baseline gap-4 border-b border-[var(--rule)] pb-3">
          <span class="meta text-[var(--cobalt)]">№ 03 — Dispatches</span>
          <span class="meta">{{ posts?.length ?? 0 }} entries</span>
        </div>
        <p class="kicker kicker--cobalt mb-5">Notes &amp; essays</p>
        <h1 class="mag-1">{{ t('blog.title') }}<span class="mag-italic text-[var(--cobalt)]">.</span></h1>
        <p class="dek mt-6 max-w-[44ch]">{{ t('blog.subtitle') }}</p>
      </div>
    </header>

    <div v-if="allTags.length" class="border-b border-[var(--rule)] bg-[var(--paper-2)]">
      <div class="mx-auto flex max-w-[1320px] flex-wrap items-baseline gap-x-5 gap-y-2 px-6 py-4">
        <span class="kicker mr-2">Filed under</span>
        <button
          class="text-sm font-medium transition-colors"
          :class="!selectedTag ? 'text-[var(--cobalt)] underline underline-offset-4 decoration-1' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'"
          @click="selectedTag = null"
        >
          All
        </button>
        <button
          v-for="tag in allTags"
          :key="tag"
          class="text-sm font-medium transition-colors"
          :class="selectedTag === tag ? 'text-[var(--cobalt)] underline underline-offset-4 decoration-1' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'"
          @click="selectedTag = tag"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <section class="mx-auto max-w-[1320px] px-6 py-16">
      <!-- Featured + grid -->
      <div v-if="filteredPosts?.length" class="grid gap-x-8 gap-y-16 md:grid-cols-12">
        <!-- First: featured editorial layout -->
        <NuxtLink
          v-if="filteredPosts[0]"
          :to="filteredPosts[0].path"
          class="group md:col-span-12 grid gap-x-10 md:grid-cols-12"
        >
          <figure class="figure figure--zoom mb-6 md:col-span-7 md:mb-0">
            <div class="ar-wide overflow-hidden">
              <img :src="useArticleImage(filteredPosts[0].path, 'wide').src" :alt="useArticleImage(filteredPosts[0].path, 'wide').alt" loading="eager">
            </div>
          </figure>
          <div class="md:col-span-5 md:self-center">
            <span class="meta text-[var(--cobalt)]">Latest · {{ formatDate(filteredPosts[0].date) }}</span>
            <h2 class="mag-2 mt-3 transition-colors group-hover:text-[var(--cobalt)]">
              {{ filteredPosts[0].title }}
            </h2>
            <p class="dek mt-6 text-base font-body not-italic">{{ filteredPosts[0].description }}</p>
            <p v-if="filteredPosts[0].readingTime" class="meta mt-4">{{ filteredPosts[0].readingTime }} {{ t('common.min') }} read</p>
          </div>
        </NuxtLink>

        <!-- 3-up grid for the rest -->
        <NuxtLink
          v-for="post in filteredPosts.slice(1)"
          :key="post.path"
          :to="post.path"
          class="tile group md:col-span-4"
        >
          <figure class="figure figure--zoom">
            <div class="ar-card overflow-hidden">
              <img :src="useArticleImage(post.path, 'card').src" :alt="useArticleImage(post.path, 'card').alt" loading="lazy">
            </div>
          </figure>
          <div>
            <span class="meta">{{ formatDate(post.date) }}</span>
            <h3 class="mag-4 mt-2 transition-colors group-hover:text-[var(--cobalt)]">{{ post.title }}</h3>
            <p class="tile__dek mt-2 line-clamp-2">{{ post.description }}</p>
            <div v-if="post.tags?.length" class="mt-3 flex flex-wrap gap-x-3">
              <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="py-20 text-center">
        <p class="kicker mb-3">No entries</p>
        <p class="dek">{{ selectedTag ? t('blog.noArticlesWithTag', { tag: selectedTag }) : t('blog.noArticles') }}</p>
      </div>
    </section>
  </article>
</template>
