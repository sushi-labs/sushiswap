import type { VariablesOf } from 'gql.tada'
import request from 'graphql-request'
import type { SushiSwapV3ChainId } from 'sushi/config'
import { SUSHISWAP_V3_SUBGRAPH_URL } from 'sushi/config/subgraph'

import { FetchError } from 'src/lib/fetch-error'
import { addChainId } from 'src/lib/modifiers/add-chain-id'
import { convertIdToMultichainId } from 'src/lib/modifiers/convert-id-to-multichain-id'
import { copyIdToAddress } from 'src/lib/modifiers/copy-id-to-address'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import type { Hex } from 'src/lib/types/hex'
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

  if (result.pool) {
    return convertIdToMultichainId(
      copyIdToAddress(
        addChainId(chainId, result.pool as typeof result.pool & { id: Hex }),
      ),
    )
  }

  throw new FetchError(
    chainId,
    `Failed to fetch pool ${chainId}:${variables.id}`,
  )
}

export type SushiV3Pool = Awaited<ReturnType<typeof getSushiV3Pool>>
