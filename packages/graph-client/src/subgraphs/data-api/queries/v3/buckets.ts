import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request.js'
import { EvmChainId } from 'sushi'
import { isSushiSwapV3ChainId } from 'sushi/config'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'

export const V3PoolBucketsQuery = graphql(
  `
query V3PoolBuckets($address: Bytes!, $chainId: SushiSwapV3ChainId!) {
  v3PoolBuckets(address: $address, chainId: $chainId) {
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

export type GetV3PoolBuckets = VariablesOf<typeof V3PoolBucketsQuery>

export async function getV3PoolBuckets(
  variables: GetV3PoolBuckets,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  const chainId = Number(variables.chainId) as EvmChainId

  if (!isSushiSwapV3ChainId(chainId)) {
    throw new Error('Invalid chainId')
  }
  try {
    const result = await request(
      { url, document: V3PoolBucketsQuery, variables },
      options,
    )
    if (result.v3PoolBuckets) {
      return {
        hourBuckets: result.v3PoolBuckets.hourBuckets.filter((b) => b !== null),
        dayBuckets: result.v3PoolBuckets.dayBuckets.filter((b) => b !== null),
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

export type V3PoolBuckets = Awaited<ReturnType<typeof getV3PoolBuckets>>
