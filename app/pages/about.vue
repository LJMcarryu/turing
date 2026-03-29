<script setup lang="ts">
const { t } = useI18n()
const appConfig = useAppConfig()

useSeoMeta({
  title: `${t('about.title')} — Turing`,
  description: t('site.description'),
})
</script>

<template>
  <div class="gradient-bg min-h-screen">
    <!-- Header -->
    <section class="px-4 py-20">
      <div class="mx-auto max-w-4xl">
        <div class="text-center">
          <h1 class="text-5xl font-bold md:text-6xl">
            <span class="text-gradient">{{ t('about.title') }}</span>
          </h1>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="px-4 py-12">
      <div class="mx-auto max-w-3xl">
        <div class="card p-8 md:p-12">
          <div class="space-y-6 text-base leading-relaxed text-brand-muted">
            <p class="text-xl text-brand-text">
              {{ t('about.greeting') }} <span class="text-gradient font-bold">Jimmy Liu</span>，Turing {{ t('about.greeting') === '你好，我是' ? '的创建者。' : "'s creator." }}
            </p>

            <p>
              <strong class="text-brand-text">Turing</strong> {{ t('about.intro') }}
            </p>

            <div class="my-8 border-l-4 border-brand-primary bg-brand-surface p-6">
              <h2 class="mb-4 text-lg font-bold text-brand-text">{{ t('about.findHere') }}</h2>
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <Icon name="heroicons:academic-cap" class="mt-1 h-5 w-5 shrink-0 text-brand-primary" />
                  <div>
                    <strong class="text-brand-text">{{ t('nav.learn') }}</strong>
                    <span class="text-brand-muted"> — {{ t('about.learnDesc') }}</span>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="heroicons:cube" class="mt-1 h-5 w-5 shrink-0 text-brand-accent" />
                  <div>
                    <strong class="text-brand-text">{{ t('nav.projects') }}</strong>
                    <span class="text-brand-muted"> — {{ t('about.projectsDesc') }}</span>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="heroicons:document-text" class="mt-1 h-5 w-5 shrink-0 text-brand-secondary" />
                  <div>
                    <strong class="text-brand-text">{{ t('nav.blog') }}</strong>
                    <span class="text-brand-muted"> — {{ t('about.blogDesc') }}</span>
                  </div>
                </li>
              </ul>
            </div>

            <p>
              {{ t('about.subscribePrompt') }}
              <NuxtLink to="/newsletter" class="text-brand-primary hover:underline">{{ t('about.subscribeLink') }}</NuxtLink>
              {{ t('about.subscribeEnd') }}
            </p>
          </div>
        </div>

        <!-- Contact Card -->
        <div class="card mt-8 p-8">
          <h2 class="text-2xl font-bold">{{ t('about.contact') }}</h2>
          <div class="mt-6 flex gap-4">
            <a
              v-if="appConfig.social.github"
              :href="appConfig.social.github"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-surface text-brand-muted transition-all hover:bg-brand-primary hover:text-brand-bg"
            >
              <Icon name="heroicons:code-bracket" class="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
