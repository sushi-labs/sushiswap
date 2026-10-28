'use client'

import type { VaultV1 } from '@sushiswap/graph-client/data-api'
import { Chip, SkeletonBox, classNames } from '@sushiswap/ui'
import React, { type FC, useMemo } from 'react'
import { useConcentratedActiveLiquidity } from 'src/lib/pool/v3/use-concentrated-active-liquidity'
import { useV4PoolSlot0 } from 'src/lib/pool/v4'
import {
  EvmToken,
  SushiSwapProtocol,
  type SushiSwapV3ChainId,
  type SushiSwapV4ChainId,
} from 'sushi/evm'
import type { Hex } from 'viem'
import { getSteerVaultProtocol } from '../../utils/get-steer-vault-href'

interface SteerLiquidityInRangeChipProps {
  vault: VaultV1
}

export const SteerLiquidityInRangeChip: FC<SteerLiquidityInRangeChipProps> = ({
  vault,
}) => {
  return getSteerVaultProtocol(vault) === SushiSwapProtocol.SUSHISWAP_V4 ? (
    <SteerLiquidityInRangeChipV4 vault={vault} />
  ) : (
    <SteerLiquidityInRangeChipV3 vault={vault} />
  )
}

const SteerLiquidityInRangeChipV3: FC<SteerLiquidityInRangeChipProps> = ({
  vault,
}) => {
  const concentratedActiveLiquidityArgs = useMemo(() => {
    const token0 = new EvmToken({ ...vault.token0, chainId: vault.chainId })
    const token1 = new EvmToken({ ...vault.token1, chainId: vault.chainId })

    return {
      token0,
      token1,
      feeAmount: vault.feeTier * 1000000,
      chainId: vault.chainId as SushiSwapV3ChainId,
    }
  }, [vault.chainId, vault.feeTier, vault.token0, vault.token1])

  const { activeTick, isLoading } = useConcentratedActiveLiquidity(
    concentratedActiveLiquidityArgs,
  )

  return (
    <SteerLiquidityInRangeChipView
      vault={vault}
      activeTick={activeTick}
      isLoading={isLoading}
    />
  )
}

const SteerLiquidityInRangeChipV4: FC<SteerLiquidityInRangeChipProps> = ({
  vault,
}) => {
  const { data: slot0, isLoading } = useV4PoolSlot0({
    chainId: vault.chainId as SushiSwapV4ChainId,
    poolId: vault.poolAddress as Hex,
  })

  return (
    <SteerLiquidityInRangeChipView
      vault={vault}
      activeTick={slot0?.tick}
      isLoading={isLoading}
    />
  )
}

const SteerLiquidityInRangeChipView: FC<
  SteerLiquidityInRangeChipProps & {
    activeTick: number | undefined
    isLoading: boolean
  }
> = ({ vault, activeTick, isLoading }) => {
  const inRange = useMemo(() => {
    if (activeTick === undefined) return undefined
    return vault.lowerTick < activeTick && vault.upperTick > activeTick
  }, [vault.lowerTick, vault.upperTick, activeTick])

  if (isLoading) return <SkeletonBox className="w-[107px] h-5" />

  return (
    <>
      {typeof inRange === 'boolean' && (
        <Chip
          variant={'outline'}
          className={classNames(
            inRange
              ? 'bg-green/20 text-green hover:bg-green/40'
              : 'bg-red/20 text-red hover:bg-red/[0.35]',
          )}
        >
          <div className="inline-flex space-x-1.5 items-center">
            <div
              className={classNames(
                inRange ? 'bg-green' : 'bg-red',
                'w-2 h-2 rounded-full',
              )}
            />
            <span>{inRange ? 'In' : 'Out of'} Range</span>
          </div>
        </Chip>
      )}
    </>
  )
}
