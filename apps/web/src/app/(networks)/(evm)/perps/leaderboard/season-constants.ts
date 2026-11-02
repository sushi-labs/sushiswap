import type { PerpsPointsSeason } from '@sushiswap/graph-client/data-api'

export const PERPS_POINTS_SEASONS = [
  'SEASON_1',
  'SEASON_2',
  'SEASON_3',
] as const

export const PERPS_LEADERBOARD_SEASON_1_END_DATE = new Date(
  '2026-07-31T23:59:59Z',
)

export const PERPS_LEADERBOARD_SEASON_2_START_DATE = new Date(
  '2026-08-01T00:00:00Z',
)

export const PERPS_LEADERBOARD_SEASON_2_END_DATE = new Date(
  '2026-11-01T23:59:59Z',
)

export const PERPS_LEADERBOARD_SEASON_3_START_DATE = new Date(
  '2026-11-02T00:00:00Z',
)
export const PERPS_LEADERBOARD_SEASON_3_END_DATE = new Date(
  '2027-02-02T23:59:59Z',
)

export const SEASON_1_CLAIM_WINDOW_END_DATE = new Date(
  PERPS_LEADERBOARD_SEASON_1_END_DATE.getTime() + 30 * 24 * 60 * 60 * 1000,
)

export function getCurrentSeason(): PerpsPointsSeason {
  const nowTime = Date.now()

  if (nowTime < PERPS_LEADERBOARD_SEASON_2_START_DATE.getTime()) {
    return 'SEASON_1'
  }

  if (nowTime < PERPS_LEADERBOARD_SEASON_3_START_DATE.getTime()) {
    return 'SEASON_2'
  }

  return 'SEASON_3'
}

export function getSeasonText(
  season: PerpsPointsSeason = getCurrentSeason(),
): string {
  return season.replace('SEASON_', 'Season ')
}
