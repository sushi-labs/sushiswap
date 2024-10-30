import type { MetadataRoute } from 'next'

const tronChainPaths = ['/pool', '/explore/pools', '/pool/add', '/swap']

export default function sitemap(): MetadataRoute.Sitemap {
  return tronChainPaths.map(
    (path) =>
      ({
        url: `https://sushi.com/tron/${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
      }) as const,
  )
}
