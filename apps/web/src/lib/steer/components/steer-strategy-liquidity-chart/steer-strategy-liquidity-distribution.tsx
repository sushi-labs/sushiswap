'use client'

import type { VaultV1 } from '@sushiswap/graph-client/data-api'
import { SkeletonBox } from '@sushiswap/ui'
import React, { type FC, useMemo } from 'react'
import { tickToPoolPrice } from 'src/lib/functions'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query/pools/use-concentrated-liquidity-pool-stats'
import { useV4PoolDensityChartData } from 'src/lib/pool/v4'
import {
  type EvmCurrency,
  EvmToken,
  SushiSwapProtocol,
  type SushiSwapV3ChainId,
  type SushiSwapV4ChainId,
  TickMath,
} from 'sushi/evm'
import type { Address, Hex } from 'viem'
import { useConcentratedDerivedMintInfo } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { useDensityChartData } from '~evm/[chainId]/_ui/liquidity-chart-range-input/hooks'
import type { ChartEntry } from '~evm/[chainId]/_ui/liquidity-chart-range-input/types'
import { getSteerVaultProtocol } from '../../utils/get-steer-vault-href'
import type { SteerStrategyGeneric } from '../steer-strategies'
import { SteerStrategyLiquidityDistributionChart } from './steer-strategy-liquidity-distribution-chart'

interface SteerStrategyLiquidityDistribution {
  vault: VaultV1
  positions: SteerStrategyGeneric['positions']
}

export const SteerStrategyLiquidityDistribution: FC<
  SteerStrategyLiquidityDistribution
> = (props) => {
  return (
    <div className="h-full w-full rounded-xl flex items-center justify-center">
      {getSteerVaultProtocol(props.vault) === SushiSwapProtocol.SUSHISWAP_V4 ? (
        <SteerStrategyLiquidityDistributionV4 {...props} />
      ) : (
        <SteerStrategyLiquidityDistributionV3 {...props} />
      )}
    </div>
  )
}

const SteerStrategyLiquidityDistributionV3: FC<
  SteerStrategyLiquidityDistribution
> = ({ vault, positions }) => {
  const chainId = vault.chainId as SushiSwapV3ChainId

  const { data: poolStats } = useConcentratedLiquidityPoolStats({
    chainId,
    address: vault.poolAddress as Address,
  })

  const {
    price,
    invertPrice,
    isLoading: isMintInfoLoading,
  } = useConcentratedDerivedMintInfo({
    account: undefined,
    chainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    baseToken: poolStats?.token0,
    feeAmount: poolStats?.feeAmount,
    existingPosition: undefined,
  })

  const { isLoading: isDensityDataLoading, data } = useDensityChartData({
    chainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    feeAmount: poolStats?.feeAmount,
  })

  const current = useMemo(() => {
    if (!price) return null

    return Number.parseFloat(
      (invertPrice ? price.invert() : price)?.toSignificant(8),
    )
  }, [invertPrice, price])

  return (
    <SteerStrategyLiquidityDistributionView
      token0={poolStats?.token0}
      token1={poolStats?.token1}
      positions={positions}
      series={data}
      current={current}
      isLoading={!poolStats || isMintInfoLoading || isDensityDataLoading}
    />
  )
}

const SteerStrategyLiquidityDistributionV4: FC<
  SteerStrategyLiquidityDistribution
> = ({ vault, positions }) => {
  const [token0, token1] = useMemo(
    () => [new EvmToken(vault.token0), new EvmToken(vault.token1)],
    [vault.token0, vault.token1],
  )

  const { series, currentPrice, isLoading } = useV4PoolDensityChartData({
    chainId: vault.chainId as SushiSwapV4ChainId,
    poolId: vault.poolAddress as Hex,
    token0,
    token1,
  })

  return (
    <SteerStrategyLiquidityDistributionView
      token0={token0}
      token1={token1}
      positions={positions}
      series={series}
      current={currentPrice}
      isLoading={isLoading}
    />
  )
}

const SteerStrategyLiquidityDistributionView: FC<{
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  positions: SteerStrategyGeneric['positions']
  series: ChartEntry[] | undefined
  current: number | null
  isLoading: boolean
}> = ({ token0, token1, positions, series, current, isLoading }) => {
  const steerRange = useMemo(() => {
    if (!token0 || !token1) return null

    const min = Math.min(
      ...positions.map((position) => Number(position.lowerTick)),
    )
    const max = Math.max(
      ...positions.map((position) => Number(position.upperTick)),
    )

    if (min < TickMath.MIN_TICK || max > TickMath.MAX_TICK || min > max) {
      return null
    }

    return {
      minPrice: Number(tickToPoolPrice(token0, token1, min).toSignificant(12)),
      maxPrice: Number(tickToPoolPrice(token0, token1, max).toSignificant(12)),
    }
  }, [positions, token0, token1])

  if (isLoading) {
    return <SkeletonBox className="w-full h-full" />
  }

  if (!series || !current || !steerRange) {
    return <div className="text-slate-300 text-sm">Invalid data.</div>
  }

  return (
    <div className="bg-secondary w-full h-full">
      <SteerStrategyLiquidityDistributionChart
        series={series}
        current={current}
        steerRange={steerRange}
      />
    </div>
  )
}
