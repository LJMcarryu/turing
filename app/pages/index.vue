<script setup lang="ts">
useSeoMeta({
  title: 'Turing — AI 技术实践者的知识库与工具箱',
  description: '探索 AI 技术前沿，分享实践经验，构建开源工具。',
})

const { data: featuredLearn } = await useAsyncData('featured-learn', () =>
  queryCollection('learn').where('featured', '=', true).limit(3).all()
)

const { data: latestBlog } = await useAsyncData('latest-blog', () =>
  queryCollection('blog').order('date', 'DESC').limit(3).all()
)

const { data: projects } = await useAsyncData('projects', () =>
  queryCollection('projects').limit(3).all()
)
</script>

<template>
  <div>
    <HeroSection />

    <div class="mx-auto max-w-6xl px-4 py-16">
      <!-- Featured Learn -->
      <section v-if="featuredLearn?.length" class="mb-16">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold">AI 编程实践</h2>
          <NuxtLink to="/learn" class="text-sm text-brand-primary hover:underline">
            查看全部 →
          </NuxtLink>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <ContentCard
            v-for="article in featuredLearn"
            :key="article.path"
            :to="article.path"
            label="LEARN"
            :title="article.title"
            :description="article.description"
            :level="article.level"
            :reading-time="article.readingTime"
          />
        </div>
      </section>

      <!-- Projects -->
      <section v-if="projects?.length" class="mb-16">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold">开源项目</h2>
          <NuxtLink to="/projects" class="text-sm text-brand-primary hover:underline">
            查看全部 →
          </NuxtLink>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <ContentCard
            v-for="project in projects"
            :key="project.path"
            :to="project.path"
            label="PROJECT"
            :title="project.title"
            :description="project.description"
          />
        </div>
      </section>

      <!-- Latest Blog -->
      <section v-if="latestBlog?.length" class="mb-16">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold">最新洞察</h2>
          <NuxtLink to="/blog" class="text-sm text-brand-primary hover:underline">
            查看全部 →
          </NuxtLink>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <ContentCard
            v-for="post in latestBlog"
            :key="post.path"
            :to="post.path"
            label="BLOG"
            :title="post.title"
            :description="post.description"
            :date="post.date"
            :reading-time="post.readingTime"
          />
        </div>
      </section>

      <!-- Newsletter -->
      <section class="rounded-xl border border-brand-border bg-brand-card p-8 text-center">
        <h2 class="text-xl font-bold">订阅 Turing Newsletter</h2>
        <p class="mt-2 text-sm text-brand-muted">获取最新的 AI 技术实践文章和开源项目更新</p>
        <div class="mt-6 flex justify-center">
          <NewsletterForm />
        </div>
      </section>
    </div>
  </div>
</template>
