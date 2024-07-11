import { articleSchema } from './article'
import { strapi } from './strapi'

export async function getMoreArticles(slug: string) {
  const { data: moreArticles } = await strapi.find('articles', {
    populate: ['categories', 'cover', 'authors', 'authors.avatar'],
    filters: {
      slug: {
        $ne: slug,
      },
      articleTypes: {
        type: {
          $eq: 'blog',
        },
      },
    },
    pagination: {
      start: 0,
      limit: 2,
    },
    sort: 'publishedAt:desc',
  })

  const moreArticlesParsed = articleSchema.parse(moreArticles)

  return moreArticlesParsed
}
