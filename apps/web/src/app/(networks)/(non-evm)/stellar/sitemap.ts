import type { MetadataRoute } from 'next'

const stellarChainPaths = ['/pool', '/explore/pools', '/swap']

export default function sitemap(): MetadataRoute.Sitemap {
  return stellarChainPaths.map(
    (path) =>
      ({
        url: `https://www.sushi.com/stellar/${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
      }) as const,
  )
}
