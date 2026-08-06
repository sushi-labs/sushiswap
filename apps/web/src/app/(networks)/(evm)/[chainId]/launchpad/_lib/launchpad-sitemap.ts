import { getLaunchpadTokens } from '@sushiswap/graph-client/data-api'
import type { MetadataRoute } from 'next'
import { unstable_cache } from 'next/cache'
import { getEvmChainById } from 'sushi/evm'
import { LAUNCHPAD_SUPPORTED_CHAIN_IDS } from '../constants'
import type { LaunchpadChainId } from '../constants'
import { getLaunchpadCreateUrl, getLaunchpadTokenUrl } from './launchpad-seo'

const SITEMAP_REVALIDATE_SECONDS = 60 * 60
const TOKENS_PER_PAGE = 100
/** Well under the 50k per-sitemap limit, and a stop for a runaway cursor. */
const MAX_TOKENS = 10_000

interface LaunchpadSitemapToken {
  lastModified: string
  url: string
}

const getCachedLaunchpadSitemapTokens = unstable_cache(
  async (chainId: LaunchpadChainId): Promise<LaunchpadSitemapToken[]> => {
    const entries: LaunchpadSitemapToken[] = []
    let after: string | undefined

    while (entries.length < MAX_TOKENS) {
      const connection = await getLaunchpadTokens({
        input: {
          chainId,
          first: TOKENS_PER_PAGE,
          after,
          sortBy: 'CREATED_AT',
          sortDirection: 'DESC',
        },
      })

      for (const { node } of connection.edges) {
        entries.push({
          lastModified:
            node.metrics?.asOf || node.metadata.updatedAt || node.createdAt,
          url: getLaunchpadTokenUrl(node),
        })
      }

      if (!connection.pageInfo.hasNextPage || !connection.pageInfo.endCursor) {
        break
      }
      after = connection.pageInfo.endCursor
    }

    return entries.slice(0, MAX_TOKENS)
  },
  ['launchpad-sitemap-tokens'],
  { revalidate: SITEMAP_REVALIDATE_SECONDS },
)

function getLaunchpadChainIdByKey(
  networkKey: string,
): LaunchpadChainId | undefined {
  return LAUNCHPAD_SUPPORTED_CHAIN_IDS.find(
    (chainId) => getEvmChainById(chainId).key === networkKey,
  )
}

/**
 * Launchpad entries for the per-network sitemap. Empty for every network the
 * launchpad is not deployed on, since the layout 404s on those.
 */
export async function getLaunchpadSitemapEntries(
  networkKey: string,
): Promise<MetadataRoute.Sitemap> {
  const chainId = getLaunchpadChainIdByKey(networkKey)
  if (!chainId) return []

  const discoverUrl = `https://www.sushi.com/${networkKey}/launchpad`
  const entries: MetadataRoute.Sitemap = [
    {
      url: discoverUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: getLaunchpadCreateUrl(chainId),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  try {
    const tokens = await getCachedLaunchpadSitemapTokens(chainId)
    return [
      ...entries,
      ...tokens.map((token) => ({
        url: token.url,
        lastModified: new Date(token.lastModified),
        changeFrequency: 'hourly' as const,
        priority: 0.5,
      })),
    ]
  } catch {
    // A data-api outage should not take the whole network sitemap down.
    return entries
  }
}
