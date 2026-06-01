// app/composables/useScrollReveal.ts
// 给元素加 .reveal（初始隐藏），进入视口后加 .is-in 触发揭示。
// reduced-motion 时直接显示，不挂 observer。
export function useScrollReveal() {
  if (import.meta.server)
    return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  onMounted(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (reduce) {
      els.forEach(el => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )
    els.forEach(el => io.observe(el))
    onBeforeUnmount(() => io.disconnect())
  })
}
