'use client'

import { Card, SkeletonBox } from '@sushiswap/ui'
import { TooltipWithBounds, defaultStyles, useTooltip } from '@visx/tooltip'
import { useTheme } from 'next-themes'
import { useMemo, useState } from 'react'
import { usePoolPairsChartData } from 'src/lib/pool/blade/usePoolPairsChartData'
import type { BladeChainId } from 'sushi/evm'
import type { Address } from 'viem'
import {
  PoolChartPeriod,
  PoolChartPeriods,
} from '~evm/[chainId]/pool/_ui/pool-chart-periods'
import { PoolChartTypes } from '~evm/[chainId]/pool/_ui/pool-chart-types'
import { ChordDiagram, TooltipContent } from './chord-diagram'
import { type ChordPairData, convertPairsToChordMatrix } from './utils'

enum BladePairsChartType {
  Volume = 'Pair Volume',
  Swaps = 'Pair Swaps',
}

const pairsChartTypes = [BladePairsChartType.Volume, BladePairsChartType.Swaps]
const periods = [
  PoolChartPeriod.Day,
  PoolChartPeriod.Week,
  PoolChartPeriod.Month,
  PoolChartPeriod.All,
]
const durationByPeriod = {
  [PoolChartPeriod.Day]: 'DAY' as const,
  [PoolChartPeriod.Week]: 'WEEK' as const,
  [PoolChartPeriod.Month]: 'MONTH' as const,
  [PoolChartPeriod.All]: 'ALL' as const,
  // Year is not supported. Map it to Day.
  [PoolChartPeriod.Year]: 'DAY' as const,
} satisfies Record<PoolChartPeriod, string>

export function BladePoolPairsChart({
  poolAddress,
  chainId,
}: {
  poolAddress: Address
  chainId: BladeChainId
}) {
  const { theme } = useTheme()
  const [chartType, setChartType] = useState<BladePairsChartType>(
    BladePairsChartType.Volume,
  )
  const [period, setPeriod] = useState<PoolChartPeriod>(PoolChartPeriod.Day)

  const { data, isLoading } = usePoolPairsChartData({
    poolAddress,
    chainId,
    duration: durationByPeriod[period],
  })

  const { segmentNames, pairs, hasData } = useMemo(() => {
    if (!data || data.length === 0) {
      return { segmentNames: [], pairs: {}, hasData: false }
    }

    const tokenSymbolsSet = new Set<string>()
    const pairsMap: Record<
      string,
      { volumeUSD: number; txCount: number; id: string }
    > = {}

    data.forEach((pair) => {
      const token0Symbol = pair.token0.symbol
      const token1Symbol = pair.token1.symbol

      tokenSymbolsSet.add(token0Symbol)
      tokenSymbolsSet.add(token1Symbol)

      const pairKey = `${token0Symbol}-${token1Symbol}`
      const reversePairKey = `${token1Symbol}-${token0Symbol}`

      const existingKey = pairsMap[pairKey]
        ? pairKey
        : pairsMap[reversePairKey]
          ? reversePairKey
          : pairKey

      if (!pairsMap[existingKey]) {
        pairsMap[existingKey] = {
          volumeUSD: 0,
          txCount: 0,
          id: `${token0Symbol}-${token1Symbol}`,
        }
      }

      pairsMap[existingKey].volumeUSD += Number(pair.volumeUSD) || 0
      pairsMap[existingKey].txCount += pair.txCount || 0
    })

    const segmentNames = Array.from(tokenSymbolsSet).sort()
    const hasData = segmentNames.length > 0 && Object.keys(pairsMap).length > 0

    return { segmentNames, pairs: pairsMap, hasData }
  }, [data])

  const { matrix, matrixProps } = useMemo(() => {
    if (!hasData) return { matrix: [], matrixProps: [] }

    const matrixFilter =
      chartType === BladePairsChartType.Volume ? 'volumeUSD' : 'txCount'
    return convertPairsToChordMatrix(segmentNames, pairs, matrixFilter)
  }, [segmentNames, pairs, chartType, hasData])

  const {
    tooltipOpen,
    tooltipData,
    showTooltip,
    hideTooltip,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<ChordPairData>({})

  const tooltipStyles = useMemo(
    () => ({
      ...defaultStyles,
      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#000000',
      padding: 12,
      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
      borderRadius: '8px',
    }),
    [theme],
  )

  if (isLoading) {
    return (
      <Card className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 border-accent border-b px-6 py-4">
          <PoolChartTypes
            charts={pairsChartTypes}
            selectedChart={chartType}
            setChart={setChartType}
          />
          <PoolChartPeriods
            periods={periods}
            selectedPeriod={period}
            setPeriod={setPeriod}
          />
        </div>
        <div className="p-6">
          <SkeletonBox className="h-[400px] w-full" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 border-accent border-b px-6 py-4">
        <PoolChartTypes
          charts={pairsChartTypes}
          selectedChart={chartType}
          setChart={setChartType}
        />
        <PoolChartPeriods
          periods={periods}
          selectedPeriod={period}
          setPeriod={setPeriod}
        />
      </div>
      <div className="flex flex-col gap-6 p-6">
        {!hasData ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-2 font-medium text-gray-400 text-lg">
                No data available
              </div>
              <div className="text-muted-foreground text-sm">
                No {chartType.toLowerCase()} data found for the selected period
              </div>
            </div>
          </div>
        ) : (
          <ChordDiagram
            matrix={matrix}
            matrixProps={matrixProps}
            segmentNames={segmentNames}
            theme={theme}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
        )}
      </div>
      {tooltipOpen && (
        // @ts-expect-error https://github.com/airbnb/visx/issues/1906
        <TooltipWithBounds
          style={tooltipStyles}
          top={tooltipTop + 10}
          left={tooltipLeft + 20}
          key={Math.random()}
        >
          {tooltipData ? <TooltipContent item={tooltipData} /> : null}
        </TooltipWithBounds>
      )}
    </Card>
  )
}
