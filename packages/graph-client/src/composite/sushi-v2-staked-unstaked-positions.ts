import { FetchError } from 'src/lib/fetch-error'
import type { ChainIdsVariable } from 'src/lib/types/chainId'
import type { Hex } from 'src/lib/types/hex'
import { fetchMultichain } from 'src/multichain/fetch-multichain'
import {
  type GetSushiV2LiquidityPositions,
  getSushiV2LiquidityPositions,
} from 'src/subgraphs/sushi-v2'
import { ChainId } from 'sushi/chain'
import {
  MINICHEF_SUPPORTED_CHAIN_IDS,
  SUSHISWAP_V2_SUPPORTED_CHAIN_IDS,
  isMiniChefChainId,
  isSushiSwapV2ChainId,
} from 'sushi/config'
import type {
  PoolV2,
  SushiPositionStaked,
  SushiPositionWithPool,
} from 'sushi/types'
import {
  type GetChefUserPositions,
  getChefUserPositions,
} from './chef-user-positions'

export type GetSushiV2StakedUnstakedPositions = {
  id: Hex
} & ChainIdsVariable<
  | NonNullable<GetChefUserPositions['chainIds']>[number]
  | GetSushiV2LiquidityPositions['chainId']
>

export type SushiV2StakedUnstakedPosition = SushiPositionStaked<
  SushiPositionWithPool<PoolV2>
>

/**
 * @brief Get staked AND unstaked user positions
 */
export async function getSushiV2StakedUnstakedPositions({
  chainIds = [
    ...new Set([
      ...SUSHISWAP_V2_SUPPORTED_CHAIN_IDS,
      ...MINICHEF_SUPPORTED_CHAIN_IDS,
    ]),
  ],
  id,
}: GetSushiV2StakedUnstakedPositions): Promise<{
  data: SushiV2StakedUnstakedPosition[]
  errors: FetchError[]
}> {
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
        user: id,
        liquidityTokenBalance_gt: '0',
      },
    },
  })

  const chefChainIds = [
    ...chainIds.filter(isMiniChefChainId),
    ...(chainIds.includes(ChainId.ETHEREUM) ? [ChainId.ETHEREUM] : []),
  ]
  const { data: chefUserPositions, errors: chefUserPositionErrors } =
    await getChefUserPositions({
      chainIds: chefChainIds,
      where: {
        address: id,
        amount_gt: '0',
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
        user: id,
        unstakedBalance: BigInt(sushiSwapPosition?.balance ?? '0'),
        stakedBalance: BigInt(chefPosition?.balance ?? '0'),
        pool,
      }
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)

  const errors = [
    ...sushiSwapV2LiquidityPositionErrors,
    ...chefUserPositionErrors,
  ]

  return { data, errors }
}
