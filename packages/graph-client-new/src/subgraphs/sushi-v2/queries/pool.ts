import {
  SUSHISWAP_SUBGRAPH_URL,
  type SushiSwapChainId,
} from '@sushiswap/graph-config'
import type { VariablesOf } from 'gql.tada'
import request from 'graphql-request'

import { addChainId } from 'src/lib/modifiers/add-chain-id'
import { convertIdToMultichainId } from 'src/lib/modifiers/convert-id-to-multichain-id'
import { copyIdToAddress } from 'src/lib/modifiers/copy-id-to-address'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { PoolFieldsFragment } from '../fragments/pool-fields'
import { graphql } from '../graphql'

export const SushiV2PoolQuery = graphql(
  `
  query Pool($id: ID!, $block: Block_height) {
    pool: pair(id: $id, block: $block) {
      ...PoolFields
    }
  }
`,
  [PoolFieldsFragment],
)

export type GetSushiV2Pool = VariablesOf<typeof SushiV2PoolQuery> &
  ChainIdVariable<SushiSwapChainId>

export async function getSushiV2Pool({
  chainId,
  ...variables
}: GetSushiV2Pool) {
  const url = `https://${SUSHISWAP_SUBGRAPH_URL[chainId]}`

  const result = await request(url, SushiV2PoolQuery, variables)

  if (result.pool) {
    return convertIdToMultichainId(
      copyIdToAddress(addChainId(chainId, result.pool)),
    )
  }

  throw new Error(`Failed to fetch pool ${chainId}:${variables.id}`)
}

export type SushiV2Pool = Awaited<ReturnType<typeof getSushiV2Pool>>
