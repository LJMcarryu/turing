import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  const fine = window.matchMedia('(pointer: fine)').matches
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduce)
    return // 移动端/降级走原生滚动

  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true, syncTouch: false })
  let id = 0
  const raf = (t: number) => {
    lenis.raf(t)
    id = requestAnimationFrame(raf)
  }
  id = requestAnimationFrame(raf)

  const router = useRouter()
  router.afterEach(() => lenis.scrollTo(0, { immediate: true }))

  onScopeDispose(() => {
    cancelAnimationFrame(id)
    lenis.destroy()
  })

  return { provide: { lenis } }
})
