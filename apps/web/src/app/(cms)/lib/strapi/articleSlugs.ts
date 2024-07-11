import { z } from 'zod'
import { strapi } from './strapi'

const schema = z.array(
  z
    .object({
      attributes: z.object({
        slug: z.string(),
      }),
    })
    .transform((data) => data.attributes.slug),
)

export async function getArticleSlugs() {
  const { data } = await strapi.find('articles', {
    fields: ['slug'],
    filters: {
      articleTypes: {
        type: {
          $eq: 'blog',
        },
      },
    },
    pagination: {
      start: 0,
      limit: 10000,
    },
  })

  const parsed = schema.parse(data)

  return parsed
}
