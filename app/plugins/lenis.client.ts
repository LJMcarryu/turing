import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  if (!useMotionAllowed().allowed)
    return // 移动端/降级走原生滚动

  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true, syncTouch: false })
  let id = 0
  const raf = (t: number) => {
    lenis.raf(t)
    id = requestAnimationFrame(raf)
  }
  id = requestAnimationFrame(raf)

  // 同页锚点（文档导航 TOC 等）必须经由 lenis.scrollTo —— 否则原生锚点跳转会绕过 Lenis 的
  // 虚拟滚动：页面真位置跳到了标题，但 Lenis 内部位置仍停在点击前，一滚轮就用过期位置把页面
  // 弹回顶部。不用 Lenis 内置 anchors：它用 URL 编码后的 hash 做 querySelector，选不中中文 id 的标题。
  const targetFromHash = (hash: string): HTMLElement | null => {
    if (!hash || hash === '#')
      return null
    let key = hash.slice(1)
    try { key = decodeURIComponent(key) }
    catch { /* 已是解码形式 */ }
    return document.getElementById(key)
  }

  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return
    const a = (e.target as HTMLElement | null)?.closest?.('a[href]') as HTMLAnchorElement | null
    if (!a || (a.target && a.target !== '_self'))
      return // 新标签/具名窗口交给浏览器
    const url = new URL(a.href, window.location.href)
    // 仅处理「当前页（含 query）+ 锚点」的同页跳转；跨页/外链交给 router / 浏览器
    if (url.host !== window.location.host || url.pathname !== window.location.pathname
      || url.search !== window.location.search || !url.hash)
      return
    const el = targetFromHash(url.hash)
    if (!el)
      return
    e.preventDefault()
    lenis.scrollTo(el)
    // 同步地址栏 hash（pushState 不触发跳转/路由）；同一锚点重复点击不堆历史
    if (url.hash !== window.location.hash)
      history.pushState(null, '', a.getAttribute('href') || url.hash)
  }
  document.addEventListener('click', onClick)

  // 直链/刷新进入带 hash 时，把 Lenis 内部位置对齐到目标，避免首个滚轮弹回
  const syncHash = () => {
    const el = targetFromHash(window.location.hash)
    if (el)
      lenis.scrollTo(el, { immediate: true, force: true })
  }
  nuxtApp.hook('page:finish', () => {
    if (window.location.hash)
      requestAnimationFrame(() => requestAnimationFrame(syncHash))
  })

  // 浏览器前进/后退切换 hash 也是原生跳转，会绕过 Lenis —— 同步过去
  const onHashChange = () => {
    const el = targetFromHash(window.location.hash)
    if (el)
      lenis.scrollTo(el)
  }
  window.addEventListener('hashchange', onHashChange)

  const router = useRouter()
  router.afterEach((to, from) => {
    // 仅在真正切换页面（path 变化）时回到顶部；同页锚点交给 onClick
    if (to.path !== from.path)
      lenis.scrollTo(0, { immediate: true })
  })

  onScopeDispose(() => {
    cancelAnimationFrame(id)
    document.removeEventListener('click', onClick)
    window.removeEventListener('hashchange', onHashChange)
    lenis.destroy()
  })

  return { provide: { lenis } }
})
