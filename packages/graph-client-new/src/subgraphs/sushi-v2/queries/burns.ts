import type { VariablesOf } from 'gql.tada'
import type { SushiSwapV2ChainId } from 'sushi/config'
import { SUSHISWAP_V2_SUBGRAPH_URL } from 'sushi/config/subgraph'

import { FetchError } from 'src/lib/fetch-error'
import type { RequestOptions } from 'src/lib/request'
import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { graphql } from '../graphql'

export const SushiV2BurnsQuery = graphql(`
  query Burns($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Burn_orderBy, $orderDirection: OrderDirection, $where: Burn_filter) {
    burns(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      sender
      liquidity
      amount0
      amount1
      amountUSD
      logIndex
      transaction {
        id
        createdAtTimestamp: timestamp
        createdAtBlock: blockNumber
      }
    }
  }
`)

export type GetSushiV2Burns = VariablesOf<typeof SushiV2BurnsQuery> &
  ChainIdVariable<SushiSwapV2ChainId>

export async function getSushiV2Burns(
  { chainId, ...variables }: GetSushiV2Burns,
  options?: RequestOptions,
) {
  const url = `https://${SUSHISWAP_V2_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV2BurnsQuery,
    variables,
    options,
  })

  if (result) {
    return result.burns
  }

  throw new FetchError(chainId, 'Failed to fetch burns')
}

export type SushiV2Burns = Awaited<ReturnType<typeof getSushiV2Burns>>
