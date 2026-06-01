import { describe, expect, it } from 'vitest'
import { formatDateValue } from './useFormatDate'

describe('date formatting utility', () => {
  it('formats date to locale string', () => {
    const formatted = formatDateValue('2026-03-29', 'zh-CN')

    expect(formatted).toContain('2026')
    expect(formatted).toContain('3')
    expect(formatted).toContain('29')
  })

  it('formats date to English locale', () => {
    const formatted = formatDateValue('2026-03-29', 'en-US')

    expect(formatted).toContain('2026')
    expect(formatted).toContain('March')
    expect(formatted).toContain('29')
  })

  it('handles invalid dates', () => {
    expect(formatDateValue('invalid', 'zh-CN')).toBe('Invalid Date')
  })

  it('keeps date-only values on the requested calendar day', () => {
    expect(formatDateValue('2026-03-01', 'en-US')).toContain('March 1')
  })
})
