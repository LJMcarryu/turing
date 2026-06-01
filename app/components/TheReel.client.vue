<!-- app/components/TheReel.client.vue — 单排视差电影胶片带 -->
<script setup lang="ts">
interface ReelItem {
  path: string
  title: string
  description?: string
  status?: string
  src: string
  alt: string
}
defineProps<{ items: ReelItem[] }>()

const root = ref<HTMLElement | null>(null)
const trackA = ref<HTMLElement | null>(null)
const listMode = ref(false)
const enabled = ref(false)
const pad = (n: number) => String(n).padStart(2, '0')

let raf = 0
let targetP = 0.5
let curP = 0.5
let sA = 0 // 横向余量(slack)

function measure() {
  const pa = trackA.value?.parentElement
  if (trackA.value && pa)
    sA = Math.max(0, trackA.value.scrollWidth - pa.clientWidth)
}
function onScroll() {
  if (!root.value) return
  const r = root.value.getBoundingClientRect()
  // 0 = 区块刚从底部进入视口；1 = 刚从顶部离开。页面照常滚动，这只是读位置
  targetP = (window.innerHeight - r.top) / (window.innerHeight + r.height)
}
function loop() {
  curP += (targetP - curP) * 0.07 // 阻尼，胶片惯性感
  if (trackA.value && sA > 0) {
    const tx = -sA / 2 + (0.5 - curP) * sA * 0.6 // 随页面滚动横向漂移
    trackA.value.style.transform = `translate3d(${tx}px, 0, 0)`
  }
  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  enabled.value
    = window.matchMedia('(pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!enabled.value) return // 移动/降级：原生横向滑动，无视差
  nextTick(() => {
    measure()
    onScroll()
    raf = requestAnimationFrame(loop)
  })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', measure, { passive: true })
  const t = setTimeout(measure, 600) // 图片/字体加载后再量一次
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', measure)
    clearTimeout(t)
  })
})
watch(listMode, () => nextTick(measure))
</script>

<template>
  <div ref="root" class="film" :class="{ 'is-on': enabled && !listMode }">
    <div class="film-head machine">
      <span><span class="film-dot" aria-hidden="true" />FILM · {{ items.length }} REELS · 24FPS</span>
      <button type="button" class="film-toggle" data-magnet @click="listMode = !listMode">
        {{ listMode ? '胶片视图' : '列表视图' }}
      </button>
    </div>

    <div v-if="!listMode" class="film-strip">
      <div class="film-perf" aria-hidden="true" />
      <div ref="trackA" class="film-track">
        <NuxtLink v-for="(it, i) in items" :key="it.path" :to="it.path" class="frame" data-magnet>
          <div class="ar-wide overflow-hidden duotone">
            <img :src="it.src" :alt="it.alt" loading="eager">
          </div>
          <span class="frame-cap">
            <span class="machine">№ {{ pad(i + 1) }}</span>
            <span class="mag-cjk">{{ it.title }}</span>
          </span>
        </NuxtLink>
      </div>
      <div class="film-perf" aria-hidden="true" />
    </div>

    <div v-else class="reel-list" role="list">
      <NuxtLink v-for="(it, i) in items" :key="it.path" :to="it.path" class="entry" role="listitem">
        <span class="entry__num">{{ pad(i + 1) }}</span>
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
.film {
  overflow: hidden;
}
.film-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1536px;
  margin: 0 auto 1.5rem;
  padding: 0 1.5rem 0.6rem;
  border-bottom: 1px solid var(--rule);
  font-size: 0.72rem;
  color: var(--ink-soft);
}
.film-head > span {
  display: inline-flex;
  align-items: center;
  gap: 0.55em;
}
.film-dot {
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
.film-toggle {
  border: 1px solid var(--rule);
  padding: 0.3em 0.8em;
  border-radius: 999px;
  color: var(--ink);
  white-space: nowrap;
}
.film-toggle:hover {
  border-color: var(--cobalt);
  color: var(--cobalt);
}

/* 胶片带：上下齿孔 + 中间帧轨 */
.film-strip {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--paper-2);
}
.film-perf {
  height: 18px;
  flex: none;
  background-color: var(--paper-3);
  background-image: radial-gradient(circle, oklch(0.44 0.012 60) 0 3px, transparent 3.5px);
  background-size: 24px 18px;
  background-repeat: repeat-x;
  background-position: center;
}
.film-track {
  display: flex;
  will-change: transform;
}
.frame {
  flex: 0 0 clamp(300px, 42vw, 620px);
  position: relative;
  border-left: 1px solid oklch(0.3 0.012 60);
}
.frame:first-child {
  border-left: 0;
}
.frame .ar-wide {
  aspect-ratio: 16 / 10;
}
.frame-cap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 2rem 1.1rem 0.9rem;
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.2;
  color: var(--ink);
  background: linear-gradient(to top, oklch(0.1 0.012 60 / 0.92), transparent);
  display: flex;
  gap: 0.55em;
  align-items: baseline;
}
.frame-cap .machine {
  color: var(--amber);
  font-size: 0.78rem;
  flex: none;
}

/* 非视差（移动/降级/列表）：原生横向滑动 */
.film:not(.is-on) .film-track {
  overflow-x: auto;
  transform: none !important;
  scrollbar-width: thin;
}

.reel-list {
  display: flex;
  flex-direction: column;
  max-width: 1536px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

@media (max-width: 768px) {
  .frame {
    flex-basis: 82vw;
  }
}
@media (prefers-reduced-motion: reduce) {
  .film-dot {
    animation: none;
  }
}
</style>
