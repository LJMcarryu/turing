<script setup lang="ts">
const appConfig = useAppConfig()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-brand-border">
    <div class="mx-auto max-w-6xl px-4 py-12">
      <div class="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="h-6 w-6 rounded-md bg-gradient-to-br from-brand-primary to-brand-accent" />
            <span class="font-bold">{{ appConfig.site.name }}</span>
          </NuxtLink>
          <p class="mt-2 text-sm text-brand-subtle">{{ appConfig.site.slogan }}</p>
        </div>

        <nav class="flex gap-6">
          <NuxtLink
            v-for="item in appConfig.nav"
            :key="item.to"
            :to="item.to"
            class="text-sm text-brand-muted hover:text-brand-text"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="flex gap-4">
          <a
            v-if="appConfig.social.github"
            :href="appConfig.social.github"
            target="_blank"
            rel="noopener noreferrer"
            class="text-brand-subtle hover:text-brand-text"
          >
            <Icon name="lucide:github" class="h-5 w-5" />
          </a>
        </div>
      </div>

      <div class="mt-8 border-t border-brand-border pt-6 text-center text-sm text-brand-subtle">
        &copy; {{ year }} {{ appConfig.site.author }}. All rights reserved.
      </div>
    </div>
  </footer>
</template>
