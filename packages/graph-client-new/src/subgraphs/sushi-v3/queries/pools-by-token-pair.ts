import {
  SUSHISWAP_V3_SUBGRAPH_URL,
  type SushiSwapV3ChainId,
} from '@sushiswap/graph-config'
import type { ResultOf, VariablesOf } from 'gql.tada'
import request from 'graphql-request'

import type { ChainIdVariable } from 'src/chainId'
import { graphql } from '../graphql'

export const SushiV3PoolsByTokenPairQuery = graphql(`
  query PoolsByTokenPair($where: Pool_filter!) {
    pools(first: 1000, where: $where) {
      id
      feeTier
      liquidity
      sqrtPrice
      feeGrowthGlobal0X128
      feeGrowthGlobal1X128
      token0Price
      token1Price
      tick
      observationIndex
      volumeToken0
      volumeToken1
      volumeUSD
      untrackedVolumeUSD
      feesUSD
      collectedFeesToken0
      collectedFeesToken1
      collectedFeesUSD
      totalValueLockedToken0
      totalValueLockedToken1
      totalValueLockedETH
      totalValueLockedUSD
      totalValueLockedUSDUntracked
      liquidityProviderCount
    }
  }
`)

export type GetSushiV3PoolsByTokenPair = {
  token0: `0x${string}`
  token1: `0x${string}`
} & ChainIdVariable<SushiSwapV3ChainId>

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
      token0: tokens[0],
      token1: tokens[1],
    },
  }

  const result = await request({
    url,
    document: SushiV3PoolsByTokenPairQuery,
    variables,
  })

  if (result) {
    return result.pools
  }

  return []
}

export type SushiV3PoolsByTokenPair = NonNullable<
  ResultOf<typeof SushiV3PoolsByTokenPairQuery>
>['pools']
