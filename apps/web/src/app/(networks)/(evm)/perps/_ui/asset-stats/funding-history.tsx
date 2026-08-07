import {
  Button,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
  SkeletonBox,
  classNames,
} from '@sushiswap/ui'
import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import {
  type MarketFundingHistoryItem,
  type MarketFundingHistoryStartTime,
  getTextColorClass,
  perpsNumberFormatter,
  useMarketFundingHistory,
} from 'src/lib/perps'
import { TableButton } from '~evm/perps/_ui/_common'
import { useAssetState } from '../trade-widget'

const FUNDING_INTERVALS_PER_YEAR = 24 * 365
const HISTORY_ROW_LIMIT = 5000
const CHART_WIDTH = 320
const CHART_HEIGHT = 112
const CHART_PADDING = 10

const TIMEFRAME_OPTIONS = [
  { label: '24H', value: 'D' },
  { label: '7D', value: 'W' },
  { label: '30D', value: 'M' },
  { label: '3M', value: '3M' },
  { label: '1Y', value: 'Y' },
] as const satisfies readonly {
  label: string
  value: MarketFundingHistoryStartTime
}[]

type FundingPoint = {
  rate: number
  time: number
}

type FundingSummary = {
  averageRate: number
  chartItems: FundingPoint[]
  cumulativeRate: number
  hasData: boolean
  highestRate: number
  latestRate: number
  lowestRate: number
  recentRows: MarketFundingHistoryItem[]
}

export const FundingHistory = ({
  currentFunding1year,
  currentFundingPct,
}: {
  currentFunding1year?: string | null
  currentFundingPct?: string | null
}) => {
  const {
    state: { activeAsset },
  } = useAssetState()
  const [open, setOpen] = useState(false)
  const [timeframe, setTimeframe] = useState<MarketFundingHistoryStartTime>('W')
  const { data, isLoading, isError, refetch } = useMarketFundingHistory({
    assetString: activeAsset,
    enabled: open,
    startTime: timeframe,
  })

  const summary = useMemo(() => getFundingSummary(data ?? []), [data])
  const activeAssetLabel = activeAsset.includes(':')
    ? activeAsset.split(':')[1]
    : activeAsset
  const currentHourlyRate = Number.parseFloat(currentFundingPct ?? '')
  const currentAnnualizedRate = Number.parseFloat(currentFunding1year ?? '')
  const displayedCurrentHourlyRate = Number.isFinite(currentHourlyRate)
    ? currentHourlyRate
    : 0
  const displayedCurrentAnnualizedRate = Number.isFinite(currentAnnualizedRate)
    ? currentAnnualizedRate
    : displayedCurrentHourlyRate * FUNDING_INTERVALS_PER_YEAR
  const currentDirection = getFundingDirection(displayedCurrentHourlyRate)

  return (
    <PerpsDialog open={open} onOpenChange={setOpen}>
      <PerpsDialogTrigger asChild>
        <Button
          variant="perps-secondary"
          className="w-fit text-xs lg:text-sm whitespace-nowrap"
          disabled={!activeAsset}
          size="sm"
        >
          Funding History
        </Button>
      </PerpsDialogTrigger>
      <PerpsDialogContent className="!max-w-5xl">
        <PerpsDialogHeader>
          <PerpsDialogTitle>
            {activeAssetLabel} Funding History
          </PerpsDialogTitle>
          <PerpsDialogDescription className="text-xs text-perps-muted-50">
            Current funding, annualized rate, premium, and historical payer
            side.
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent className="!max-h-[min(720px,calc(100dvh-120px))] overflow-y-auto">
          <div className="flex w-fit rounded-lg border border-accent bg-perps-muted/[0.03] p-0.5 ml-auto mb-2">
            {TIMEFRAME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={classNames(
                  'h-7 min-w-12 rounded-md px-2 text-xs font-medium transition-colors',
                  option.value === timeframe
                    ? 'bg-perps-muted/10 text-perps-muted'
                    : 'text-perps-muted-50 hover:text-perps-muted',
                )}
                onClick={() => setTimeframe(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          {isLoading && !summary.hasData ? (
            <FundingHistorySkeleton />
          ) : isError ? (
            <FundingHistoryError onRetry={() => void refetch()} />
          ) : !summary.hasData ? (
            <EmptyFundingHistory activeAsset={activeAsset} />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                <FundingSummaryItem
                  label="Current hourly"
                  value={formatSignedPercent(displayedCurrentHourlyRate, 4)}
                  caption={`${formatSignedPercent(
                    displayedCurrentAnnualizedRate,
                    4,
                  )} APR`}
                  className={getFundingColorClass(displayedCurrentHourlyRate)}
                />
                <FundingSummaryItem
                  label="Avg hourly"
                  value={formatSignedPercent(summary.averageRate, 4)}
                  caption={`${formatSignedPercent(
                    summary.averageRate * FUNDING_INTERVALS_PER_YEAR,
                    2,
                  )} APR`}
                  className={getFundingColorClass(summary.averageRate)}
                />
                <FundingSummaryItem
                  label="Window total"
                  value={formatSignedPercent(summary.cumulativeRate, 3)}
                  caption={`${summary.chartItems.length} prints`}
                  className={getFundingColorClass(summary.cumulativeRate)}
                />
                <FundingSummaryItem
                  label="Payer"
                  value={currentDirection.payer}
                  caption={currentDirection.caption}
                  className={currentDirection.className}
                />
              </div>

              <FundingRateChart
                highestRate={summary.highestRate}
                items={summary.chartItems}
                latestRate={summary.latestRate}
                lowestRate={summary.lowestRate}
              />

              <FundingHistoryRows
                totalRows={summary.chartItems.length}
                rows={summary.recentRows}
              />
            </div>
          )}
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}

function getFundingSummary(data: MarketFundingHistoryItem[]): FundingSummary {
  const orderedRows = [...data].sort((a, b) => a.time - b.time)
  const chartItems = orderedRows
    .map((item) => ({
      rate: Number.parseFloat(item.fundingRate),
      time: item.time,
    }))
    .filter((item) => Number.isFinite(item.rate))

  const rates = chartItems.map((item) => item.rate)
  const cumulativeRate = rates.reduce((sum, rate) => sum + rate, 0)
  const latestRate = rates[rates.length - 1] ?? 0

  return {
    averageRate: rates.length ? cumulativeRate / rates.length : 0,
    chartItems,
    cumulativeRate,
    hasData: chartItems.length > 0,
    highestRate: rates.length ? Math.max(...rates) : 0,
    latestRate,
    lowestRate: rates.length ? Math.min(...rates) : 0,
    recentRows: [...orderedRows].reverse().slice(0, HISTORY_ROW_LIMIT),
  }
}

function FundingSummaryItem({
  caption,
  className,
  label,
  value,
}: {
  caption: string
  className?: string
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-accent bg-perps-muted/[0.02] p-3">
      <div className="text-xs text-perps-muted-50">{label}</div>
      <div
        className={classNames(
          'mt-1 truncate text-lg font-semibold tabular-nums text-perps-muted',
          className,
        )}
      >
        {value}
      </div>
      <div className="mt-1 truncate text-[11px] text-perps-muted-50">
        {caption}
      </div>
    </div>
  )
}

function FundingRateChart({
  highestRate,
  items,
  latestRate,
  lowestRate,
}: {
  highestRate: number
  items: FundingPoint[]
  latestRate: number
  lowestRate: number
}) {
  const chart = getChartPath(items)
  const firstItem = items[0]
  const lastItem = items[items.length - 1]

  return (
    <div className="rounded-lg border border-accent bg-perps-muted/[0.02] p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-medium text-perps-muted">
            Hourly funding
          </div>
          {firstItem && lastItem ? (
            <div className="text-[11px] text-perps-muted-50">
              {format(firstItem.time, 'MMM d, HH:mm')} -{' '}
              {format(lastItem.time, 'MMM d, HH:mm')}
            </div>
          ) : null}
        </div>
        <div className="grid grid-cols-3 gap-3 text-right text-[11px]">
          <ChartRangeValue label="High" value={highestRate} />
          <ChartRangeValue label="Low" value={lowestRate} />
          <ChartRangeValue label="Latest" value={latestRate} />
        </div>
      </div>

      <svg
        aria-hidden
        className="mt-3 h-28 w-full overflow-visible"
        preserveAspectRatio="none"
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      >
        <line
          className="text-perps-muted-20"
          stroke="currentColor"
          strokeDasharray="4 4"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          x1={CHART_PADDING}
          x2={CHART_WIDTH - CHART_PADDING}
          y1={chart.zeroY}
          y2={chart.zeroY}
        />
        {chart.path ? (
          <path
            className={getFundingColorClass(latestRate)}
            d={chart.path}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
      </svg>
    </div>
  )
}

function ChartRangeValue({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-perps-muted-50">{label}</div>
      <div
        className={classNames(
          'font-medium tabular-nums',
          getFundingColorClass(value),
        )}
      >
        {formatSignedPercent(value, 4)}
      </div>
    </div>
  )
}

function FundingHistoryRows({
  rows,
  totalRows,
}: {
  rows: MarketFundingHistoryItem[]
  totalRows: number
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-accent">
      <div className="flex items-center justify-between border-b border-accent px-3 py-2">
        <div className="text-xs font-medium text-perps-muted">
          Recent prints
        </div>
        <div className="text-[11px] text-perps-muted-50">
          Latest {rows.length} of {totalRows}
        </div>
      </div>
      <div className="max-h-[320px] overflow-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-perps-background text-perps-muted-50">
            <tr className="border-b border-accent">
              <th className="whitespace-nowrap px-3 py-2 font-medium">Time</th>
              <th className="whitespace-nowrap px-3 py-2 text-right font-medium">
                Hourly
              </th>
              <th className="whitespace-nowrap px-3 py-2 text-right font-medium">
                APR
              </th>
              <th className="whitespace-nowrap px-3 py-2 text-right font-medium">
                Premium
              </th>
              <th className="whitespace-nowrap px-3 py-2 text-right font-medium">
                Flow
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rate = Number.parseFloat(row.fundingRate)
              const premium = Number.parseFloat(row.premium)
              const direction = getFundingDirection(rate)

              return (
                <tr
                  key={`${row.time}-${row.fundingRate}-${row.premium}`}
                  className="border-b border-accent last:border-b-0"
                >
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-perps-muted">
                    {format(row.time, 'MMM d, HH:mm')}
                  </td>
                  <td
                    className={classNames(
                      'whitespace-nowrap px-3 py-2 text-right font-medium tabular-nums',
                      getFundingColorClass(rate),
                    )}
                  >
                    {formatSignedPercent(rate, 4)}
                  </td>
                  <td
                    className={classNames(
                      'whitespace-nowrap px-3 py-2 text-right font-medium tabular-nums',
                      getFundingColorClass(rate),
                    )}
                  >
                    {formatSignedPercent(rate * FUNDING_INTERVALS_PER_YEAR, 2)}
                  </td>
                  <td
                    className={classNames(
                      'whitespace-nowrap px-3 py-2 text-right font-medium tabular-nums',
                      getFundingColorClass(premium),
                    )}
                  >
                    {formatSignedNumber(premium, 6)}
                  </td>
                  <td
                    className={classNames(
                      'whitespace-nowrap px-3 py-2 text-right font-medium',
                      direction.className,
                    )}
                  >
                    {direction.label}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FundingHistorySkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBox key={index} className="h-[92px] w-full rounded-lg" />
        ))}
      </div>
      <SkeletonBox className="h-[184px] w-full rounded-lg" />
      <SkeletonBox className="h-[320px] w-full rounded-lg" />
    </div>
  )
}

function FundingHistoryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-lg border border-accent bg-perps-muted/[0.02] p-6 text-center">
      <div>
        <div className="text-sm font-medium text-perps-muted">
          Funding history unavailable
        </div>
        <div className="mt-1 text-xs text-perps-muted-50">
          The market funding feed could not be loaded.
        </div>
      </div>
      <TableButton variant="gradient" className="text-xs" onClick={onRetry}>
        Retry
      </TableButton>
    </div>
  )
}

function EmptyFundingHistory({ activeAsset }: { activeAsset: string }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-accent bg-perps-muted/[0.02] p-6 text-center">
      <div>
        <div className="text-sm font-medium text-perps-muted">
          No funding prints
        </div>
        <div className="mt-1 text-xs text-perps-muted-50">
          {activeAsset} has no funding records in this range.
        </div>
      </div>
    </div>
  )
}

function getChartPath(items: FundingPoint[]): { path: string; zeroY: number } {
  if (items.length < 2) {
    return { path: '', zeroY: CHART_HEIGHT / 2 }
  }

  const rates = items.map((item) => item.rate)
  const minRate = Math.min(0, ...rates)
  const maxRate = Math.max(0, ...rates)
  const range = maxRate - minRate || 1

  function getX(index: number): number {
    return (
      CHART_PADDING +
      (index / (items.length - 1)) * (CHART_WIDTH - CHART_PADDING * 2)
    )
  }

  function getY(rate: number): number {
    return (
      CHART_HEIGHT -
      CHART_PADDING -
      ((rate - minRate) / range) * (CHART_HEIGHT - CHART_PADDING * 2)
    )
  }

  const path = items
    .map((item, index) => {
      const command = index === 0 ? 'M' : 'L'
      return `${command} ${getX(index).toFixed(2)} ${getY(item.rate).toFixed(
        2,
      )}`
    })
    .join(' ')

  return { path, zeroY: getY(0) }
}

function getFundingDirection(rate: number): {
  caption: string
  className: string
  label: string
  payer: string
} {
  if (rate > 0) {
    return {
      caption: 'Shorts receive',
      className: getTextColorClass(1),
      label: 'Longs pay',
      payer: 'Longs',
    }
  }

  if (rate < 0) {
    return {
      caption: 'Longs receive',
      className: getTextColorClass(-1),
      label: 'Shorts pay',
      payer: 'Shorts',
    }
  }

  return {
    caption: 'No transfer',
    className: 'text-perps-muted-50',
    label: 'Flat',
    payer: 'Flat',
  }
}

function getFundingColorClass(value: number): string {
  if (value > 0) return getTextColorClass(1)
  if (value < 0) return getTextColorClass(-1)
  return 'text-perps-muted'
}

function formatSignedPercent(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return '0.00%'

  const sign = value > 0 ? '+' : ''
  return `${sign}${(value * 100).toFixed(decimals)}%`
}

function formatSignedNumber(value: number, maxFraxDigits: number): string {
  if (!Number.isFinite(value)) return '0'

  const sign = value > 0 ? '+' : ''
  return `${sign}${perpsNumberFormatter({
    maxFraxDigits,
    value,
  })}`
}
