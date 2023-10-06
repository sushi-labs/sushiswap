import GhostContentAPI from '@tryghost/content-api'

import { ArticleSchema } from './validate'

export function getGhostClient() {
  return new GhostContentAPI({
    url: 'https://ghost.sushi.com',
    key: '9a481331206651cecc033ae05f', // can be exposed, only access to public data
    version: 'v5.0',
  })
}

export async function addBodyToArticle(article: (typeof ArticleSchema)['_output']) {
  const ghostClient = getGhostClient()
  const { html } = await ghostClient.posts.read({ slug: article.attributes.ghostSlug })

  return {
    ...article,
    attributes: {
      ...article.attributes,
      body: html,
    },
  }
}

export type GhostArticle = Awaited<ReturnType<typeof addBodyToArticle>>
