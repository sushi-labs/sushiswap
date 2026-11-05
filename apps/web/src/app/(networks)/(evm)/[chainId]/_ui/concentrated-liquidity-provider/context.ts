'use client'

import { createContext, useContext } from 'react'
import type { Bound } from 'src/lib/constants'
import type { RangeTick } from 'src/lib/pool/cl'
import {
  type ConcentratedLiquidityState,
  type RangePreset,
  initialConcentratedLiquidityState,
} from './state'

export type Api = {
  onFieldAInput(typedValue: string): void
  onFieldBInput(typedValue: string): void
  /** A start price typed as of the currency with ID `base`, if known. */
  onStartPriceInput(typedValue: string, base: string | undefined): void
  /** Sets one bound of the range for `pair` (see `getRangePairKey`). */
  setRangeBound(pair: string, bound: Bound, tick: RangeTick | undefined): void
  /** Sets the range for `pair`, by the preset `preset` if one set it. */
  setRange(
    pair: string,
    lower: RangeTick | undefined,
    upper: RangeTick | undefined,
    preset?: RangePreset,
  ): void
  resetMintState(): void
  /** Locks currency0's weight in the range for `pair`, if it's set. */
  setWeightLockedCurrency0(pair: string, value: number | undefined): void
}

export const ConcentratedLiquidityStateContext =
  createContext<ConcentratedLiquidityState>(initialConcentratedLiquidityState)
export const ConcentratedLiquidityActionsContext = createContext<Api>({} as Api)

// Outside a provider these are the initial state and no actions, which the
// read-only V3 depth and steer distribution charts rely on
export function useConcentratedMintState(): ConcentratedLiquidityState {
  return useContext(ConcentratedLiquidityStateContext)
}

export function useConcentratedMintActionHandlers(): Api {
  return useContext(ConcentratedLiquidityActionsContext)
}
