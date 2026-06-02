// 把 QuerySpec 套到任意"可链式 builder"上（client 的 queryCollection(name) 或
// server 的 queryCollection(event,name) 返回值）。只依赖链式接口 → 可用假 builder 单测。
import type { QuerySpec } from './spec'

export interface ChainBuilder {
  where: (field: string, op: '=', value: unknown) => ChainBuilder
  order: (field: string, dir: 'ASC' | 'DESC') => ChainBuilder
  limit: (n: number) => ChainBuilder
}

export function applySpec<B extends ChainBuilder>(builder: B, spec: QuerySpec): B {
  let b: ChainBuilder = builder
  if (spec.where) {
    for (const [field, value] of spec.where)
      b = b.where(field, '=', value)
  }
  if (spec.order)
    b = b.order(spec.order[0], spec.order[1])
  if (spec.limit !== undefined)
    b = b.limit(spec.limit)
  return b as B
}
