<script setup lang="ts">
const { t } = useI18n()
const email = ref('')
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

async function subscribe() {
  if (!email.value) return
  status.value = 'loading'
  try {
    // TODO Phase 2: Connect to Buttondown/Resend API
    // For MVP, simulate success
    await new Promise((r) => setTimeout(r, 500))
    status.value = 'success'
    email.value = ''
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <form class="flex w-full max-w-md gap-2" @submit.prevent="subscribe">
    <input
      v-model="email"
      type="email"
      required
      :placeholder="t('newsletter.form.placeholder')"
      class="flex-1 rounded-lg border border-brand-border bg-brand-card px-4 py-2 text-sm text-brand-text placeholder-brand-subtle outline-none focus:border-brand-primary"
      :disabled="status === 'loading'"
    />
    <button
      type="submit"
      class="btn-primary px-5 py-2 text-sm"
      :disabled="status === 'loading'"
    >
      {{ status === 'loading' ? t('newsletter.form.loading') : status === 'success' ? t('newsletter.form.subscribed') : t('newsletter.form.subscribe') }}
    </button>
  </form>
  <p v-if="status === 'success'" class="mt-2 text-sm text-green-400">
    {{ t('newsletter.form.success') }}
  </p>
  <p v-if="status === 'error'" class="mt-2 text-sm text-red-400">
    {{ t('newsletter.form.error') }}
  </p>
</template>
