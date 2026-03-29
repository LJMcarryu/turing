<script setup lang="ts">
const appConfig = useAppConfig()
const mobileMenuOpen = ref(false)
const { locale, locales, setLocale } = useI18n()
const { t } = useI18n()

const route = useRoute()
watch(() => route.path, () => { mobileMenuOpen.value = false })

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})

const switchLocale = (code: string) => {
  setLocale(code)
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-brand-border bg-brand-bg/90 backdrop-blur-xl">
    <div class="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
      <!-- Logo -->
      <NuxtLink to="/" class="group flex items-center gap-3">
        <div class="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent transition-transform group-hover:scale-110">
          <div class="absolute inset-0 bg-brand-bg opacity-0 transition-opacity group-hover:opacity-20"></div>
        </div>
        <span class="text-xl font-bold tracking-tight">{{ appConfig.site.name }}</span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="hidden items-center gap-8 md:flex">
        <NuxtLink
          to="/learn"
          class="relative text-sm font-semibold text-brand-muted transition-colors hover:text-brand-text"
          active-class="text-brand-primary"
        >
          {{ t('nav.learn') }}
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="relative text-sm font-semibold text-brand-muted transition-colors hover:text-brand-text"
          active-class="text-brand-primary"
        >
          {{ t('nav.projects') }}
        </NuxtLink>
        <NuxtLink
          to="/blog"
          class="relative text-sm font-semibold text-brand-muted transition-colors hover:text-brand-text"
          active-class="text-brand-primary"
        >
          {{ t('nav.blog') }}
        </NuxtLink>
        <NuxtLink
          to="/about"
          class="relative text-sm font-semibold text-brand-muted transition-colors hover:text-brand-text"
          active-class="text-brand-primary"
        >
          {{ t('nav.about') }}
        </NuxtLink>

        <!-- Language Switcher -->
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          @click="switchLocale(loc.code)"
          class="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-muted transition-colors hover:bg-brand-surface hover:text-brand-text"
          :title="`Switch to ${loc.name}`"
        >
          {{ loc.code === 'zh-CN' ? '中' : 'EN' }}
        </button>

        <NuxtLink
          to="/newsletter"
          class="btn-primary px-5 py-2 text-sm"
        >
          <Icon name="heroicons:envelope" class="h-4 w-4" />
          {{ t('nav.subscribe') }}
        </NuxtLink>
      </nav>

      <!-- Mobile Menu Button -->
      <button
        class="rounded-lg p-2 transition-colors hover:bg-brand-surface md:hidden"
        :aria-label="t('common.menu')"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <Icon :name="mobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" class="h-6 w-6" />
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" class="border-t border-brand-border bg-brand-surface/50 px-4 pb-6 backdrop-blur-xl md:hidden">
        <nav class="flex flex-col gap-4 pt-6">
          <NuxtLink
            to="/learn"
            class="text-base font-semibold text-brand-muted transition-colors hover:text-brand-text"
            active-class="text-brand-primary"
            @click="mobileMenuOpen = false"
          >
            {{ t('nav.learn') }}
          </NuxtLink>
          <NuxtLink
            to="/projects"
            class="text-base font-semibold text-brand-muted transition-colors hover:text-brand-text"
            active-class="text-brand-primary"
            @click="mobileMenuOpen = false"
          >
            {{ t('nav.projects') }}
          </NuxtLink>
          <NuxtLink
            to="/blog"
            class="text-base font-semibold text-brand-muted transition-colors hover:text-brand-text"
            active-class="text-brand-primary"
            @click="mobileMenuOpen = false"
          >
            {{ t('nav.blog') }}
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="text-base font-semibold text-brand-muted transition-colors hover:text-brand-text"
            active-class="text-brand-primary"
            @click="mobileMenuOpen = false"
          >
            {{ t('nav.about') }}
          </NuxtLink>

          <!-- Mobile Language Switcher -->
          <div class="flex gap-2 pt-2">
            <button
              v-for="loc in availableLocales"
              :key="loc.code"
              @click="switchLocale(loc.code)"
              class="flex-1 rounded-lg bg-brand-surface px-4 py-2 text-sm font-medium text-brand-muted transition-colors hover:bg-brand-primary hover:text-white"
            >
              {{ loc.name }}
            </button>
          </div>

          <NuxtLink
            to="/newsletter"
            class="btn-primary mt-2 px-5 py-3 text-center text-sm"
            @click="mobileMenuOpen = false"
          >
            <Icon name="heroicons:envelope" class="h-4 w-4" />
            {{ t('nav.subscribe') }}
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>
