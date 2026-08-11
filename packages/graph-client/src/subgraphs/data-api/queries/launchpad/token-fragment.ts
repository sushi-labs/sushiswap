import type { ResultOf } from 'gql.tada'
import { graphql } from '../../graphql.js'

export const LaunchpadTokenFragment = graphql(`
  fragment LaunchpadTokenFragment on LaunchpadToken @_unmask {
    __typename
    id
    chainId
    provider
    address
    creator
    factoryAddress
    name
    symbol
    decimals
    initialSupply
    initialFdvUsd
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

export type LaunchpadToken = ResultOf<typeof LaunchpadTokenFragment>
export type LaunchpadIndexingStatus = LaunchpadToken['indexingStatus']
export type LaunchpadProvider = LaunchpadToken['provider']
export type LaunchpadPosition = LaunchpadToken['positions'][number]
export type LaunchpadMetadata = LaunchpadToken['metadata']
export type LaunchpadMetadataLink = LaunchpadMetadata['links'][number]
export type LaunchpadMetrics = NonNullable<LaunchpadToken['metrics']>
export type LaunchpadNullableWindowValues = LaunchpadMetrics['volumeUsd']
export type LaunchpadTokenRef = LaunchpadToken['pool']['quoteToken']
