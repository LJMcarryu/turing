import { describe, expect, it } from 'vitest'
import { readMotion } from './motion'

// 假 matchMedia：按查询字符串返回 matches
function mm(map: Record<string, boolean>) {
  return (q: string) => ({ matches: map[q] ?? false })
}

describe('readMotion', () => {
  it('fine pointer 且非 reduced-motion → allowed', () => {
    const m = readMotion(mm({ '(pointer: fine)': true, '(prefers-reduced-motion: reduce)': false }))
    expect(m).toEqual({ finePointer: true, reducedMotion: false, allowed: true })
  })
  it('reduced-motion → 不 allowed（但 reducedMotion 暴露给调用方）', () => {
    const m = readMotion(mm({ '(pointer: fine)': true, '(prefers-reduced-motion: reduce)': true }))
    expect(m).toEqual({ finePointer: true, reducedMotion: true, allowed: false })
  })
  it('coarse pointer → 不 allowed', () => {
    const m = readMotion(mm({ '(pointer: fine)': false, '(prefers-reduced-motion: reduce)': false }))
    expect(m).toEqual({ finePointer: false, reducedMotion: false, allowed: false })
  })
})
