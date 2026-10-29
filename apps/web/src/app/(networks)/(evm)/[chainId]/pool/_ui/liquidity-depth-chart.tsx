'use client'

import { SkeletonBox } from '@sushiswap/ui'
import type { FC } from 'react'
import type { EvmCurrency } from 'sushi/evm'
import type { ChartEntry } from '~evm/[chainId]/_ui/liquidity-chart-range-input/types'
import { DepthChart } from './depth-chart'

interface LiquidityDepthChartProps {
  isLoading: boolean
  series: ChartEntry[] | undefined
  /** token0 priced in token1 */
  currentPrice: number | null | undefined
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
}

export const LiquidityDepthChart: FC<LiquidityDepthChartProps> = ({
  isLoading,
  series,
  currentPrice,
  token0,
  token1,
}) => {
  if (isLoading) {
    return <SkeletonBox className="h-[380px] w-full" />
  }

  if (!series || !currentPrice || !token0 || !token1) {
    return (
      <div className="flex h-[380px] items-center justify-center text-sm text-muted-foreground">
        Liquidity depth is unavailable for this pool.
      </div>
    )
  }

  return (
    <DepthChart
      series={series}
      currentPrice={currentPrice}
      baseSymbol={token0.symbol ?? 'Token 0'}
      quoteSymbol={token1.symbol ?? 'Token 1'}
      token0Decimals={token0.decimals}
      token1Decimals={token1.decimals}
    />
  )
}
