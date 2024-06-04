import type { ChainIdsVariable } from 'src/lib/types/chainId'
import type { Hex } from 'src/lib/types/hex'
import { fetchMultichain } from 'src/multichain/fetch-multichain'
import {
  type GetSushiV2LiquidityPositions,
  getSushiV2LiquidityPositions,
} from 'src/subgraphs/sushi-v2'
import {
  MINICHEF_SUPPORTED_CHAIN_IDS,
  SUSHISWAP_V2_SUPPORTED_CHAIN_IDS,
  isMiniChefChainId,
  isSushiSwapV2ChainId,
  type SushiSwapV2ChainId,
} from 'sushi/config'
import type { GetChefUserPositions } from './chef-user-positions'

export type GetCombinedUserPositions = {
  user: Hex
} & ChainIdsVariable<
  | NonNullable<GetChefUserPositions['chainIds']>[number]
  | GetSushiV2LiquidityPositions['chainId']
>

/**
 * @brief Get staked AND unstaked user positions
 */
export async function getCombinedUserPositions({
  chainIds = [
    ...new Set([
      ...SUSHISWAP_V2_SUPPORTED_CHAIN_IDS,
      ...MINICHEF_SUPPORTED_CHAIN_IDS,
    ]),
  ],
  user,
}: GetCombinedUserPositions) {
  const sushiSwapChainIds = chainIds.filter(isSushiSwapV2ChainId)
  const {
    data: sushiSwapV2LiquidityPositions,
    errors: sushiSwapV2LiquidityPositionErrors,
  } = await fetchMultichain({
    chainIds: sushiSwapChainIds,
    fetch: getSushiV2LiquidityPositions,
    variables: {
      first: 1000,
      where: {
        user,
        liquidityTokenBalance_gt: '0',
      },
    },
  })

  const miniChefChainIds = chainIds.filter(isMiniChefChainId)
  const { data: chefUserPositions, errors: chefUserPositionErrors } =
    await fetchMultichain({
      chainIds: miniChefChainIds,
      fetch: getSushiV2LiquidityPositions,
      variables: {
        first: 1000,
        where: {
          user,
        },
      },
    })

  const poolIds = Array.from(
    new Set([
      ...sushiSwapV2LiquidityPositions.map((position) => position.pool.id),
      ...chefUserPositions.map((position) => position.pool.id),
    ]),
  )

  const data = poolIds
    .map((poolId) => {
      const sushiSwapPosition = sushiSwapV2LiquidityPositions.find(
        (position) => position.pool.id === poolId,
      )
      const chefPosition = chefUserPositions.find(
        (position) => position.pool.id === poolId,
      )

      const pool = sushiSwapPosition?.pool ?? chefPosition?.pool
      if (!pool) return null 
      return {
        ...pool,
        user,
        unstakedBalance: sushiSwapPosition?.balance ?? '0',
        stakedBalance: chefPosition?.balance ?? '0',
      }
    })
    .filter((p) => p !== null) as CombinedV2UserPosition[]

  const errors = [
    ...sushiSwapV2LiquidityPositionErrors,
    ...chefUserPositionErrors,
  ]

  return { data, errors }
}

export type CombinedV2UserPosition = {
  user: `0x${string}`
  unstakedBalance: string
  stakedBalance: string
  chainId: SushiSwapV2ChainId
  address: `0x${string}`
  id: `${string}:${string}`
}
