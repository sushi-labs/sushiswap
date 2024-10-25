import { MetadataRoute } from 'next'
import { CHAIN_IDS } from 'src/config'
import { getNetworkKey } from 'src/lib/network'

const evmChainPaths = [
  '/migrate',
  '/pool',
  '/rewards',
  '/cross-chain-swap',
  '/dca',
  '/limit',
  '/swap',
  '/explore/pools',
  '/explore/smart-pools',
  '/pool/incentivize',
  '/pool/v2/add',
  '/pool/v3/add',
  '/pool/v3/fees',
]

export async function generateSitemaps() {
  return CHAIN_IDS.map((chainId) => ({
    id: getNetworkKey(chainId),
  }))
}

export default function sitemap({ id }: { id: string }): MetadataRoute.Sitemap {
  return evmChainPaths.map(
    (path) =>
      ({
        url: `https://sushi.com/${id}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
      }) as const,
  )
}
