<script setup lang="ts">
const { t } = useI18n()
const { formatDate } = useFormatDate()

const route = useRoute()
const { data: project, error } = await useAsyncData(route.path, () =>
  queryCollection('projects').path(route.path).first()
)

if (error.value || !project.value) {
  throw createError({ statusCode: 404, message: t('error.notFound') })
}

useSeoMeta({
  title: `${project.value.title} — Turing`,
  description: project.value.description,
  ogTitle: project.value.title,
  ogDescription: project.value.description,
  ogType: 'website',
})

const { data: otherProjects } = await useAsyncData(`other-projects-${route.path}`, async () => {
  const all = await queryCollection('projects').limit(4).all()
  return all.filter(p => p.path !== project.value.path).slice(0, 3)
})
</script>

<template>
  <article v-if="project" class="min-h-screen">
    <!-- Header -->
    <section class="gradient-bg px-4 py-20">
      <div class="mx-auto max-w-4xl">
        <nav class="flex items-center gap-2 text-sm text-brand-subtle">
          <NuxtLink to="/" class="hover:text-brand-primary">{{ t('nav.home') }}</NuxtLink>
          <Icon name="heroicons:chevron-right" class="h-4 w-4" />
          <NuxtLink to="/projects" class="hover:text-brand-primary">{{ t('projects.title') }}</NuxtLink>
        </nav>

        <div class="mt-8">
          <div class="flex flex-wrap items-center gap-3">
            <span
              class="rounded-full px-3 py-1 text-xs font-bold uppercase"
              :class="{
                'bg-brand-primary/10 text-brand-primary': project.status === 'active',
                'bg-brand-secondary/10 text-brand-secondary': project.status === 'wip',
                'bg-brand-subtle/10 text-brand-subtle': project.status === 'archived',
              }"
            >
              {{ t(`projects.status.${project.status}`) }}
            </span>
            <span v-if="project.date" class="text-sm text-brand-subtle">
              {{ formatDate(project.date) }}
            </span>
          </div>

          <h1 class="mt-6 text-4xl font-bold leading-tight md:text-5xl">
            {{ project.title }}
          </h1>
          <p class="mt-4 text-xl text-brand-muted">
            {{ project.description }}
          </p>

          <div class="mt-6 flex flex-wrap gap-4">
            <a
              v-if="project.github"
              :href="project.github"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary"
            >
              <Icon name="heroicons:code-bracket" class="h-5 w-5" />
              {{ t('common.viewSource') }}
            </a>
          </div>

          <div v-if="project.tags?.length" class="mt-6 flex flex-wrap gap-2">
            <span
              v-for="tag in project.tags"
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
          <ContentRenderer :value="project" />
        </div>
      </div>
    </section>

    <!-- Other Projects -->
    <section v-if="otherProjects?.length" class="px-4 py-12">
      <div class="mx-auto max-w-4xl">
        <div class="mb-8 border-t border-brand-border pt-8">
          <h2 class="text-3xl font-bold">{{ t('projects.otherProjects') }}</h2>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <NuxtLink
            v-for="other in otherProjects"
            :key="other.path"
            :to="other.path"
            class="card group p-6"
          >
            <div class="mb-3">
              <span
                class="rounded-full px-3 py-1 text-xs font-bold uppercase"
                :class="{
                  'bg-brand-primary/10 text-brand-primary': other.status === 'active',
                  'bg-brand-secondary/10 text-brand-secondary': other.status === 'wip',
                  'bg-brand-subtle/10 text-brand-subtle': other.status === 'archived',
                }"
              >
                {{ t(`projects.status.${other.status}`) }}
              </span>
            </div>
            <h3 class="font-bold leading-tight group-hover:text-brand-primary">
              {{ other.title }}
            </h3>
            <p class="mt-2 line-clamp-2 text-sm text-brand-muted">
              {{ other.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Back to Projects -->
    <section class="px-4 py-8">
      <div class="mx-auto max-w-4xl border-t border-brand-border pt-8">
        <NuxtLink
          to="/projects"
          class="group inline-flex items-center gap-2 text-brand-primary transition-all hover:gap-3"
        >
          <Icon name="heroicons:arrow-left" class="h-5 w-5" />
          <span class="font-semibold">{{ t('common.backTo') }} {{ t('projects.title') }}</span>
        </NuxtLink>
      </div>
    </section>
  </article>
</template>
