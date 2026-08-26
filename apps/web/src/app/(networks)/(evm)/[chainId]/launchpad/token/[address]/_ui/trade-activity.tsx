'use client'

import { SkeletonBox, classNames } from '@sushiswap/ui'
import { useEffect, useRef, useState } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { formatPercent, formatUsd } from '../../../_lib/format'
import {
  SEGMENTED_GROUP,
  SEGMENTED_ITEM,
  SEGMENTED_ITEM_IDLE,
  SEGMENTED_ITEM_SELECTED,
} from '../../../_ui/segmented-control'
import type { LaunchpadChainId } from '../../../constants'
import {
  DEFAULT_LAUNCHPAD_MARKET_STATS_WINDOW,
  LAUNCHPAD_MARKET_STATS_WINDOWS,
  type LaunchpadMarketStatsWindowKey,
  getLaunchpadMarketActivity,
} from '../_lib/launchpad-market-stats'
import { useLaunchpadMarketStats } from '../_lib/use-launchpad-market-stats'

const SEGMENTED_ITEM_COMPACT = 'flex-1 !h-7 !px-2 !text-[11px]'

function changeClassName(value: number | null): string {
  if (value === null || value === 0) return 'text-perps-muted'
  return value > 0 ? 'text-emerald-400' : 'text-red'
}

function TradeActivitySide({
  alignment,
  count,
  flashEventId,
  label,
  volumeUsd,
}: {
  alignment: 'left' | 'right'
  count: number
  flashEventId: string | null
  label: 'Buys' | 'Sells'
  volumeUsd: number
}) {
  const previousFlashEventId = useRef(flashEventId)
  const previousValues = useRef({ count, volumeUsd })
  const [flashKey, setFlashKey] = useState(0)

  useEffect(() => {
    const valuesChanged =
      count !== previousValues.current.count ||
      volumeUsd !== previousValues.current.volumeUsd
    if (
      flashEventId !== null &&
      flashEventId !== previousFlashEventId.current &&
      valuesChanged
    ) {
      setFlashKey((current) => current + 1)
    }
    previousFlashEventId.current = flashEventId
    previousValues.current = { count, volumeUsd }
  }, [count, flashEventId, volumeUsd])

  const isBuy = label === 'Buys'
  const shouldFlash = flashKey > 0
  const flashClassName =
    shouldFlash &&
    'animate-launchpad-trade-flash rounded-sm motion-reduce:animate-none'

  return (
    <div
      className={classNames('min-w-0', alignment === 'right' && 'text-right')}
    >
      <div
        className={classNames(
          'flex items-baseline gap-1.5',
          alignment === 'right' && 'justify-end',
        )}
      >
        {alignment === 'right' ? (
          <span
            className={classNames(
              'text-[11px] font-medium',
              isBuy ? 'text-emerald-400/80' : 'text-red/80',
            )}
          >
            {label}
          </span>
        ) : null}
        <span
          key={`count-${flashKey}`}
          className={classNames(
            'text-base font-semibold tabular-nums',
            isBuy ? 'text-emerald-400' : 'text-red',
            flashClassName,
          )}
        >
          {count}
        </span>
        {alignment === 'left' ? (
          <span
            className={classNames(
              'text-[11px] font-medium',
              isBuy ? 'text-emerald-400/80' : 'text-red/80',
            )}
          >
            {label}
          </span>
        ) : null}
      </div>
      <div
        key={`volume-${flashKey}`}
        className={classNames(
          'mt-0.5 truncate text-xs tabular-nums text-perps-muted-50',
          flashClassName,
        )}
      >
        {formatUsd(volumeUsd)}
      </div>
    </div>
  )
}

export function TradeActivitySkeleton() {
  return (
    <PerpsCard className="p-4" fullWidth>
      <div aria-hidden="true">
        <div className="flex items-center justify-between gap-3">
          <SkeletonBox className="h-5 w-32 rounded-md" />
          <SkeletonBox className="h-9 w-[164px] rounded-xl" />
        </div>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="space-y-1.5">
            <SkeletonBox className="h-6 w-24 rounded-sm" />
            <SkeletonBox className="h-2.5 w-16 rounded-sm" />
          </div>
          <div className="space-y-1.5">
            <SkeletonBox className="ml-auto h-6 w-20 rounded-sm" />
            <SkeletonBox className="ml-auto h-2.5 w-16 rounded-sm" />
          </div>
        </div>
        <SkeletonBox className="mt-3 h-2 w-full rounded-full" />
        <div className="mt-3 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <SkeletonBox className="h-4 w-16 rounded-sm" />
            <SkeletonBox className="h-3 w-14 rounded-sm" />
          </div>
          <div className="space-y-1.5">
            <SkeletonBox className="ml-auto h-4 w-16 rounded-sm" />
            <SkeletonBox className="ml-auto h-3 w-14 rounded-sm" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-3">
          <SkeletonBox className="h-3 w-16 rounded-sm" />
          <SkeletonBox className="h-3 w-20 rounded-sm" />
        </div>
      </div>
    </PerpsCard>
  )
}

/**
 * Server-side rolling windows for one launch token, with the window the reader
 * picked in front. The 5m and 1h windows move on every poll and every folded
 * stream event; 6h and 24h are held in a server cache and will read identically
 * for minutes at a time.
 */
export function TradeActivity({
  chainId,
  tokenAddress,
}: {
  chainId: LaunchpadChainId
  tokenAddress: EvmAddress
}) {
  const [windowKey, setWindowKey] = useState<LaunchpadMarketStatsWindowKey>(
    DEFAULT_LAUNCHPAD_MARKET_STATS_WINDOW,
  )
  const { data, isPending, latestNewTradeEvent } = useLaunchpadMarketStats(
    chainId,
    tokenAddress,
  )

  if (isPending) return <TradeActivitySkeleton />

  if (!data) {
    return (
      <PerpsCard className="p-4" fullWidth>
        <h2 className="font-semibold text-perps-muted">Market activity</h2>
        <p className="mt-2 text-sm leading-5 text-perps-muted-50">
          Market activity is unavailable right now.
        </p>
      </PerpsCard>
    )
  }

  const selected =
    LAUNCHPAD_MARKET_STATS_WINDOWS.find(({ key }) => key === windowKey) ??
    LAUNCHPAD_MARKET_STATS_WINDOWS[0]
  const statsWindow = data[selected.key]
  const activity = getLaunchpadMarketActivity(statsWindow)
  const hasActivity = activity.totalTradeCount > 0

  return (
    <PerpsCard className="p-4" fullWidth>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-perps-muted">Market activity</h2>
        <div
          role="radiogroup"
          aria-label="Market activity window"
          className={classNames(SEGMENTED_GROUP, 'w-[164px]')}
        >
          {LAUNCHPAD_MARKET_STATS_WINDOWS.map((option) => {
            const isSelected = option.key === selected.key
            return (
              <button
                key={option.key}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`${option.name} window`}
                onClick={() => setWindowKey(option.key)}
                className={classNames(
                  SEGMENTED_ITEM,
                  SEGMENTED_ITEM_COMPACT,
                  isSelected ? SEGMENTED_ITEM_SELECTED : SEGMENTED_ITEM_IDLE,
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="truncate text-xl font-semibold tabular-nums text-perps-muted">
            {formatUsd(activity.totalVolumeUsd)}
          </div>
          <div className="mt-0.5 text-[11px] text-perps-muted-50">
            {selected.label} volume
          </div>
        </div>
        <div className="min-w-0 text-right">
          <div
            className={classNames(
              'truncate text-xl font-semibold tabular-nums',
              changeClassName(activity.priceChangePercent),
            )}
          >
            {formatPercent(activity.priceChangePercent)}
          </div>
          <div className="mt-0.5 text-[11px] text-perps-muted-50">
            {selected.label} price
          </div>
        </div>
      </div>

      <div
        className="mt-3 flex h-2 overflow-hidden rounded-full bg-white/[0.06]"
        role="img"
        aria-label={
          hasActivity
            ? `${Math.round(activity.buySharePercent)}% buys and ${Math.round(activity.sellSharePercent)}% sells by ${activity.shareBasis}`
            : `No trades in the last ${selected.name}`
        }
      >
        {hasActivity ? (
          <>
            <div
              className="bg-emerald-400 transition-[width] duration-500"
              style={{ width: `${activity.buySharePercent}%` }}
            />
            <div
              className="bg-red transition-[width] duration-500"
              style={{ width: `${activity.sellSharePercent}%` }}
            />
          </>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-3">
        <TradeActivitySide
          alignment="left"
          count={activity.buyCount}
          flashEventId={
            latestNewTradeEvent?.direction === 'BUY'
              ? latestNewTradeEvent.insertionEventId
              : null
          }
          label="Buys"
          volumeUsd={activity.buyVolumeUsd}
        />
        <div className="min-w-0 self-end text-center">
          <div
            className={classNames(
              'truncate text-xs font-medium tabular-nums',
              changeClassName(activity.netFlowUsd),
            )}
          >
            {activity.netFlowUsd > 0 ? '+' : ''}
            {formatUsd(activity.netFlowUsd)}
          </div>
        </div>
        <TradeActivitySide
          alignment="right"
          count={activity.sellCount}
          flashEventId={
            latestNewTradeEvent?.direction === 'SELL'
              ? latestNewTradeEvent.insertionEventId
              : null
          }
          label="Sells"
          volumeUsd={activity.sellVolumeUsd}
        />
      </div>
    </PerpsCard>
  )
}
