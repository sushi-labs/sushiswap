import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const PortfolioV2TokensQuery = graphql(`
  query PortfolioV2Tokens($address: Bytes!, $chainIds: [PoolChainId!]!) {
    portfolioV2Tokens(address: $address, chainIds: $chainIds) {
      tokens {
        token {
          id
          chainId
          address
          name
          symbol
          decimals
        }
        amount
        amountUSD
        priceUSD
        percentageOfPortfolio
        chains {
          chainId
          address
          decimals
          amount
          amountUSD
        }
        bridges {
          chainId
          address
          decimals
        }
      }
      totalValueUSD
    }
  }
`)

export type GetPortfolioV2Tokens = VariablesOf<typeof PortfolioV2TokensQuery>

export async function getPortfolioV2Tokens(
  variables: GetPortfolioV2Tokens,
  options?: RequestOptions,
) {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`
  const url = 'https://data-api-feat-sushi2.data-gcp.sushi.com/graphql'

  try {
    const result = await request(
      {
        url,
        document: PortfolioV2TokensQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result) {
      return result.portfolioV2Tokens
    }
  } catch (error) {
    console.error('getPortfolioV2Tokens error', error)
    throw new Error('getPortfolioV2Tokens error')
  }
  return {
    tokens: [],
    totalValueUSD: 0,
  }
}

export type PortfolioV2TokensResponse = Awaited<
  ReturnType<typeof getPortfolioV2Tokens>
>
export type PortfolioV2Tokens = PortfolioV2TokensResponse['tokens']
export type PortfolioV2Token = PortfolioV2Tokens[number]
