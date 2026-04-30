'use client'

import type { PerpsSushiReferralFeePoint } from '@sushiswap/graph-client/data-api'
import { Button, classNames } from '@sushiswap/ui'
import { format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { currencyFormatter, useSushiReferralFeeHistory } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { PerpsCard } from '~evm/perps/_ui/_common'
import {
  ReferralHistoryChart,
  ReferralHistoryChartSkeleton,
} from './referral-history-chart'

const HISTORY_FILTERS = ['7D', '30D', 'All'] as const

export type HistoryFilter = (typeof HISTORY_FILTERS)[number]

function getHistoryRange(filter: HistoryFilter) {
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

export function ReferralHistoryCard() {
  const address = useAccount('evm')
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('30D')
  const range = useMemo(() => getHistoryRange(historyFilter), [historyFilter])
  const [dataToShow, setDataToShow] = useState<{
    amount: number
    date: string
  }>({ amount: 0, date: new Date().toISOString() })

  const history = useSushiReferralFeeHistory({
    address,
    from: range.from,
    to: range.to,
  })

  const historyPoints = useMemo(
    () =>
      [...((history.data ?? []) as PerpsSushiReferralFeePoint[])].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    [history.data],
  )
  useEffect(() => {
    if (!dataToShow && historyPoints.length) {
      const lastPoint = historyPoints[historyPoints.length - 1]
      setDataToShow({
        amount: lastPoint.amount,
        date: lastPoint.date,
      })
    }
  }, [dataToShow, historyPoints])

  return (
    <PerpsCard className="p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm gap-2 flex items-center">
            <h2 className=" text-perps-muted-50">Daily reward history</h2>
            <p>·</p>

            <p className="text-perps-muted-70">
              {format(new Date(dataToShow.date), 'MMM d, yyyy')}
            </p>
          </div>
          <p className="text-2xl font-medium text-perps-muted">
            {currencyFormatter.format(Number(dataToShow.amount))}
          </p>
        </div>
        <div className="hidden lg:block">
          <PerpsCard
            className="flex items-center gap-1 hide-scrollbar overflow-x-auto p-1"
            rounded="full"
          >
            {HISTORY_FILTERS.map((filter) => (
              <Button
                key={filter}
                size="xs"
                variant={historyFilter === filter ? 'perps-secondary' : 'ghost'}
                onClick={() => setHistoryFilter(filter)}
                className={classNames(
                  'w-full capitalize !text-xs !rounded-full  !border-0',
                  historyFilter === filter
                    ? 'text-white bg-accent'
                    : 'text-muted-foreground',
                )}
              >
                {filter}
              </Button>
            ))}
          </PerpsCard>
        </div>
      </div>
      <div className="mt-4">
        {history.isLoading ? (
          <ReferralHistoryChartSkeleton />
        ) : (
          <ReferralHistoryChart
            data={historyPoints}
            historyFilter={historyFilter}
            setDataToShow={setDataToShow}
          />
        )}
      </div>
      <div className="block lg:hidden">
        <PerpsCard
          className="flex items-center gap-1 hide-scrollbar overflow-x-auto p-1"
          rounded="full"
        >
          {HISTORY_FILTERS.map((filter) => (
            <Button
              key={filter}
              size="xs"
              variant={historyFilter === filter ? 'perps-secondary' : 'ghost'}
              onClick={() => setHistoryFilter(filter)}
              className={classNames(
                'w-full capitalize !text-xs !rounded-full  !border-0',
                historyFilter === filter
                  ? 'text-white bg-accent'
                  : 'text-muted-foreground',
              )}
            >
              {filter}
            </Button>
          ))}
        </PerpsCard>
      </div>
    </PerpsCard>
  )
}
