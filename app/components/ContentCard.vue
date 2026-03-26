<script setup lang="ts">
import { formatDate } from '~/composables/useFormatDate'

defineProps<{
  to: string
  label?: string
  title: string
  description?: string
  date?: string
  readingTime?: number
  level?: 'beginner' | 'intermediate' | 'advanced'
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="group block rounded-xl border border-brand-border bg-brand-card p-5 transition-colors hover:border-brand-primary/50"
  >
    <div class="mb-2 flex items-center gap-2">
      <span v-if="label" class="text-xs font-semibold uppercase tracking-wider text-brand-primary">
        {{ label }}
      </span>
      <LevelBadge v-if="level" :level="level" />
    </div>
    <h3 class="text-base font-semibold text-brand-text group-hover:text-brand-primary">
      {{ title }}
    </h3>
    <p v-if="description" class="mt-1.5 line-clamp-2 text-sm text-brand-subtle">
      {{ description }}
    </p>
    <div v-if="date || readingTime" class="mt-3 flex items-center gap-3 text-xs text-brand-subtle">
      <span v-if="date">{{ formatDate(date) }}</span>
      <span v-if="readingTime">{{ readingTime }} min</span>
    </div>
  </NuxtLink>
</template>
