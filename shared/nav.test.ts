import { describe, expect, it } from 'vitest'
import { buildNav, NAV_ROUTES } from './nav'

describe('buildNav', () => {
  it('每个路由映射为 { to, label }，label 经 translate 函数', () => {
    const dict: Record<string, string> = {
      'nav.learn': '学习',
      'nav.projects': '项目',
      'nav.blog': '博客',
      'nav.about': '关于',
    }
    const t = (k: string) => dict[k] ?? k
    expect(buildNav(t)).toEqual([
      { to: '/learn', label: '学习' },
      { to: '/projects', label: '项目' },
      { to: '/blog', label: '博客' },
      { to: '/about', label: '关于' },
    ])
  })
  it('覆盖四个主栏目', () => {
    expect(NAV_ROUTES.map(r => r.to)).toEqual(['/learn', '/projects', '/blog', '/about'])
  })
})
