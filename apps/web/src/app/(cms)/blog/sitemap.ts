import { getBlogArticles } from '@sushiswap/graph-client/strapi'
import type { MetadataRoute } from 'next'
import { connection } from 'next/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection()

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
      ...articles.map<MetadataRoute.Sitemap[number]>(({ slug, updatedAt }) => ({
        url: `https://www.sushi.com/blog/${slug}`,
        lastModified: updatedAt ? new Date(updatedAt) : undefined,
        changeFrequency: 'weekly',
      })),
    ]
  } catch {
    console.error('sitemap: Error fetching blog articles')
    return []
  }
}
