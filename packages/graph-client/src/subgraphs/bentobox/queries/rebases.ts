import type { VariablesOf } from 'gql.tada'
import type { BentoBoxChainId } from 'sushi/config'
import { getBentoBoxSubgraphUrl } from 'sushi/config/subgraph'

import { addChainId } from 'src/lib/modifiers/add-chain-id.js'
import { convertIdToMultichainId } from 'src/lib/modifiers/convert-id-to-multichain-id.js'
import { copyIdToAddress } from 'src/lib/modifiers/copy-id-to-address.js'
import { type RequestOptions } from 'src/lib/request.js'
import { requestPaged } from 'src/lib/request-paged.js'
import type { ChainIdVariable } from 'src/lib/types/chainId.js'
import type { Hex } from 'src/lib/types/hex.js'
import { graphql } from '../graphql.js'
import { getSubgraphUrl } from 'src/lib/get-subgraph-url.js'

export const BentoBoxRebasesQuery = graphql(`
  query Rebases($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Rebase_orderBy, $orderDirection: OrderDirection, $where: Rebase_filter) {
    rebases(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      token {
        symbol
        name
        decimals
      }
      base
      elastic
      }
  }
`)

export type GetRebases = VariablesOf<typeof BentoBoxRebasesQuery> &
  ChainIdVariable<BentoBoxChainId>

export async function getRebases(
  { chainId, ...variables }: GetRebases,
  options?: RequestOptions,
) {
  const url = getSubgraphUrl({
    chainId,
    getter: getBentoBoxSubgraphUrl,
  })

  const result = await requestPaged({
    chainId,
    url,
    query: BentoBoxRebasesQuery,
    variables,
    options,
  })

  return result.rebases.map((rebase) =>
    convertIdToMultichainId(
      copyIdToAddress(
        addChainId(chainId, rebase as typeof rebase & { id: Hex }),
      ),
    ),
  )
}

export type BentoBoxRebases = Awaited<ReturnType<typeof getRebases>>
