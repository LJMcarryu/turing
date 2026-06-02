import { describe, expect, it } from 'vitest'
import { buildBlogSpec, buildLearnSpec, buildProjectSpec, cacheKey } from './spec'

describe('buildSpec', () => {
  it('blog 默认按 date DESC，无 where', () => {
    expect(buildBlogSpec()).toEqual({ collection: 'blog', order: ['date', 'DESC'] })
  })
  it('blog featured 进 where，limit 透传', () => {
    expect(buildBlogSpec({ featured: true, limit: 4 })).toEqual({
      collection: 'blog',
      order: ['date', 'DESC'],
      where: [['featured', true]],
      limit: 4,
    })
  })
  it('learn category + level 进 where 且按 date DESC', () => {
    expect(buildLearnSpec({ category: 'mcp', level: 'beginner' })).toEqual({
      collection: 'learn',
      order: ['date', 'DESC'],
      where: [['category', 'mcp'], ['level', 'beginner']],
    })
  })
  it('projects 不排序，status 进 where', () => {
    expect(buildProjectSpec({ status: 'active' })).toEqual({
      collection: 'projects',
      where: [['status', 'active']],
    })
  })
  it('projects 默认无 where 无 order', () => {
    expect(buildProjectSpec()).toEqual({ collection: 'projects' })
  })
})

describe('cacheKey', () => {
  it('稳定且区分 opts', () => {
    expect(cacheKey(buildBlogSpec({ featured: true, limit: 4 })))
      .toBe(cacheKey(buildBlogSpec({ featured: true, limit: 4 })))
    expect(cacheKey(buildBlogSpec({ limit: 4 })))
      .not.toBe(cacheKey(buildBlogSpec({ limit: 8 })))
    expect(cacheKey(buildLearnSpec({ category: 'mcp' })))
      .not.toBe(cacheKey(buildLearnSpec({ category: 'agent-development' })))
  })
})
