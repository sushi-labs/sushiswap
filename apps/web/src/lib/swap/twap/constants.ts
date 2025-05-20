import { type TimeDuration, TimeUnit } from '@orbs-network/twap-sdk'
import ms from 'ms'

export const TwapExpiryTimeDurations = {
  Day: {
    unit: TimeUnit.Days,
    value: 1,
  },
  Week: {
    unit: TimeUnit.Weeks,
    value: 1,
  },
  Month: {
    unit: TimeUnit.Months,
    value: 1,
  },
  Year: {
    unit: TimeUnit.Years,
    value: 1,
  },
} as const

export const TWAP_MIN_FILL_DELAY_MS = ms('5m') // 5 * 60 * 1000
export const TWAP_MIN_FILL_DELAY = {
  value: 5,
  unit: TimeUnit.Minutes,
} as const satisfies TimeDuration

export const TWAP_MAX_FILL_DELAY_MS = ms('365d') // 365 * 24 * 60 * 60 * 1000;
export const TWAP_MAX_FILL_DELAY = {
  value: 365,
  unit: TimeUnit.Days,
} as const satisfies TimeDuration

export const TWAP_MIN_DURATION_MS = ms('5m') // 5 * 60 * 1000
export const TWAP_MIN_DURATION = {
  value: 5,
  unit: TimeUnit.Minutes,
} as const satisfies TimeDuration

export const TWAP_MAX_DURATION_MS = ms('365d') //365 * 24 * 60 * 60 * 1000
export const TWAP_MAX_DURATION = {
  value: 365,
  unit: TimeUnit.Days,
} as const satisfies TimeDuration
