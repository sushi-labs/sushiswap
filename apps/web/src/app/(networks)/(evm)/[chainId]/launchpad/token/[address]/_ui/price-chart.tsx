'use client'

import { Button, classNames } from '@sushiswap/ui'
import { useState } from 'react'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { formatUsd } from '../../../_ui/format'
import type { LaunchpadCandle } from '../../../types'

export function PriceChart({
  candles,
  symbol,
}: {
  candles: LaunchpadCandle[]
  symbol: string
}) {
  const [range, setRange] = useState('1D')
  const closes = candles.map((candle) => candle.close)
  const minimum = Math.min(...closes)
  const maximum = Math.max(...closes)
  const span = maximum - minimum || 1
  const points = candles.map((candle, index) => ({
    x: candles.length > 1 ? (index / (candles.length - 1)) * 800 : 0,
    y: 248 - ((candle.close - minimum) / span) * 190,
  }))
  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
  const areaPath = `${linePath} L 800 270 L 0 270 Z`

  return (
    <PerpsCard className="min-h-[540px] overflow-hidden" fullHeight fullWidth>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.06] p-5">
        <div>
          <div className="text-xs font-medium text-perps-muted-50">
            {symbol} / USD
          </div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-perps-muted">
            {formatUsd(closes.at(-1))}
          </div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            Live launch pool · 1% fee tier
          </div>
        </div>
        <div className="flex rounded-xl bg-white/[0.04] p-1">
          {['1H', '6H', '1D', '1W'].map((item) => (
            <Button
              key={item}
              size="xs"
              variant="perps-secondary"
              onClick={() => setRange(item)}
              className={classNames(
                'rounded-lg border-transparent px-2.5 text-perps-muted-50 shadow-none',
                range === item &&
                  '!bg-white/[0.08] !text-perps-muted shadow-sm',
              )}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      <div className="relative h-[438px] px-2 pb-4 pt-8">
        <div className="pointer-events-none absolute inset-x-5 bottom-10 top-8 flex flex-col justify-between">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="border-t border-dashed border-white/[0.06]"
            />
          ))}
        </div>
        {candles.length > 0 ? (
          <svg
            viewBox="0 0 800 290"
            preserveAspectRatio="none"
            className="relative h-full w-full overflow-visible"
            role="img"
            aria-label={`${symbol} price chart`}
          >
            <defs>
              <linearGradient
                id="launchpad-chart-area"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0" stopColor="#2563eb" stopOpacity="0.28" />
                <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#launchpad-chart-area)" />
            <path
              d={linePath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ) : (
          <div className="grid h-full place-items-center text-sm text-perps-muted-50">
            Trading will appear here after the first swap.
          </div>
        )}
      </div>
    </PerpsCard>
  )
}
