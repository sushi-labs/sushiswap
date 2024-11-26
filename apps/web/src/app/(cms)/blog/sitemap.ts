import { getBlogArticles } from '@sushiswap/graph-client/strapi'
import type { MetadataRoute } from 'next'

export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const { articles } = await getBlogArticles({
      pagination: { pageSize: 10000 },
    })

    return [
      {
        url: 'https://www.sushi.com/blog',
        lastModified: new Date(),
        changeFrequency: 'daily',
      },
      ...articles.map(
        (article) =>
          ({
            url: `https://www.sushi.com/blog/${article.slug}`,
            lastModified: new Date(article.updatedAt),
            changeFrequency: 'weekly',
          }) as const,
      ),
    ]
  } catch {
    console.error('sitemap: Error fetching blog articles')
    return []
  }
}
