import { type TimeDuration, TimeUnit } from '@orbs-network/spot-react'

export { TWAP_SUPPORTED_CHAIN_IDS } from './supported-chain-ids'

export const TWAP_MIN_FILL_DELAY = {
  value: 5,
  unit: TimeUnit.Minutes,
} as const satisfies TimeDuration

export const TWAP_MAX_FILL_DELAY = {
  value: 365,
  unit: TimeUnit.Days,
} as const satisfies TimeDuration

export const ORBS_EXPLORER_URL = 'https://orbs-explorer.vercel.app'

// Minimum per-trade (chunk) size in USD. Currently uniform across all
// supported chains.
export const TWAP_MIN_CHUNK_SIZE_USD = 5
