<!-- app/components/TheCursor.client.vue -->
<script setup lang="ts">
const ring = ref<HTMLElement | null>(null)
const cross = ref<HTMLElement | null>(null)
let raf = 0
const pos = { x: -100, y: -100 }
const cur = { x: -100, y: -100 }

onMounted(() => {
  if (!window.matchMedia('(pointer: fine)').matches) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  document.documentElement.classList.add('has-cursor')
  const move = (e: MouseEvent) => {
    pos.x = e.clientX
    pos.y = e.clientY
  }
  const over = (e: MouseEvent) => {
    const hit = (e.target as HTMLElement).closest('a, button, [data-magnet]')
    ring.value?.classList.toggle('is-hot', !!hit)
  }
  window.addEventListener('mousemove', move, { passive: true })
  window.addEventListener('mouseover', over, { passive: true })
  const loop = () => {
    cur.x += (pos.x - cur.x) * 0.18
    cur.y += (pos.y - cur.y) * 0.18
    if (cross.value) cross.value.style.transform = `translate(${pos.x}px, ${pos.y}px)`
    if (ring.value) ring.value.style.transform = `translate(${cur.x}px, ${cur.y}px)`
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseover', over)
  })
})
</script>

<template>
  <div aria-hidden="true">
    <div ref="cross" class="cur-cross" />
    <div ref="ring" class="cur-ring" />
  </div>
</template>

<style>
.has-cursor,
.has-cursor a,
.has-cursor button {
  cursor: none;
}
.cur-cross,
.cur-ring {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
  margin: -1px 0 0 -1px;
}
.cur-cross {
  width: 2px;
  height: 14px;
  margin-left: -1px;
  margin-top: -7px;
  background: var(--cobalt, #5a6ff0);
  box-shadow: 0 0 0 1px color-mix(in oklch, var(--paper) 60%, transparent);
}
.cur-cross::after {
  content: '';
  position: absolute;
  left: -6px;
  top: 6px;
  width: 14px;
  height: 2px;
  background: inherit;
}
.cur-ring {
  width: 30px;
  height: 30px;
  margin: -15px 0 0 -15px;
  border: 1px solid var(--ink-soft);
  border-radius: 999px;
  opacity: 0.5;
  transition:
    width 0.2s var(--ease-reel),
    height 0.2s var(--ease-reel),
    opacity 0.2s;
}
.cur-ring.is-hot {
  width: 46px;
  height: 46px;
  margin: -23px 0 0 -23px;
  opacity: 0.9;
  border-color: var(--cobalt);
}
@media (pointer: coarse) {
  .cur-cross,
  .cur-ring {
    display: none;
  }
}
</style>
