import {
  MINICHEF_ENABLED_NETWORKS,
  SUSHISWAP_ENABLED_NETWORKS,
  isMiniChefChainId,
} from '@sushiswap/graph-config'
import type { ChainIdsVariable } from 'src/lib/types/chainId'
import type { Hex } from 'src/lib/types/hex'
import { fetchMultichain } from 'src/multichain/fetch-multichain'
import {
  type GetSushiV2LiquidityPositions,
  getSushiV2LiquidityPositions,
} from 'src/subgraphs/sushi-v2'
import { isSushiSwapV2ChainId } from 'sushi/config'
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
    ...new Set([...SUSHISWAP_ENABLED_NETWORKS, ...MINICHEF_ENABLED_NETWORKS]),
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
      first: Infinity,
      where: {
        user,
      },
    },
  })

  const miniChefChainIds = chainIds.filter(isMiniChefChainId)
  const { data: chefUserPositions, errors: chefUserPositionErrors } =
    await fetchMultichain({
      chainIds: miniChefChainIds,
      fetch: getSushiV2LiquidityPositions,
      variables: {
        first: Infinity,
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

  const data = poolIds.map((poolId) => {
    const sushiSwapPosition = sushiSwapV2LiquidityPositions.find(
      (position) => position.pool.id === poolId,
    )
    const chefPosition = chefUserPositions.find(
      (position) => position.pool.id === poolId,
    )

    const pool = sushiSwapPosition?.pool ?? chefPosition?.pool

    return {
      ...pool,
      user,
      unstakedBalance: sushiSwapPosition?.balance ?? '0',
      stakedBalance: chefPosition?.balance ?? '0',
    }
  })

  const errors = [
    ...sushiSwapV2LiquidityPositionErrors,
    ...chefUserPositionErrors,
  ]

  return { data, errors }
}
