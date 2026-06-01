// Deterministic editorial images via picsum.photos (seed-based).
// Same slug always returns the same image; variant controls aspect ratio.

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

function seed(slug: string, offset = 0): string {
  // Normalise slug to ASCII range so picsum's seed key behaves consistently.
  const base = (slug || 'turing').replace(NON_SEED_CHAR_RE, '-')
  return `${base}-${offset}`
}

export function useArticleImage(slug: string, variant: ImgVariant = 'card', offset = 0) {
  const { w, h } = DIMS[variant]
  const s = seed(slug, offset)
  return {
    src: `https://picsum.photos/seed/${s}/${w}/${h}`,
    src2x: `https://picsum.photos/seed/${s}/${w * 2}/${h * 2}`,
    alt: '', // decorative — articles have their own titles
    credit: 'picsum.photos',
    seed: s,
  }
}
