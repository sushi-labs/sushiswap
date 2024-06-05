import type { VariablesOf } from 'gql.tada'
import request from 'graphql-request'
import type { SushiSwapV3ChainId } from 'sushi/config'
import { SUSHISWAP_V3_SUBGRAPH_URL } from 'sushi/config/subgraph'
import type { PoolV3 } from 'sushi/types'

import { FetchError } from 'src/lib/fetch-error'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { PoolFieldsFragment } from 'src/subgraphs/sushi-v3/fragments/pool-fields'
import { transformPoolV3ToStd } from 'src/subgraphs/sushi-v3/transforms/pool-v3-to-std'
import { graphql } from '../graphql'

export const SushiV3PoolQuery = graphql(
  `
  query Pool($id: ID!, $block: Block_height) {
    pool(id: $id, block: $block) {
      ...PoolFields
    }
  }
`,
  [PoolFieldsFragment],
)

export type GetSushiV3Pool = VariablesOf<typeof SushiV3PoolQuery> &
  ChainIdVariable<SushiSwapV3ChainId>

export type SushiV3Pool = PoolV3

export async function getSushiV3Pool({
  chainId,
  ...variables
}: GetSushiV3Pool): Promise<SushiV3Pool> {
  const url = `https://${SUSHISWAP_V3_SUBGRAPH_URL[chainId]}`

  const result = await request(url, SushiV3PoolQuery, variables)

  if (result.pool) {
    return transformPoolV3ToStd(result.pool, chainId)
  }

  throw new FetchError(
    chainId,
    `Failed to fetch pool ${chainId}:${variables.id}`,
  )
}
