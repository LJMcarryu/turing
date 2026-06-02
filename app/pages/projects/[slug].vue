<script setup lang="ts">
const { t } = useI18n()
const { formatDate } = useFormatDate()

const route = useRoute()
const project = await getProject(route.path)

useSeoMeta({
  title: `${project.value.title} — Turing`,
  description: project.value.description,
  ogTitle: project.value.title,
  ogDescription: project.value.description,
  ogType: 'website',
})

const heroImg = useArticleImageFromEntry(project.value, 'hero')
const sideImg = useArticleImageFromEntry(project.value, 'portrait', 1)

const { data: otherProjects } = useOtherProjects(project)

const { projectStatusClass, projectStatusLabel } = useProjectStatus()
</script>

<template>
  <article v-if="project">
    <header class="border-b border-[var(--rule)]">
      <div class="mx-auto max-w-[1100px] px-6 pt-12 pb-12">
        <nav class="meta mb-8 flex items-center gap-2">
          <NuxtLink to="/" class="hover:text-[var(--cobalt)]">Home</NuxtLink>
          <span>/</span>
          <NuxtLink to="/projects" class="hover:text-[var(--cobalt)]">{{ t('projects.title') }}</NuxtLink>
        </nav>
        <div class="mb-5 flex flex-wrap items-baseline gap-4">
          <span class="pill" :class="projectStatusClass(project.status)">{{ projectStatusLabel(project.status) }}</span>
          <span v-if="project.date" class="meta">{{ formatDate(project.date) }}</span>
        </div>
        <h1 class="mag-1">{{ project.title }}</h1>
        <p class="dek mt-8">{{ project.description }}</p>

        <div v-if="project.tags?.length" class="mt-6 flex flex-wrap gap-x-4">
          <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <div v-if="project.github" class="mt-8">
          <a :href="project.github" target="_blank" rel="noopener noreferrer" class="btn-ink">
            {{ t('common.viewSource') }} ↗
          </a>
        </div>
      </div>
    </header>

    <figure class="figure">
      <div class="ar-cinema overflow-hidden">
        <img :src="heroImg.src" :alt="heroImg.alt" loading="eager">
      </div>
    </figure>

    <section class="mx-auto max-w-[1100px] px-6 py-16">
      <div class="grid gap-x-10 md:grid-cols-12">
        <div class="prose md:col-span-8 max-w-none">
          <ContentRenderer :value="project" />
        </div>
        <aside class="mt-12 md:col-span-4 md:mt-0">
          <figure class="figure md:sticky md:top-12">
            <div class="ar-portrait overflow-hidden">
              <img :src="sideImg.src" :alt="sideImg.alt" loading="lazy">
            </div>
            <figcaption class="figure__caption">
              <span class="figure__caption-num">Fig. 02</span>
              <span>An accompanying image.</span>
            </figcaption>
          </figure>
        </aside>
      </div>
    </section>

    <section class="border-t border-[var(--rule)] bg-[var(--paper-2)]">
      <div class="mx-auto max-w-[1536px] px-6 py-20">
        <NuxtLink to="/projects" class="link-more mb-10 inline-flex">← {{ t('common.backTo') }} {{ t('projects.title') }}</NuxtLink>

        <div v-if="otherProjects?.length" class="mt-10">
          <div class="section-head mb-10">
            <div>
              <p class="kicker kicker--cobalt mb-2">Elsewhere in the ledger</p>
              <h2 class="mag-2">{{ t('projects.otherProjects') }}</h2>
            </div>
          </div>

          <div class="grid gap-x-8 gap-y-12 md:grid-cols-3">
            <NuxtLink
              v-for="other in otherProjects"
              :key="other.path"
              :to="other.path"
              class="tile group"
            >
              <figure class="figure figure--zoom">
                <div class="ar-card overflow-hidden">
                  <img :src="useArticleImage(other.path, 'card').src" :alt="useArticleImage(other.path, 'card').alt" loading="lazy">
                </div>
              </figure>
              <div>
                <div class="mb-2"><span class="pill" :class="projectStatusClass(other.status)">{{ projectStatusLabel(other.status) }}</span></div>
                <h3 class="mag-4 transition-colors group-hover:text-[var(--cobalt)]">{{ other.title }}</h3>
                <p class="tile__dek mt-2 line-clamp-2">{{ other.description }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>
