<script setup lang="ts">
const appConfig = useAppConfig()
const mobileMenuOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-brand-border bg-brand-bg/80 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="h-7 w-7 rounded-md bg-gradient-to-br from-brand-primary to-brand-accent" />
        <span class="text-lg font-bold tracking-tight">{{ appConfig.site.name }}</span>
      </NuxtLink>

      <nav class="hidden items-center gap-6 md:flex">
        <NuxtLink
          v-for="item in appConfig.nav"
          :key="item.to"
          :to="item.to"
          class="text-sm text-brand-muted transition-colors hover:text-brand-text"
          active-class="text-brand-text"
        >
          {{ item.label }}
        </NuxtLink>
        <NuxtLink
          to="/newsletter"
          class="rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Subscribe
        </NuxtLink>
      </nav>

      <button class="md:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
        <Icon :name="mobileMenuOpen ? 'lucide:x' : 'lucide:menu'" class="h-6 w-6" />
      </button>
    </div>

    <div v-if="mobileMenuOpen" class="border-t border-brand-border px-4 pb-4 md:hidden">
      <nav class="flex flex-col gap-3 pt-3">
        <NuxtLink
          v-for="item in appConfig.nav"
          :key="item.to"
          :to="item.to"
          class="text-sm text-brand-muted hover:text-brand-text"
          @click="mobileMenuOpen = false"
        >
          {{ item.label }}
        </NuxtLink>
        <NuxtLink
          to="/newsletter"
          class="mt-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent px-4 py-2 text-center text-sm font-medium text-white"
          @click="mobileMenuOpen = false"
        >
          Subscribe
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
