import { z } from 'zod'
import { strapi } from './strapi'

const schema = z.array(
  z
    .object({
      attributes: z.object({
        slug: z.string(),
      }),
    })
    .transform((data) => data.attributes),
)

export async function getPreviewPostBySlug(slug: string) {
  const { data } = await strapi.find('articles', {
    fields: ['slug'],
    filters: {
      slug: {
        $eq: slug,
      },
    },
    pagination: {
      start: 0,
      limit: 1,
    },
  })

  const parsed = schema.parse(data)[0]

  return parsed ? parsed : null
}
