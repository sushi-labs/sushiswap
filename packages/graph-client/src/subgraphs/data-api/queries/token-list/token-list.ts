import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import type { ChainIdVariable } from 'src/lib/types/chainId.js'
import type { ChainId } from 'sushi'
import { SUSHI_DATA_API_HOST } from 'sushi/evm'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const TokenListQuery = graphql(
  `
  query TokenList($chainId: TokenListChainId!, $first: Int = 50,  $skip: Int, $search: String, $customTokens: [Bytes!]) {
    tokenList(chainId: $chainId, first: $first, skip: $skip, search: $search, customTokens: $customTokens) {
      address
      symbol
      name
      decimals
      approved
    }
  }
`,
)

export type GetTokenList = VariablesOf<typeof TokenListQuery> &
  ChainIdVariable<ChainId>

export async function getTokenList(
  variables: GetTokenList,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: TokenListQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.tokenList.map((token) => ({
      id: `${variables.chainId}:${token.address}`,
      chainId: variables.chainId,
      ...token,
    }))
  }

  throw new Error('No tokens found')
}

export type TokenList = Awaited<ReturnType<typeof getTokenList>>
