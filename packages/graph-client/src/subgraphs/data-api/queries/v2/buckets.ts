import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import {
  type EvmChainId,
  SUSHI_DATA_API_HOST,
  isSushiSwapV2ChainId,
} from 'sushi/evm'
import { graphql } from '../../graphql.js'

export const V2PoolBucketsQuery = graphql(
  `
query V2PoolBuckets($address: Bytes!, $chainId: SushiSwapV2ChainId!) {
  v2PoolBuckets(address: $address, chainId: $chainId) {
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

export type GetV2PoolBuckets = VariablesOf<typeof V2PoolBucketsQuery>

export async function getV2PoolBuckets(
  variables: GetV2PoolBuckets,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  const chainId = Number(variables.chainId) as EvmChainId

  if (!isSushiSwapV2ChainId(chainId)) {
    throw new Error('Invalid chainId')
  }
  try {
    const result = await request(
      { url, document: V2PoolBucketsQuery, variables },
      options,
    )
    if (result.v2PoolBuckets) {
      return {
        hourBuckets: result.v2PoolBuckets.hourBuckets.filter((b) => b !== null),
        dayBuckets: result.v2PoolBuckets.dayBuckets.filter((b) => b !== null),
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

export type V2PoolBuckets = Awaited<ReturnType<typeof getV2PoolBuckets>>
