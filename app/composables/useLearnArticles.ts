import type {LearnOpts} from '#shared/content/spec';
import type { LearnCollectionItem } from '@nuxt/content'
import { applySpec } from '#shared/content/apply'
import { relatedPredicate } from '#shared/content/predicates'
import { buildLearnSpec, cacheKey  } from '#shared/content/spec'

export async function useLearnArticles(opts: LearnOpts = {}) {
  const spec = buildLearnSpec(opts)
  const { data, error } = await useAsyncData(cacheKey(spec), () =>
    applySpec(queryCollection('learn'), spec).all())
  if (error.value)
    throw createError({ statusCode: 500, message: 'Failed to load articles' })
  return { articles: data }
}

export async function getLearnArticle(path: string) {
  const { data } = await useAsyncData(path, () => queryCollection('learn').path(path).first())
  if (!data.value)
    throw createError({ statusCode: 404, message: 'Not found' })
  return data as Ref<LearnCollectionItem>
}

export function useRelatedArticles(article: Ref<LearnCollectionItem>, limit = 3) {
  return useAsyncData(`related-${article.value.path}`, async () => {
    if (!article.value.category)
      return []
    const all = await applySpec(
      queryCollection('learn'),
      buildLearnSpec({ category: article.value.category, limit: 4 }),
    ).all()
    return all.filter(relatedPredicate(article.value, 'category')).slice(0, limit)
  })
}
