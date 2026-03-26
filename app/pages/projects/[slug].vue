<script setup lang="ts">
import { formatDate } from '~/composables/useFormatDate'

const route = useRoute()
const { data: project, error } = await useAsyncData(route.path, () =>
  queryCollection('projects').path(route.path).first()
)

if (error.value || !project.value) {
  throw createError({ statusCode: 404, message: '项目未找到' })
}

useSeoMeta({
  title: `${project.value.title} — Turing`,
  description: project.value.description,
})
</script>

<template>
  <article v-if="project" class="mx-auto max-w-3xl px-4 py-12">
    <NuxtLink to="/projects" class="text-sm text-brand-primary hover:underline">
      ← 返回 Projects
    </NuxtLink>

    <header class="mt-4">
      <div class="flex items-center gap-3">
        <span
          class="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
          :class="{
            'bg-green-500/10 text-green-400': project.status === 'active',
            'bg-yellow-500/10 text-yellow-400': project.status === 'wip',
            'bg-gray-500/10 text-gray-400': project.status === 'archived',
          }"
        >
          {{ project.status }}
        </span>
        <span v-if="project.date" class="text-sm text-brand-subtle">
          {{ formatDate(project.date) }}
        </span>
      </div>
      <h1 class="mt-3 text-3xl font-bold leading-tight">{{ project.title }}</h1>
      <p class="mt-2 text-lg text-brand-muted">{{ project.description }}</p>
      <a
        v-if="project.github"
        :href="project.github"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-3 inline-flex items-center gap-1.5 text-sm text-brand-primary hover:underline"
      >
        <Icon name="lucide:github" class="h-4 w-4" />
        GitHub
      </a>
    </header>

    <div class="prose mt-8 max-w-none">
      <ContentRenderer :value="project" />
    </div>
  </article>
</template>
