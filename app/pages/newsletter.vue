<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: `${t('newsletter.title')} ${t('newsletter.titleHighlight')} — Turing`,
  description: t('newsletter.description'),
})
</script>

<template>
  <div class="gradient-bg min-h-screen">
    <!-- Header -->
    <section class="px-4 py-20">
      <div class="mx-auto max-w-4xl">
        <div class="text-center">
          <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent">
            <Icon name="heroicons:envelope" class="h-10 w-10 text-white" />
          </div>
          <h1 class="text-5xl font-bold md:text-6xl">
            {{ t('newsletter.title') }} <span class="text-gradient">{{ t('newsletter.titleHighlight') }}</span>
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-xl text-brand-muted">
            {{ t('newsletter.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Form -->
    <section class="px-4 py-12">
      <div class="mx-auto max-w-xl">
        <div class="card p-8">
          <NewsletterForm />
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="px-4 py-12">
      <div class="mx-auto max-w-4xl">
        <h2 class="mb-8 text-center text-3xl font-bold">{{ t('newsletter.whatYouGet') }}</h2>
        <div class="grid gap-6 md:grid-cols-3">
          <div class="card p-6 text-center">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10">
              <Icon name="heroicons:academic-cap" class="h-8 w-8 text-brand-primary" />
            </div>
            <h3 class="text-lg font-bold">{{ t('newsletter.benefits.tutorials.title') }}</h3>
            <p class="mt-2 text-sm text-brand-muted">
              {{ t('newsletter.benefits.tutorials.description') }}
            </p>
          </div>

          <div class="card p-6 text-center">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-accent/10">
              <Icon name="heroicons:cube" class="h-8 w-8 text-brand-accent" />
            </div>
            <h3 class="text-lg font-bold">{{ t('newsletter.benefits.updates.title') }}</h3>
            <p class="mt-2 text-sm text-brand-muted">
              {{ t('newsletter.benefits.updates.description') }}
            </p>
          </div>

          <div class="card p-6 text-center">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-secondary/10">
              <Icon name="heroicons:chart-bar" class="h-8 w-8 text-brand-secondary" />
            </div>
            <h3 class="text-lg font-bold">{{ t('newsletter.benefits.insights.title') }}</h3>
            <p class="mt-2 text-sm text-brand-muted">
              {{ t('newsletter.benefits.insights.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
