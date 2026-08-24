import {
  type LaunchpadCandle,
  type LaunchpadCreator,
  type LaunchpadProvider,
  type LaunchpadToken,
  type LaunchpadTokenConnection,
  getLaunchpadCandles,
  getLaunchpadCreator,
  getLaunchpadTokens,
} from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import type {
  BreadcrumbList,
  CollectionPage,
  Dataset,
  FinancialProduct,
  Graph,
  ItemList,
  ItemPage,
  ListItem,
  Organization,
  PropertyValue,
  WebSite,
} from 'schema-dts'
import { shortenAddress } from 'sushi'
import { getEvmChainById } from 'sushi/evm'
import type { EvmAddress } from 'sushi/evm'
import type { LaunchpadChainId } from '../constants'
import { getCachedLaunchpadToken } from './get-cached-launchpad-token'
import { getLaunchpadProvidersForFilter } from './launchpad-provider'

const SUSHI_URL = 'https://www.sushi.com'
const SUSHI_ORGANIZATION_ID = `${SUSHI_URL}/#organization`
const SUSHI_WEBSITE_ID = `${SUSHI_URL}/#website`
const POOLS_FUN_URL = 'https://pools.fun'
const POOLS_FUN_ORGANIZATION_ID = `${POOLS_FUN_URL}/#organization`
const LAUNCHPAD_REVALIDATE_SECONDS = 60

const getCachedLaunchpadTokens = unstable_cache(
  async (chainId: LaunchpadChainId) =>
    getLaunchpadTokens({
      input: {
        chainId,
        providers: getLaunchpadProvidersForFilter('all'),
        first: 20,
        sortBy: 'MARKET_CAPITALIZATION',
        sortDirection: 'DESC',
      },
    }),
  ['launchpad-discover-seo'],
  { revalidate: LAUNCHPAD_REVALIDATE_SECONDS },
)

const getCachedLaunchpadCreator = unstable_cache(
  async (chainId: LaunchpadChainId, address: EvmAddress) =>
    getLaunchpadCreator({
      chainId,
      address,
      input: {
        chainId,
        creator: address,
        providers: getLaunchpadProvidersForFilter('sushi'),
        first: 20,
        sortBy: 'CREATED_AT',
        sortDirection: 'DESC',
      },
    }),
  ['launchpad-creator-seo'],
  { revalidate: LAUNCHPAD_REVALIDATE_SECONDS },
)

const getCachedLaunchpadDayCandles = unstable_cache(
  async (chainId: LaunchpadChainId, address: EvmAddress) => {
    const to = Math.floor(Date.now() / 1000)
    const { nodes } = await getLaunchpadCandles({
      input: {
        chainId,
        tokenAddress: address,
        interval: 'FIFTEEN_MINUTES',
        from: to - 24 * 60 * 60,
        to,
      },
    })
    return nodes
  },
  ['launchpad-candles-seo'],
  { revalidate: LAUNCHPAD_REVALIDATE_SECONDS },
)

export async function getLaunchpadTokenForSeo(
  chainId: LaunchpadChainId,
  address: EvmAddress,
): Promise<LaunchpadToken | null> {
  try {
    return await getCachedLaunchpadToken({ chainId, address })
  } catch {
    return null
  }
}

export async function getLaunchpadTokensForSeo(
  chainId: LaunchpadChainId,
): Promise<LaunchpadTokenConnection | null> {
  try {
    return await getCachedLaunchpadTokens(chainId)
  } catch {
    return null
  }
}

export async function getLaunchpadCreatorForSeo(
  chainId: LaunchpadChainId,
  address: EvmAddress,
): Promise<LaunchpadCreator | null> {
  try {
    return await getCachedLaunchpadCreator(chainId, address)
  } catch {
    return null
  }
}

export async function getLaunchpadDayCandlesForSeo(
  chainId: LaunchpadChainId,
  address: EvmAddress,
): Promise<LaunchpadCandle[] | null> {
  try {
    return await getCachedLaunchpadDayCandles(chainId, address)
  } catch {
    return null
  }
}

export function getLaunchpadUrl(chainId: LaunchpadChainId): string {
  return `${SUSHI_URL}/${getEvmChainById(chainId).key}/launchpad`
}

export function getLaunchpadTokenUrl(token: LaunchpadToken): string {
  return `${getLaunchpadUrl(token.chainId)}/token/${token.address}`
}

/**
 * Relative on purpose: Next resolves it against metadataBase, which uses the
 * Vercel deployment URL when available so previews point to their own card
 * route.
 */
export function getLaunchpadTokenCardPath(
  token: LaunchpadToken,
  version: string,
): string {
  const chainKey = getEvmChainById(token.chainId).key
  return `/${chainKey}/launchpad/token/${token.address}/card.png?v=${version}`
}

export function getLaunchpadCreateUrl(chainId: LaunchpadChainId): string {
  return `${getLaunchpadUrl(chainId)}/create`
}

export function getLaunchpadCreatorUrl(
  chainId: LaunchpadChainId,
  address: EvmAddress,
): string {
  return `${getLaunchpadUrl(chainId)}/creator/${address}`
}

function getLaunchpadTokenCdnUrl(
  token: Pick<LaunchpadToken, 'address' | 'chainId'>,
  transformations: string[],
): string {
  return `https://cdn.sushi.com/image/upload/${transformations.join(',')}/tokens/${token.chainId}/${token.address}`
}

export function getLaunchpadTokenLogoUrl(
  token: Pick<LaunchpadToken, 'address' | 'chainId'>,
  width = 256,
): string {
  return getLaunchpadTokenCdnUrl(token, [`c_limit,w_${width}`, 'q_auto'])
}

/**
 * Creators upload WebP logos, which satori cannot decode — ask the CDN to
 * transcode so the embed never renders (or crashes) without the logo.
 */
export function getLaunchpadTokenEmbedLogoUrl(
  token: Pick<LaunchpadToken, 'address' | 'chainId'>,
  width = 256,
): string {
  return getLaunchpadTokenCdnUrl(token, [
    `c_limit,w_${width}`,
    'q_auto',
    'f_png',
  ])
}

export function getLaunchpadTokenDescription(token: LaunchpadToken): string {
  return (
    token.metadata.description?.trim() ||
    `Trade ${token.name} (${token.symbol}) on Sushi Launchpad with live price, volume, and permanently locked liquidity.`
  )
}

function getSushiOrganization(): Organization {
  return {
    '@type': 'Organization',
    '@id': SUSHI_ORGANIZATION_ID,
    name: 'Sushi',
    alternateName: 'SushiSwap',
    url: SUSHI_URL,
    sameAs: [
      'https://twitter.com/sushiswap',
      'https://github.com/sushiswap',
      'https://discord.gg/qGeREffeAH',
      'https://t.me/sushiswaphq',
    ],
  }
}

function getPoolsFunOrganization(): Organization {
  return {
    '@type': 'Organization',
    '@id': POOLS_FUN_ORGANIZATION_ID,
    name: 'Pools.fun',
    url: POOLS_FUN_URL,
  }
}

const PROVIDER_ORGANIZATION_IDS = {
  SUSHI_V1: SUSHI_ORGANIZATION_ID,
  POOLS_FUN_V1: POOLS_FUN_ORGANIZATION_ID,
} as const satisfies Record<LaunchpadProvider, string>

const PROVIDER_ORGANIZATIONS = {
  SUSHI_V1: getSushiOrganization,
  POOLS_FUN_V1: getPoolsFunOrganization,
} as const satisfies Record<LaunchpadProvider, () => Organization>

function getLaunchpadProviderOrganizations(
  tokens: readonly LaunchpadToken[],
): Organization[] {
  const providers = new Set<LaunchpadProvider>(['SUSHI_V1'])
  for (const token of tokens) providers.add(token.provider)
  return [...providers].map((provider) => PROVIDER_ORGANIZATIONS[provider]())
}

function getSushiWebsite(): WebSite {
  return {
    '@type': 'WebSite',
    '@id': SUSHI_WEBSITE_ID,
    name: 'Sushi',
    alternateName: 'SushiSwap',
    url: SUSHI_URL,
    publisher: { '@id': SUSHI_ORGANIZATION_ID },
  }
}

function getHttpMetadataLinks(token: LaunchpadToken): string[] {
  return token.metadata.links.flatMap((link) => {
    try {
      const url = new URL(link.url)
      return url.protocol === 'http:' || url.protocol === 'https:'
        ? [url.toString()]
        : []
    } catch {
      return []
    }
  })
}

function getMarketMetric(
  name: string,
  value: number | null | undefined,
): PropertyValue | null {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return null
  }

  return {
    '@type': 'PropertyValue',
    name,
    value,
    unitText: 'USD',
  }
}

function getTokenFinancialProduct(
  token: LaunchpadToken,
  includeMarketData: boolean,
): FinancialProduct {
  const url = getLaunchpadTokenUrl(token)
  const sameAs = getHttpMetadataLinks(token)
  const provider = { '@id': PROVIDER_ORGANIZATION_IDS[token.provider] }

  return {
    '@type': 'FinancialProduct',
    '@id': `${url}#token`,
    name: token.name,
    alternateName: token.symbol,
    description: getLaunchpadTokenDescription(token),
    category: 'Cryptocurrency',
    identifier: [
      {
        '@type': 'PropertyValue',
        name: 'Contract address',
        propertyID: 'contractAddress',
        value: token.address,
      },
      {
        '@type': 'PropertyValue',
        name: 'Chain ID',
        propertyID: 'chainId',
        value: token.chainId,
      },
    ],
    logo: getLaunchpadTokenLogoUrl(token),
    brand: provider,
    provider,
    ...(sameAs.length === 0 ? {} : { sameAs }),
    ...(includeMarketData
      ? { subjectOf: { '@id': `${url}#market-data` } }
      : {}),
    url,
  }
}

export function getLaunchpadTokenJsonLd(token: LaunchpadToken): Graph {
  const url = getLaunchpadTokenUrl(token)
  const discoverUrl = getLaunchpadUrl(token.chainId)
  const metrics = token.metrics
  const marketMetrics = [
    getMarketMetric('Price', metrics?.priceUsd),
    getMarketMetric('24-hour trading volume', metrics?.volumeUsd.h24),
    getMarketMetric('Liquidity', metrics?.currentTvlUsd),
    getMarketMetric(
      'Fully diluted valuation',
      metrics?.fullyDilutedValuationUsd,
    ),
  ].filter((metric): metric is PropertyValue => metric !== null)

  const breadcrumb: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Sushi',
        item: SUSHI_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Launchpad',
        item: discoverUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: token.name,
        item: url,
      },
    ],
  }

  const page: ItemPage = {
    '@type': 'ItemPage',
    '@id': `${url}#webpage`,
    url,
    name: `${token.name} (${token.symbol})`,
    description: getLaunchpadTokenDescription(token),
    breadcrumb: { '@id': `${url}#breadcrumb` },
    datePublished: token.createdAt,
    dateModified: metrics?.asOf || token.metadata.updatedAt || token.createdAt,
    isPartOf: { '@id': SUSHI_WEBSITE_ID },
    mainEntity: { '@id': `${url}#token` },
    // The social card lives behind a build-hashed opengraph-image URL, so this
    // points at the token logo — the one stable image of the page's subject.
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: getLaunchpadTokenLogoUrl(token),
    },
    publisher: { '@id': SUSHI_ORGANIZATION_ID },
  }

  const dataset: Dataset = {
    '@type': 'Dataset',
    '@id': `${url}#market-data`,
    name: `${token.symbol} market data`,
    description: `Live launch pool market data for ${token.name} (${token.symbol}).`,
    creator: { '@id': SUSHI_ORGANIZATION_ID },
    dateModified: metrics?.asOf || token.metadata.updatedAt || token.createdAt,
    isAccessibleForFree: true,
    measurementTechnique: 'Sushi Launchpad on-chain pool metrics',
    url,
    ...(marketMetrics.length === 0 ? {} : { variableMeasured: marketMetrics }),
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...getLaunchpadProviderOrganizations([token]),
      getSushiWebsite(),
      page,
      breadcrumb,
      getTokenFinancialProduct(token, true),
      dataset,
    ],
  }
}

export function getLaunchpadDiscoverJsonLd(
  chainId: LaunchpadChainId,
  connection: LaunchpadTokenConnection | null,
): Graph {
  const url = getLaunchpadUrl(chainId)
  const chain = getEvmChainById(chainId)
  const tokens = connection?.edges.map((edge) => edge.node) ?? []
  const listItems: ListItem[] = tokens.map((token, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: getTokenFinancialProduct(token, false),
  }))
  const latestUpdate = tokens.reduce<string | undefined>((latest, token) => {
    const updatedAt =
      token.metrics?.asOf || token.metadata.updatedAt || token.createdAt
    return !latest || updatedAt > latest ? updatedAt : latest
  }, undefined)

  const breadcrumb: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Sushi',
        item: SUSHI_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Launchpad',
        item: url,
      },
    ],
  }

  const itemList: ItemList = {
    '@type': 'ItemList',
    '@id': `${url}#launches`,
    name: `Sushi Launchpad tokens on ${chain.name}`,
    itemListElement: listItems,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: connection?.totalCount ?? 0,
    url,
  }

  const page: CollectionPage = {
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    url,
    name: `Sushi Launchpad on ${chain.name}`,
    description:
      'Create and discover tokens with live markets and permanently locked Sushi V3 liquidity.',
    breadcrumb: { '@id': `${url}#breadcrumb` },
    dateModified: latestUpdate,
    isPartOf: { '@id': SUSHI_WEBSITE_ID },
    mainEntity: { '@id': `${url}#launches` },
    publisher: { '@id': SUSHI_ORGANIZATION_ID },
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...getLaunchpadProviderOrganizations(tokens),
      getSushiWebsite(),
      page,
      breadcrumb,
      itemList,
    ],
  }
}

export function getLaunchpadCreatorJsonLd(
  chainId: LaunchpadChainId,
  address: EvmAddress,
  creator: LaunchpadCreator | null,
): Graph {
  const url = getLaunchpadCreatorUrl(chainId, address)
  const discoverUrl = getLaunchpadUrl(chainId)
  const chain = getEvmChainById(chainId)
  const label = shortenAddress(address)
  const tokens = creator?.launches.edges.map((edge) => edge.node) ?? []
  const listItems: ListItem[] = tokens.map((token, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: getTokenFinancialProduct(token, false),
  }))

  const breadcrumb: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Sushi',
        item: SUSHI_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Launchpad',
        item: discoverUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Creator ${label}`,
        item: url,
      },
    ],
  }

  const itemList: ItemList = {
    '@type': 'ItemList',
    '@id': `${url}#launches`,
    name: `Tokens launched by ${label}`,
    itemListElement: listItems,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: creator?.launchCount ?? 0,
    url,
  }

  const page: CollectionPage = {
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    url,
    name: `Tokens launched by ${label} on ${chain.name}`,
    description: getLaunchpadCreatorDescription(address),
    breadcrumb: { '@id': `${url}#breadcrumb` },
    isPartOf: { '@id': SUSHI_WEBSITE_ID },
    mainEntity: { '@id': `${url}#launches` },
    publisher: { '@id': SUSHI_ORGANIZATION_ID },
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...getLaunchpadProviderOrganizations(tokens),
      getSushiWebsite(),
      page,
      breadcrumb,
      itemList,
    ],
  }
}

export function getLaunchpadCreatorDescription(address: EvmAddress): string {
  return `Every token launched by ${shortenAddress(address)} on Sushi Launchpad, with live market data and permanently locked Sushi V3 liquidity.`
}

export function serializeLaunchpadJsonLd(jsonLd: Graph): string {
  return JSON.stringify(jsonLd).replaceAll('<', '\\u003c')
}
