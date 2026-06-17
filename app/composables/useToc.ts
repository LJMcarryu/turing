// 文章目录（TOC）工具：从 @nuxt/content 解析出的 body.toc 取章节链接，并统计章节数，
// 供文章页决定是否启用「正文 + 右侧 TOC」两列版式。projects / blog / learn 共用。

export interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

export function getTocLinks(doc: { body?: unknown } | null | undefined): TocLink[] {
  const body = doc?.body as { toc?: { links?: TocLink[] } } | undefined
  return body?.toc?.links ?? []
}

// 递归统计 h2/h3 章节数（depth ≤ 3），用于判断是否值得展示 TOC
export function tocCount(links: TocLink[]): number {
  let n = 0
  const walk = (list: TocLink[]) => {
    for (const l of list) {
      if (l.depth <= 3)
        n++
      if (l.children?.length)
        walk(l.children)
    }
  }
  walk(links)
  return n
}
