import type {ProjectOpts} from '#shared/content/spec';
import type { ProjectsCollectionItem } from '@nuxt/content'
import { applySpec } from '#shared/content/apply'
import { buildProjectSpec, cacheKey  } from '#shared/content/spec'

export async function useProjects(opts: ProjectOpts = {}) {
  const spec = buildProjectSpec(opts)
  const { data, error } = await useAsyncData(cacheKey(spec), () =>
    applySpec(queryCollection('projects'), spec).all())
  if (error.value)
    throw createError({ statusCode: 500, message: 'Failed to load projects' })
  return { projects: data }
}

export async function getProject(path: string) {
  const { data } = await useAsyncData(path, () => queryCollection('projects').path(path).first())
  if (!data.value)
    throw createError({ statusCode: 404, message: 'Not found' })
  return data as Ref<ProjectsCollectionItem>
}

export function useOtherProjects(project: Ref<ProjectsCollectionItem>, limit = 3) {
  return useAsyncData(`other-projects-${project.value.path}`, async () => {
    const all = await applySpec(queryCollection('projects'), buildProjectSpec({ limit: 4 })).all()
    return all.filter(p => p.path !== project.value.path).slice(0, limit)
  })
}
