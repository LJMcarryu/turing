<script setup lang="ts">
const { t } = useI18n()
const email = ref('')
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

async function subscribe() {
  if (!email.value)
    return

  status.value = 'loading'
  try {
    await new Promise(r => setTimeout(r, 500))
    status.value = 'success'
    email.value = ''
  }
  catch {
    status.value = 'error'
  }
}
</script>

<template>
  <div class="w-full">
    <form class="flex flex-col gap-4 sm:flex-row sm:items-end" @submit.prevent="subscribe">
      <label class="flex-1">
        <span class="kicker mb-1 block">{{ t('newsletter.form.placeholder') }}</span>
        <input
          v-model="email"
          type="email"
          required
          placeholder="hello@somewhere.com"
          class="field"
          :disabled="status === 'loading'"
        >
      </label>
      <button type="submit" class="btn-ink self-start whitespace-nowrap sm:self-end" :disabled="status === 'loading'">
        {{ status === 'loading' ? t('newsletter.form.loading') : status === 'success' ? t('newsletter.form.subscribed') : t('newsletter.form.subscribe') }}
        <span aria-hidden="true">→</span>
      </button>
    </form>
    <p v-if="status === 'success'" class="meta mt-3 text-[var(--cobalt)]">✓ {{ t('newsletter.form.success') }}</p>
    <p v-else-if="status === 'error'" class="meta mt-3 text-[var(--cobalt)]">× {{ t('newsletter.form.error') }}</p>
  </div>
</template>
