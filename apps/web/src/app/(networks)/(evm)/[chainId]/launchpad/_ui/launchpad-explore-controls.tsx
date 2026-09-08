'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { TextField, classNames } from '@sushiswap/ui'
import type { ReactElement } from 'react'
import type { LaunchpadProviderFilter } from '../_lib/launchpad-provider'
import type { LaunchpadTokenSortField } from '../types'
import { LaunchpadProviderMark } from './launchpad-provider-mark'
import { DEFAULT_LAUNCHPAD_TOKEN_SORT } from './token-sort-controls'

const CONTROL_CLASS =
  'flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-perps-blue disabled:cursor-not-allowed sm:text-base'
const SELECTED_CLASS = 'border-perps-blue bg-[#1E2F50] text-white'
const IDLE_CLASS =
  'border-white/[0.07] bg-white/[0.015] text-perps-muted-50 hover:bg-white/[0.04] hover:text-white'

const SORT_OPTIONS = [
  { label: 'Trending', value: 'TRENDING', comingSoon: true },
  { label: 'New', value: 'CREATED_AT', comingSoon: false },
  { label: 'Stock Pairs', value: 'STOCK_PAIRS', comingSoon: true },
  { label: 'Market Cap', value: 'MARKET_CAPITALIZATION', comingSoon: false },
  { label: 'Volume', value: 'VOLUME_24H', comingSoon: false },
] as const

const PERIOD_OPTIONS = [
  { label: '1H', value: 'VOLUME_1H' },
  { label: '6H', value: 'VOLUME_6H' },
  { label: '12H', value: 'VOLUME_12H' },
  { label: '24H', value: 'VOLUME_24H' },
] as const

const PROVIDER_OPTIONS = [
  { label: 'All', value: 'all', provider: undefined },
  { label: 'Sushi Launch', value: 'sushi', provider: 'SUSHI_V1' },
  { label: 'pools.fun', value: 'pools-fun', provider: 'POOLS_FUN_V1' },
] as const

export function LaunchpadExploreControls({
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
  providerFilter,
  onProviderFilterChange,
  view,
  onViewChange,
  disabled = false,
}: {
  search: string
  onSearchChange: (search: string) => void
  sortBy: LaunchpadTokenSortField
  onSortByChange: (sortBy: LaunchpadTokenSortField) => void
  providerFilter: LaunchpadProviderFilter
  onProviderFilterChange: (filter: LaunchpadProviderFilter) => void
  view: 'grid' | 'table'
  onViewChange: (view: 'grid' | 'table') => void
  disabled?: boolean
}): ReactElement {
  const isVolume = sortBy.startsWith('VOLUME_')
  const volumePeriod = isVolume ? sortBy : 'VOLUME_24H'

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-perps-muted">
            Explore
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#6B7280] sm:text-base">
            Tokens currently launching on Sushi Launch &amp; pools.fun
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:max-w-[250px] sm:justify-end lg:max-w-none">
          <div
            role="group"
            aria-label="Volume period"
            className="flex flex-1 items-center justify-between gap-1 sm:flex-none border-white/[0.12] border p-1 rounded-xl"
          >
            {PERIOD_OPTIONS.map((period) => (
              <button
                key={period.value}
                type="button"
                aria-pressed={volumePeriod === period.value}
                disabled={disabled}
                onClick={() => onSortByChange(period.value)}
                className={classNames(
                  CONTROL_CLASS,
                  '!px-3 sm:!px-4',
                  volumePeriod === period.value
                    ? SELECTED_CLASS
                    : 'border-transparent text-[#6B7280] hover:text-white',
                )}
              >
                {period.label}
              </button>
            ))}
          </div>
          <div
            role="group"
            aria-label="Token view"
            className="ml-auto flex items-center gap-1.5 sm:ml-5 border-white/[0.12] border p-1 rounded-xl"
          >
            {(['grid', 'table'] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={view === option}
                disabled={disabled}
                onClick={() => onViewChange(option)}
                className={classNames(
                  CONTROL_CLASS,
                  view === option
                    ? SELECTED_CLASS
                    : ' text-white hover:bg-white/[0.04] border-transparent',
                )}
              >
                {option === 'grid' ? 'Grid' : 'Table'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <TextField
          disabled={disabled}
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          icon={MagnifyingGlassIcon}
          iconProps={{ className: 'text-[#6B7280]' }}
          placeholder="Search tokens, symbols, or addresses"
          aria-label="Search launches"
          className="!h-11 !rounded-xl !border !border-white/[0.07] !bg-[#101116] !font-normal !text-perps-muted placeholder:!text-[#6B7280]"
          wrapperClassName="order-1 w-full min-w-0 md:w-auto md:flex-[1_1_14rem]"
        />
        <div className="order-2 grid w-full min-w-0 grid-cols-3 items-center gap-0.5 rounded-xl border border-white/[0.07] bg-white/[0.015] p-1 sm:flex sm:gap-0 md:order-3 xl:order-2 sm:w-fit xl:shrink-0">
          <div
            role="group"
            aria-label="Sort launches by"
            className="contents sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:gap-0.5 sm:overflow-x-auto sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden"
          >
            {SORT_OPTIONS.map((option) => {
              const selected =
                option.value === sortBy ||
                (option.value === 'VOLUME_24H' && isVolume)
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  disabled={disabled || option.comingSoon}
                  title={
                    option.comingSoon
                      ? `${option.label} is coming soon`
                      : undefined
                  }
                  onClick={() => {
                    if (!option.comingSoon) onSortByChange(option.value)
                  }}
                  className={classNames(
                    'h-9 shrink-0 whitespace-nowrap rounded-lg px-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-perps-blue disabled:cursor-not-allowed sm:px-3 sm:text-base min-[1440px]:px-4',
                    selected
                      ? 'bg-gradient-to-br from-[#24446E] to-[#249DDD] text-white'
                      : 'text-perps-muted-50 enabled:hover:bg-white/[0.04] enabled:hover:text-white',
                  )}
                >
                  {option.label}
                </button>
              )
            })}
            {sortBy === 'CURRENT_TVL' && (
              <button
                type="button"
                aria-pressed="true"
                disabled={disabled}
                className="h-9 shrink-0 rounded-lg bg-gradient-to-br from-[#24446E] to-[#249DDD] px-3 text-sm font-medium text-white"
              >
                Liquidity
              </button>
            )}
          </div>
        </div>

        <div
          role="group"
          aria-label="Filter launches by provider"
          className="order-3 flex w-full min-w-0 flex-wrap items-center gap-1.5 sm:flex-nowrap md:order-2 md:w-auto md:shrink-0 xl:order-3"
        >
          {PROVIDER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={providerFilter === option.value}
              disabled={disabled}
              onClick={() => onProviderFilterChange(option.value)}
              className={classNames(
                CONTROL_CLASS,
                'flex-1 !px-2 sm:flex-none sm:!px-4',
                providerFilter === option.value ? SELECTED_CLASS : IDLE_CLASS,
              )}
            >
              {option.provider && (
                <LaunchpadProviderMark
                  provider={option.provider}
                  size="sm"
                  className={
                    option.provider === 'SUSHI_V1'
                      ? 'grayscale'
                      : '!bg-transparent'
                  }
                />
              )}
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function noop() {}

export function LaunchpadExploreControlsSkeleton(): ReactElement {
  return (
    <LaunchpadExploreControls
      disabled
      search=""
      onSearchChange={noop}
      sortBy={DEFAULT_LAUNCHPAD_TOKEN_SORT}
      onSortByChange={noop}
      providerFilter="all"
      onProviderFilterChange={noop}
      view="grid"
      onViewChange={noop}
    />
  )
}
