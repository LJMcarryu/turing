<script setup lang="ts">
// MDC 组件：编辑式问答手风琴。无图标库依赖，用排印符号 ＋ / − 作开合提示。
interface Faq { q: string, a: string }
defineProps<{ items: Faq[] }>()

const open = ref(-1)
function toggle(i: number) {
  open.value = open.value === i ? -1 : i
}
</script>

<template>
  <div class="not-prose my-8">
    <div v-for="(f, i) in items" :key="i" class="border-t border-[var(--rule)] last:border-b">
      <button
        type="button"
        class="flex w-full items-baseline justify-between gap-4 py-4 text-left transition-colors hover:text-[var(--cobalt)]"
        @click="toggle(i)"
      >
        <span class="font-display text-lg text-[var(--ink)]">{{ f.q }}</span>
        <span class="shrink-0 font-display text-xl text-[var(--cobalt)]">{{ open === i ? '−' : '+' }}</span>
      </button>
      <p v-if="open === i" class="max-w-[66ch] pb-5 leading-relaxed text-[var(--ink-soft)]">{{ f.a }}</p>
    </div>
  </div>
</template>
