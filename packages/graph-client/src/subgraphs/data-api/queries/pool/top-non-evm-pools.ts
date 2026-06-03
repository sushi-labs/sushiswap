import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const TopNonEvmPoolsQuery = graphql(
  `
  query TopPools($chainId: ChainId!) {
    topPools(chainId: $chainId) {
      id
      chainId
      name
      address
      swapFee
      protocol
      token0Address
      token1Address
      liquidityUSD
      txCount1d
      feeUSD1d
      volumeUSD1d
      totalApr1d
      incentiveApr
      isIncentivized
      wasIncentivized
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
