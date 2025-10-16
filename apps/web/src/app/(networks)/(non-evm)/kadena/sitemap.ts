import type { MetadataRoute } from 'next'

const kadenaChainPaths = ['/pool', '/explore/pools', '/pool/add', '/swap']

export default function sitemap(): MetadataRoute.Sitemap {
  return kadenaChainPaths.map(
    (path) =>
      ({
        url: `https://www.sushi.com/kadena/${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
      }) as const,
  )
}
