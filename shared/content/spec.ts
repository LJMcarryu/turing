// 内容查询的纯规格：把"查哪个集合、怎么排序/过滤/截断"表达成数据，
// 由 client(composable) 与 server(RSS) 两个适配各自执行。无任何 Nuxt 依赖。

export type Collection = 'blog' | 'learn' | 'projects'
export type OrderDir = 'ASC' | 'DESC'

export interface QuerySpec {
  collection: Collection
  order?: [field: string, dir: OrderDir]
  where?: Array<[field: string, value: string | number | boolean]>
  limit?: number
}

export interface BlogOpts { featured?: boolean, limit?: number }
export interface LearnOpts { category?: string, featured?: boolean, level?: 'beginner' | 'intermediate' | 'advanced', limit?: number }
export interface ProjectOpts { status?: 'active' | 'wip' | 'archived', limit?: number }

const DATE_DESC: [string, OrderDir] = ['date', 'DESC']

function compose(base: QuerySpec, where: QuerySpec['where'], limit?: number): QuerySpec {
  const spec: QuerySpec = { ...base }
  if (where && where.length)
    spec.where = where
  if (limit !== undefined)
    spec.limit = limit
  return spec
}

export function buildBlogSpec(opts: BlogOpts = {}): QuerySpec {
  const where: QuerySpec['where'] = []
  if (opts.featured !== undefined)
    where.push(['featured', opts.featured])
  return compose({ collection: 'blog', order: DATE_DESC }, where, opts.limit)
}

export function buildLearnSpec(opts: LearnOpts = {}): QuerySpec {
  const where: QuerySpec['where'] = []
  if (opts.category)
    where.push(['category', opts.category])
  if (opts.featured !== undefined)
    where.push(['featured', opts.featured])
  if (opts.level)
    where.push(['level', opts.level])
  return compose({ collection: 'learn', order: DATE_DESC }, where, opts.limit)
}

export function buildProjectSpec(opts: ProjectOpts = {}): QuerySpec {
  const where: QuerySpec['where'] = []
  if (opts.status)
    where.push(['status', opts.status])
  return compose({ collection: 'projects' }, where, opts.limit)
}

export function cacheKey(spec: QuerySpec): string {
  const o = spec.order ? `${spec.order[0]}:${spec.order[1]}` : ''
  const w = spec.where ? spec.where.map(([f, v]) => `${f}=${String(v)}`).join('&') : ''
  return ['content', spec.collection, o, w, spec.limit ?? ''].join('|')
}
