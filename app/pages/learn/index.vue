<script setup lang="ts">
useSeoMeta({
  title: 'Learn — Turing',
  description: 'AI 技术教程中心：Claude Code、Prompt Engineering、Agent 开发等',
})

const levelFilter = ref('')

const { data: articles, error } = await useAsyncData('learn-all', () =>
  queryCollection('learn').order('date', 'DESC').all()
)

if (error.value) {
  throw createError({ statusCode: 500, message: '加载教程失败' })
}

const categories = [
  { label: 'Claude Code', value: 'claude-code', icon: 'lucide:terminal' },
  { label: 'Prompt Engineering', value: 'prompt-engineering', icon: 'lucide:message-square' },
  { label: 'Agent 开发', value: 'agent-development', icon: 'lucide:bot' },
  { label: 'MCP 协议', value: 'mcp', icon: 'lucide:plug' },
]

const levels = [
  { label: '入门', value: 'beginner' },
  { label: '进阶', value: 'intermediate' },
  { label: '专业', value: 'advanced' },
]

const filteredArticles = computed(() => {
  if (!articles.value) return []
  if (!levelFilter.value) return articles.value
  return articles.value.filter((a) => a.level === levelFilter.value)
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-12">
    <h1 class="text-3xl font-bold">Learn</h1>
    <p class="mt-2 text-brand-muted">从入门到专业，系统学习 AI 技术</p>

    <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <NuxtLink
        v-for="cat in categories"
        :key="cat.value"
        :to="`/learn/${cat.value}`"
        class="group rounded-xl border border-brand-border bg-brand-card p-5 transition-colors hover:border-brand-primary/50"
      >
        <Icon :name="cat.icon" class="mb-3 h-8 w-8 text-brand-primary" />
        <h3 class="font-semibold group-hover:text-brand-primary">{{ cat.label }}</h3>
      </NuxtLink>
    </div>

    <section class="mt-12">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-bold">全部教程</h2>
        <FilterPills v-model="levelFilter" :items="levels" />
      </div>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ContentCard
          v-for="article in filteredArticles"
          :key="article.path"
          :to="article.path"
          :label="article.category"
          :title="article.title"
          :description="article.description"
          :level="article.level"
          :reading-time="article.readingTime"
        />
      </div>
      <p v-if="filteredArticles.length === 0" class="py-12 text-center text-brand-subtle">
        暂无此级别的教程
      </p>
    </section>
  </div>
</template>
