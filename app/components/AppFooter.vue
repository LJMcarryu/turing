<script setup lang="ts">
const appConfig = useAppConfig()
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-24 bg-[var(--ink-dark)] text-[var(--paper-dark)]">
    <div class="mx-auto max-w-[1536px] px-6 pt-16 pb-10">
      <!-- Big wordmark + tag -->
      <div class="flex flex-wrap items-end justify-between gap-6 border-b border-[oklch(0.92_0.005_80/0.2)] pb-12">
        <p class="font-display text-6xl font-medium leading-none md:text-7xl">
          {{ appConfig.site.name }}<span class="text-[var(--cobalt-bright)]">.</span>
        </p>
        <p class="meta !text-[var(--paper-dark)]/70">{{ t('site.slogan') }}</p>
      </div>

      <div class="mt-12 grid gap-10 md:grid-cols-12">
        <div class="md:col-span-5">
          <p class="kicker mb-3 !text-[var(--paper-dark)]/60">Colophon</p>
          <p class="dek !text-[var(--paper-dark)] text-base">
            A magazine of practical notes from inside the AI work — written, edited &amp; published by {{ appConfig.site.author }}.
          </p>
        </div>

        <div class="md:col-span-3">
          <p class="kicker mb-3 !text-[var(--paper-dark)]/60">Sections</p>
          <ul class="flex flex-col gap-2">
            <li><NuxtLink to="/learn" class="text-[var(--paper-dark)] hover:text-[var(--cobalt-bright)]">{{ t('nav.learn') }}</NuxtLink></li>
            <li><NuxtLink to="/projects" class="text-[var(--paper-dark)] hover:text-[var(--cobalt-bright)]">{{ t('nav.projects') }}</NuxtLink></li>
            <li><NuxtLink to="/blog" class="text-[var(--paper-dark)] hover:text-[var(--cobalt-bright)]">{{ t('nav.blog') }}</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-[var(--paper-dark)] hover:text-[var(--cobalt-bright)]">{{ t('nav.about') }}</NuxtLink></li>
          </ul>
        </div>

        <div class="md:col-span-4">
          <p class="kicker mb-3 !text-[var(--paper-dark)]/60">Elsewhere</p>
          <ul class="flex flex-col gap-2">
            <li v-if="appConfig.social.github">
              <a :href="appConfig.social.github" target="_blank" rel="noopener noreferrer" class="text-[var(--paper-dark)] hover:text-[var(--cobalt-bright)]">
                GitHub ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-16 flex flex-col items-baseline justify-between gap-2 border-t border-[oklch(0.92_0.005_80/0.2)] pt-6 sm:flex-row">
        <p class="meta !text-[var(--paper-dark)]/60">© {{ year }} {{ appConfig.site.author }} · {{ t('common.allRightsReserved') }}</p>
        <p class="meta !text-[var(--paper-dark)]/60">
          Bodoni Moda · Albert Sans · Imagery from <a href="https://unsplash.com/?utm_source=turing&utm_medium=referral" target="_blank" rel="noopener noreferrer" class="hover:text-[var(--cobalt-bright)]">Unsplash</a>
        </p>
      </div>
    </div>
  </footer>
</template>
