import * as z from 'zod'
import { strapi } from './strapi'

const schema = z.array(
  z
    .object({
      id: z.number(),
      attributes: z.object({
        name: z.string(),
        description: z.string(),
        slug: z.string(),
      }),
    })
    .transform((data) => ({ id: data.id, ...data.attributes })),
)

export type Category = z.infer<typeof schema>[number]

export async function getCategories() {
  const { data } = await strapi.find('categories')

  const parsed = schema.parse(data)

  return parsed
}
