'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { SignalIcon } from '@heroicons/react/24/outline'
import { Button, Switch, classNames } from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { formatRawAmount, formatUsd, shortenAddress } from '../../../_ui/format'
import { useLaunchpadLiveTrades } from '../../../hooks/use-launchpad-data'
import type { LaunchpadToken } from '../../../types'

function formatRelativeTime(timestamp: string, now: number) {
  const elapsedSeconds = Math.max(
    0,
    Math.floor((now - new Date(timestamp).getTime()) / 1_000),
  )

  if (elapsedSeconds < 5) return 'now'
  if (elapsedSeconds < 60) return `${elapsedSeconds}s`
  if (elapsedSeconds < 3_600) return `${Math.floor(elapsedSeconds / 60)}m`

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export function TradeHistory({ token }: { token: LaunchpadToken }) {
  const [includeSmallTrades, setIncludeSmallTrades] = useState(false)
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
  const { data, streamStatus, lastEventAt } = useLaunchpadLiveTrades(input)

  useEffect(() => {
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), 1_000)
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
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-perps-muted">
                  Recent trades
                </h2>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                  <span
                    className={classNames(
                      'h-1.5 w-1.5 rounded-full bg-emerald-400',
                      streamStatus === 'live' && 'animate-pulse',
                    )}
                  />
                  {streamStatus === 'live' ? 'Live' : 'Connecting'}
                </span>
              </div>
              <p className="mt-1 text-xs text-perps-muted-50">
                Newest launch-pool swaps appear automatically
              </p>
            </div>
            <SignalIcon className="h-5 w-5 shrink-0 text-perps-blue" />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
            <label
              htmlFor="launchpad-small-trades"
              className="flex items-center gap-2 text-xs text-perps-muted-50"
            >
              <Switch
                id="launchpad-small-trades"
                checked={includeSmallTrades}
                onCheckedChange={setIncludeSmallTrades}
              />
              Include trades under $1
            </label>
            <span className="text-[11px] text-perps-muted-50">
              {lastEventAt ? 'Just updated' : `${data.edges.length} trades`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[52px_minmax(0,1fr)_auto] gap-2 border-b border-white/[0.06] px-4 py-2 text-[10px] uppercase tracking-wide text-perps-muted-50">
          <span>Side</span>
          <span>Trade</span>
          <span className="text-right">Value / time</span>
        </div>

        {data.edges.length > 0 ? (
          <div className="min-h-0 flex-1 divide-y divide-white/[0.06] overflow-y-scroll overscroll-contain">
            {data.edges.map(({ node: trade }, index) => (
              <div
                key={trade.id}
                className={classNames(
                  'group grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-2 px-4 py-3 text-xs transition hover:bg-white/[0.025]',
                  index === 0 &&
                    lastEventAt === trade.timestamp &&
                    'bg-white/[0.03]',
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
                    {formatRawAmount(trade.tokenAmount, token.decimals)}{' '}
                    {token.symbol}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 truncate text-[11px] text-perps-muted-50">
                    <span>
                      {trade.trader ? shortenAddress(trade.trader) : 'Unknown'}
                    </span>
                    <span>·</span>
                    <span>{trade.isLaunchPool ? 'Launch' : 'V3'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1 text-right">
                  <div>
                    <div className="font-medium text-perps-muted">
                      {formatUsd(trade.amountUsd)}
                    </div>
                    <div className="mt-1 text-[11px] text-perps-muted-50">
                      {formatRelativeTime(trade.timestamp, now)}
                    </div>
                  </div>
                  <Button
                    variant="perps-secondary"
                    size="xs"
                    className="ml-1 h-7 w-7 !p-0 opacity-0 transition group-hover:opacity-100"
                    aria-label="View transaction"
                  >
                    <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid flex-1 place-items-center p-6 text-center text-sm text-perps-muted-50">
            <div>
              <SignalIcon className="mx-auto mb-3 h-6 w-6" />
              The first swap will appear here live.
            </div>
          </div>
        )}
      </PerpsCard>
    </div>
  )
}
