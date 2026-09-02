'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  classNames,
} from '@sushiswap/ui'
import type { LaunchpadTokenSortField } from '../types'

type SortMetric =
  | 'VOLUME'
  | 'MARKET_CAPITALIZATION'
  | 'CURRENT_TVL'
  | 'CREATED_AT'
type VolumePeriod = '1H' | '6H' | '12H' | '24H'

const SORT_METRICS: Array<{ value: SortMetric; label: string }> = [
  { value: 'VOLUME', label: 'Volume' },
  { value: 'MARKET_CAPITALIZATION', label: 'Marketcap' },
  { value: 'CURRENT_TVL', label: 'Liquidity' },
  { value: 'CREATED_AT', label: 'Newest' },
]

const VOLUME_PERIODS: VolumePeriod[] = ['1H', '6H', '12H', '24H']

const VOLUME_SORT_FIELDS = {
  '1H': 'VOLUME_1H',
  '6H': 'VOLUME_6H',
  '12H': 'VOLUME_12H',
  '24H': 'VOLUME_24H',
} as const satisfies Record<VolumePeriod, LaunchpadTokenSortField>

const SORT_FIELDS = new Set<LaunchpadTokenSortField>([
  ...Object.values(VOLUME_SORT_FIELDS),
  'MARKET_CAPITALIZATION',
  'CURRENT_TVL',
  'CREATED_AT',
])

export const DEFAULT_LAUNCHPAD_TOKEN_SORT = 'MARKET_CAPITALIZATION' as const

export function parseLaunchpadTokenSortField(
  value: string | null,
): LaunchpadTokenSortField {
  const requestedSort = value as LaunchpadTokenSortField
  return SORT_FIELDS.has(requestedSort)
    ? requestedSort
    : DEFAULT_LAUNCHPAD_TOKEN_SORT
}

function getSortMetric(sortBy: LaunchpadTokenSortField): SortMetric {
  if (
    sortBy === 'MARKET_CAPITALIZATION' ||
    sortBy === 'CURRENT_TVL' ||
    sortBy === 'CREATED_AT'
  ) {
    return sortBy
  }
  return 'VOLUME'
}

function getVolumePeriod(sortBy: LaunchpadTokenSortField): VolumePeriod {
  const period = VOLUME_PERIODS.find(
    (candidate) => VOLUME_SORT_FIELDS[candidate] === sortBy,
  )
  return period ?? '24H'
}

export function TokenSortControls({
  sortBy,
  onSortByChange,
  ariaLabel = 'Sort launches by',
  disabled = false,
}: {
  sortBy: LaunchpadTokenSortField
  onSortByChange: (sortBy: LaunchpadTokenSortField) => void
  ariaLabel?: string
  disabled?: boolean
}) {
  const sortMetric = getSortMetric(sortBy)
  const volumePeriod = getVolumePeriod(sortBy)
  const sortMetricLabel = SORT_METRICS.find(
    (option) => option.value === sortMetric,
  )?.label

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Select
        disabled={disabled}
        value={sortMetric}
        onValueChange={(value) => {
          const metric = value as SortMetric
          onSortByChange(
            metric === 'VOLUME' ? VOLUME_SORT_FIELDS[volumePeriod] : metric,
          )
        }}
      >
        <SelectTrigger
          aria-label={ariaLabel}
          className="w-full !border !border-white/[0.06] !bg-white/[0.04] !text-perps-muted focus:!border-perps-blue md:w-[150px]"
        >
          <SelectValue>{sortMetricLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent className="!bg-black/10 backdrop-blur-2xl">
          {SORT_METRICS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div
        role="radiogroup"
        aria-label="Volume period"
        aria-disabled={disabled || sortMetric !== 'VOLUME'}
        className={classNames(
          'flex h-10 shrink-0 items-center rounded-lg border border-white/[0.06] bg-white/[0.04] p-1 transition-opacity justify-between md:justify-start',
          sortMetric !== 'VOLUME' && 'opacity-40',
        )}
      >
        {VOLUME_PERIODS.map((period) => {
          const selected = sortMetric === 'VOLUME' && volumePeriod === period
          return (
            <button
              key={period}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled || sortMetric !== 'VOLUME'}
              onClick={() => onSortByChange(VOLUME_SORT_FIELDS[period])}
              className={classNames(
                'h-8 min-w-10 w-full rounded-md px-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-perps-blue/50 disabled:cursor-not-allowed',
                selected
                  ? 'bg-white/[0.09] text-perps-muted shadow-sm'
                  : 'text-perps-muted-50 hover:text-perps-muted disabled:hover:text-perps-muted-50',
              )}
            >
              {period}
            </button>
          )
        })}
      </div>
    </div>
  )
}
