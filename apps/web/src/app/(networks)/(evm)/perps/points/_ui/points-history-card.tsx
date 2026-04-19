'use client'

import { Card, classNames } from '@sushiswap/ui'
import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { useSushiPointsHistory } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import {
  PointsHistoryChart,
  PointsHistoryChartSkeleton,
} from './points-history-chart'

const HISTORY_FILTERS = ['7D', '30D', 'All'] as const

function getHistoryRange(filter: (typeof HISTORY_FILTERS)[number]) {
  const to = format(new Date(), 'yyyy-MM-dd')

  if (filter === 'All') {
    return { from: undefined, to }
  }

  const days = filter === '7D' ? 7 : 30
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)

  return {
    from: format(fromDate, 'yyyy-MM-dd'),
    to,
  }
}

export function PointsHistoryCard() {
  const address = useAccount('evm')
  const [historyFilter, setHistoryFilter] =
    useState<(typeof HISTORY_FILTERS)[number]>('30D')
  const range = useMemo(() => getHistoryRange(historyFilter), [historyFilter])

  const history = useSushiPointsHistory({
    address,
    from: range.from,
    to: range.to,
  })

  const historyPoints = useMemo(
    () =>
      [...(history.data ?? [])].sort((a, b) => a.date.localeCompare(b.date)),
    [history.data],
  )

  return (
    <Card className="border-transparent !bg-[#18223B] p-2 !rounded-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-medium">Daily points history</h2>
          <p className="text-sm text-slate-400">
            Simple day-by-day Sushi point earnings.
          </p>
        </div>
        <div className="flex gap-2">
          {HISTORY_FILTERS.map((filter) => (
            <button
              key={filter}
              className={classNames(
                'rounded-md px-3 py-1.5 text-sm transition-colors',
                historyFilter === filter
                  ? 'bg-[#629FFF] text-white'
                  : 'bg-transparent text-slate-400 hover:text-white',
              )}
              onClick={() => setHistoryFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        {history.isLoading ? (
          <PointsHistoryChartSkeleton />
        ) : (
          <PointsHistoryChart data={historyPoints} />
        )}
      </div>
    </Card>
  )
}
