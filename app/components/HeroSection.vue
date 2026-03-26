<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]" />
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(74,158,255,0.15),transparent_50%)]" />

    <div class="relative mx-auto max-w-6xl px-4 py-24 text-center md:py-32">
      <h1 class="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
        {{ appConfig.site.name }}
      </h1>
      <p class="mx-auto mt-4 max-w-xl text-lg text-brand-muted md:text-xl">
        {{ appConfig.site.slogan }}
      </p>
      <div class="mt-8 flex items-center justify-center gap-4">
        <NuxtLink
          to="/learn"
          class="btn-primary"
        >
          开始学习
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="rounded-lg border border-brand-border px-6 py-2.5 font-medium text-brand-muted transition-colors hover:border-brand-primary/50 hover:text-brand-text"
        >
          浏览项目
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
