'use client'

import {
  ArrowTrendingUpIcon,
  FireIcon,
  SparklesIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline'
import { classNames } from '@sushiswap/ui'
import { useState } from 'react'
import {
  LAUNCHPAD_FEED_WINDOWS,
  type LaunchpadFeed,
  getLaunchpadFeed,
  getLaunchpadFeedSortField,
  getLaunchpadFeedWindow,
  isWindowedLaunchpadFeed,
} from '../_lib/launchpad-feed'
import type { LaunchpadTokenSortField } from '../types'
import {
  SEGMENTED_GROUP,
  SEGMENTED_ITEM,
  SEGMENTED_ITEM_ACCENT,
  SEGMENTED_ITEM_IDLE,
  SEGMENTED_ITEM_SELECTED,
} from './segmented-control'

const FEEDS = [
  { value: 'HOT', label: 'Hot', icon: FireIcon },
  { value: 'NEW', label: 'New', icon: SparklesIcon },
  { value: 'CLIMBING', label: 'Climbing', icon: ArrowTrendingUpIcon },
  { value: 'TOP', label: 'Top', icon: TrophyIcon },
] as const satisfies readonly {
  value: LaunchpadFeed
  label: string
  icon: typeof FireIcon
}[]

export function TokenSortControls({
  sortBy,
  onSortByChange,
  ariaLabel = 'Launch feeds',
}: {
  sortBy: LaunchpadTokenSortField
  onSortByChange: (sortBy: LaunchpadTokenSortField) => void
  ariaLabel?: string
}) {
  const feed = getLaunchpadFeed(sortBy)
  const windowed = isWindowedLaunchpadFeed(feed)

  // New and Top carry no window, so the chosen one has to be remembered while
  // they're active — otherwise a detour through Top silently resets Hot to 1H.
  const sortWindow = getLaunchpadFeedWindow(sortBy)
  const [lastWindow, setLastWindow] = useState(sortWindow)
  if (windowed && lastWindow !== sortWindow) setLastWindow(sortWindow)
  const activeWindow = windowed ? sortWindow : lastWindow

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={classNames(
          SEGMENTED_GROUP,
          'justify-between sm:justify-start',
        )}
      >
        {FEEDS.map((option) => {
          const selected = option.value === feed
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() =>
                onSortByChange(
                  getLaunchpadFeedSortField(option.value, activeWindow),
                )
              }
              className={classNames(
                SEGMENTED_ITEM,
                'w-full sm:w-auto',
                selected ? SEGMENTED_ITEM_ACCENT : SEGMENTED_ITEM_IDLE,
              )}
            >
              <option.icon className="h-4 w-4 shrink-0" aria-hidden />
              {option.label}
            </button>
          )
        })}
      </div>
      <div
        role="radiogroup"
        aria-label="Time window"
        aria-disabled={!windowed}
        className={classNames(
          SEGMENTED_GROUP,
          'justify-between transition-opacity sm:justify-start',
          !windowed && 'opacity-40',
        )}
      >
        {LAUNCHPAD_FEED_WINDOWS.map((option) => {
          const selected = option === activeWindow
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={!windowed}
              onClick={() => {
                setLastWindow(option)
                onSortByChange(getLaunchpadFeedSortField(feed, option))
              }}
              className={classNames(
                SEGMENTED_ITEM,
                'w-full min-w-10 px-2 text-xs tabular-nums sm:w-auto',
                selected ? SEGMENTED_ITEM_SELECTED : SEGMENTED_ITEM_IDLE,
              )}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
