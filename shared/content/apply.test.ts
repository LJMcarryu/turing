import type {ChainBuilder} from './apply';
import type { QuerySpec } from './spec'
import { describe, expect, it } from 'vitest'
import { applySpec  } from './apply'

// 假 builder：记录被调用的链式方法
function fakeBuilder() {
  const calls: string[] = []
  const b: ChainBuilder = {
    where: (f, op, v) => { calls.push(`where:${f}${op}${String(v)}`); return b },
    order: (f, d) => { calls.push(`order:${f}:${d}`); return b },
    limit: (n) => { calls.push(`limit:${n}`); return b },
  }
  return { b, calls }
}

describe('applySpec', () => {
  it('按 spec 依次施加 where/order/limit', () => {
    const { b, calls } = fakeBuilder()
    const spec: QuerySpec = { collection: 'learn', order: ['date', 'DESC'], where: [['category', 'mcp']], limit: 4 }
    expect(applySpec(b, spec)).toBe(b)
    expect(calls).toEqual(['where:category=mcp', 'order:date:DESC', 'limit:4'])
  })
  it('spec 缺项时不调用对应方法', () => {
    const { b, calls } = fakeBuilder()
    applySpec(b, { collection: 'projects' })
    expect(calls).toEqual([])
  })
})
