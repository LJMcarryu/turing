import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    learn: defineCollection({
      type: 'page',
      source: 'learn/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        category: z.string(),
        tags: z.array(z.string()).default([]),
        level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
        date: z.string(),
        updated: z.string().optional(),
        readingTime: z.number().default(10),
        featured: z.boolean().default(false),
        cover: z.string().optional(),
        premium: z.boolean().default(false),
      }),
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()).default([]),
        date: z.string(),
        updated: z.string().optional(),
        readingTime: z.number().default(5),
        featured: z.boolean().default(false),
        cover: z.string().optional(),
      }),
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        github: z.string().optional(),
        tags: z.array(z.string()).default([]),
        status: z.enum(['active', 'archived', 'wip']).default('active'),
      }),
    }),
  },
})
