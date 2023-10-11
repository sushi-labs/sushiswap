import { Article, Image } from 'types'
import { z } from 'zod'

const image: z.ZodSchema<Image> = z.object({
  // id: z.number(),
  attributes: z.object({
    name: z.string(),
    alternativeText: z.string(),
    caption: z.string(),
    width: z.number().nullable(),
    height: z.number().nullable(),
    // hash: z.string(),
    // ext: z.string(),
    // mime: z.string(),
    // size: z.number(),
    url: z.string(),
    // previewUrl: z.string().nullable(),
    // provider: z.string(),
    provider_metadata: z.object({
      public_id: z.string(),
      resource_type: z.string(),
    }),
    // createdAt: z.string(),
    // updatedAt: z.string(),
  }),
})

const data = <T extends z.ZodTypeAny>(generic: T) =>
  z.object({
    data: generic,
    // meta: z.object({
    //   pagination: z.object({
    //     page: z.number(),
    //     pageSize: z.number(),
    //     pageCount: z.number(),
    //     total: z.number(),
    //   }),
    // }),
  })

export const ArticleSchema: z.ZodSchema<Article> = z.object({
  id: z.string(),
  attributes: z.object({
    authors: data(
      z.array(
        z.object({
          // id: z.number(),
          attributes: z.object({
            avatar: data(image),
            name: z.string(),
            handle: z.string(),
            email: z.string(),
            // createdAt: z.string(),
            // updatedAt: z.string(),
          }),
        }),
      ),
    ),
    title: z.string(),
    description: z.string(),
    ghostSlug: z.string().nullable(),
    slug: z.string(),
    cover: data(image),
    categories: data(
      z.array(
        z.object({
          id: z.string(),
          attributes: z.object({
            description: z.string(),
            name: z.string(),
            slug: z.string(),
            // createdAt: z.string(),
            // updatedAt: z.string(),
          }),
        }),
      ),
    ),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
    // blocks: z.array(z.any()),
  }),
})
