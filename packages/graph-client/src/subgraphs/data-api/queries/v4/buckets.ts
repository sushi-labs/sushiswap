import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const V4PoolBucketsQuery = graphql(
  `
query V4PoolBuckets($poolId: Bytes!, $chainId: SushiSwapV4ChainId!) {
  v4PoolBuckets(poolId: $poolId, chainId: $chainId) {
    hourBuckets {
      id
      date
      volumeUSD
      liquidityUSD
      txCount
      feesUSD
    }
    dayBuckets {
      id
      date
      volumeUSD
      liquidityUSD
      txCount
      feesUSD
    }
  }
}
`,
)

export type GetV4PoolBuckets = VariablesOf<typeof V4PoolBucketsQuery>

export async function getV4PoolBuckets(
  variables: GetV4PoolBuckets,
  options?: RequestOptions,
) {
  const url = SUSHI_DATA_API_GRAPHQL_URL

  try {
    const result = await request(
      {
        url,
        document: V4PoolBucketsQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result.v4PoolBuckets) {
      return {
        hourBuckets: result.v4PoolBuckets.hourBuckets.filter((b) => b !== null),
        dayBuckets: result.v4PoolBuckets.dayBuckets.filter((b) => b !== null),
      }
    }
    throw new Error('Invalid response')
  } catch {
    return {
      hourBuckets: [],
      dayBuckets: [],
    }
  }
}

export type V4PoolBuckets = Awaited<ReturnType<typeof getV4PoolBuckets>>
