import type { PerpsPointsSeason } from '@sushiswap/graph-client/data-api'

// TODO: Get from DB once season timing is available there.
export const PERPS_LEADERBOARD_SEASON_1_END_DATE = new Date(
  '2026-07-31T23:59:59Z',
)

export const PERPS_LEADERBOARD_SEASON_2_START_DATE = new Date(
  '2026-08-01T00:00:00Z',
)

export const PERPS_LEADERBOARD_SEASON_2_END_DATE = new Date(
  '2026-11-01T23:59:59Z',
)

export const SEASON_1_CLAIM_WINDOW_END_DATE = new Date(
  PERPS_LEADERBOARD_SEASON_1_END_DATE.getTime() + 30 * 24 * 60 * 60 * 1000,
)

export const getCurrentSeason = (): PerpsPointsSeason => {
  const now = new Date()
  const nowTime = now.getTime()

  if (nowTime < PERPS_LEADERBOARD_SEASON_1_END_DATE.getTime()) {
    return 'SEASON_1'
  }

  if (nowTime < PERPS_LEADERBOARD_SEASON_2_START_DATE.getTime()) {
    return 'SEASON_2'
  }

  if (nowTime < PERPS_LEADERBOARD_SEASON_2_END_DATE.getTime()) {
    return 'SEASON_2'
  }

  return 'SEASON_2'
}
export const getSeasonText = () => {
  const now = new Date()
  const nowTime = now.getTime()

  if (nowTime < PERPS_LEADERBOARD_SEASON_1_END_DATE.getTime()) {
    return 'Season 1'
  }

  if (nowTime < PERPS_LEADERBOARD_SEASON_2_START_DATE.getTime()) {
    return 'Season 2'
  }

  if (nowTime < PERPS_LEADERBOARD_SEASON_2_END_DATE.getTime()) {
    return 'Season 2'
  }

  return 'Season 2'
}

export const isSeason1ClaimWindow = () => {
  const now = new Date()
  const nowTime = now.getTime()
  //30 days after season 1 ends
  return (
    nowTime >= PERPS_LEADERBOARD_SEASON_1_END_DATE.getTime() &&
    nowTime <= SEASON_1_CLAIM_WINDOW_END_DATE.getTime()
  )
}
