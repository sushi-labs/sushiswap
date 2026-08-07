import { Bound, Field } from 'src/lib/constants'

type FullRange = true

interface ConcentratedLiquidityState {
  independentField: Field
  independentRangeField: Bound
  typedValue: string
  startPriceTypedValue: string
  leftRangeTypedValue: string | FullRange
  rightRangeTypedValue: string | FullRange
  weightLockedCurrencyBase: number | undefined
}

type ConcentratedLiquidityAction =
  | { type: 'resetMintState' }
  | { type: 'typeLeftRangeInput'; typedValue: string }
  | {
      type: 'typeInput'
      field: Field
      typedValue: string
      noLiquidity: boolean
    }
  | { type: 'typeRightRangeInput'; typedValue: string }
  | { type: 'setFullRange' }
  | { type: 'typeStartPriceInput'; typedValue: string }
  | { type: 'setWeightLockedCurrencyBase'; value: number | undefined }
  | { type: 'setIndependentRangeField'; value: Bound }

const initialConcentratedLiquidityState: ConcentratedLiquidityState = {
  independentField: Field.CURRENCY_A,
  independentRangeField: Bound.LOWER,
  typedValue: '',
  startPriceTypedValue: '',
  leftRangeTypedValue: '',
  rightRangeTypedValue: '',
  weightLockedCurrencyBase: undefined,
}

function concentratedLiquidityReducer(
  state: ConcentratedLiquidityState,
  action: ConcentratedLiquidityAction,
): ConcentratedLiquidityState {
  switch (action.type) {
    case 'resetMintState':
      return initialConcentratedLiquidityState
    case 'setFullRange':
      return { ...state, leftRangeTypedValue: true, rightRangeTypedValue: true }
    case 'typeStartPriceInput':
      return { ...state, startPriceTypedValue: action.typedValue }
    case 'typeLeftRangeInput':
      return { ...state, leftRangeTypedValue: action.typedValue }
    case 'typeRightRangeInput':
      return { ...state, rightRangeTypedValue: action.typedValue }
    case 'typeInput':
      return {
        ...state,
        independentField: action.field,
        typedValue: action.typedValue,
      }
    case 'setWeightLockedCurrencyBase':
      return { ...state, weightLockedCurrencyBase: action.value }
    case 'setIndependentRangeField':
      return { ...state, independentRangeField: action.value }
  }
}

export {
  concentratedLiquidityReducer,
  initialConcentratedLiquidityState,
  type ConcentratedLiquidityAction,
  type ConcentratedLiquidityState,
}
