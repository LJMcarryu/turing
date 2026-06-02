import { describe, expect, it } from 'vitest'
import { mergeFeed, relatedPredicate } from './predicates'

const A = { path: '/blog/a', date: '2026-01-01', title: 'A', description: 'da', tags: ['ai', 'mcp'], category: 'x' }
const B = { path: '/blog/b', date: '2026-02-01', title: 'B', description: 'db', tags: ['mcp'], category: 'x' }
const C = { path: '/blog/c', date: '2026-03-01', title: 'C', description: 'dc', tags: ['vue'], category: 'y' }

describe('relatedPredicate', () => {
  it('by tags：tag 重叠且排除自己', () => {
    const p = relatedPredicate(A, 'tags')
    expect(p(A)).toBe(false) // 自己
    expect(p(B)).toBe(true) // 共享 mcp
    expect(p(C)).toBe(false) // 无重叠
  })
  it('by category：同类且排除自己', () => {
    const p = relatedPredicate(A, 'category')
    expect(p(B)).toBe(true)
    expect(p(C)).toBe(false)
  })
  it('entry 无 tags 时 by tags 全 false', () => {
    expect(relatedPredicate({ path: '/x', tags: [] as string[] }, 'tags')(B)).toBe(false)
  })
})

describe('mergeFeed', () => {
  it('合并 + 按 date 降序 + 截断', () => {
    expect(mergeFeed([[A], [B, C]], 2).map(e => e.path)).toEqual(['/blog/c', '/blog/b'])
  })
  it('过滤掉缺字段的条目', () => {
    const bad = { path: '/blog/x', title: 'x' } // 缺 date/description
    expect(mergeFeed([[A], [bad]], 10).map(e => e.path)).toEqual(['/blog/a'])
  })
})
