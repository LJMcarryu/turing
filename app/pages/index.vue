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
  queryCollection('learn').where('featured', '=', true).limit(3).all()
)

const { data: latestBlog } = await useAsyncData('latest-blog', () =>
  queryCollection('blog').order('date', 'DESC').limit(3).all()
)

const { data: projects } = await useAsyncData('projects', () =>
  queryCollection('projects').limit(3).all()
)
</script>

<template>
  <div class="gradient-bg min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden px-4 py-32">
      <div class="mx-auto max-w-6xl">
        <div class="animate-fade-in-up text-center">
          <h1 class="text-6xl font-bold leading-tight md:text-7xl lg:text-8xl">
            <span class="text-gradient">Turing</span>
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-xl text-brand-muted md:text-2xl">
            {{ t('home.hero.title') }}
          </p>
          <p class="mx-auto mt-4 max-w-3xl text-base text-brand-subtle">
            {{ t('home.hero.subtitle') }}
          </p>
          <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
            <NuxtLink to="/learn" class="btn-primary">
              <Icon name="heroicons:academic-cap" class="h-5 w-5" />
              {{ t('home.hero.startLearning') }}
            </NuxtLink>
            <NuxtLink to="/projects" class="btn-secondary">
              <Icon name="heroicons:code-bracket" class="h-5 w-5" />
              {{ t('home.hero.exploreProjects') }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Decorative elements -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="glow-effect absolute -right-40 -top-40 h-80 w-80 rounded-full bg-brand-primary opacity-10 blur-3xl"></div>
        <div class="glow-effect absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-brand-accent opacity-10 blur-3xl" style="animation-delay: 1.5s"></div>
      </div>
    </section>

    <!-- Featured Learn -->
    <section v-if="featuredLearn?.length" class="px-4 py-16">
      <div class="mx-auto max-w-6xl">
        <div class="mb-10 flex items-end justify-between">
          <div>
            <h2 class="text-4xl font-bold">{{ t('home.learn.title') }}</h2>
            <p class="mt-2 text-brand-muted">{{ t('home.learn.subtitle') }}</p>
          </div>
          <NuxtLink to="/learn" class="group flex items-center gap-2 text-brand-primary transition-all hover:gap-3">
            <span class="font-semibold">{{ t('common.viewAll') }}</span>
            <Icon name="heroicons:arrow-right" class="h-5 w-5" />
          </NuxtLink>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <NuxtLink
            v-for="(article, index) in featuredLearn"
            :key="article.path"
            :to="article.path"
            class="card group p-6"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="mb-3 flex items-center justify-between">
              <span class="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
                {{ t('home.learn.badge') }}
              </span>
              <LevelBadge v-if="article.level" :level="article.level" />
            </div>
            <h3 class="text-xl font-bold leading-tight group-hover:text-brand-primary">
              {{ article.title }}
            </h3>
            <p class="mt-3 line-clamp-2 text-sm text-brand-muted">
              {{ article.description }}
            </p>
            <div v-if="article.readingTime" class="mt-4 flex items-center gap-2 text-xs text-brand-subtle">
              <Icon name="heroicons:clock" class="h-4 w-4" />
              <span>{{ article.readingTime }} {{ t('common.readingTime') }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Projects -->
    <section v-if="projects?.length" class="px-4 py-16">
      <div class="mx-auto max-w-6xl">
        <div class="mb-10 flex items-end justify-between">
          <div>
            <h2 class="text-4xl font-bold">{{ t('home.projects.title') }}</h2>
            <p class="mt-2 text-brand-muted">{{ t('home.projects.subtitle') }}</p>
          </div>
          <NuxtLink to="/projects" class="group flex items-center gap-2 text-brand-primary transition-all hover:gap-3">
            <span class="font-semibold">{{ t('common.viewAll') }}</span>
            <Icon name="heroicons:arrow-right" class="h-5 w-5" />
          </NuxtLink>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <NuxtLink
            v-for="(project, index) in projects"
            :key="project.path"
            :to="project.path"
            class="card group p-6"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="mb-3">
              <span class="rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-bold text-brand-accent">
                {{ t('home.projects.badge') }}
              </span>
            </div>
            <h3 class="text-xl font-bold leading-tight group-hover:text-brand-primary">
              {{ project.title }}
            </h3>
            <p class="mt-3 line-clamp-2 text-sm text-brand-muted">
              {{ project.description }}
            </p>
            <div v-if="project.tags?.length" class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="tag in project.tags.slice(0, 3)"
                :key="tag"
                class="rounded-md bg-brand-surface px-2 py-1 text-xs text-brand-subtle"
              >
                {{ tag }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Latest Blog -->
    <section v-if="latestBlog?.length" class="px-4 py-16">
      <div class="mx-auto max-w-6xl">
        <div class="mb-10 flex items-end justify-between">
          <div>
            <h2 class="text-4xl font-bold">{{ t('home.blog.title') }}</h2>
            <p class="mt-2 text-brand-muted">{{ t('home.blog.subtitle') }}</p>
          </div>
          <NuxtLink to="/blog" class="group flex items-center gap-2 text-brand-primary transition-all hover:gap-3">
            <span class="font-semibold">{{ t('common.viewAll') }}</span>
            <Icon name="heroicons:arrow-right" class="h-5 w-5" />
          </NuxtLink>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <NuxtLink
            v-for="(post, index) in latestBlog"
            :key="post.path"
            :to="post.path"
            class="card group p-6"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="mb-3">
              <span class="rounded-full bg-brand-secondary/10 px-3 py-1 text-xs font-bold text-brand-secondary">
                {{ t('home.blog.badge') }}
              </span>
            </div>
            <h3 class="text-xl font-bold leading-tight group-hover:text-brand-primary">
              {{ post.title }}
            </h3>
            <p class="mt-3 line-clamp-2 text-sm text-brand-muted">
              {{ post.description }}
            </p>
            <div class="mt-4 flex items-center gap-3 text-xs text-brand-subtle">
              <span>{{ formatDate(post.date) }}</span>
              <span v-if="post.readingTime">{{ post.readingTime }} {{ t('common.min') }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Newsletter CTA -->
    <section class="px-4 py-20">
      <div class="mx-auto max-w-4xl">
        <div class="card relative overflow-hidden p-12 text-center">
          <div class="relative z-10">
            <h2 class="text-3xl font-bold md:text-4xl">
              {{ t('home.newsletter.title') }} <span class="text-gradient">{{ t('home.newsletter.titleHighlight') }}</span>
            </h2>
            <p class="mx-auto mt-4 max-w-2xl text-brand-muted">
              {{ t('home.newsletter.description') }}
            </p>
            <div class="mt-8 flex justify-center">
              <NewsletterForm />
            </div>
          </div>
          <!-- Background decoration -->
          <div class="pointer-events-none absolute inset-0 opacity-30">
            <div class="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand-primary blur-3xl"></div>
            <div class="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-brand-accent blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
