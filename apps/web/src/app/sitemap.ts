import type { MetadataRoute } from 'next'
import { CHAIN_IDS } from 'src/config'
import { getNetworkKey } from 'src/lib/network'
import { getLaunchpadSitemapEntries } from './(networks)/(evm)/[chainId]/launchpad/_lib/launchpad-sitemap'

const evmChainPaths = [
  '/migrate',
  '/pool',
  '/cross-chain-swap',
  '/dca',
  '/limit',
  '/stop-loss',
  '/take-profit',
  '/swap',
  '/stake',
  '/claim',
  '/explore/pools',
  '/explore/smart-pools',
  '/explore/blade-pools',
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

export default async function sitemap({
  id,
}: {
  // Next 16 hands the generateSitemaps id over as a promise; interpolating it
  // without awaiting emitted "/[object Promise]/swap" for every network.
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const networkKey = await id
  const chainPaths = evmChainPaths.map(
    (path) =>
      ({
        url: `https://www.sushi.com/${networkKey}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
      }) as const,
  )

  return [...chainPaths, ...(await getLaunchpadSitemapEntries(networkKey))]
}
