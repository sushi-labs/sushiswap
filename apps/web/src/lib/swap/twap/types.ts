import { TimeUnit } from '@orbs-network/twap-sdk'

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
