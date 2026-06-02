<script setup lang="ts">
// MDC 组件：操作系统安装命令切换 + 复制。编辑式样，单一钴蓝强调，无渐变/辉光。
interface Platform { id: string, name: string, shell: string, command: string }
const props = defineProps<{ platforms: Platform[] }>()

const active = ref(props.platforms[0]?.id ?? '')
const copied = ref(false)
const current = computed(() => props.platforms.find(p => p.id === active.value) ?? props.platforms[0])

async function copy() {
  if (!current.value || typeof navigator === 'undefined')
    return
  try {
    await navigator.clipboard.writeText(current.value.command)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
  catch {
    // clipboard 不可用
  }
}
</script>

<template>
  <div class="not-prose my-8 border border-[var(--rule)]">
    <div class="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[var(--rule)] bg-[var(--paper-2)] px-5 py-3">
      <button
        v-for="p in platforms"
        :key="p.id"
        type="button"
        class="machine text-xs uppercase tracking-wider transition-colors"
        :class="active === p.id ? 'text-[var(--cobalt)] underline decoration-1 underline-offset-4' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'"
        @click="active = p.id"
      >
{{ p.name }}
</button>
    </div>
    <div v-if="current" class="flex items-center justify-between gap-4 px-5 py-4">
      <code class="overflow-x-auto font-mono text-sm text-[var(--ink)]">{{ current.command }}</code>
      <button
        type="button"
        class="machine shrink-0 text-xs uppercase tracking-wider text-[var(--cobalt)] transition-opacity hover:opacity-70"
        @click="copy"
      >
{{ copied ? '已复制' : '复制' }}
</button>
    </div>
    <p v-if="current" class="meta border-t border-[var(--rule)] px-5 py-2">{{ current.shell }}</p>
  </div>
</template>
