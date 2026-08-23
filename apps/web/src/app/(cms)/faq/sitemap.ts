import { getFaqAnswerSearch } from '@sushiswap/graph-client/strapi'
import type { MetadataRoute } from 'next'
import { connection } from 'next/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection()

  try {
    const { answers, answerGroups } = await getFaqAnswerSearch({
      search: '',
      pagination: {
        limit: 10000,
      },
    })

    const combined = answers.concat(answerGroups)

    return [
      {
        url: 'https://www.sushi.com/faq',
        lastModified: new Date(),
        changeFrequency: 'weekly',
      },
      ...combined.map(
        (answer) =>
          ({
            url: `https://www.sushi.com/faq/${answer.slug}`,
            changeFrequency: 'weekly',
          }) as const,
      ),
    ]
  } catch {
    console.error('sitemap: Error fetching faq articles')
    return []
  }
}
