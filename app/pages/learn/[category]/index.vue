<script setup lang="ts">
const route = useRoute()
const category = route.params.category as string

const categoryNames: Record<string, string> = {
  'claude-code': 'Claude Code',
  'prompt-engineering': 'Prompt Engineering',
  'agent-development': 'Agent 开发',
  'mcp': 'MCP 协议',
}

const categoryName = categoryNames[category] || category

useSeoMeta({
  title: `${categoryName} — Learn — Turing`,
  description: `${categoryName} 相关教程和实践指南`,
})

const levelFilter = ref('')

const { data: articles } = await useAsyncData(`learn-${category}`, () =>
  queryCollection('learn').where('category', '=', category).order('date', 'DESC').all()
)

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
    <NuxtLink to="/learn" class="text-sm text-brand-primary hover:underline">
      ← 返回 Learn
    </NuxtLink>
    <h1 class="mt-4 text-3xl font-bold">{{ categoryName }}</h1>

    <div class="mt-6">
      <CategoryFilter v-model="levelFilter" :items="levels" />
    </div>

    <div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ContentCard
        v-for="article in filteredArticles"
        :key="article.path"
        :to="article.path"
        :title="article.title"
        :description="article.description"
        :level="article.level"
        :reading-time="article.readingTime"
      />
    </div>
    <p v-if="filteredArticles.length === 0" class="py-12 text-center text-brand-subtle">
      暂无教程
    </p>
  </div>
</template>
