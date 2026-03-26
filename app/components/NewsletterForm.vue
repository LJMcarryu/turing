<script setup lang="ts">
const email = ref('')
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

async function subscribe() {
  if (!email.value) return
  status.value = 'loading'
  // TODO Phase 2: Connect to Buttondown/Resend API
  // For MVP, simulate success
  await new Promise((r) => setTimeout(r, 500))
  status.value = 'success'
  email.value = ''
}
</script>

<template>
  <form class="flex w-full max-w-md gap-2" @submit.prevent="subscribe">
    <input
      v-model="email"
      type="email"
      required
      placeholder="your@email.com"
      class="flex-1 rounded-lg border border-brand-border bg-brand-card px-4 py-2 text-sm text-brand-text placeholder-brand-subtle outline-none focus:border-brand-primary"
      :disabled="status === 'loading'"
    />
    <button
      type="submit"
      class="rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      :disabled="status === 'loading'"
    >
      {{ status === 'loading' ? '...' : status === 'success' ? '已订阅' : '订阅' }}
    </button>
  </form>
  <p v-if="status === 'success'" class="mt-2 text-sm text-green-400">
    感谢订阅！我们会将最新内容发送到你的邮箱。
  </p>
</template>
