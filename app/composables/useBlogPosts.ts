import type {BlogOpts} from '#shared/content/spec';
import type { BlogCollectionItem } from '@nuxt/content'
import { applySpec } from '#shared/content/apply'
import { relatedPredicate } from '#shared/content/predicates'
import {  buildBlogSpec, cacheKey } from '#shared/content/spec'

export async function useBlogPosts(opts: BlogOpts = {}) {
  const spec = buildBlogSpec(opts)
  const { data, error } = await useAsyncData(cacheKey(spec), () =>
    applySpec(queryCollection('blog'), spec).all())
  if (error.value)
    throw createError({ statusCode: 500, message: 'Failed to load posts' })
  return { posts: data }
}

export async function getBlogPost(path: string) {
  const { data } = await useAsyncData(path, () => queryCollection('blog').path(path).first())
  if (!data.value)
    throw createError({ statusCode: 404, message: 'Not found' })
  return data as Ref<BlogCollectionItem>
}

export function useRelatedPosts(post: Ref<BlogCollectionItem>, limit = 3) {
  return useAsyncData(`related-${post.value.path}`, async () => {
    if (!post.value.tags?.length)
      return []
    const all = await applySpec(queryCollection('blog'), buildBlogSpec({ limit: 20 })).all()
    return all.filter(relatedPredicate(post.value, 'tags')).slice(0, limit)
  })
}
