import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'
import { Token as _Token } from 'sushi/currency'

export const TokensQuery = graphql(
  `
  query TokensQuery($chainId: SushiSwapChainId!) {
    exploreTokens(chainId: $chainId) {
      address
      chainId
      symbol
      name
      decimals
      logoUrl
      price
      priceChangePercentage1d
      marketCapUSD
      sparkline7d
    }
  }
`,
)

export type GetTokens = VariablesOf<typeof TokensQuery>

export async function getTokens(
  variables: GetTokens,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  try {
    const result = await request(
      {
        url,
        document: TokensQuery,
        variables: {
          chainId: variables.chainId as any
        },
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result) {
      return {
        count: result.exploreTokens.length,
        data: result.exploreTokens.map(({ address, chainId, symbol, name, decimals, logoUrl, ...rest}) => ({
          token: new _Token({ address, chainId, symbol, name, decimals, logoUrl }),
          ...rest,
        }))
      }
    }
  } catch (error) {
    console.error('getTokens error', error)
  }
  return {
    count: 0,
    data: [],
  }
}

export type TokensResponse = Awaited<ReturnType<typeof getTokens>>
export type Tokens = TokensResponse['data']
export type Token = Tokens[number]
