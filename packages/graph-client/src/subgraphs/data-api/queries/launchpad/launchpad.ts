import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import type { LaunchpadChainId } from 'src/subgraphs/data-api/types/LaunchpadChainId.js'
import type { EvmAddress } from 'sushi/evm'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const LaunchpadTokenFragment = graphql(`
  fragment LaunchpadTokenFragment on LaunchpadToken @_unmask {
    id
    chainId
    address
    creator
    factoryAddress
    name
    symbol
    decimals
    initialSupply
    feeSplit {
      sushiFeeBps
      creatorFeeBps
    }
    indexingStatus
    pool {
      address
      feeTier
      quoteToken {
        address
        symbol
        name
        decimals
      }
    }
    positions {
      positionIndex
      positionId
      tickLower
      tickUpper
      desiredAmount
      usedAmount
      liquidity
    }
    metadata {
      description
      links {
        kind
        url
        label
      }
      revision
      updatedAt
    }
    metrics {
      version
      priceUsd
      marketCapitalizationUsd
      fullyDilutedValuationUsd
      currentTvlUsd
      volumeUsd {
        h1
        h6
        h12
        h24
      }
      tvlChangePercent {
        h1
        h6
        h12
        h24
      }
      asOf
      source
      isStale
    }
    creationTransactionHash
    createdAt
  }
`)

export const LaunchpadQuoteTokenListQuery = graphql(`
  query LaunchpadQuoteTokenList($chainId: LaunchpadChainId!) {
    launchpad {
      quoteTokenList(chainId: $chainId) {
        address
        symbol
        name
        decimals
      }
    }
  }
`)

export const LaunchpadTokensQuery = graphql(
  `
    query LaunchpadTokens($input: LaunchpadTokensInput!) {
      launchpad {
        tokens(input: $input) {
          edges {
            cursor
            node {
              ...LaunchpadTokenFragment
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
          totalCount
        }
      }
    }
  `,
  [LaunchpadTokenFragment],
)

export const LaunchpadTokenQuery = graphql(
  `
    query LaunchpadToken($chainId: LaunchpadChainId!, $address: EvmAddress!) {
      launchpad {
        token(chainId: $chainId, address: $address) {
          ...LaunchpadTokenFragment
        }
      }
    }
  `,
  [LaunchpadTokenFragment],
)

export const LaunchpadCreatorQuery = graphql(
  `
    query LaunchpadCreator(
      $chainId: LaunchpadChainId!
      $address: EvmAddress!
      $input: LaunchpadTokensInput!
    ) {
      launchpad {
        creator(chainId: $chainId, address: $address) {
          chainId
          address
          launchCount
        }
        tokens(input: $input) {
          edges {
            cursor
            node {
              ...LaunchpadTokenFragment
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
          totalCount
        }
      }
    }
  `,
  [LaunchpadTokenFragment],
)

export const LaunchpadTradesQuery = graphql(`
  query LaunchpadTrades($input: LaunchpadTradesInput!) {
    launchpad {
      trades(input: $input) {
        streamCursor
        totalCount
        edges {
          cursor
          node {
            id
            chainId
            tokenAddress
            poolAddress
            feeTier
            isLaunchPool
            transactionHash
            logIndex
            blockNumber
            timestamp
            trader
            direction
            tokenAmount
            quoteToken {
              address
              symbol
              name
              decimals
            }
            quoteAmount
            priceUsd
            amountUsd
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`)

export const LaunchpadCandlesQuery = graphql(`
  query LaunchpadCandles($input: LaunchpadCandlesInput!) {
    launchpad {
      candles(input: $input) {
        streamCursor
        nodes {
          timestamp
          open
          high
          low
          close
          volumeUsd
          tradeCount
        }
      }
    }
  }
`)

export type GetLaunchpadQuoteTokenList = VariablesOf<
  typeof LaunchpadQuoteTokenListQuery
>
export type GetLaunchpadTokens = VariablesOf<typeof LaunchpadTokensQuery>
export type GetLaunchpadToken = VariablesOf<typeof LaunchpadTokenQuery>
export type GetLaunchpadCreator = VariablesOf<typeof LaunchpadCreatorQuery>
export type GetLaunchpadTrades = VariablesOf<typeof LaunchpadTradesQuery>
export type GetLaunchpadCandles = VariablesOf<typeof LaunchpadCandlesQuery>

export type LaunchpadTokensInput = GetLaunchpadTokens['input']
export type LaunchpadTradesInput = GetLaunchpadTrades['input']
export type LaunchpadCandlesInput = GetLaunchpadCandles['input']
export type LaunchpadTokenSortField = NonNullable<
  LaunchpadTokensInput['sortBy']
>
export type LaunchpadSortDirection = NonNullable<
  LaunchpadTokensInput['sortDirection']
>
export type LaunchpadCandleInterval = LaunchpadCandlesInput['interval']
export type LaunchpadIndexingStatus = 'PROVISIONAL' | 'CONFIRMED' | 'ORPHANED'
export type LaunchpadTradeDirection = 'BUY' | 'SELL'

export interface LaunchpadTokenRef {
  address: EvmAddress
  symbol: string
  name: string
  decimals: number
}

export interface LaunchpadNullableWindowValues {
  h1: number | null
  h6: number | null
  h12: number | null
  h24: number | null
}

export interface LaunchpadMetrics {
  version: string
  priceUsd: number | null
  marketCapitalizationUsd: number | null
  fullyDilutedValuationUsd: number | null
  currentTvlUsd: number | null
  volumeUsd: LaunchpadNullableWindowValues
  tvlChangePercent: LaunchpadNullableWindowValues
  asOf: string
  source: string
  isStale: boolean
}

export interface LaunchpadPosition {
  positionIndex: number
  positionId: string
  tickLower: number
  tickUpper: number
  desiredAmount: string
  usedAmount: string
  liquidity: string
}

export interface LaunchpadMetadataLink {
  kind: string
  url: string
  label: string | null
}

export interface LaunchpadMetadata {
  description: string | null
  links: LaunchpadMetadataLink[]
  revision: number
  updatedAt: string | null
}

export interface LaunchpadToken {
  id: string
  chainId: LaunchpadChainId
  address: EvmAddress
  creator: EvmAddress
  factoryAddress: EvmAddress
  name: string
  symbol: string
  decimals: number
  initialSupply: string
  feeSplit: {
    sushiFeeBps: number
    creatorFeeBps: number
  }
  indexingStatus: LaunchpadIndexingStatus
  pool: {
    address: EvmAddress
    feeTier: number
    quoteToken: LaunchpadTokenRef
  }
  positions: LaunchpadPosition[]
  metadata: LaunchpadMetadata
  metrics: LaunchpadMetrics | null
  creationTransactionHash: `0x${string}`
  createdAt: string
}

export interface LaunchpadPageInfo {
  endCursor: string | null
  hasNextPage: boolean
}

export interface LaunchpadTokenConnection {
  edges: Array<{ cursor: string; node: LaunchpadToken }>
  pageInfo: LaunchpadPageInfo
  totalCount: number
}

export interface LaunchpadCreator {
  chainId: LaunchpadChainId
  address: EvmAddress
  launchCount: number
  launches: LaunchpadTokenConnection
}

export interface LaunchpadTrade {
  id: string
  chainId: LaunchpadChainId
  tokenAddress: EvmAddress
  poolAddress: EvmAddress
  feeTier: number
  isLaunchPool: boolean
  transactionHash: `0x${string}`
  logIndex: number
  blockNumber: string
  timestamp: string
  trader: EvmAddress | null
  direction: LaunchpadTradeDirection
  tokenAmount: string
  quoteToken: LaunchpadTokenRef
  quoteAmount: string
  priceUsd: number | null
  amountUsd: number | null
}

export interface LaunchpadTradeConnection {
  edges: Array<{ cursor: string; node: LaunchpadTrade }>
  pageInfo: LaunchpadPageInfo
  streamCursor: string
  totalCount: number
}

export interface LaunchpadCandle {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volumeUsd: number
  tradeCount: number
}

export interface LaunchpadCandleSnapshot {
  streamCursor: string
  nodes: LaunchpadCandle[]
}

export async function getLaunchpadQuoteTokenList(
  variables: GetLaunchpadQuoteTokenList,
  options?: RequestOptions,
): Promise<LaunchpadTokenRef[]> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadQuoteTokenListQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return result.launchpad.quoteTokenList as LaunchpadTokenRef[]
}

export async function getLaunchpadTokens(
  variables: GetLaunchpadTokens,
  options?: RequestOptions,
): Promise<LaunchpadTokenConnection> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadTokensQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return result.launchpad.tokens as LaunchpadTokenConnection
}

export async function getLaunchpadToken(
  variables: GetLaunchpadToken,
  options?: RequestOptions,
): Promise<LaunchpadToken | null> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadTokenQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return result.launchpad.token as LaunchpadToken | null
}

export async function getLaunchpadCreator(
  variables: GetLaunchpadCreator,
  options?: RequestOptions,
): Promise<LaunchpadCreator> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadCreatorQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return {
    ...result.launchpad.creator,
    launches: result.launchpad.tokens as LaunchpadTokenConnection,
  }
}

export async function getLaunchpadTrades(
  variables: GetLaunchpadTrades,
  options?: RequestOptions,
): Promise<LaunchpadTradeConnection> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadTradesQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return result.launchpad.trades as LaunchpadTradeConnection
}

export async function getLaunchpadCandles(
  variables: GetLaunchpadCandles,
  options?: RequestOptions,
): Promise<LaunchpadCandleSnapshot> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadCandlesQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return result.launchpad.candles
}
