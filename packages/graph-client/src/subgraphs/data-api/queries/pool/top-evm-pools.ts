import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { type EvmChainId, isEvmChainId } from 'sushi'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const TopPoolsQuery = graphql(
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

export type GetTopPools = VariablesOf<typeof TopPoolsQuery>

export async function getTopPools(
  variables: GetTopPools,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  try {
    if (!isEvmChainId(Number.parseInt(variables.chainId))) {
      throw new Error(
        `Invalid chainId: ${variables.chainId}, this only supports evm networks and must be a number.`,
      )
    }
    const chainId = Number.parseInt(variables.chainId) as EvmChainId
    const result = await request(
      {
        url,
        document: TopPoolsQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result) {
      return (
        result.topPools.map((p) => ({
          ...p,
          chainId,
        })) ?? []
      )
    }
  } catch (error) {
    console.error('getTopPools error', error)
  }
  return []
}

export type TopPools = Awaited<ReturnType<typeof getTopPools>>
