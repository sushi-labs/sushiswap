'use client'

import type { PortfolioV2ChartResponse } from '@sushiswap/graph-client/data-api-portfolio'
import { Button, CardTitle, SkeletonText, classNames } from '@sushiswap/ui'
import type { FC, MouseEventHandler, ReactNode } from 'react'
import { formatPercent, formatUSD } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'
import {
  useChartFilters,
  useSetChartFilters,
} from '~evm/[chainId]/portfolio/chart-filters-provider'
import { ActionButtons } from './action-buttons'
import { AssetsFilter } from './assets-filter'

export enum AssetsChartPeriod {
  OneDay = 'ONE_DAY',
  SevenDay = 'SEVEN_DAYS',
  ThirtyDay = 'THIRTY_DAYS',
  All = 'ALL',
}

export const CHART_PERIODS = [
  {
    label: '1d',
    value: AssetsChartPeriod.OneDay,
  },
  {
    label: '7d',
    value: AssetsChartPeriod.SevenDay,
  },
  {
    label: '30d',
    value: AssetsChartPeriod.ThirtyDay,
  },
  {
    label: 'All',
    value: AssetsChartPeriod.All,
  },
]

export const AssetsChartHeader: FC<{
  setSelectedToken: (token: EvmCurrency | null) => void
  selectedToken: EvmCurrency | null
  isLoading: boolean
  data: PortfolioV2ChartResponse | undefined
}> = ({ setSelectedToken, selectedToken, isLoading, data }) => {
  const { chartRange } = useChartFilters()
  const setFilters = useSetChartFilters()

  const setPeriod = (period: AssetsChartPeriod) => {
    setFilters((prev) => ({
      ...prev,
      chartRange: period,
    }))
  }

  return (
    <>
      <div className="flex flex-col gap-4 justify-between px-4 pb-4 md:pb-4 md:gap-0 md:items-center md:flex-row">
        <AssetsFilter
          setSelectedToken={setSelectedToken}
          selectedToken={selectedToken}
        />
        {selectedToken && <ActionButtons token={selectedToken} />}
      </div>

      <div className="h-[1px] bg-accent w-full !mt-0" />

      <CardTitle className="!text-primary px-4 pt-4 md:pt-4">
        <div className="flex flex-col-reverse gap-1 justify-between items-start md:items-center md:flex-row md:gap-0">
          <div className="flex flex-col gap-1 pt-4 w-full md:pt-0">
            {isLoading ? (
              <>
                <SkeletonText fontSize="2xl" className="!w-[120px]" />
                <SkeletonText fontSize="default" className="!w-[150px]" />
              </>
            ) : (
              <>
                <span className="text-2xl !font-medium">
                  {formatUSD(data?.totalValueUSD ?? 0)}
                </span>
                <span
                  className={classNames(
                    '!font-medium',
                    (data?.percentChange ?? 0) >= 0
                      ? 'text-green-500'
                      : 'text-red-500',
                  )}
                >
                  {formatPercent(data?.percentChange ?? 0)} (
                  {formatUSD(data?.usdChange ?? 0)})
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 items-start md:items-center md:flex-row">
            <div className="flex gap-2">
              {CHART_PERIODS.map((period) => (
                <ChartPeriodButton
                  key={period.value}
                  active={chartRange === period.value}
                  onClick={() => setPeriod(period.value)}
                >
                  {period.label}
                </ChartPeriodButton>
              ))}
            </div>
          </div>
        </div>
      </CardTitle>
    </>
  )
}

interface ChartPeriodButtonProps {
  active: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
  children: ReactNode
  className?: string
}

const ChartPeriodButton: FC<ChartPeriodButtonProps> = ({
  active,
  onClick,
  children,
  className,
}) => {
  return (
    <Button
      size="sm"
      variant={active ? 'tertiary' : 'ghost'}
      onClick={onClick}
      className={classNames(
        '!h-8 !min-h-[32px] w-[46px]',
        !active && '!font-normal !text-primary',
        className,
      )}
    >
      {children}
    </Button>
  )
}
