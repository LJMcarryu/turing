<script setup lang="ts">
defineProps<{ level: 'beginner' | 'intermediate' | 'advanced' }>()

const { t } = useI18n()
</script>

<template>
  <span class="inline-flex items-baseline gap-1.5 font-body text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[var(--ink-soft)]">
    <span class="mag-italic text-[var(--cobalt)]">
      {{ level === 'beginner' ? 'I' : level === 'intermediate' ? 'II' : 'III' }}
    </span>
    <span>{{ t(`learn.levels.${level}`) }}</span>
  </span>
</template>
