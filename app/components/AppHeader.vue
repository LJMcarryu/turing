<script setup lang="ts">
const appConfig = useAppConfig()
const mobileMenuOpen = ref(false)
const { t } = useI18n()
const route = useRoute()
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

const nav = computed(() => [
  { to: '/learn', label: t('nav.learn') },
  { to: '/projects', label: t('nav.projects') },
  { to: '/blog', label: t('nav.blog') },
  { to: '/about', label: t('nav.about') },
])

const issue = computed(() => {
  const now = new Date()
  const q = Math.floor(now.getMonth() / 3) + 1
  return `Issue ${String(q).padStart(2, '0')} · ${now.getFullYear()}`
})
</script>

<template>
  <header class="relative z-50 bg-[var(--paper)]">
    <!-- Top thin masthead bar -->
    <div class="border-b border-[var(--rule)]">
      <div class="mx-auto flex max-w-[1536px] items-center justify-between gap-3 px-6 py-2">
        <span class="meta">{{ t('site.slogan') }}</span>
        <span class="meta">{{ issue }}</span>
      </div>
    </div>

    <!-- Main row -->
    <div class="border-b border-[var(--ink)]">
      <div class="mx-auto flex max-w-[1536px] items-center justify-between gap-6 px-6 py-5">
        <NuxtLink to="/" class="font-display text-3xl font-medium leading-none tracking-tight md:text-4xl">
          {{ appConfig.site.name }}<span class="italic font-normal">.</span>
        </NuxtLink>

        <nav class="hidden items-center gap-7 md:flex">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="relative text-sm font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
            active-class="!text-[var(--cobalt)]"
          >
            {{ item.label }}
          </NuxtLink>

          <span class="h-4 w-px bg-[var(--rule)]"></span>

          <NuxtLink to="/newsletter" class="btn-ink text-sm">
            {{ t('nav.subscribe') }}
          </NuxtLink>
        </nav>

        <button
          class="border border-[var(--ink)] px-3 py-1.5 text-sm font-semibold md:hidden"
          :aria-label="t('common.menu')"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          {{ mobileMenuOpen ? '×' : 'Menu' }}
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileMenuOpen" class="border-b border-[var(--ink)] bg-[var(--paper)] px-6 pb-8 pt-2 md:hidden">
        <nav class="flex flex-col divide-y divide-[var(--rule)]">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="py-4 font-display text-3xl"
            active-class="!text-[var(--cobalt)]"
            @click="mobileMenuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>

          <NuxtLink to="/newsletter" class="btn-ink mt-2 self-start" @click="mobileMenuOpen = false">
            {{ t('nav.subscribe') }}
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>
