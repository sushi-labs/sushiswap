import type { MetadataRoute } from 'next'

const solanaChainPaths = ['/swap']

export default function sitemap(): MetadataRoute.Sitemap {
  return solanaChainPaths.map(
    (path) =>
      ({
        url: `https://www.sushi.com/solana/${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
      }) as const,
  )
}
