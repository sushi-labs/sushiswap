import type { VariablesOf } from 'gql.tada'
import request from 'graphql-request'
import type { SushiSwapV3ChainId } from 'sushi/config'
import { SUSHISWAP_V3_SUBGRAPH_URL } from 'sushi/config/subgraph'
import type { PoolV3, PoolWithBuckets } from 'sushi/types'

import { FetchError } from 'src/lib/fetch-error'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { PoolFieldsFragment } from 'src/subgraphs/sushi-v3/fragments/pool-fields'
import { transformBucketsV3ToStd } from 'src/subgraphs/sushi-v3/transforms/bucket-v3-to-std'
import { transformPoolV3ToStd } from 'src/subgraphs/sushi-v3/transforms/pool-v3-to-std'
import { graphql } from '../graphql'

export const SushiV3PoolBucketsQuery = graphql(
  `
  query Pool($id: ID!, $block: Block_height, $hourDataFirst: Int = 168, $dayDataFirst: Int = 1000) {
    pool(id: $id, block: $block) {
      ...PoolFields

      poolHourData(first: $hourDataFirst, orderBy: periodStartUnix, orderDirection: desc) {
        id
        date: periodStartUnix
        liquidityUSD: tvlUSD
        volumeUSD
        feesUSD
        txCount
      }

      poolDayData(first: $dayDataFirst, orderBy: date, orderDirection: desc) {
        id
        date
        liquidityUSD: tvlUSD
        volumeUSD
        feesUSD
        txCount
      }
    }
  }
`,
  [PoolFieldsFragment],
)

export type GetSushiV3PoolBuckets = VariablesOf<
  typeof SushiV3PoolBucketsQuery
> &
  ChainIdVariable<SushiSwapV3ChainId>

export type SushiV3PoolBuckets = PoolWithBuckets<PoolV3>

export async function getSushiV3PoolBuckets({
  chainId,
  ...variables
}: GetSushiV3PoolBuckets): Promise<SushiV3PoolBuckets> {
  const url = `https://${SUSHISWAP_V3_SUBGRAPH_URL[chainId]}`

  const result = await request(url, SushiV3PoolBucketsQuery, variables)

  if (result.pool) {
    return {
      ...transformPoolV3ToStd(result.pool, chainId),
      poolHourData: transformBucketsV3ToStd(result.pool.poolHourData),
      poolDayData: transformBucketsV3ToStd(result.pool.poolDayData),
    }
  }

  throw new FetchError(
    chainId,
    `Failed to fetch pool ${chainId}:${variables.id}`,
  )
}
