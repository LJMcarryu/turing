<script setup lang="ts">
const { t } = useI18n()
const appConfig = useAppConfig()

useSeoMeta({ title: `${t('about.title')} — Turing`, description: t('site.description') })

const portrait = useArticleImage('about-jimmy-portrait', 'portrait')
</script>

<template>
  <article>
    <section class="border-b border-[var(--rule)]">
      <div class="mx-auto grid max-w-[1536px] grid-cols-1 gap-0 px-6 pt-8 md:grid-cols-12 md:gap-x-10">
        <div class="md:col-span-7 md:pr-6">
          <div class="mb-5 flex flex-wrap items-baseline gap-4 border-b border-[var(--rule)] pb-3">
            <span class="meta text-[var(--cobalt)]">№ 04 · About</span>
            <span class="meta">Colophon</span>
          </div>
          <p class="kicker kicker--cobalt mb-5">{{ t('about.title') }}</p>
          <h1 class="mag-1">{{ t('about.greeting') }} <span class="mag-italic">Jimmy Liu.</span></h1>
          <p class="dek mt-8">{{ t('about.intro') }}</p>
        </div>

        <figure class="figure mt-10 md:col-span-5 md:mt-0 md:pb-12">
          <div class="ar-portrait overflow-hidden">
            <img :src="portrait.src" :alt="portrait.alt" loading="eager">
          </div>
          <figcaption class="figure__caption">
            <span class="figure__caption-num">Fig. 01</span>
            <span>A working desk, a long afternoon.</span>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="mx-auto max-w-[1536px] px-6 py-20">
      <div class="grid gap-12 md:grid-cols-12">
        <div class="md:col-span-8">
          <p class="kicker mb-5">{{ t('about.findHere') }}</p>
          <ol class="list-none">
            <li>
              <NuxtLink to="/learn" class="entry">
                <span class="entry__num">01</span>
                <div>
                  <h3 class="entry__title">{{ t('nav.learn') }}</h3>
                  <p class="entry__dek">{{ t('about.learnDesc') }}</p>
                </div>
                <div class="entry__meta">↗</div>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/projects" class="entry">
                <span class="entry__num">02</span>
                <div>
                  <h3 class="entry__title">{{ t('nav.projects') }}</h3>
                  <p class="entry__dek">{{ t('about.projectsDesc') }}</p>
                </div>
                <div class="entry__meta">↗</div>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/blog" class="entry">
                <span class="entry__num">03</span>
                <div>
                  <h3 class="entry__title">{{ t('nav.blog') }}</h3>
                  <p class="entry__dek">{{ t('about.blogDesc') }}</p>
                </div>
                <div class="entry__meta">↗</div>
              </NuxtLink>
            </li>
          </ol>

          <hr class="rule my-12">
          <p class="dek">
            {{ t('about.subscribePrompt') }}
            <NuxtLink to="/newsletter" class="link-ed">{{ t('about.subscribeLink') }}</NuxtLink>{{ t('about.subscribeEnd') }}
          </p>
        </div>

        <aside class="md:col-span-4">
          <p class="kicker mb-5">{{ t('about.contact') }}</p>
          <ul class="flex flex-col gap-4">
            <li v-if="appConfig.social.github">
              <a :href="appConfig.social.github" target="_blank" rel="noopener noreferrer" class="link-ed inline-flex items-center gap-2 text-base">
                <span>GitHub</span>
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
          <hr class="rule my-8">
          <p class="kicker mb-3">Imprint</p>
          <p class="caption">
            Edited &amp; written by {{ appConfig.site.author }}.<br>
            Set in Bodoni Moda &amp; Albert Sans.<br>
            Imagery via picsum.photos.
          </p>
        </aside>
      </div>
    </section>
  </article>
</template>
