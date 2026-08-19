'use client'

import { classNames } from '@sushiswap/ui'
import {
  LAUNCHPAD_PROVIDER_FILTERS,
  type LaunchpadProviderFilter,
  getLaunchpadProvidersForFilter,
} from '../_lib/launchpad-provider'
import { LaunchpadProviderMark } from './launchpad-provider-mark'
import {
  SEGMENTED_GROUP,
  SEGMENTED_ITEM,
  SEGMENTED_ITEM_IDLE,
  SEGMENTED_ITEM_SELECTED,
} from './segmented-control'

export function ProviderFilterControls({
  filter,
  onFilterChange,
}: {
  filter: LaunchpadProviderFilter
  onFilterChange: (filter: LaunchpadProviderFilter) => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Filter launches by provider"
      className={classNames(
        SEGMENTED_GROUP,
        'justify-between sm:justify-start',
      )}
    >
      {LAUNCHPAD_PROVIDER_FILTERS.map((option) => {
        const selected = option.value === filter
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onFilterChange(option.value)}
            className={classNames(
              SEGMENTED_ITEM,
              'w-full sm:w-auto',
              selected ? SEGMENTED_ITEM_SELECTED : SEGMENTED_ITEM_IDLE,
            )}
          >
            <span className="flex items-center" aria-hidden>
              {getLaunchpadProvidersForFilter(option.value).map(
                (provider, index) => (
                  <LaunchpadProviderMark
                    key={provider}
                    provider={provider}
                    size="sm"
                    className={classNames(
                      'transition-opacity',
                      index > 0 &&
                        '-ml-1.5 rounded-full ring-2 ring-perps-background bg-perps-background',
                      !selected && 'opacity-60',
                    )}
                  />
                ),
              )}
            </span>
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
