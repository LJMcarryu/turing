<script setup lang="ts">
const { t } = useI18n()
const { formatDate } = useFormatDate()

useSeoMeta({
  title: `Turing — ${t('site.slogan')}`,
  description: t('site.description'),
  ogTitle: `Turing — ${t('site.slogan')}`,
  ogDescription: t('site.description'),
  ogType: 'website',
})

const { data: featuredLearn } = await useAsyncData('featured-learn', () =>
  queryCollection('learn').where('featured', '=', true).limit(4).all(),
)
const { data: latestBlog } = await useAsyncData('latest-blog', () =>
  queryCollection('blog').order('date', 'DESC').limit(4).all(),
)
const { data: projects } = await useAsyncData('projects', () =>
  queryCollection('projects').limit(4).all(),
)

const today = new Date()
const dateline = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

const heroImg = useArticleImage('turing-cover', 'hero')

useScrollReveal()

const periodEl = ref<HTMLElement | null>(null)
onMounted(() => {
  if (import.meta.server) return
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !window.matchMedia('(pointer: fine)').matches
  )
    return
  const arc = document.querySelector<HTMLElement>('.arc')
  if (!arc) return
  let y = 0.5
  let cur = 0.5
  let raf = 0
  const onMove = (e: MouseEvent) => {
    y = Math.min(1, Math.max(0, e.clientY / window.innerHeight))
  }
  const loop = () => {
    cur += (y - cur) * 0.08
    arc.style.setProperty('--arc-y', String(cur))
    raf = requestAnimationFrame(loop)
  }
  window.addEventListener('mousemove', onMove, { passive: true })
  raf = requestAnimationFrame(loop)
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('mousemove', onMove)
  })
})
</script>

<template>
  <div data-theme="noir">
    <!-- ============== COVER ============== -->
    <section class="border-b border-[var(--rule)]">
      <div class="mx-auto grid max-w-[1320px] grid-cols-1 gap-0 px-6 pt-6 pb-0 md:grid-cols-12 md:gap-x-10 md:pt-10">
        <!-- Text column -->
        <div class="reveal md:col-span-7 md:pr-6">
          <div class="mb-5 flex flex-wrap items-baseline gap-4 border-b border-[var(--rule)] pb-3">
            <span class="machine meta">{{ dateline }}</span>
            <span class="machine meta text-[var(--cobalt)]">№ 04 · Cover Story</span>
          </div>
          <p class="kicker kicker--cobalt mb-5">{{ t('home.hero.eyebrow') }}</p>
          <h1 class="mag-1 mag-cjk headline">
            {{ t('home.hero.title') }}<span ref="periodEl" class="period text-[var(--cobalt)]">.</span>
          </h1>
          <div class="arc" aria-hidden="true" />
          <p class="dek dek--cjk mt-8">{{ t('home.hero.subtitle') }}</p>
          <div class="mt-10 flex flex-wrap items-center gap-4">
            <NuxtLink to="/learn" class="btn-ink" data-magnet>{{ t('home.hero.startLearning') }} <span aria-hidden="true">→</span></NuxtLink>
            <NuxtLink to="/projects" class="link-ed text-base">{{ t('home.hero.exploreProjects') }} →</NuxtLink>
          </div>
          <!-- dispatch 微条：坐实「内容站有货」 -->
          <p v-if="latestBlog?.[0]" class="machine mt-8 text-[0.72rem] text-[var(--ink-faint)]">
            NOW READING · <NuxtLink :to="latestBlog[0].path" class="text-[var(--cobalt)]">{{ latestBlog[0].title }}</NuxtLink>
          </p>
        </div>

        <!-- Image column -->
        <figure class="figure mt-10 md:col-span-5 md:mt-0">
          <div class="ar-portrait overflow-hidden duotone reveal">
            <img :src="heroImg.src" :alt="heroImg.alt" loading="eager">
          </div>
          <figcaption class="figure__caption">
            <span class="figure__caption-num">Fig. 01</span>
            <span>A study, in fragments — on the practice of building with AI.</span>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- ============== LEARN ============== -->
    <section v-if="featuredLearn?.length" class="relative overflow-clip mx-auto max-w-[1320px] px-6 py-24">
      <span aria-hidden="true" class="ghost-num">01</span>
      <div class="section-head mb-12">
        <div>
          <p class="kicker kicker--cobalt mb-2">№ 01 — Field Manual</p>
          <h2 class="mag-2">{{ t('home.learn.title') }}</h2>
          <p class="dek mt-4">{{ t('home.learn.subtitle') }}</p>
        </div>
        <NuxtLink to="/learn" class="link-more shrink-0">{{ t('common.viewAll') }}</NuxtLink>
      </div>

      <div class="grid gap-x-8 gap-y-14 md:grid-cols-12">
        <!-- Featured large -->
        <NuxtLink
          v-if="featuredLearn[0]"
          :to="featuredLearn[0].path"
          class="tile group md:col-span-7"
        >
          <figure class="figure figure--zoom">
            <div class="ar-wide overflow-hidden duotone">
              <img :src="useArticleImage(featuredLearn[0].path, 'wide').src" :alt="useArticleImage(featuredLearn[0].path, 'wide').alt" loading="lazy">
            </div>
          </figure>
          <div>
            <div class="mb-3 flex flex-wrap items-baseline gap-3">
              <span class="meta text-[var(--cobalt)]">Field Manual</span>
              <LevelBadge v-if="featuredLearn[0].level" :level="featuredLearn[0].level" />
            </div>
            <h3 class="mag-3 transition-colors group-hover:text-[var(--cobalt)]">{{ featuredLearn[0].title }}</h3>
            <p class="mt-3 text-[1rem] text-[var(--ink-soft)] max-w-[60ch]">{{ featuredLearn[0].description }}</p>
            <p v-if="featuredLearn[0].readingTime" class="meta mt-4">{{ featuredLearn[0].readingTime }} {{ t('common.min') }} read</p>
          </div>
        </NuxtLink>

        <!-- Secondary stack -->
        <div class="md:col-span-5 flex flex-col gap-10">
          <NuxtLink
            v-for="article in featuredLearn.slice(1, 4)"
            :key="article.path"
            :to="article.path"
            class="reveal group grid grid-cols-[1fr_140px] items-start gap-5 border-t border-[var(--rule)] pt-6"
          >
            <div>
              <div class="mb-2 flex flex-wrap items-baseline gap-3">
                <span class="meta text-[var(--cobalt)]">Field Manual</span>
                <LevelBadge v-if="article.level" :level="article.level" />
              </div>
              <h4 class="mag-4 transition-colors group-hover:text-[var(--cobalt)]">{{ article.title }}</h4>
              <p v-if="article.readingTime" class="meta mt-3">{{ article.readingTime }} {{ t('common.min') }}</p>
            </div>
            <div class="ar-thumb overflow-hidden duotone">
              <img :src="useArticleImage(article.path, 'thumb').src" :alt="useArticleImage(article.path, 'thumb').alt" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]">
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ============== PROJECTS — image-led grid ============== -->
    <section v-if="projects?.length" class="border-y border-[var(--rule)] bg-[var(--paper-2)]">
      <div class="mx-auto max-w-[1320px] px-6 py-24">
        <div class="section-head mb-12">
          <div>
            <p class="kicker kicker--cobalt mb-2">№ 02 — Working Ledger</p>
            <h2 class="mag-2">{{ t('home.projects.title') }}</h2>
            <p class="dek mt-4">{{ t('home.projects.subtitle') }}</p>
          </div>
          <NuxtLink to="/projects" class="link-more shrink-0">{{ t('common.viewAll') }}</NuxtLink>
        </div>

        <ClientOnly>
          <TheReel :items="(projects ?? []).map(p => ({ path: p.path, title: p.title, description: p.description, status: p.status, src: useArticleImage(p.path, 'wide').src, alt: useArticleImage(p.path, 'wide').alt }))" />
          <template #fallback>
            <!-- SSG/无 JS 兜底：静态横向列表 -->
            <div class="grid gap-8 md:grid-cols-2">
              <NuxtLink v-for="p in projects" :key="p.path" :to="p.path" class="tile">
                <h3 class="mag-4 mag-cjk">{{ p.title }}</h3>
              </NuxtLink>
            </div>
          </template>
        </ClientOnly>
      </div>
    </section>

    <!-- ============== BLOG ============== -->
    <section v-if="latestBlog?.length" class="mx-auto max-w-[1320px] px-6 py-24">
      <div class="section-head mb-12">
        <div>
          <p class="kicker kicker--cobalt mb-2">№ 03 — Dispatches</p>
          <h2 class="mag-2">{{ t('home.blog.title') }}</h2>
          <p class="dek mt-4">{{ t('home.blog.subtitle') }}</p>
        </div>
        <NuxtLink to="/blog" class="link-more shrink-0">{{ t('common.viewAll') }}</NuxtLink>
      </div>

      <div class="grid gap-x-8 gap-y-12 md:grid-cols-3">
        <NuxtLink
          v-for="post in latestBlog.slice(0, 3)"
          :key="post.path"
          :to="post.path"
          class="tile group"
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
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ============== NEWSLETTER ============== -->
    <section class="bg-[var(--ink-dark)] text-[var(--paper-dark)]">
      <div class="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 px-6 py-24 md:grid-cols-12 md:gap-x-12">
        <div class="md:col-span-6">
          <p class="kicker mb-4 !text-[var(--cobalt-bright)]">A letter, on occasion</p>
          <h2 class="mag-1 !text-[var(--paper-dark)]">
            {{ t('home.newsletter.title') }} <span class="mag-italic text-[var(--cobalt-bright)]">{{ t('home.newsletter.titleHighlight') }}</span>
          </h2>
        </div>
        <div class="md:col-span-6 md:pl-8 md:border-l md:border-[oklch(0.92_0.005_80/0.2)]">
          <p class="dek !text-[var(--paper-dark)] mb-8">{{ t('home.newsletter.description') }}</p>
          <NewsletterForm />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.headline {
  position: relative;
  line-height: 0.9;
}
.period {
  display: inline-block;
  animation: period-pulse 6s var(--ease-develop) infinite;
}
.arc {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  top: calc(var(--arc-y, 0.5) * 9rem);
  background: linear-gradient(90deg, transparent, var(--cobalt-bright), transparent);
  mix-blend-mode: screen;
  filter: drop-shadow(0 0 8px var(--cobalt));
  pointer-events: none;
  animation: line-reveal 800ms var(--ease-reel) 700ms both;
}
.headline.reveal,
.headline {
  /* 英文逐字交给 JS 可选；MVP 用整体揭示 */
}
.dek--cjk {
  font-style: normal;
  border-left: 2px solid var(--cobalt);
  padding-left: 0.9em;
}
:lang(en) .dek--cjk {
  border-left: 0;
  padding-left: 0;
  font-style: italic;
}
@media (prefers-reduced-motion: reduce) {
  .period {
    animation: none;
  }
  .arc {
    animation: none;
    top: 4.5rem;
  }
}

/* Learn 巨大琥珀幽灵编号 */
.ghost-num {
  position: absolute;
  right: 2%;
  top: -2.5rem;
  z-index: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(8rem, 22vw, 20rem);
  color: transparent;
  -webkit-text-stroke: 1.5px var(--amber);
  opacity: 0.14;
  font-feature-settings: 'onum';
  pointer-events: none;
  line-height: 1;
}
.section-head,
.grid {
  position: relative;
  z-index: 1;
}

/* Form invert inside dark newsletter */
section.bg-\[var\(--ink-dark\)\] :deep(.field) {
  color: var(--paper-dark);
  border-bottom-color: var(--paper-dark);
}
section.bg-\[var\(--ink-dark\)\] :deep(.field::placeholder) { color: oklch(0.92 0.005 80 / 0.5); }
section.bg-\[var\(--ink-dark\)\] :deep(.field:focus) { border-bottom-color: var(--cobalt-bright); }
section.bg-\[var\(--ink-dark\)\] :deep(.kicker) { color: var(--paper-dark); opacity: 0.7; }
section.bg-\[var\(--ink-dark\)\] :deep(.btn-ink) {
  background: var(--paper-dark);
  color: var(--ink-dark);
  border-color: var(--paper-dark);
}
section.bg-\[var\(--ink-dark\)\] :deep(.btn-ink:hover) {
  background: var(--cobalt-bright);
  color: var(--paper);
  border-color: var(--cobalt-bright);
}
</style>
