// 内容配图：优先用本地自托管的 Unsplash 照片（按主题挑选、带署名、已下载到
// public/images/unsplash 避免 hotlink 限流/解码问题），未映射的回退 picsum。

export type ImgVariant = 'hero' | 'wide' | 'portrait' | 'card' | 'thumb' | 'square'

const NON_SEED_CHAR_RE = /[^\w-]/g

const DIMS: Record<ImgVariant, { w: number, h: number }> = {
  hero: { w: 1600, h: 1000 },
  wide: { w: 1400, h: 800 },
  portrait: { w: 900, h: 1200 },
  card: { w: 800, h: 1000 },
  thumb: { w: 480, h: 600 },
  square: { w: 900, h: 900 },
}

// path/seed → 本地 Unsplash 照片（文件路径 + 摄影师署名）。
const UNSPLASH: Record<string, { f: string, by: string, user: string }> = {
  "claude-code": { f: "/images/unsplash/claude-code.jpg", by: "Pankaj Patel", user: "pankajpatel" },
  "prompt-engineering": { f: "/images/unsplash/prompt-engineering.jpg", by: "Raphael Schaller", user: "raphaelphotoch" },
  "mcp": { f: "/images/unsplash/mcp.jpg", by: "Conny Schneider", user: "choys_" },
  "/projects/turing-website": { f: "/images/unsplash/projects-turing-website.jpg", by: "Lee  Campbell", user: "leecampbell" },
  "/projects/mcp-scaffold": { f: "/images/unsplash/projects-mcp-scaffold.jpg", by: "imgix", user: "imgix" },
  "/projects/prompt-forge": { f: "/images/unsplash/projects-prompt-forge.jpg", by: "Luke Lung", user: "lukelung1991" },
  "/projects/agent-lab": { f: "/images/unsplash/projects-agent-lab.jpg", by: "Michael Schiffer", user: "michael_schiffer_design" },
  "/learn/claude-code/getting-started": { f: "/images/unsplash/learn-claude-code-getting-started.jpg", by: "Jake Walker", user: "jakewalker" },
  "/learn/claude-code/advanced-usage": { f: "/images/unsplash/learn-claude-code-advanced-usage.jpg", by: "Ilya Pavlov", user: "ilyapavlov" },
  "/learn/prompt-engineering/basics": { f: "/images/unsplash/learn-prompt-engineering-basics.jpg", by: "Gülfer ERGİN", user: "gulfergin_01" },
  "/learn/agent-development/intro": { f: "/images/unsplash/learn-agent-development-intro.jpg", by: "Arseny Togulev", user: "tetrakiss" },
  "/learn/mcp/what-is-mcp": { f: "/images/unsplash/learn-mcp-what-is-mcp.jpg", by: "Hal Gatewood", user: "halacious" },
  "/blog/2026-03-welcome": { f: "/images/unsplash/blog-2026-03-welcome.jpg", by: "Minh Pham", user: "minhphamdesign" },
  "/blog/2026-03-welcome-en-us": { f: "/images/unsplash/blog-2026-03-welcome-en-us.jpg", by: "Minh Pham", user: "minhphamdesign" },
  "/blog/ai-programming-future": { f: "/images/unsplash/blog-ai-programming-future.jpg", by: "MJH SHIKDER", user: "mjh_shikder" },
  "/blog/claude-code-guide": { f: "/images/unsplash/blog-claude-code-guide.jpg", by: "Radowan Nakif Rehan", user: "radowanrehan" },
  "/blog/nuxt3-tailwind-guide": { f: "/images/unsplash/blog-nuxt3-tailwind-guide.jpg", by: "Hal Gatewood", user: "halacious" },
  "/blog/2026-05-context-engineering": { f: "/images/unsplash/blog-2026-05-context-engineering.jpg", by: "Zetong Li", user: "zetong" },
  "/blog/2026-04-agent-patterns": { f: "/images/unsplash/blog-2026-04-agent-patterns.jpg", by: "Amsterdam City Archives", user: "amsterdamcityarchives" },
  "turing-cover": { f: "/images/unsplash/turing-cover.jpg", by: "Pawel Czerwinski", user: "pawel_czerwinski" },
  "agent-development": { f: "/images/unsplash/agent-development.jpg", by: "Possessed Photography", user: "possessedphotography" },
  "/projects/context-lens": { f: "/images/unsplash/projects-context-lens.jpg", by: "Ross Sneddon", user: "rosssneddon" },
  "/projects/iflyadlib-ios": { f: "/images/unsplash/projects-iflyadlib-ios.jpg", by: "William Hook", user: "williamtm" },
}

function seed(slug: string, offset = 0): string {
  const base = (slug || 'turing').replace(NON_SEED_CHAR_RE, '-')
  return `${base}-${offset}`
}

// 内容条目里与配图相关的字段（frontmatter）。结构上兼容 @nuxt/content 的集合条目。
export interface ArticleImageEntry {
  path?: string
  cover?: string
  credit?: string
  creditUrl?: string
  alt?: string
  title?: string
}

export interface ResolvedImage {
  src: string
  src2x: string
  alt: string
  credit: string
  creditUrl: string
  seed: string
}

function tableCredit(slug: string): { credit: string, creditUrl: string } | undefined {
  const photo = UNSPLASH[slug]
  if (!photo)
    return undefined
  return {
    credit: `Photo by ${photo.by} on Unsplash`,
    creditUrl: `https://unsplash.com/@${photo.user}?utm_source=turing&utm_medium=referral`,
  }
}

// 单一图片解析策略：frontmatter(cover/credit/alt) > 本地 Unsplash 表(按 path) > picsum 兜底。
// offset>0 视为副图，始终走 picsum（与历史行为一致）。
export function resolveArticleImage(slug: string, variant: ImgVariant = 'card', offset = 0, entry?: ArticleImageEntry): ResolvedImage {
  const { w, h } = DIMS[variant]
  const table = offset === 0 ? tableCredit(slug) : undefined
  const alt = entry?.alt ?? entry?.title ?? ''

  // 1) frontmatter 封面优先
  if (offset === 0 && entry?.cover) {
    return {
      src: entry.cover,
      src2x: entry.cover,
      alt,
      credit: entry.credit ?? table?.credit ?? '',
      creditUrl: entry.creditUrl ?? table?.creditUrl ?? '',
      seed: slug,
    }
  }

  // 2) 本地自托管 Unsplash 表
  const photo = offset === 0 ? UNSPLASH[slug] : undefined
  if (photo && table) {
    return { src: photo.f, src2x: photo.f, alt, credit: table.credit, creditUrl: table.creditUrl, seed: slug }
  }

  // 3) picsum 兜底
  const s = seed(slug, offset)
  return {
    src: `https://picsum.photos/seed/${s}/${w}/${h}`,
    src2x: `https://picsum.photos/seed/${s}/${w * 2}/${h * 2}`,
    alt,
    credit: 'picsum.photos',
    creditUrl: '',
    seed: s,
  }
}

// 种子/非内容图（首页封面、栏目 hero 等没有内容条目的调用）。
export function useArticleImage(slug: string, variant: ImgVariant = 'card', offset = 0): ResolvedImage {
  return resolveArticleImage(slug, variant, offset)
}

// 内容条目图：frontmatter 优先、按 entry.path 回退到表。
export function useArticleImageFromEntry(entry: ArticleImageEntry, variant: ImgVariant = 'card', offset = 0): ResolvedImage {
  return resolveArticleImage(entry.path ?? '', variant, offset, entry)
}
