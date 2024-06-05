import type { VariablesOf } from 'gql.tada'
import request from 'graphql-request'
import type { SushiSwapV2ChainId } from 'sushi/config'
import { SUSHISWAP_V2_SUBGRAPH_URL } from 'sushi/config/subgraph'
import type { PoolV2 } from 'sushi/types'

import { FetchError } from 'src/lib/fetch-error'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { transformPoolV2ToStd } from 'src/subgraphs/sushi-v2/transforms/pool-v2-to-std'
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
  ChainIdVariable<SushiSwapV2ChainId>

export async function getSushiV2Pool({
  chainId,
  ...variables
}: GetSushiV2Pool): Promise<PoolV2> {
  const url = `https://${SUSHISWAP_V2_SUBGRAPH_URL[chainId]}`

  const result = await request(url, SushiV2PoolQuery, variables)

  if (result.pool) {
    return transformPoolV2ToStd(result.pool, chainId)
  }

  throw new FetchError(
    chainId,
    `Failed to fetch pool ${chainId}:${variables.id}`,
  )
}

export type SushiV2Pool = Awaited<ReturnType<typeof getSushiV2Pool>>
