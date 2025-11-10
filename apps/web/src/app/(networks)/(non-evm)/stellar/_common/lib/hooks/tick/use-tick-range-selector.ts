'use client'

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  DEFAULT_TICK_RANGE,
  TICK_SPACINGS,
  alignTick,
  clampTickRange,
  isTickAligned,
} from '~stellar/_common/lib/utils/ticks'
import { calculateTickFromPrice } from '../../soroban/pool-helpers'

export type TickRangeSelectorState = {
  currentTick: number
  tickLower: number
  tickUpper: number
  ticksAligned: boolean
  tickSpacing: number
  isTickRangeValid: boolean
  defaultLower: number
  defaultUpper: number
  setTickLower: Dispatch<SetStateAction<number>>
  setTickUpper: Dispatch<SetStateAction<number>>
}

export const useTickRangeSelector = (
  fee: number,
  currentPrice: number,
): TickRangeSelectorState => {
  const tickSpacing = useMemo(() => {
    return TICK_SPACINGS[fee] ?? TICK_SPACINGS[3000]
  }, [fee])

  const currentTick = alignTick(
    calculateTickFromPrice(currentPrice),
    tickSpacing,
  )

  const defaultLower = useMemo(
    () => alignTick(DEFAULT_TICK_RANGE.lower + currentTick, tickSpacing),
    [tickSpacing, currentTick],
  )
  const defaultUpper = useMemo(
    () => alignTick(DEFAULT_TICK_RANGE.upper + currentTick, tickSpacing),
    [tickSpacing, currentTick],
  )

  const [tickLower, setTickLower] = useState<number>(() => defaultLower)
  const [tickUpper, setTickUpper] = useState<number>(() => defaultUpper)
  const [ticksAligned, setTicksAligned] = useState<boolean>(true)

  useEffect(() => {
    setTickLower((prev) => alignTick(prev, tickSpacing))
    setTickUpper((prev) => alignTick(prev, tickSpacing))
  }, [tickSpacing])

  useEffect(() => {
    const lowerAligned = isTickAligned(tickLower, tickSpacing)
    const upperAligned = isTickAligned(tickUpper, tickSpacing)
    setTicksAligned(lowerAligned && upperAligned)
  }, [tickLower, tickUpper, tickSpacing])

  // Prevent adding liquidity when price is above range (can't provide token0)
  const isTickRangeValid = tickLower < tickUpper && ticksAligned

  return {
    currentTick,
    tickLower,
    tickUpper,
    ticksAligned,
    tickSpacing,
    isTickRangeValid,
    defaultLower,
    defaultUpper,
    setTickLower,
    setTickUpper,
  }
}
