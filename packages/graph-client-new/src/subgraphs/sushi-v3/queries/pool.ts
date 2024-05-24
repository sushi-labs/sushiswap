import {
  SUSHISWAP_V3_SUBGRAPH_URL,
  type SushiSwapV3ChainId,
} from '@sushiswap/graph-config'
import type { ResultOf, VariablesOf } from 'gql.tada'
import request from 'graphql-request'

import type { ChainIdVariable } from 'src/chainId'
import { graphql } from '../graphql'

export const SushiV3PoolQuery = graphql(`
  query Pool($id: ID!, $block: Block_height) {
    pool(id: $id, block: $block) {
      id
      token0 {
        id
        symbol
        name
        decimals
      }
      token1 {
        id
        symbol
        name
        decimals
      }
      feeTier
      liquidity
      volumeToken0
      volumeToken1
      volumeUSD
      feesUSD
      txCount
      totalValueLockedToken0
      totalValueLockedToken1
      totalValueLockedETH
      totalValueLockedUSD

      createdAtTimestamp
      createdAtBlockNumber

      poolHourData(first: 168, orderBy: periodStartUnix, orderDirection: desc) {
        id
        periodStartUnix
        tvlUSD
        volumeUSD
        feesUSD
        txCount
      }

      poolDayData(first: 730, orderBy: date, orderDirection: desc) {
        id
        date
        tvlUSD
        volumeUSD
        feesUSD
        txCount
      }
    }
  }
`)

export type GetSushiV3Pool = VariablesOf<typeof SushiV3PoolQuery> &
  ChainIdVariable<SushiSwapV3ChainId>

export async function getSushiV3Pool({
  chainId,
  ...variables
}: GetSushiV3Pool) {
  const url = `https://${SUSHISWAP_V3_SUBGRAPH_URL[chainId]}`

  const result = await request(url, SushiV3PoolQuery, variables)

  if (result) {
    return result.pool
  }

  throw new Error('No pool found')
}

export type SushiV3Pool = NonNullable<ResultOf<typeof SushiV3PoolQuery>>['pool']
