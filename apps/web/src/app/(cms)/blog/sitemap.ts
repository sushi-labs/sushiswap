import { getBlogArticles } from '@sushiswap/graph-client/strapi'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const { articles } = await getBlogArticles({
      pagination: { pageSize: 10000 },
    })

    return [
      {
        url: 'https://sushi.com/blog',
        lastModified: new Date(),
        changeFrequency: 'yearly',
      },
      ...articles.map(
        (article) =>
          ({
            url: `https://sushi.com/blog/${article.slug}`,
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
