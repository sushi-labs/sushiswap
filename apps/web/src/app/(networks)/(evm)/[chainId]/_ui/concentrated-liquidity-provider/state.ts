import { Bound, Field } from 'src/lib/constants'
import type { PriceRange, RangeTick } from 'src/lib/pool/cl'

/** A range, as pool ticks, for the pair whose key is `pair`. */
interface RangeState {
  pair: string
  [Bound.LOWER]: RangeTick | undefined
  [Bound.UPPER]: RangeTick | undefined
  /** The bound set last, which a locked weight keeps; unset, the displayed min. */
  independentBound: Bound | undefined
  /** A locked weight of currency0 in the position's value, from 0 to 1. */
  weightLockedCurrency0: number | undefined
  /** The preset that set the range, at a tick spacing, until anything else changes it. */
  preset: RangePreset | undefined
}

interface RangePreset {
  value: PriceRange
  tickSpacing: number
}

interface ConcentratedLiquidityState {
  independentField: Field
  typedValue: string
  startPriceTypedValue: string
  /** The ID of the currency the typed start price is of. */
  startPriceBase: string | undefined
  /** Unset, or for another pair, when no range is selected. */
  range: RangeState | undefined
}

type ConcentratedLiquidityAction =
  | { type: 'resetMintState' }
  | {
      type: 'typeInput'
      field: Field
      typedValue: string
    }
  | {
      type: 'typeStartPriceInput'
      typedValue: string
      base: string | undefined
    }
  | {
      type: 'setRangeBound'
      pair: string
      bound: Bound
      tick: RangeTick | undefined
    }
  | {
      type: 'setRange'
      pair: string
      lower: RangeTick | undefined
      upper: RangeTick | undefined
      preset: RangePreset | undefined
    }
  | {
      type: 'setWeightLockedCurrency0'
      pair: string
      value: number | undefined
    }

const initialConcentratedLiquidityState: ConcentratedLiquidityState = {
  independentField: Field.CURRENCY_A,
  typedValue: '',
  startPriceTypedValue: '',
  startPriceBase: undefined,
  range: undefined,
}

function concentratedLiquidityReducer(
  state: ConcentratedLiquidityState,
  action: ConcentratedLiquidityAction,
): ConcentratedLiquidityState {
  switch (action.type) {
    case 'resetMintState':
      return initialConcentratedLiquidityState
    case 'typeStartPriceInput':
      return {
        ...state,
        startPriceTypedValue: action.typedValue,
        startPriceBase: action.base,
      }
    case 'setRangeBound': {
      // A range for another pair doesn't carry over
      const range =
        state.range?.pair === action.pair
          ? state.range
          : emptyRange(action.pair)
      return {
        ...state,
        range: {
          ...range,
          [action.bound]: action.tick,
          independentBound: action.bound,
          preset: undefined,
        },
      }
    }
    case 'setRange':
      return {
        ...state,
        range: {
          ...emptyRange(action.pair),
          [Bound.LOWER]: action.lower,
          [Bound.UPPER]: action.upper,
          preset: action.preset,
        },
      }
    case 'setWeightLockedCurrency0':
      // Only a range of the pair can be weighted
      if (state.range?.pair !== action.pair) return state
      return {
        ...state,
        range: {
          ...state.range,
          weightLockedCurrency0: action.value,
          // A weight reshapes the range
          preset: action.value === undefined ? state.range.preset : undefined,
        },
      }
    case 'typeInput':
      return {
        ...state,
        independentField: action.field,
        typedValue: action.typedValue,
      }
  }
}

function emptyRange(pair: string): RangeState {
  return {
    pair,
    [Bound.LOWER]: undefined,
    [Bound.UPPER]: undefined,
    independentBound: undefined,
    weightLockedCurrency0: undefined,
    preset: undefined,
  }
}

export {
  concentratedLiquidityReducer,
  initialConcentratedLiquidityState,
  type ConcentratedLiquidityAction,
  type ConcentratedLiquidityState,
  type RangePreset,
  type RangeState,
}
