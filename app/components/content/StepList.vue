<script setup lang="ts">
// MDC 组件：编号步骤（钴蓝序号 + 可选代码）。编辑式样。
interface Step { title: string, desc?: string, code?: string }
defineProps<{ steps: Step[] }>()
</script>

<template>
  <div class="not-prose my-8">
    <div
      v-for="(s, i) in steps"
      :key="i"
      class="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-[var(--rule)] py-5 last:border-b"
    >
      <span class="font-display text-xl italic text-[var(--cobalt)]">{{ String(i + 1).padStart(2, '0') }}</span>
      <div>
        <p class="font-display text-lg text-[var(--ink)]">{{ s.title }}</p>
        <p v-if="s.desc" class="mt-1 max-w-[66ch] text-[var(--ink-soft)]">{{ s.desc }}</p>
        <pre v-if="s.code" class="mt-3 overflow-x-auto border border-[var(--rule)] bg-[var(--paper-2)] p-3 font-mono text-sm"><code>{{ s.code }}</code></pre>
      </div>
    </div>
  </div>
</template>
