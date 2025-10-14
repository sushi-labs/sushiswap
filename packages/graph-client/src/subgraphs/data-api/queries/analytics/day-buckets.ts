import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from 'sushi/evm'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const AnalyticsDayBucketsQuery = graphql(
  `
  query SushiDayBuckets($chainId: SushiSwapChainId!) {
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
    blade {
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
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  try {
    const result = await request(
      {
        url,
        document: AnalyticsDayBucketsQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result) {
      // Filter to only keep last 6 months of data
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      const sixMonthsAgoTimestamp = Math.floor(sixMonthsAgo.getTime() / 1000)

      return {
        v2: result.sushiDayBuckets.v2.filter(
          (bucket) => bucket.date >= sixMonthsAgoTimestamp,
        ),
        v3: result.sushiDayBuckets.v3.filter(
          (bucket) => bucket.date >= sixMonthsAgoTimestamp,
        ),
        blade: result.sushiDayBuckets.blade?.filter(
          (bucket) => bucket.date >= sixMonthsAgoTimestamp,
        ) ?? [],
      }
    }
  } catch {
    // TODO: handle error, probably return {data, error}? or message
  }
  return {
    v2: [],
    v3: [],
    blade: [],
  }
}

export type AnalyticsDayBuckets = Awaited<
  ReturnType<typeof getAnalyticsDayBuckets>
>
