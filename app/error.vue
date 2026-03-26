<script setup lang="ts">
const props = defineProps<{
  error: { statusCode: number; message: string }
}>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-brand-bg px-4 text-center">
    <h1 class="text-6xl font-bold text-brand-primary">{{ error.statusCode }}</h1>
    <p class="mt-4 text-xl text-brand-muted">{{ error.message || '页面未找到' }}</p>
    <button
      class="mt-8 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent px-6 py-2.5 font-medium text-white"
      @click="handleError"
    >
      返回首页
    </button>
  </div>
</template>
