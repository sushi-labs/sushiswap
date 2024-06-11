import type { VariablesOf } from 'gql.tada'
import type { SushiSwapV3ChainId } from 'sushi/config'
import { SUSHISWAP_V3_SUBGRAPH_URL } from 'sushi/config/subgraph'

import type { RequestOptions } from 'src/lib/request'
import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { graphql } from '../graphql'

export const SushiV3BurnsQuery = graphql(`
  query Burns($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Burn_orderBy, $orderDirection: OrderDirection, $where: Burn_filter) {
    burns(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      owner
      origin
      amount
      amount0
      amount1
      amountUSD
      logIndex
      transaction {
        id
        timestamp
        blockNumber
      }
    }
  }
`)

export type GetSushiV3Burns = VariablesOf<typeof SushiV3BurnsQuery> &
  ChainIdVariable<SushiSwapV3ChainId>

export async function getSushiV3Burns(
  { chainId, ...variables }: GetSushiV3Burns,
  options?: RequestOptions,
) {
  const url = `https://${SUSHISWAP_V3_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV3BurnsQuery,
    variables,
    options,
  })

  return result.burns
}

export type SushiV3Burns = Awaited<ReturnType<typeof getSushiV3Burns>>
