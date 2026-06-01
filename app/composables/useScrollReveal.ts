// app/composables/useScrollReveal.ts
// 给元素加 .reveal / .develop（初始隐藏），进入视口后加 .is-in 触发揭示。
// 健壮实现：滚动时「重新查询」未揭示元素（不依赖一次性观察的节点引用，
// 因此 Vue 重渲染/水合替换节点也不会让图永久被 clip 藏住），
// 并设兜底定时器，确保任何元素最终都会被揭示、绝不卡在隐藏态。
export function useScrollReveal() {
  if (import.meta.server)
    return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  onMounted(() => {
    const revealAll = () =>
      document.querySelectorAll('.reveal:not(.is-in), .develop:not(.is-in)')
        .forEach(el => el.classList.add('is-in'))

    if (reduce) {
      revealAll()
      return
    }

    let ticking = false
    const check = () => {
      ticking = false
      const vh = window.innerHeight
      document.querySelectorAll<HTMLElement>('.reveal:not(.is-in), .develop:not(.is-in)')
        .forEach((el) => {
          // 元素上沿进入视口 90% 处即揭示
          if (el.getBoundingClientRect().top < vh * 0.9)
            el.classList.add('is-in')
        })
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(check)
      }
    }

    check() // 初始可见的先揭示
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    // 兜底：3s 后把剩余未揭示的全部揭示（防止任何漏网元素永久隐藏）
    const fallback = setTimeout(revealAll, 3000)

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      clearTimeout(fallback)
    })
  })
}
