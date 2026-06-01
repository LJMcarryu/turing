<!-- app/components/TheReel.client.vue -->
<script setup lang="ts">
interface ReelItem {
  path: string
  title: string
  description?: string
  status?: string
  src: string
  alt: string
}
const props = defineProps<{ items: ReelItem[] }>()
const mode = ref<'reel' | 'list'>('reel')
const track = ref<HTMLElement | null>(null)
const idx = ref(0)

function go(n: number) {
  idx.value = Math.min(props.items.length - 1, Math.max(0, idx.value + n))
  track.value?.children[idx.value]?.scrollIntoView({
    behavior: 'smooth',
    inline: 'center',
    block: 'nearest',
  })
}
function onKey(e: KeyboardEvent) {
  if (mode.value !== 'reel') return
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    go(1)
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    go(-1)
  }
}
const tc = computed(
  () => `${String(idx.value + 1).padStart(2, '0')} / ${String(props.items.length).padStart(2, '0')}`,
)
</script>

<template>
  <div class="reel" tabindex="0" :aria-label="`项目放映 ${tc}`" @keydown="onKey">
    <div class="reel-bar machine">
      <span>REEL · {{ tc }}</span>
      <button
        type="button"
        class="reel-toggle"
        data-magnet
        @click="mode = mode === 'reel' ? 'list' : 'reel'"
      >
        {{ mode === 'reel' ? '列表视图' : '放映视图' }}
      </button>
    </div>

    <div v-if="mode === 'reel'" ref="track" class="reel-track" role="list">
      <NuxtLink
        v-for="(it, i) in items"
        :key="it.path"
        :to="it.path"
        class="reel-cell"
        role="listitem"
        data-magnet
      >
        <span class="reel-no machine" aria-hidden="true">№ {{ String(i + 1).padStart(2, '0') }}</span>
        <div class="ar-wide overflow-hidden duotone">
          <img :src="it.src" :alt="it.alt" loading="lazy">
        </div>
        <h3 class="mag-4 mag-cjk mt-3">{{ it.title }}</h3>
        <p v-if="it.description" class="tile__dek mt-1 line-clamp-2">{{ it.description }}</p>
      </NuxtLink>
    </div>

    <div v-else class="reel-list" role="list">
      <NuxtLink v-for="(it, i) in items" :key="it.path" :to="it.path" class="entry" role="listitem">
        <span class="entry__num">{{ String(i + 1).padStart(2, '0') }}</span>
        <div>
          <h3 class="entry__title">{{ it.title }}</h3>
          <p class="entry__dek">{{ it.description }}</p>
        </div>
        <span class="entry__meta machine">{{ it.status }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.reel:focus-visible {
  outline: 2px solid var(--cobalt);
  outline-offset: 6px;
}
.reel-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--rule);
  padding-bottom: 0.6rem;
  font-size: 0.72rem;
  color: var(--ink-soft);
}
.reel-toggle {
  border: 1px solid var(--rule);
  padding: 0.3em 0.8em;
  border-radius: 999px;
  color: var(--ink);
}
.reel-toggle:hover {
  border-color: var(--cobalt);
  color: var(--cobalt);
}
.reel-track {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 1.5rem 0;
  scrollbar-width: thin;
}
.reel-cell {
  flex: 0 0 min(72vw, 460px);
  scroll-snap-align: center;
  position: relative;
}
.reel-no {
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  z-index: 1;
  color: var(--amber);
  font-size: 0.72rem;
}
.reel-list {
  display: flex;
  flex-direction: column;
}
</style>
