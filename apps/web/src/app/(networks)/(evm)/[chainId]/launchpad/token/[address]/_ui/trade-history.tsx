'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { SignalIcon } from '@heroicons/react/24/outline'
import { Button, Dots, SkeletonBox, Switch, classNames } from '@sushiswap/ui'
import { differenceInMinutes, differenceInSeconds, format } from 'date-fns'
import ms from 'ms'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getEvmChainById } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import {
  formatRawAmount,
  formatUsd,
  shortenAddress,
} from '../../../_lib/format'
import type { LaunchpadToken, LaunchpadTrade } from '../../../types'
import { useLaunchpadLiveTrades } from '../_lib/use-launchpad-live-trades'

const TRADE_GRID_CLASS_NAME =
  'grid min-w-[680px] grid-cols-[52px_minmax(180px,1fr)_minmax(110px,auto)_minmax(140px,auto)_minmax(90px,auto)] gap-4'
type TradeHistoryToken = Pick<
  LaunchpadToken,
  'address' | 'chainId' | 'decimals' | 'symbol'
>

function formatRelativeTime(timestamp: string, now: number) {
  const timestampDate = new Date(timestamp)
  const elapsedSeconds = Math.max(0, differenceInSeconds(now, timestampDate))

  if (elapsedSeconds < 5) return 'now'
  if (elapsedSeconds < 60) return `${elapsedSeconds}s`
  if (elapsedSeconds < 3_600) {
    return `${differenceInMinutes(now, timestampDate)}m`
  }

  return format(timestampDate, 'h:mm a')
}

function formatTradePrice(priceUsd: number | null | undefined) {
  return priceUsd === null || priceUsd === undefined
    ? '—'
    : `$${priceUsd.toPrecision(4)}`
}

function TradeRowSkeleton() {
  return (
    <div
      className={classNames(TRADE_GRID_CLASS_NAME, 'items-center px-4 py-3')}
      aria-hidden="true"
    >
      <SkeletonBox className="h-4 w-8" />
      <div className="space-y-2">
        <SkeletonBox className="h-3 w-24" />
        <SkeletonBox className="h-2.5 w-20" />
      </div>
      <SkeletonBox className="h-3 w-14" />
      <div className="flex flex-col items-end gap-2">
        <SkeletonBox className="h-3 w-14" />
        <SkeletonBox className="h-2.5 w-20" />
      </div>
      <div className="flex items-center justify-end gap-2">
        <SkeletonBox className="h-3 w-8" />
        <SkeletonBox className="h-7 w-7 rounded-lg" />
      </div>
    </div>
  )
}

function TradeRow({
  trade,
  token,
  now,
  isLatest,
}: {
  trade: LaunchpadTrade
  token: TradeHistoryToken
  now: number
  isLatest: boolean
}) {
  return (
    <div
      className={classNames(
        TRADE_GRID_CLASS_NAME,
        'items-center px-4 py-3 text-xs transition-[background-color] hover:bg-white/[0.025]',
        isLatest && 'bg-white/[0.03]',
      )}
    >
      <span
        className={classNames(
          'font-semibold',
          trade.direction === 'BUY' ? 'text-emerald-400' : 'text-red',
        )}
      >
        {trade.direction === 'BUY' ? 'Buy' : 'Sell'}
      </span>
      <div className="min-w-0">
        <div className="truncate font-medium text-perps-muted">
          {formatRawAmount(trade.tokenAmount, token.decimals)} {token.symbol}
        </div>
        <div className="mt-1 flex items-center gap-1.5 truncate text-[11px] text-perps-muted-50">
          <span>{trade.trader ? shortenAddress(trade.trader) : 'Unknown'}</span>
          <span>·</span>
          <span>{trade.isLaunchPool ? 'Launch Pool' : 'V3'}</span>
        </div>
      </div>
      <div className="justify-self-end whitespace-nowrap text-right font-medium tabular-nums text-perps-muted">
        {formatTradePrice(trade.priceUsd)}
      </div>
      <div className="min-w-0 justify-self-end text-right tabular-nums">
        <div className="font-medium text-perps-muted">
          {formatUsd(trade.amountUsd)}
        </div>
        <div className="mt-1 truncate text-[11px] text-perps-muted-50">
          {formatRawAmount(trade.quoteAmount, trade.quoteToken.decimals, 6)}{' '}
          {trade.quoteToken.symbol}
        </div>
      </div>
      <div className="grid grid-cols-[1fr_28px] items-center gap-2 justify-self-end text-right">
        <span className="whitespace-nowrap tabular-nums text-perps-muted-50">
          {formatRelativeTime(trade.timestamp, now)}
        </span>
        <Button
          asChild
          variant="perps-secondary"
          size="xs"
          className="h-7 w-7 !p-0 opacity-50 transition-opacity hover:opacity-100"
        >
          <a
            href={getEvmChainById(trade.chainId).getTransactionUrl(
              trade.transactionHash,
            )}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View transaction in block explorer"
          >
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
    </div>
  )
}

export function TradeHistory({
  token,
}: {
  token: TradeHistoryToken
}) {
  const [includeSmallTrades, setIncludeSmallTrades] = useState(false)
  const [isTableScrolled, setIsTableScrolled] = useState(false)
  const [now, setNow] = useState(0)
  const input = useMemo(
    () => ({
      chainId: token.chainId,
      tokenAddress: token.address,
      includeSmallTrades,
      first: 20,
    }),
    [includeSmallTrades, token.address, token.chainId],
  )
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    streamStatus,
    lastEventAt,
  } = useLaunchpadLiveTrades(input)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [loadMoreTarget, setLoadMoreTarget] = useState<HTMLDivElement | null>(
    null,
  )

  useEffect(() => {
    const root = scrollRef.current
    const target = loadMoreTarget
    if (!root || !target || !hasNextPage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { root, rootMargin: '160px' },
    )
    observer.observe(target)

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, loadMoreTarget])

  useEffect(() => {
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), ms('1s'))
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="h-[560px]">
      <PerpsCard
        className="flex min-h-0 flex-col overflow-hidden"
        fullHeight
        fullWidth
      >
        <div className="border-b border-white/[0.06] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-perps-muted">
                  Recent trades
                </h2>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                  <span
                    className={classNames(
                      'h-1.5 w-1.5 rounded-full bg-emerald-400',
                      streamStatus !== 'live' && 'animate-pulse',
                    )}
                  />
                  {streamStatus === 'live'
                    ? 'Live'
                    : streamStatus === 'reconnecting'
                      ? 'Reconnecting'
                      : 'Connecting'}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-[11px] text-perps-muted-50">
                {data.totalCount} trades
              </span>
              <div aria-hidden="true" className="h-4 w-px bg-white/[0.06]" />
              <label
                htmlFor="launchpad-small-trades"
                className="flex items-center gap-2 text-[11px] text-perps-muted-50"
              >
                <Switch
                  id="launchpad-small-trades"
                  checked={includeSmallTrades}
                  onCheckedChange={setIncludeSmallTrades}
                  thumbClassName="dark:data-[state=unchecked]:!bg-perps-muted/[0.5]"
                />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Include &lt;$1
                </span>
              </label>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={(event) =>
            setIsTableScrolled(event.currentTarget.scrollTop > 0)
          }
          className="min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain hide-scrollbar"
        >
          <div className="flex min-h-full min-w-[680px] flex-col">
            <div
              className={classNames(
                TRADE_GRID_CLASS_NAME,
                'sticky top-0 z-10 border-b border-white/[0.06] px-4 py-2 text-[10px] uppercase tracking-wide text-perps-muted-50',
                isTableScrolled && 'bg-[#161b1f]/95 backdrop-blur-xl',
              )}
            >
              <span>Side</span>
              <span>Trade</span>
              <span className="justify-self-end text-right">Price</span>
              <span className="justify-self-end text-right">Total</span>
              <span className="grid grid-cols-[1fr_28px] gap-2 text-right">
                <span>Time</span>
              </span>
            </div>

            {isPending ? (
              <div className="min-h-0 flex-1 divide-y divide-white/[0.06]">
                {Array.from({ length: 7 }, (_, index) => (
                  <TradeRowSkeleton key={index} />
                ))}
              </div>
            ) : data.edges.length > 0 ? (
              <div className="min-h-0 flex-1 divide-y divide-white/[0.06]">
                {data.edges.map(({ node: trade }, index) => (
                  <TradeRow
                    key={trade.id}
                    trade={trade}
                    token={token}
                    now={now}
                    isLatest={index === 0 && lastEventAt === trade.timestamp}
                  />
                ))}
                {(hasNextPage || isFetchingNextPage) && (
                  <div
                    ref={setLoadMoreTarget}
                    className="flex min-h-8 items-center justify-center text-[11px] text-perps-muted-50"
                  >
                    {isFetchingNextPage ? (
                      <>
                        Loading more trades
                        <Dots />
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid flex-1 place-items-center p-6 text-center text-sm text-perps-muted-50">
                <div>
                  <SignalIcon className="mx-auto mb-3 h-6 w-6" />
                  The first swap will appear here live.
                </div>
              </div>
            )}
          </div>
        </div>
      </PerpsCard>
    </div>
  )
}
