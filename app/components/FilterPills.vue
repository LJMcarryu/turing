<script setup lang="ts">
const props = defineProps<{
  items: { label: string; value: string }[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="item in items"
      :key="item.value"
      class="rounded-full border px-3 py-1 text-sm transition-colors"
      :class="
        modelValue === item.value
          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
          : 'border-brand-border text-brand-muted hover:border-brand-primary/50 hover:text-brand-text'
      "
      @click="emit('update:modelValue', modelValue === item.value ? '' : item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
