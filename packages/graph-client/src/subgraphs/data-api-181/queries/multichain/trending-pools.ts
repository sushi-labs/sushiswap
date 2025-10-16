import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { graphql } from '../../graphql.js'

export const TrendingPoolsQuery = graphql(`
  query TrendingPools {
    trendingPools {
      id
      chainId
      name
      address
      swapFee
      protocol
      token0 {
        id
        chainId
        address
        name
        symbol
        decimals
      }
      token1 {
        id
        chainId
        address
        name
        symbol
        decimals
      }
      liquidityUSD
      volumeUSD1d
      volumeUSD1w
      totalApr1d
    }
  }
`)

export type GetTrendingPools = VariablesOf<typeof TrendingPoolsQuery>

// 3. Fetcher function
export async function getTrendingPools(options?: RequestOptions) {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`
  const url = 'https://data-api-feat-new-db-fields.data-gcp.sushi.com/graphql'

  const result = await request({ url, document: TrendingPoolsQuery }, options)

  if (result) {
    return result.trendingPools
  }

  throw new Error(`Failed to fetch trending pools`)
}

export type TrendingPools = Awaited<ReturnType<typeof getTrendingPools>>
export type TrendingPool = TrendingPools[number]
