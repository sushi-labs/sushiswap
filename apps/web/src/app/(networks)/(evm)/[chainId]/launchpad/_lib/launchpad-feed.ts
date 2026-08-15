import type { LaunchpadTokenSortField } from '../types'

/**
 * A feed is a named way to browse launches. It maps onto exactly one
 * `LaunchpadTokenSortField` — sorting drives the cursor pagination, so the
 * feed a user picks has to be something the API can order by on its own.
 */
export type LaunchpadFeed = 'HOT' | 'NEW' | 'CLIMBING' | 'TOP'

export type LaunchpadFeedWindow = '1H' | '6H' | '12H' | '24H'

export const LAUNCHPAD_FEED_WINDOWS = [
  '1H',
  '6H',
  '12H',
  '24H',
] as const satisfies readonly LaunchpadFeedWindow[]

const WINDOWED_FEED_SORT_FIELDS = {
  HOT: {
    '1H': 'VOLUME_1H',
    '6H': 'VOLUME_6H',
    '12H': 'VOLUME_12H',
    '24H': 'VOLUME_24H',
  },
  CLIMBING: {
    '1H': 'TVL_CHANGE_1H',
    '6H': 'TVL_CHANGE_6H',
    '12H': 'TVL_CHANGE_12H',
    '24H': 'TVL_CHANGE_24H',
  },
} as const satisfies Record<
  'HOT' | 'CLIMBING',
  Record<LaunchpadFeedWindow, LaunchpadTokenSortField>
>

const FIXED_FEED_SORT_FIELDS = {
  NEW: 'CREATED_AT',
  TOP: 'MARKET_CAPITALIZATION',
} as const satisfies Record<'NEW' | 'TOP', LaunchpadTokenSortField>

/**
 * Every field the API accepts, not just the ones a pill can reach. `CURRENT_TVL`
 * and the 12H windows predate the feeds and still arrive in shared links and
 * embeds, so they have to keep resolving.
 */
const SORT_FIELDS = new Set<LaunchpadTokenSortField>([
  'CREATED_AT',
  'MARKET_CAPITALIZATION',
  'CURRENT_TVL',
  'VOLUME_1H',
  'VOLUME_6H',
  'VOLUME_12H',
  'VOLUME_24H',
  'TVL_CHANGE_1H',
  'TVL_CHANGE_6H',
  'TVL_CHANGE_12H',
  'TVL_CHANGE_24H',
])

export const DEFAULT_LAUNCHPAD_TOKEN_SORT = 'VOLUME_1H' as const

export function parseLaunchpadTokenSortField(
  value: string | null,
): LaunchpadTokenSortField {
  const requestedSort = value as LaunchpadTokenSortField
  return SORT_FIELDS.has(requestedSort)
    ? requestedSort
    : DEFAULT_LAUNCHPAD_TOKEN_SORT
}

export function getLaunchpadFeed(
  sortBy: LaunchpadTokenSortField,
): LaunchpadFeed {
  if (sortBy.startsWith('VOLUME_')) return 'HOT'
  if (sortBy.startsWith('TVL_CHANGE_')) return 'CLIMBING'
  if (sortBy === 'CREATED_AT') return 'NEW'
  return 'TOP'
}

export function isWindowedLaunchpadFeed(
  feed: LaunchpadFeed,
): feed is 'HOT' | 'CLIMBING' {
  return feed === 'HOT' || feed === 'CLIMBING'
}

export function getLaunchpadFeedWindow(
  sortBy: LaunchpadTokenSortField,
): LaunchpadFeedWindow {
  const suffix = sortBy.split('_').at(-1) as LaunchpadFeedWindow
  return LAUNCHPAD_FEED_WINDOWS.includes(suffix) ? suffix : '1H'
}

export function getLaunchpadFeedSortField(
  feed: LaunchpadFeed,
  window: LaunchpadFeedWindow,
): LaunchpadTokenSortField {
  return isWindowedLaunchpadFeed(feed)
    ? WINDOWED_FEED_SORT_FIELDS[feed][window]
    : FIXED_FEED_SORT_FIELDS[feed]
}
