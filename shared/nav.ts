// 站点主导航的唯一来源：路由 + i18n key。被 AppHeader / AppFooter 共用。
export interface NavItem { to: string, label: string }

export const NAV_ROUTES = [
  { to: '/learn', key: 'nav.learn' },
  { to: '/projects', key: 'nav.projects' },
  { to: '/blog', key: 'nav.blog' },
  { to: '/about', key: 'nav.about' },
] as const

export function buildNav(t: (key: string) => string): NavItem[] {
  return NAV_ROUTES.map(r => ({ to: r.to, label: t(r.key) }))
}
