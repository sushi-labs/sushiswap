import { describe, expect, it } from 'vitest'
import {
  DEFAULT_LAUNCHPAD_TOKEN_SORT,
  getLaunchpadFeed,
  getLaunchpadFeedSortField,
  getLaunchpadFeedWindow,
  isWindowedLaunchpadFeed,
  parseLaunchpadTokenSortField,
} from './launchpad-feed'

describe('launchpad feeds', () => {
  it('opens on the hot feed', () => {
    expect(DEFAULT_LAUNCHPAD_TOKEN_SORT).toBe('VOLUME_1H')
    expect(getLaunchpadFeed(DEFAULT_LAUNCHPAD_TOKEN_SORT)).toBe('HOT')
  })

  it('derives the feed and window from the sort field alone', () => {
    expect(getLaunchpadFeed('VOLUME_6H')).toBe('HOT')
    expect(getLaunchpadFeed('CREATED_AT')).toBe('NEW')
    expect(getLaunchpadFeed('TVL_CHANGE_24H')).toBe('CLIMBING')
    expect(getLaunchpadFeed('MARKET_CAPITALIZATION')).toBe('TOP')

    expect(getLaunchpadFeedWindow('VOLUME_6H')).toBe('6H')
    expect(getLaunchpadFeedWindow('TVL_CHANGE_12H')).toBe('12H')
  })

  it('keeps the pre-feed sort fields resolving', () => {
    // Shared links and embeds still carry these, so they have to land on a feed
    // rather than silently falling back to the default.
    expect(parseLaunchpadTokenSortField('CURRENT_TVL')).toBe('CURRENT_TVL')
    expect(getLaunchpadFeed('CURRENT_TVL')).toBe('TOP')
    expect(parseLaunchpadTokenSortField('VOLUME_12H')).toBe('VOLUME_12H')
    expect(getLaunchpadFeed('VOLUME_12H')).toBe('HOT')

    expect(parseLaunchpadTokenSortField('NONSENSE')).toBe(
      DEFAULT_LAUNCHPAD_TOKEN_SORT,
    )
    expect(parseLaunchpadTokenSortField(null)).toBe(
      DEFAULT_LAUNCHPAD_TOKEN_SORT,
    )
  })

  it('falls back to a real window for the windowless feeds', () => {
    expect(getLaunchpadFeedWindow('MARKET_CAPITALIZATION')).toBe('1H')
    expect(getLaunchpadFeedWindow('CREATED_AT')).toBe('1H')
    expect(getLaunchpadFeedWindow('CURRENT_TVL')).toBe('1H')
  })

  it('maps a feed and window back to a sort field', () => {
    expect(getLaunchpadFeedSortField('HOT', '24H')).toBe('VOLUME_24H')
    expect(getLaunchpadFeedSortField('CLIMBING', '1H')).toBe('TVL_CHANGE_1H')
    // the window is irrelevant to the feeds that have none
    expect(getLaunchpadFeedSortField('NEW', '6H')).toBe('CREATED_AT')
    expect(getLaunchpadFeedSortField('TOP', '6H')).toBe('MARKET_CAPITALIZATION')

    expect(isWindowedLaunchpadFeed('HOT')).toBe(true)
    expect(isWindowedLaunchpadFeed('TOP')).toBe(false)
  })
})
