<script setup lang="ts">
const { t } = useI18n()
const { formatDate } = useFormatDate()

const route = useRoute()
const project = await getProject(route.path)

const heroImg = useArticleImageFromEntry(project.value, 'hero')

useSeoMeta({
  title: `${project.value.title} — Turing`,
  description: project.value.description,
  ogTitle: project.value.title,
  ogDescription: project.value.description,
  ogImage: heroImg.src,
  ogType: 'website',
})

const { data: otherProjects } = useOtherProjects(project)

const { projectStatusClass, projectStatusLabel } = useProjectStatus()

// 目录：取 @nuxt/content 的 body.toc（SSR 友好）；章节数 ≥3 才启用「正文 + 右侧 TOC」两列版式
const tocLinks = computed(() => getTocLinks(project.value))
const hasToc = computed(() => tocCount(tocLinks.value) >= 3)
</script>

<template>
  <article v-if="project">
    <header class="border-b border-[var(--rule)]">
      <div class="mx-auto max-w-[1200px] px-6 pt-12 pb-12">
        <nav class="meta mb-8 flex items-center gap-2">
          <NuxtLink to="/" class="hover:text-[var(--cobalt)]">Home</NuxtLink>
          <span>/</span>
          <NuxtLink to="/projects" class="hover:text-[var(--cobalt)]">{{ t('projects.title') }}</NuxtLink>
        </nav>
        <div class="mb-5 flex flex-wrap items-baseline gap-4">
          <span class="pill" :class="projectStatusClass(project.status)">{{ projectStatusLabel(project.status) }}</span>
          <span v-if="project.date" class="meta">{{ formatDate(project.date) }}</span>
        </div>
        <h1 class="mag-1">{{ project.title }}</h1>
        <p class="dek mt-8">{{ project.description }}</p>

        <div v-if="project.tags?.length" class="mt-6 flex flex-wrap gap-x-4">
          <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <div v-if="project.github" class="mt-8">
          <a :href="project.github" target="_blank" rel="noopener noreferrer" class="btn-ink">
            {{ t('common.viewSource') }} ↗
          </a>
        </div>
      </div>
    </header>

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
          <span v-else>{{ project.title }}</span>
        </div>
      </figcaption>
    </figure>

    <section class="mx-auto max-w-[1200px] px-6 py-16">
      <div v-if="hasToc" class="article-layout">
        <div class="article-main">
          <ArticleToc :links="tocLinks" variant="inline" class="lg:hidden" />
          <div class="prose max-w-none">
            <ContentRenderer :value="project" />
          </div>
        </div>
        <aside class="hidden lg:block">
          <ArticleToc :links="tocLinks" variant="sticky" />
        </aside>
      </div>
      <div v-else class="prose max-w-none">
        <ContentRenderer :value="project" />
      </div>
    </section>

    <section class="border-t border-[var(--rule)] bg-[var(--paper-2)]">
      <div class="mx-auto max-w-[1536px] px-6 py-20">
        <NuxtLink to="/projects" class="link-more mb-10 inline-flex">← {{ t('common.backTo') }} {{ t('projects.title') }}</NuxtLink>

        <div v-if="otherProjects?.length" class="mt-10">
          <div class="section-head mb-10">
            <div>
              <p class="kicker kicker--cobalt mb-2">Elsewhere in the ledger</p>
              <h2 class="mag-2">{{ t('projects.otherProjects') }}</h2>
            </div>
          </div>

          <div class="grid gap-x-8 gap-y-12 md:grid-cols-3">
            <NuxtLink
              v-for="other in otherProjects"
              :key="other.path"
              :to="other.path"
              class="tile group"
            >
              <figure class="figure figure--zoom">
                <div class="ar-card overflow-hidden">
                  <img :src="useArticleImage(other.path, 'card').src" :alt="useArticleImage(other.path, 'card').alt" loading="lazy">
                </div>
              </figure>
              <div>
                <div class="mb-2"><span class="pill" :class="projectStatusClass(other.status)">{{ projectStatusLabel(other.status) }}</span></div>
                <h3 class="mag-4 transition-colors group-hover:text-[var(--cobalt)]">{{ other.title }}</h3>
                <p class="tile__dek mt-2 line-clamp-2">{{ other.description }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>
