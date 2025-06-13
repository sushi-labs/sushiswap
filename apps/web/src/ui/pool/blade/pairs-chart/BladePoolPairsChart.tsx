'use client'

import { Card, SkeletonBox } from '@sushiswap/ui'
import { TooltipWithBounds, defaultStyles, useTooltip } from '@visx/tooltip'
import { useTheme } from 'next-themes'
import { useMemo, useState } from 'react'
import type { Address } from 'sushi'
import type { BladeChainId } from 'sushi/config'
import { usePoolPairsChartData } from '../../../../lib/pool/blade/usePoolPairsChartData'
import { PoolChartPeriod, PoolChartPeriods } from '../../PoolChartPeriods'
import { PoolChartTypes } from '../../PoolChartTypes'
import { ChordDiagram, TooltipContent } from './ChordDiagram'
import { type ChordPairData, convertPairsToChordMatrix } from './utils'

enum BladePairsChartType {
  Volume = 'Pair Volume',
  Swaps = 'Pair Swaps',
}

const pairsChartTypes = [BladePairsChartType.Volume, BladePairsChartType.Swaps]

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

  const duration = useMemo(() => {
    switch (period) {
      case PoolChartPeriod.Day:
        return 'DAY'
      case PoolChartPeriod.Week:
        return 'WEEK'
      case PoolChartPeriod.Month:
        return 'MONTH'
      case PoolChartPeriod.All:
        return 'ALL'
      default:
        return 'DAY'
    }
  }, [period])

  const periods = useMemo(
    () => [
      PoolChartPeriod.Day,
      PoolChartPeriod.Week,
      PoolChartPeriod.Month,
      PoolChartPeriod.All,
    ],
    [],
  )

  const { data, isLoading } = usePoolPairsChartData({
    poolAddress,
    chainId,
    duration,
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
              <div className="mb-2 font-medium text-gray-400 text-lg dark:text-gray-400">
                No data available
              </div>
              <div className="text-gray-500 text-sm dark:text-gray-400">
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
