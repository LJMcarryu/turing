<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({ title: `${t('projects.title')} — Turing`, description: t('projects.subtitle') })

const { projects } = await useProjects()

const { projectStatusClass, projectStatusLabel } = useProjectStatus()
</script>

<template>
  <article>
    <header class="border-b border-[var(--ink)]">
      <div class="mx-auto max-w-[1536px] px-6 pt-10 pb-12">
        <div class="mb-6 flex flex-wrap items-baseline gap-4 border-b border-[var(--rule)] pb-3">
          <span class="meta text-[var(--cobalt)]">№ 02 — Working Ledger</span>
          <span class="meta">{{ projects?.length ?? 0 }} entries</span>
        </div>
        <p class="kicker kicker--cobalt mb-5">In progress &amp; in production</p>
        <h1 class="mag-1">{{ t('projects.title') }}<span class="mag-italic text-[var(--cobalt)]">.</span></h1>
        <p class="dek mt-6 max-w-[44ch]">{{ t('projects.subtitle') }}</p>
      </div>
    </header>

    <section class="mx-auto max-w-[1536px] px-6 py-16">
      <!-- Editorial alternating split layout, image-led -->
      <div v-if="projects?.length" class="flex flex-col gap-24">
        <NuxtLink
          v-for="(project, i) in projects"
          :key="project.path"
          :to="project.path"
          class="group grid gap-x-10 gap-y-6 md:grid-cols-12"
        >
          <figure
            class="figure figure--zoom md:col-span-7"
            :class="i % 2 === 0 ? 'md:order-1' : 'md:order-2'"
          >
            <div class="ar-wide overflow-hidden">
              <img :src="useArticleImage(project.path, 'wide').src" :alt="useArticleImage(project.path, 'wide').alt" loading="lazy">
            </div>
            <figcaption class="figure__caption">
              <span class="figure__caption-num">Fig. {{ String(i + 1).padStart(2, '0') }}</span>
              <span>{{ project.title }}</span>
            </figcaption>
          </figure>
          <div
            class="md:col-span-5 md:self-center"
            :class="i % 2 === 0 ? 'md:order-2' : 'md:order-1'"
          >
            <div class="mb-3 flex flex-wrap items-baseline gap-3">
              <span class="pill" :class="projectStatusClass(project.status)">{{ projectStatusLabel(project.status) }}</span>
            </div>
            <h2 class="mag-2 transition-colors group-hover:text-[var(--cobalt)]">{{ project.title }}</h2>
            <p class="dek mt-5 text-base font-body not-italic">{{ project.description }}</p>
            <div v-if="project.tags?.length" class="mt-4 flex flex-wrap gap-x-4">
              <span v-for="tag in project.tags.slice(0, 5)" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <p class="link-more mt-6 inline-flex">Read entry</p>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="py-20 text-center">
        <p class="kicker mb-3">Empty ledger</p>
        <p class="dek">{{ t('projects.noProjects') }}</p>
      </div>
    </section>
  </article>
</template>
