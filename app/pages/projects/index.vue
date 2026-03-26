<script setup lang="ts">
useSeoMeta({
  title: 'Projects — Turing',
  description: '开源项目与工具',
})

const { data: projects } = await useAsyncData('projects-all', () =>
  queryCollection('projects').all()
)
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-12">
    <h1 class="text-3xl font-bold">Projects</h1>
    <p class="mt-2 text-brand-muted">开源项目与工具</p>

    <div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="project in projects"
        :key="project.path"
        class="rounded-xl border border-brand-border bg-brand-card p-6"
      >
        <div class="mb-2 flex items-center gap-2">
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
        </div>
        <h3 class="text-lg font-semibold">{{ project.title }}</h3>
        <p class="mt-1.5 text-sm text-brand-muted">{{ project.description }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="rounded-full border border-brand-border px-2 py-0.5 text-xs text-brand-subtle"
          >
            {{ tag }}
          </span>
        </div>
        <a
          v-if="project.github"
          :href="project.github"
          target="_blank"
          rel="noopener"
          class="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-primary hover:underline"
        >
          <Icon name="lucide:github" class="h-4 w-4" />
          GitHub
        </a>
      </div>
    </div>

    <p v-if="!projects?.length" class="py-12 text-center text-brand-subtle">
      暂无项目
    </p>
  </div>
</template>
