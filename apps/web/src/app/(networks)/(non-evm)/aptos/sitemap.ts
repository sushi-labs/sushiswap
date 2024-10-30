import type { MetadataRoute } from 'next'

const aptosChainPaths = ['/pool', '/explore/pools', '/pool/add', '/swap']

export default function sitemap(): MetadataRoute.Sitemap {
  return aptosChainPaths.map(
    (path) =>
      ({
        url: `https://www.sushi.com/aptos/${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
      }) as const,
  )
}
