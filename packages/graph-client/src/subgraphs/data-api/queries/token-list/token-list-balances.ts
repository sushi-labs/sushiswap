import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import type { ChainIdVariable } from 'src/lib/types/chainId.js'
import type { TokenListChainId } from 'src/subgraphs/data-api/types/TokenListChainId.js'
import { type AddressFor, getIdFromChainIdAddress } from 'sushi'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const TokenListBalancesQuery = graphql(
  `
  query TokenListBalances($chainId: TokenListChainId!, $account: Address!, $includeNative: Boolean, $customTokens: [Address!]) {
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

export type GetTokenListBalances<TChainId extends TokenListChainId> =
  VariablesOf<typeof TokenListBalancesQuery> & ChainIdVariable<TChainId>

export async function getTokenListBalances<TChainId extends TokenListChainId>(
  variables: GetTokenListBalances<TChainId>,
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
      ...token,
      id: getIdFromChainIdAddress(variables.chainId, token.address),
      chainId: variables.chainId,
      address: token.address as AddressFor<TChainId>,
    }))
  }

  throw new Error('No tokens found')
}

export type TokenListBalances<
  TChainId extends TokenListChainId = TokenListChainId,
> = Awaited<ReturnType<typeof getTokenListBalances<TChainId>>>
