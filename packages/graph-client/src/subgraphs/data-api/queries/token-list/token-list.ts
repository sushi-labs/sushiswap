import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import type { ChainIdVariable } from 'src/lib/types/chainId.js'
import type { TokenListChainId } from 'src/subgraphs/data-api/types/TokenListChainId.js'
import { type AddressFor, getIdFromChainIdAddress } from 'sushi'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const TokenListQuery = graphql(
  `
  query TokenList($chainId: TokenListChainId!, $first: Int = 50,  $skip: Int, $search: String, $customTokens: [ContractAddress!], $approvalStatuses: [TokenApprovalStatus!]) {
    tokenList(chainId: $chainId, first: $first, skip: $skip, search: $search, customTokens: $customTokens, approvalStatuses: $approvalStatuses) {
      address
      symbol
      name
      decimals
      approved
      stellarMetadata {
        issuer
        domain
      }
    }
  }
`,
)

export type GetTokenList<TChainId extends TokenListChainId> = VariablesOf<
  typeof TokenListQuery
> &
  ChainIdVariable<TChainId>

export async function getTokenList<TChainId extends TokenListChainId>(
  variables: GetTokenList<TChainId>,
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
    return result.tokenList.map((token) => {
      const address = token.address as AddressFor<TChainId>

      return {
        ...token,
        id: getIdFromChainIdAddress(variables.chainId, address),
        chainId: variables.chainId,
        address,
      }
    })
  }

  throw new Error('No tokens found')
}

export type TokenList<TChainId extends TokenListChainId = TokenListChainId> =
  Awaited<ReturnType<typeof getTokenList<TChainId>>>
