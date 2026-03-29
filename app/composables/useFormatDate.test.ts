import { describe, it, expect } from 'vitest'

describe('Date Formatting Utility', () => {
  it('formats date to locale string', () => {
    const date = new Date('2026-03-29')
    const formatted = date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    expect(formatted).toContain('2026')
    expect(formatted).toContain('3')
    expect(formatted).toContain('29')
  })

  it('formats date to English locale', () => {
    const date = new Date('2026-03-29')
    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    expect(formatted).toContain('2026')
    expect(formatted).toContain('March')
    expect(formatted).toContain('29')
  })

  it('handles invalid dates', () => {
    const date = new Date('invalid')
    const formatted = date.toLocaleDateString('zh-CN')

    expect(formatted).toBe('Invalid Date')
  })
})
