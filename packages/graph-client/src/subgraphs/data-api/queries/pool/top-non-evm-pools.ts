import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const TopNonEvmPoolsQuery = graphql(
  `
  query TopPools($chainId: String!) {
    topPools(chainId: $chainId) {
      id
      chainId
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
      isIncentivized
      wasIncentivized
      source
    }
  }
`,
)

export type GetTopNonEvmPools = VariablesOf<typeof TopNonEvmPoolsQuery>

export async function getTopNonEvmPools(
  variables: GetTopNonEvmPools,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  try {
    const result = await request(
      {
        url,
        document: TopNonEvmPoolsQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result) {
      return result.topPools ?? []
    }
  } catch (error) {
    console.error('getTopNonEvmPools error', error)
  }
  return []
}

export type TopNonEvmPools = Awaited<ReturnType<typeof getTopNonEvmPools>>
