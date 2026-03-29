<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: `${t('projects.title')} — Turing`,
  description: t('projects.subtitle'),
})

const { data: projects, error } = await useAsyncData('projects-all', () =>
  queryCollection('projects').all()
)

if (error.value) {
  throw createError({ statusCode: 500, message: t('error.loadFailed') })
}
</script>

<template>
  <div class="gradient-bg min-h-screen">
    <!-- Header -->
    <section class="px-4 py-20">
      <div class="mx-auto max-w-6xl">
        <div class="text-center">
          <h1 class="text-5xl font-bold md:text-6xl">
            <span class="text-gradient">{{ t('projects.title') }}</span>
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-xl text-brand-muted">
            {{ t('projects.subtitle') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Projects Grid -->
    <section class="px-4 py-12">
      <div class="mx-auto max-w-6xl">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="(project, index) in projects"
            :key="project.path"
            :to="project.path"
            class="card group p-6"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <!-- Status Badge -->
            <div class="mb-4 flex items-center justify-between">
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
              <Icon
                v-if="project.github"
                name="heroicons:arrow-top-right-on-square"
                class="h-5 w-5 text-brand-subtle transition-colors group-hover:text-brand-primary"
              />
            </div>

            <!-- Title & Description -->
            <h3 class="text-xl font-bold leading-tight group-hover:text-brand-primary">
              {{ project.title }}
            </h3>
            <p class="mt-3 line-clamp-3 text-sm text-brand-muted">
              {{ project.description }}
            </p>

            <!-- Tags -->
            <div v-if="project.tags?.length" class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="tag in project.tags.slice(0, 4)"
                :key="tag"
                class="rounded-md bg-brand-surface px-2 py-1 text-xs text-brand-subtle"
              >
                {{ tag }}
              </span>
            </div>

            <!-- GitHub Link -->
            <div v-if="project.github" class="mt-4 flex items-center gap-2 text-sm text-brand-primary">
              <Icon name="heroicons:code-bracket" class="h-4 w-4" />
              <span class="font-semibold">{{ t('common.viewSource') }}</span>
            </div>
          </NuxtLink>
        </div>

        <!-- Empty State -->
        <div v-if="!projects?.length" class="py-20 text-center">
          <Icon name="heroicons:cube" class="mx-auto h-16 w-16 text-brand-subtle" />
          <p class="mt-4 text-brand-muted">{{ t('projects.noProjects') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
