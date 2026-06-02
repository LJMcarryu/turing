// 取数后的纯函数：related 过滤、feed 合并。无 Nuxt 依赖。

export interface FeedLike {
  path?: string
  date?: string
  tags?: string[]
  category?: string
  title?: string
  description?: string
}

export function relatedPredicate<T extends FeedLike>(entry: T, by: 'tags' | 'category'): (e: T) => boolean {
  const tags = entry.tags ?? []
  return (e: T) => {
    if (!e.path || e.path === entry.path)
      return false // 排除自己
    if (by === 'category')
      return !!entry.category && e.category === entry.category
    return !!e.tags && e.tags.some(t => tags.includes(t))
  }
}

export function mergeFeed<T extends FeedLike>(lists: T[][], limit: number): T[] {
  return lists
    .flat()
    .filter(e => e.title && e.description && e.date && e.path)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
    .slice(0, limit)
}
