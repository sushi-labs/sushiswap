import { z } from 'zod'
import { strapi } from './strapi'

const schema = z
  .object({
    pagination: z.object({
      total: z.number(),
    }),
  })
  .transform((data) => data.pagination)

export type ArticleMeta = z.infer<typeof schema>

interface GetArticleMetaOptions {
  filters?: Record<string, unknown>
}

export async function getArticleMeta({ filters }: GetArticleMetaOptions = {}) {
  const { meta } = await strapi.find('articles', {
    filters: {
      ...filters,
      articleTypes: {
        type: {
          $eq: 'blog',
        },
      },
    },
    pagination: {
      start: 0,
      limit: 1,
    },
  })

  const parsed = schema.parse(meta)

  return parsed
}
