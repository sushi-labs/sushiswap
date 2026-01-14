import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import type { ChainIdVariable } from 'src/lib/types/chainId.js'
import type { TrendingTokensChainId } from 'src/subgraphs/data-api/types/TrendingTokensChainId.js'
import { type AddressFor, getIdFromChainIdAddress } from 'sushi'
import { SUSHI_DATA_API_HOST } from 'sushi/evm'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const TrendingTokensQuery = graphql(
  `
  query TrendingTokens($chainId: TrendingTokensChainId!) {
    trendingTokens(chainId: $chainId) {
      address
      symbol
      name
      decimals
      approved
    }
  }
`,
)

export type GetTrendingTokens<TChainId extends TrendingTokensChainId> =
  VariablesOf<typeof TrendingTokensQuery> & ChainIdVariable<TChainId>

export async function getTrendingTokens<TChainId extends TrendingTokensChainId>(
  variables: GetTrendingTokens<TChainId>,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: TrendingTokensQuery,
      variables: variables as VariablesOf<typeof TrendingTokensQuery>,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.trendingTokens.map((token) => ({
      ...token,
      id: getIdFromChainIdAddress(variables.chainId, token.address),
      chainId: variables.chainId,
      address: token.address as AddressFor<TChainId>,
    }))
  }

  throw new Error('No trending tokens found')
}

export type TrendingTokens<
  TChainId extends TrendingTokensChainId = TrendingTokensChainId,
> = Awaited<ReturnType<typeof getTrendingTokens<TChainId>>>
