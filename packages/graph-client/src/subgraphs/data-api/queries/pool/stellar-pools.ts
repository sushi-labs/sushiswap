import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const StellarPoolsQuery = graphql(
  `
  query StellarPools($chainId: ChainId!) {
    stellarPools(chainId: $chainId) {
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
        approved
        stellarMetadata {
          issuer
          domain
        }
      }
      token1 {
        id
        chainId
        address
        name
        symbol
        decimals
        approved
        stellarMetadata {
          issuer
          domain
        }
      }
      liquidityUSD
      txCount1d
      feeUSD1d
      volumeUSD1d
      totalApr1d
      incentiveApr
    }
  }
`,
)

export type GetStellarPools = VariablesOf<typeof StellarPoolsQuery>

export async function getStellarPools(
  variables: GetStellarPools,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  try {
    const result = await request(
      {
        url,
        document: StellarPoolsQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result) {
      return result.stellarPools ?? []
    }
  } catch (error) {
    console.error('getStellarPools error', error)
  }
  return []
}

export type StellarPools = Awaited<ReturnType<typeof getStellarPools>>
