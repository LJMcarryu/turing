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
const progress = ref(0)

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
// 滚动同步：进度条 + 居中帧（时间码随手摇过片跳动）
function onScroll() {
  const el = track.value
  if (!el) return
  const max = el.scrollWidth - el.clientWidth
  progress.value = max > 0 ? el.scrollLeft / max : 0
  const center = el.scrollLeft + el.clientWidth / 2
  let best = 0
  let bestDist = Number.POSITIVE_INFINITY
  Array.from(el.children).forEach((c, i) => {
    const cell = c as HTMLElement
    const cc = cell.offsetLeft + cell.offsetWidth / 2
    const d = Math.abs(cc - center)
    if (d < bestDist) {
      bestDist = d
      best = i
    }
  })
  idx.value = best
}
const tc = computed(
  () => `${String(idx.value + 1).padStart(2, '0')} / ${String(props.items.length).padStart(2, '0')}`,
)
</script>

<template>
  <div class="reel" tabindex="0" :aria-label="`项目放映 ${tc}`" @keydown="onKey">
    <div class="reel-bar machine">
      <span class="reel-rec">
        <span class="reel-dot" aria-hidden="true" />REEL · {{ tc }}
      </span>
      <span class="reel-scrub" aria-hidden="true">
        <span class="reel-scrub-fill" :style="{ transform: `scaleX(${0.04 + progress * 0.96})` }" />
      </span>
      <button
        type="button"
        class="reel-toggle"
        data-magnet
        @click="mode = mode === 'reel' ? 'list' : 'reel'"
      >
        {{ mode === 'reel' ? '列表视图' : '放映视图' }}
      </button>
    </div>

    <div v-if="mode === 'reel'" ref="track" class="reel-track" role="list" @scroll.passive="onScroll">
      <NuxtLink
        v-for="(it, i) in items"
        :key="it.path"
        :to="it.path"
        class="reel-cell"
        role="listitem"
        data-magnet
      >
        <span class="reel-no machine" aria-hidden="true">№ {{ String(i + 1).padStart(2, '0') }}</span>
        <div class="reel-frame">
          <div class="ar-wide overflow-hidden duotone">
            <img :src="it.src" :alt="it.alt" loading="lazy">
          </div>
        </div>
        <h3 class="mag-4 mag-cjk mt-3">{{ it.title }}</h3>
        <p v-if="it.description" class="tile__dek mt-1 line-clamp-2">{{ it.description }}</p>
      </NuxtLink>
    </div>

    <div v-if="mode === 'reel'" class="reel-ruler machine" aria-hidden="true">
      <span>FPS 24</span>
      <span>← / → · drag</span>
      <span>TC {{ tc }}</span>
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
  gap: 1rem;
  border-bottom: 1px solid var(--rule);
  padding-bottom: 0.6rem;
  font-size: 0.72rem;
  color: var(--ink-soft);
}
.reel-rec {
  display: inline-flex;
  align-items: center;
  gap: 0.55em;
  white-space: nowrap;
}
.reel-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--cobalt);
  box-shadow: 0 0 8px var(--cobalt);
  animation: rec-blink 1.6s steps(1) infinite;
}
@keyframes rec-blink {
  50% {
    opacity: 0.2;
  }
}
.reel-scrub {
  flex: 1;
  max-width: 320px;
  height: 2px;
  background: var(--rule);
  position: relative;
  overflow: hidden;
}
.reel-scrub-fill {
  position: absolute;
  inset: 0;
  transform-origin: left;
  background: var(--cobalt);
  transform: scaleX(0.04);
}
.reel-toggle {
  border: 1px solid var(--rule);
  padding: 0.3em 0.8em;
  border-radius: 999px;
  color: var(--ink);
  white-space: nowrap;
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
  top: 1.1rem;
  left: 1.1rem;
  z-index: 2;
  color: var(--amber);
  font-size: 0.72rem;
}
/* 胶片帧：细框 + 对角琥珀套准角标 */
.reel-frame {
  position: relative;
  border: 1px solid var(--rule);
  padding: 6px;
}
.reel-frame::before,
.reel-frame::after {
  content: '';
  position: absolute;
  width: 11px;
  height: 11px;
  border: 1.5px solid var(--amber);
  opacity: 0.6;
}
.reel-frame::before {
  left: -1px;
  top: -1px;
  border-right: 0;
  border-bottom: 0;
}
.reel-frame::after {
  right: -1px;
  bottom: -1px;
  border-left: 0;
  border-top: 0;
}
/* 走带刻度尺 */
.reel-ruler {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-top: 0.4rem;
  padding-top: 0.7rem;
  border-top: 1px solid var(--rule);
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
.reel-ruler::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 7px;
  background-image: repeating-linear-gradient(90deg, var(--rule) 0 1px, transparent 1px 14px);
  opacity: 0.5;
}
.reel-list {
  display: flex;
  flex-direction: column;
}
@media (prefers-reduced-motion: reduce) {
  .reel-dot {
    animation: none;
  }
}
</style>
