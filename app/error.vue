<script setup lang="ts">
defineProps<{ error: { statusCode: number, message: string } }>()

const { t } = useI18n()
const handleError = () => clearError({ redirect: '/' })

const img = useArticleImage('error-page', 'hero')
</script>

<template>
  <div class="grid min-h-screen grid-cols-1 bg-[var(--paper)] md:grid-cols-2">
    <figure class="figure">
      <div class="h-full w-full overflow-hidden">
        <img :src="img.src" :alt="img.alt" class="h-full w-full object-cover" loading="eager">
      </div>
    </figure>
    <div class="flex flex-col items-start justify-center p-10 md:p-16">
      <p class="kicker kicker--cobalt mb-5">Errata</p>
      <p class="mag-1 leading-none text-[var(--cobalt)]">{{ error.statusCode }}</p>
      <hr class="rule-strong my-8 w-16">
      <p class="dek">{{ error.message || t('error.notFound') }}</p>
      <button class="btn-ink mt-10" @click="handleError">
        ← {{ t('common.backToHome') }}
      </button>
    </div>
  </div>
</template>
