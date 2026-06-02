<script setup lang="ts">
// MDC 组件：通用编辑式卡片网格（特性 / 模型 / 命令通用）。
// 细线分隔，单一钴蓝强调，无渐变/辉光/玻璃拟态。
interface Card { title: string, desc?: string, meta?: string, points?: string[] }
defineProps<{ items: Card[] }>()
</script>

<template>
  <div class="not-prose my-8 grid grid-cols-1 gap-px bg-[var(--rule)] sm:grid-cols-2 md:grid-cols-3">
    <div v-for="(c, i) in items" :key="i" class="bg-[var(--paper)] p-5">
      <p v-if="c.meta" class="meta mb-2 text-[var(--cobalt)]">{{ c.meta }}</p>
      <p class="font-display text-lg text-[var(--ink)]">{{ c.title }}</p>
      <p v-if="c.desc" class="mt-1 text-sm text-[var(--ink-soft)]">{{ c.desc }}</p>
      <ul v-if="c.points?.length" class="mt-2 space-y-1">
        <li v-for="(pt, j) in c.points" :key="j" class="text-sm text-[var(--ink-soft)]">— {{ pt }}</li>
      </ul>
    </div>
  </div>
</template>
