import { describe, expect, it } from 'vitest'
import { resolveArticleImage } from './useArticleImage'

describe('resolveArticleImage', () => {
  it('已知 path 命中本地 Unsplash 表（无 entry）', () => {
    const img = resolveArticleImage('/blog/claude-code-guide', 'card')
    expect(img.src).toBe('/images/unsplash/blog-claude-code-guide.jpg')
    expect(img.credit).toBe('Photo by Radowan Nakif Rehan on Unsplash')
    expect(img.creditUrl).toContain('@radowanrehan')
    expect(img.alt).toBe('')
  })

  it('frontmatter cover/credit/alt 优先于表', () => {
    const img = resolveArticleImage('/blog/x', 'hero', 0, {
      path: '/blog/x',
      cover: 'https://remote/x.jpg',
      credit: 'Photo by Me',
      creditUrl: 'https://u/@me',
      alt: 'a cat',
      title: 'X',
    })
    expect(img.src).toBe('https://remote/x.jpg')
    expect(img.credit).toBe('Photo by Me')
    expect(img.creditUrl).toBe('https://u/@me')
    expect(img.alt).toBe('a cat')
  })

  it('cover 命中但无 credit 时，credit 回退到表；alt 回退到 title', () => {
    const img = resolveArticleImage('/blog/claude-code-guide', 'hero', 0, {
      path: '/blog/claude-code-guide',
      cover: 'https://remote.jpg',
      title: 'CC',
    })
    expect(img.src).toBe('https://remote.jpg')
    expect(img.credit).toBe('Photo by Radowan Nakif Rehan on Unsplash')
    expect(img.alt).toBe('CC')
  })

  it('未知 path 且无 entry → picsum 兜底', () => {
    const img = resolveArticleImage('/blog/unknown', 'card')
    expect(img.src).toContain('picsum.photos/seed/-blog-unknown-0/800/1000')
    expect(img.credit).toBe('picsum.photos')
    expect(img.creditUrl).toBe('')
  })

  it('offset>0 为副图，忽略 cover 与表，走 picsum；alt 仍取 title', () => {
    const img = resolveArticleImage('/blog/claude-code-guide', 'portrait', 1, {
      path: '/blog/claude-code-guide',
      cover: 'https://remote.jpg',
      title: 'CC',
    })
    expect(img.src).toContain('picsum.photos/seed/')
    expect(img.src).not.toContain('remote.jpg')
    expect(img.alt).toBe('CC')
  })
})
