import type { MetadataRoute } from 'next'
import { legalPages } from './_config'

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.keys(legalPages).map(
    (page) =>
      ({
        url: `https://www.sushi.com/legal/${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
      }) as const,
  )
}
