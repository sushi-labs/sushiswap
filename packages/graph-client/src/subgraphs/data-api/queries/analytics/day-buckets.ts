import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request'
import { graphql } from '../../graphql'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'

export const AnalyticsDayBucketsQuery = graphql(
  `
  query SushiDayBuckets($chainId: Int!) {
  sushiDayBuckets(chainId: $chainId) {
    v2 {
      id
      date
      volumeUSD
      liquidityUSD

    }
    v3 {
      id
      date
      volumeUSD
      liquidityUSD
    }
  }
}
`,
)

export type GetAnalyticsDayBuckets = VariablesOf<
  typeof AnalyticsDayBucketsQuery
>

export async function getAnalyticsDayBuckets(
  variables: GetAnalyticsDayBuckets,
  options?: RequestOptions,
) {
  const url = `https://${SUSHI_DATA_API_HOST}`

  const result = await request(
    { url, document: AnalyticsDayBucketsQuery, variables, requestHeaders: { 'Origin': 'sushi.com' } },
    options,
  )
  if (result) {
    return result.sushiDayBuckets ?? {
      v2: [],
      v3: [],
    }
  }
  return {
    v2: [],
    v3: [],
  }
}

export type AnalyticsDayBuckets = Awaited<
  ReturnType<typeof getAnalyticsDayBuckets>
>
