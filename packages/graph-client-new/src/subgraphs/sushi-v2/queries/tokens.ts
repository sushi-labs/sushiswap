import {
  SUSHISWAP_SUBGRAPH_URL,
  type SushiSwapChainId,
} from '@sushiswap/graph-config'
import type { ResultOf, VariablesOf } from 'gql.tada'

import type { ChainIdVariable } from 'src/chainId'
import { requestPaged } from 'src/lib/request-paged'
import { graphql } from '../graphql'

export const SushiV2TokensQuery = graphql(`
  query Tokens($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Token_orderBy, $orderDirection: OrderDirection, $where: Token_filter) {
    tokens(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      name
      liquidityUSD
      symbol
      decimals
      volumeUSD
      feesUSD
      price {
        derivedNative
      }
    }
  }
`)

export type GetSushiV2Tokens = VariablesOf<typeof SushiV2TokensQuery> &
  ChainIdVariable<SushiSwapChainId>

export async function getSushiV2Tokens({
  chainId,
  ...variables
}: GetSushiV2Tokens) {
  const url = `https://${SUSHISWAP_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV2TokensQuery,
    variables,
  })

  if (result) {
    return result.tokens
  }

  return []
}

export type SushiV2Tokens = NonNullable<
  ResultOf<typeof SushiV2TokensQuery>
>['tokens']
