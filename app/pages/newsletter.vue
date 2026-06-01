<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: `${t('newsletter.title')} ${t('newsletter.titleHighlight')} — Turing`,
  description: t('newsletter.description'),
})

const heroImg = useArticleImage('newsletter-hero', 'hero')
</script>

<template>
  <article>
    <!-- Full-bleed hero with overlay text -->
    <section class="bleed-hero">
      <div class="bleed-hero__img">
        <div class="ar-cinema overflow-hidden">
          <img :src="heroImg.src" :alt="heroImg.alt" loading="eager">
        </div>
      </div>
      <div class="bleed-hero__overlay">
        <div class="mx-auto max-w-[1536px]">
          <p class="kicker mb-3 !text-[var(--paper-dark)]/80">Dispatch · A letter, on occasion</p>
          <h1 class="mag-1 !text-[var(--paper-dark)] max-w-[14ch]">
            {{ t('newsletter.title') }} <span class="mag-italic">{{ t('newsletter.titleHighlight') }}</span>
          </h1>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-[820px] px-6 py-20">
      <p class="dek mb-10">{{ t('newsletter.description') }}</p>
      <NewsletterForm />
    </section>

    <section class="border-t border-[var(--rule)] bg-[var(--paper-2)]">
      <div class="mx-auto max-w-[1536px] px-6 py-20">
        <div class="section-head mb-12">
          <div>
            <p class="kicker kicker--cobalt mb-2">Synopsis</p>
            <h2 class="mag-2">{{ t('newsletter.whatYouGet') }}</h2>
          </div>
        </div>

        <ol class="grid list-none gap-x-10 gap-y-12 md:grid-cols-3">
          <li>
            <figure class="figure mb-4">
              <div class="ar-square overflow-hidden">
                <img :src="useArticleImage('newsletter-bene-1', 'square').src" alt="" loading="lazy">
              </div>
            </figure>
            <span class="meta text-[var(--cobalt)]">i.</span>
            <h3 class="mag-4 mt-2">{{ t('newsletter.benefits.tutorials.title') }}</h3>
            <p class="tile__dek mt-2">{{ t('newsletter.benefits.tutorials.description') }}</p>
          </li>
          <li>
            <figure class="figure mb-4">
              <div class="ar-square overflow-hidden">
                <img :src="useArticleImage('newsletter-bene-2', 'square').src" alt="" loading="lazy">
              </div>
            </figure>
            <span class="meta text-[var(--cobalt)]">ii.</span>
            <h3 class="mag-4 mt-2">{{ t('newsletter.benefits.updates.title') }}</h3>
            <p class="tile__dek mt-2">{{ t('newsletter.benefits.updates.description') }}</p>
          </li>
          <li>
            <figure class="figure mb-4">
              <div class="ar-square overflow-hidden">
                <img :src="useArticleImage('newsletter-bene-3', 'square').src" alt="" loading="lazy">
              </div>
            </figure>
            <span class="meta text-[var(--cobalt)]">iii.</span>
            <h3 class="mag-4 mt-2">{{ t('newsletter.benefits.insights.title') }}</h3>
            <p class="tile__dek mt-2">{{ t('newsletter.benefits.insights.description') }}</p>
          </li>
        </ol>
      </div>
    </section>
  </article>
</template>
