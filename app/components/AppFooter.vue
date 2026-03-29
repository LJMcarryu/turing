<script setup lang="ts">
const appConfig = useAppConfig()
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-brand-border bg-brand-surface/30">
    <div class="mx-auto max-w-6xl px-4 py-16">
      <div class="grid gap-12 md:grid-cols-3">
        <!-- Brand -->
        <div>
          <NuxtLink to="/" class="group inline-flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent transition-transform group-hover:scale-110"></div>
            <span class="text-xl font-bold">{{ appConfig.site.name }}</span>
          </NuxtLink>
          <p class="mt-4 text-sm text-brand-muted">
            {{ t('site.slogan') }}
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-brand-text">{{ t('nav.navigation') }}</h3>
          <nav class="flex flex-col gap-3">
            <NuxtLink
              to="/learn"
              class="text-sm text-brand-muted transition-colors hover:text-brand-primary"
            >
              {{ t('nav.learn') }}
            </NuxtLink>
            <NuxtLink
              to="/projects"
              class="text-sm text-brand-muted transition-colors hover:text-brand-primary"
            >
              {{ t('nav.projects') }}
            </NuxtLink>
            <NuxtLink
              to="/blog"
              class="text-sm text-brand-muted transition-colors hover:text-brand-primary"
            >
              {{ t('nav.blog') }}
            </NuxtLink>
            <NuxtLink
              to="/about"
              class="text-sm text-brand-muted transition-colors hover:text-brand-primary"
            >
              {{ t('nav.about') }}
            </NuxtLink>
          </nav>
        </div>

        <!-- Social & Newsletter -->
        <div>
          <h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-brand-text">{{ t('nav.followMe') }}</h3>
          <div class="flex gap-3">
            <a
              v-if="appConfig.social.github"
              :href="appConfig.social.github"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-card text-brand-muted transition-all hover:bg-brand-primary hover:text-brand-bg"
            >
              <Icon name="heroicons:code-bracket" class="h-5 w-5" />
            </a>
          </div>
          <NuxtLink
            to="/newsletter"
            class="btn-secondary mt-6 inline-flex"
          >
            <Icon name="heroicons:envelope" class="h-4 w-4" />
            {{ t('footer.subscribeNewsletter') }}
          </NuxtLink>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-12 border-t border-brand-border pt-8 text-center">
        <p class="text-sm text-brand-subtle">
          &copy; {{ year }} {{ appConfig.site.author }}. {{ t('common.allRightsReserved') }}.
        </p>
      </div>
    </div>
  </footer>
</template>
