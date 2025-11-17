'use client'

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  DEFAULT_TICK_RANGE,
  TICK_SPACINGS,
  alignTick,
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
  isDynamic: boolean
  setIsDynamic: Dispatch<SetStateAction<boolean>>
  applyPresetRange: (lower: number, upper: number) => void
  dynamicOffsets: { lower: number; upper: number } | null
}

export const useTickRangeSelector = (
  fee: number,
  currentPrice: number,
): TickRangeSelectorState => {
  const tickSpacing = useMemo(() => {
    return TICK_SPACINGS[fee] ?? TICK_SPACINGS[3000]
  }, [fee])

  const currentTick = useMemo(
    () => alignTick(calculateTickFromPrice(currentPrice), tickSpacing),
    [currentPrice, tickSpacing],
  )

  const defaultLower = useMemo(
    () => alignTick(DEFAULT_TICK_RANGE.lower + currentTick, tickSpacing),
    [tickSpacing, currentTick],
  )
  const defaultUpper = useMemo(
    () => alignTick(DEFAULT_TICK_RANGE.upper + currentTick, tickSpacing),
    [tickSpacing, currentTick],
  )

  const [tickLower, setTickLower] = useState<number>(defaultLower)
  const [tickUpper, setTickUpper] = useState<number>(defaultUpper)
  const [isDynamicState, setIsDynamicState] = useState<boolean>(true)

  const ticksAligned = useMemo(() => {
    const lowerAligned = isTickAligned(tickLower, tickSpacing)
    const upperAligned = isTickAligned(tickUpper, tickSpacing)
    return lowerAligned && upperAligned
  }, [tickLower, tickUpper, tickSpacing])

  const dynamicOffsetsRef = useRef<{ lower: number; upper: number }>({
    lower: defaultLower - currentTick,
    upper: defaultUpper - currentTick,
  })
  const tickRangeRef = useRef<{ lower: number; upper: number }>({
    lower: defaultLower,
    upper: defaultUpper,
  })

  useEffect(() => {
    setTickLower((prev) => alignTick(prev, tickSpacing))
    setTickUpper((prev) => alignTick(prev, tickSpacing))
  }, [tickSpacing])

  useEffect(() => {
    tickRangeRef.current = {
      lower: tickLower,
      upper: tickUpper,
    }
  }, [tickLower, tickUpper])

  useEffect(() => {
    if (!isDynamicState) {
      return
    }

    const { lower, upper } = dynamicOffsetsRef.current
    const nextLower = alignTick(currentTick + lower, tickSpacing)
    const nextUpper = alignTick(currentTick + upper, tickSpacing)

    if (nextLower !== tickLower) {
      setTickLower(nextLower)
    }

    if (nextUpper !== tickUpper) {
      setTickUpper(nextUpper)
    }

    dynamicOffsetsRef.current = {
      lower: nextLower - currentTick,
      upper: nextUpper - currentTick,
    }
  }, [currentTick, tickSpacing, isDynamicState, tickLower, tickUpper])

  // Prevent adding liquidity when price is above range (can't provide token0)
  const isTickRangeValid = tickLower < tickUpper && ticksAligned

  const setIsDynamic: Dispatch<SetStateAction<boolean>> = (value) => {
    setIsDynamicState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value

      if (next && !prev) {
        const { lower, upper } = tickRangeRef.current
        dynamicOffsetsRef.current = {
          lower: lower - currentTick,
          upper: upper - currentTick,
        }
      }

      return next
    })
  }

  const applyPresetRange = (lower: number, upper: number) => {
    const alignedLower = alignTick(lower, tickSpacing)
    const alignedUpper = alignTick(upper, tickSpacing)

    dynamicOffsetsRef.current = {
      lower: alignedLower - currentTick,
      upper: alignedUpper - currentTick,
    }

    setIsDynamicState(true)
    setTickLower(alignedLower)
    setTickUpper(alignedUpper)
  }

  const dynamicOffsets = isDynamicState ? dynamicOffsetsRef.current : null

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
    isDynamic: isDynamicState,
    setIsDynamic,
    applyPresetRange,
    dynamicOffsets,
  }
}
