import type { TimeDuration } from '@orbs-network/twap-sdk'
import {
  TWAP_MAX_DURATION_MS,
  TWAP_MAX_FILL_DELAY_MS,
  TWAP_MIN_DURATION_MS,
  TWAP_MIN_FILL_DELAY_MS,
} from './constants'
import { getTimeDurationMs } from './utils'

export const getPartialFillWarning = (
  duration: TimeDuration,
  fillDelay: TimeDuration,
  chunks = 1,
) => {
  const durationMillis = getTimeDurationMs(duration)
  const fillDelayUiMillis = getTimeDurationMs(fillDelay)
  return chunks * fillDelayUiMillis > durationMillis
}

export const getMinFillDelayWarning = (fillDelay: TimeDuration) => {
  return getTimeDurationMs(fillDelay) < TWAP_MIN_FILL_DELAY_MS
}

export const getMaxFillDelayWarning = (fillDelay: TimeDuration) => {
  return getTimeDurationMs(fillDelay) > TWAP_MAX_FILL_DELAY_MS
}

export const getMinTradeDurationWarning = (duration: TimeDuration) => {
  return getTimeDurationMs(duration) < TWAP_MIN_DURATION_MS
}

export const getMaxTradeDurationWarning = (duration: TimeDuration) => {
  return getTimeDurationMs(duration) > TWAP_MAX_DURATION_MS
}

export const getTradeSizeWarning = (
  minChunkSizeUsd: number,
  srcChunkAmountUsd?: string | number,
  chunks = 1,
) => {
  if (BigInt(srcChunkAmountUsd || 0) === 0n) return
  const minTradeSizeUsd = BigInt(minChunkSizeUsd)

  return chunks === 0 || BigInt(srcChunkAmountUsd || 0) < minTradeSizeUsd
}
