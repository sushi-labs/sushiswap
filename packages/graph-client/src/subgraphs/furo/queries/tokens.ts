import type { VariablesOf } from 'gql.tada'
import type { FuroChainId } from 'sushi/config'
import { getFuroSubgraphUrl } from 'sushi/config/subgraph'

import { addChainId } from 'src/lib/modifiers/add-chain-id.js'
import { convertIdToMultichainId } from 'src/lib/modifiers/convert-id-to-multichain-id.js'
import { copyIdToAddress } from 'src/lib/modifiers/copy-id-to-address.js'
import type { RequestOptions } from 'src/lib/request.js'
import { requestPaged } from 'src/lib/request-paged.js'
import type { ChainIdVariable } from 'src/lib/types/chainId.js'
import type { Hex } from 'src/lib/types/hex.js'
import { graphql } from '../graphql.js'
import { getSubgraphUrl } from 'src/lib/get-subgraph-url.js'

export const FuroTokensQuery = graphql(`
  query Tokens($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Token_orderBy, $orderDirection: OrderDirection, $where: Token_filter) {
    tokens(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      decimals
      liquidityShares
      symbol
      name
      rebase {
        base
        elastic
      }
    }
  }
`)

export type GetFuroTokens = VariablesOf<typeof FuroTokensQuery> &
  ChainIdVariable<FuroChainId>

export async function getFuroTokens(
  { chainId, ...variables }: GetFuroTokens,
  options?: RequestOptions,
) {
  const url = getSubgraphUrl({
    chainId,
    getter: getFuroSubgraphUrl,
  })

  const result = await requestPaged({
    chainId,
    url,
    query: FuroTokensQuery,
    variables,
    options,
  })

  return result.tokens.map((token) =>
    convertIdToMultichainId(
      copyIdToAddress(addChainId(chainId, token as typeof token & { id: Hex })),
    ),
  )
}

export type FuroTokens = Awaited<ReturnType<typeof getFuroTokens>>
