import GhostContentAPI from '@tryghost/content-api'
import { ArticleSchema } from './validate'

export function getGhostClient() {
  return new GhostContentAPI({
    url: 'https://ghost.sushi.com',
    key: '9a481331206651cecc033ae05f', // can be exposed, only access to public data
    version: 'v5.0',
  })
}

function processVideos(html: string) {
  html = html.replaceAll(/<div class="kg-video-overlay">(.*?)<\/div>/gms, '')
  html = html.replaceAll(
    /<div class="kg-video-player-container(.*?)<input type="range" class="kg-video-volume-slider" max="100" value="100">/gms,
    '',
  )
  html = html.replaceAll('<video src=', '<video controls=true src=')
  return html
}

export async function addBodyToArticle(
  article: typeof ArticleSchema['_output'],
) {
  const ghostClient = getGhostClient()

  let html

  try {
    ;({ html } = await ghostClient.posts.read({
      slug: article.attributes.ghostSlug,
    }))
  } catch {}

  return {
    ...article,
    attributes: {
      ...article.attributes,
      body: html ? processVideos(html) : '',
    },
  }
}

export type GhostArticle = Awaited<ReturnType<typeof addBodyToArticle>>
