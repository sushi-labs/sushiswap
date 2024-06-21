import type { VariablesOf } from 'gql.tada'

import { FetchError } from 'src/lib/fetch-error'
import { type RequestOptions, request } from 'src/lib/request'
// import { SUSHI_DATA_API_V0_URL } from 'sushi/config/subgraph'
import { graphql } from '../graphql'

export const PoolsQuery = graphql(
  `
query Pools($chainId: ID!) {
    pools(chainId: $chainId) {
      id
      name
      address
      createdAt
      swapFee
      protocol
      token0Price
      token1Price
      token0Address
      token1Address
      token0PriceUSD
      token1PriceUSD
      liquidityUSD
      txCount1h
      txCount1d
      feeUSD1h
      feeUSD1d
      volumeUSD1h
      volumeUSD1d
      feeApr1d
      source
    }
  }
`,
)

export type GetPools = VariablesOf<typeof PoolsQuery>

export async function getPools(variables: GetPools, options?: RequestOptions) {
  const url = `https://data-api-production-acb1.up.railway.app/graphql/`

  const result = await request(
    { url, document: PoolsQuery, variables },
    options,
  )
  if (result) {
    return result.pools
  }

  throw new FetchError(1, 'No bar')
}

export type PoolsV1 = Awaited<ReturnType<typeof getPools>>
