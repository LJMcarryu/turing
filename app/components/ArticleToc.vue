<script setup lang="ts">
// 文章右侧目录（TOC）。点击锚点的平滑跳转由全局 Lenis 插件接管（拦截 a[href^="#"]），
// 本组件只负责渲染锚点列表 + scrollspy 高亮当前章节。projects / blog / learn 共用。
import type { TocLink } from '~/composables/useToc'

const props = withDefaults(defineProps<{
  links?: TocLink[]
  variant?: 'sticky' | 'inline'
}>(), {
  links: () => [],
  variant: 'sticky',
})

function flatten(nodes: TocLink[] | undefined): { id: string, text: string, depth: number }[] {
  const out: { id: string, text: string, depth: number }[] = []
  const walk = (list: TocLink[]) => {
    for (const n of list) {
      if (n?.id && n?.text && n.depth <= 3)
        out.push({ id: n.id, text: n.text, depth: n.depth })
      if (n?.children?.length)
        walk(n.children)
    }
  }
  walk(nodes ?? [])
  return out
}

// 优先用 content 提供的 toc.links（SSR 友好）；缺失则挂载后扫描 DOM 标题兜底。
const derived = ref<{ id: string, text: string, depth: number }[]>([])
const items = computed(() => {
  const fromProps = flatten(props.links)
  return fromProps.length ? fromProps : derived.value
})

const activeId = ref('')
let observer: IntersectionObserver | null = null
const visible = new Map<string, number>()

onMounted(() => {
  if (!flatten(props.links).length) {
    derived.value = Array.from(document.querySelectorAll<HTMLElement>('.prose h2[id], .prose h3[id]'))
      .map(h => ({ id: h.id, text: h.textContent?.trim() ?? '', depth: h.tagName === 'H2' ? 2 : 3 }))
  }

  const headings = items.value
    .map(i => document.getElementById(i.id))
    .filter((el): el is HTMLElement => !!el)
  if (!headings.length)
    return

  if (items.value[0])
    activeId.value = items.value[0].id

  observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting)
        visible.set((e.target as HTMLElement).id, e.boundingClientRect.top)
      else
        visible.delete((e.target as HTMLElement).id)
    }
    if (visible.size) {
      // 取最靠近视口顶部的可见标题作为当前章节
      const top = [...visible.entries()].sort((a, b) => a[1] - b[1])[0]
      if (top)
        activeId.value = top[0]
    }
  }, { rootMargin: '0px 0px -68% 0px', threshold: 0 })

  headings.forEach(h => observer!.observe(h))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <nav
    v-if="items.length"
    class="toc not-prose"
    :class="variant === 'sticky' ? 'toc--sticky' : 'toc--inline'"
    aria-label="目录"
  >
    <template v-if="variant === 'sticky'">
      <p class="toc__title">
        目录
      </p>
      <ul class="toc__list">
        <li v-for="it in items" :key="it.id" :class="{ 'toc__item--sub': it.depth === 3 }">
          <a :href="`#${it.id}`" class="toc__link" :class="{ 'is-active': activeId === it.id }">{{ it.text }}</a>
        </li>
      </ul>
    </template>

    <details v-else class="toc__details">
      <summary>目录</summary>
      <ul class="toc__list">
        <li v-for="it in items" :key="it.id" :class="{ 'toc__item--sub': it.depth === 3 }">
          <a :href="`#${it.id}`" class="toc__link" :class="{ 'is-active': activeId === it.id }">{{ it.text }}</a>
        </li>
      </ul>
    </details>
  </nav>
</template>
