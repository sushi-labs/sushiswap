import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import type { ChainIdVariable } from 'src/lib/types/chainId.js'
import { type ChainId, getIdFromChainIdAddress } from 'sushi'
import { SUSHI_DATA_API_HOST } from 'sushi/evm'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const TokenListBalancesQuery = graphql(
  `
  query TokenListBalances($chainId: TokenListChainId!, $account: Bytes!, $includeNative: Boolean, $customTokens: [Bytes!]) {
    tokenListBalances(chainId: $chainId, account: $account, includeNative: $includeNative, customTokens: $customTokens) {
      address
      symbol
      name
      decimals
      balance
      approved
    }
  }
`,
)

export type GetTokenListBalances = VariablesOf<typeof TokenListBalancesQuery> &
  ChainIdVariable<ChainId>

export async function getTokenListBalances(
  variables: GetTokenListBalances,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: TokenListBalancesQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.tokenListBalances.map((token) => ({
      id: getIdFromChainIdAddress(variables.chainId, token.address),
      chainId: variables.chainId,
      ...token,
    }))
  }

  throw new Error('No tokens found')
}

export type TokenListBalances = Awaited<ReturnType<typeof getTokenListBalances>>
