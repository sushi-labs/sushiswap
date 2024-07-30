import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql'

export const PoolsQuery = graphql(
  `
query Pools($chainId: Int!) {
    topPools(chainId: $chainId) {
      chainId
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
      totalApr1d
      incentiveApr
      source
      isIncentivized
      isSmartPool
    }
  }
`,
)

export type GetPools = VariablesOf<typeof PoolsQuery>

export async function getTopPools(
  variables: GetPools,
  options?: RequestOptions,
) {
  const url = `https://${SUSHI_DATA_API_HOST}`

  const result = await request(
    { url, document: PoolsQuery, variables },
    options,
  )
  if (result) {
    return result.topPools ?? []
  }

  throw new Error('No pools found')
}

export type TopPools = Awaited<ReturnType<typeof getTopPools>>
