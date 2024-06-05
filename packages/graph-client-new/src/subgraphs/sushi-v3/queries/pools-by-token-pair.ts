import type { VariablesOf } from 'gql.tada'
import request from 'graphql-request'
import type { SushiSwapV3ChainId } from 'sushi/config'
import { SUSHISWAP_V3_SUBGRAPH_URL } from 'sushi/config/subgraph'

import type { ChainIdVariable } from 'src/lib/types/chainId'
import { PoolFieldsFragment } from 'src/subgraphs/sushi-v3/fragments/pool-fields'
import { transformPoolV3ToBase } from 'src/subgraphs/sushi-v3/transforms/pool-v3-to-base'
import type { PoolBase, PoolV3 } from 'sushi/types'
import { graphql } from '../graphql'

export const SushiV3PoolsByTokenPairQuery = graphql(
  `
  query PoolsByTokenPair($where: Pool_filter!) {
    pools(first: 1000, where: $where) {
      ...PoolFields
    }
  }
`,
  [PoolFieldsFragment],
)

export type GetSushiV3PoolsByTokenPair = {
  token0: `0x${string}`
  token1: `0x${string}`
} & ChainIdVariable<SushiSwapV3ChainId>

export type SushiV3PoolsByTokenPair = PoolV3<PoolBase>

export async function getSushiV3PoolsByTokenPair({
  chainId,
  ..._variables
}: GetSushiV3PoolsByTokenPair) {
  const url = `https://${SUSHISWAP_V3_SUBGRAPH_URL[chainId]}`

  const tokens = [_variables.token0, _variables.token1].sort() as [
    `0x${string}`,
    `0x${string}`,
  ]

  const variables: VariablesOf<typeof SushiV3PoolsByTokenPairQuery> = {
    where: {
      token0: tokens[0].toLowerCase(),
      token1: tokens[1].toLowerCase(),
    },
  }

  const result = await request({
    url,
    document: SushiV3PoolsByTokenPairQuery,
    variables,
  })

  return result.pools.map((pool) => transformPoolV3ToBase(pool, chainId))
}
