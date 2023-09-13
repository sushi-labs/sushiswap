import GhostContentAPI from '@tryghost/content-api'

import { getArticleAndMoreArticles } from './api'
import { ArticleSchema } from './validate'

export function getGhostClient() {
  return new GhostContentAPI({
    url: 'https://ghost.sushi.com',
    key: '9a481331206651cecc033ae05f', // can be exposed, only access to public data
    version: 'v5.0',
  })
}

export async function addBodyToArticle(
  article: NonNullable<Awaited<ReturnType<typeof getArticleAndMoreArticles>>['articles']>['data'][0]
) {
  const result = ArticleSchema.parse(article)

  const ghostClient = getGhostClient()
  const { html } = await ghostClient.posts.read({ slug: result.attributes.ghostSlug })

  return {
    ...result,
    attributes: {
      ...result.attributes,
      body: html,
    },
  }
}

export type GhostArticle = Awaited<ReturnType<typeof addBodyToArticle>>
