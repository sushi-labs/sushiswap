import { PaginationByOffset, PaginationByPage } from 'strapi-sdk-js'
import { z } from 'zod'
import { imageSchema } from './image'
import { strapi } from './strapi'

export const articleSchema = z.array(
  z
    .object({
      id: z.number(),
      attributes: z.object({
        title: z.string(),
        description: z.string(),
        ghostSlug: z.string(),
        slug: z.string(),
        updatedAt: z.string(),
        publishedAt: z.string(),
        categories: z.object({
          data: z.array(
            z.object({
              id: z.number(),
              attributes: z.object({
                name: z.string(),
                description: z.string(),
                slug: z.string(),
              }),
            }),
          ),
        }),
        cover: imageSchema,
        authors: z.object({
          data: z.array(
            z.object({
              attributes: z.object({
                name: z.string(),
                email: z.string(),
                handle: z.string(),
                avatar: imageSchema,
              }),
            }),
          ),
        }),
      }),
    })
    .transform((data) => ({
      id: data.id,
      title: data.attributes.title,
      description: data.attributes.description,
      ghostSlug: data.attributes.ghostSlug,
      slug: data.attributes.slug,
      updatedAt: data.attributes.updatedAt,
      publishedAt: data.attributes.publishedAt,
      categories: data.attributes.categories.data.map((category) => ({
        id: category.id,
        name: category.attributes.name,
        description: category.attributes.description,
        slug: category.attributes.slug,
      })),
      cover: data.attributes.cover,
      authors: data.attributes.authors.data.map((author) => ({
        name: author.attributes.name,
        email: author.attributes.email,
        handle: author.attributes.handle,
        avatar: author.attributes.avatar,
      })),
    })),
)

export type Article = z.infer<typeof articleSchema>[number]

export async function getArticle({ slug }: { slug: string }) {
  const { data } = await strapi.find('articles', {
    populate: ['categories', 'cover', 'authors', 'authors.avatar'],
    filters: {
      slug: {
        $eq: slug,
      },
    },
  })

  const parsed = articleSchema.parse(data)[0] || null

  return parsed
}

interface GetArticlesOptions {
  filters?: Record<string, unknown>
  pagination?: PaginationByPage | PaginationByOffset
}

export async function getArticles({
  pagination,
  filters,
}: GetArticlesOptions = {}) {
  const { data } = await strapi.find('articles', {
    populate: ['categories', 'cover', 'authors', 'authors.avatar'],
    pagination,
    filters: {
      ...filters,
      articleTypes: {
        type: {
          $eq: 'blog',
        },
      },
    },
    sort: 'publishedAt:desc',
  })

  const parsed = articleSchema.parse(data)

  return parsed
}
