import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { type EvmChainId, isBladeChainId } from 'sushi/evm'
import { graphql } from '../../graphql.js'

const SUSHI_DATA_API_HOST = 'http://data-api-staging.data-gcp.sushi.com'

export const BladePoolBucketsQuery = graphql(
  `
query BladePoolBuckets($address: Bytes!, $chainId: BladeChainId!) {
  bladePoolBuckets(address: $address, chainId: $chainId) {
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

export type GetBladePoolBuckets = VariablesOf<typeof BladePoolBucketsQuery>

export async function getBladePoolBuckets(
  variables: GetBladePoolBuckets,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  const chainId = Number(variables.chainId) as EvmChainId

  if (!isBladeChainId(chainId)) {
    throw new Error('Invalid chainId')
  }
  try {
    const result = await request(
      { url, document: BladePoolBucketsQuery, variables },
      options,
    )
    if (result.bladePoolBuckets) {
      return {
        hourBuckets: result.bladePoolBuckets.hourBuckets,
        dayBuckets: result.bladePoolBuckets.dayBuckets,
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

export type BladePoolBuckets = Awaited<ReturnType<typeof getBladePoolBuckets>>
