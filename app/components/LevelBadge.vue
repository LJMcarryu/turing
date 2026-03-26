<script setup lang="ts">
const props = defineProps<{
  level: 'beginner' | 'intermediate' | 'advanced'
}>()

const config = {
  beginner: { label: '入门', class: 'bg-green-500/10 text-green-400' },
  intermediate: { label: '进阶', class: 'bg-yellow-500/10 text-yellow-400' },
  advanced: { label: '专业', class: 'bg-red-500/10 text-red-400' },
}
</script>

<template>
  <span class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium" :class="config[level].class">
    {{ config[level].label }}
  </span>
</template>
