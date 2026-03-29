<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  level: 'beginner' | 'intermediate' | 'advanced'
}>()

const config = {
  beginner: { class: 'bg-green-500/10 text-green-400' },
  intermediate: { class: 'bg-yellow-500/10 text-yellow-400' },
  advanced: { class: 'bg-red-500/10 text-red-400' },
}
</script>

<template>
  <span class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium" :class="config[level].class">
    {{ t(`learn.levels.${level}`) }}
  </span>
</template>
