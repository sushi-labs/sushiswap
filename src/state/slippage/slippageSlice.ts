import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Percent } from '@sushiswap/core-sdk'
import { AppState } from 'app/state'

export const GLOBAL_DEFAULT_SLIPPAGE_PERCENT = new Percent(50, 10_000) // .5%
export const GLOBAL_DEFAULT_SLIPPAGE_STR = GLOBAL_DEFAULT_SLIPPAGE_PERCENT.toFixed(2)

export enum SlippageError {
  TOO_LOW = 'TOO_LOW',
  TOO_HIGH = 'TOO_HIGH',
  INVALID_INPUT = 'INVALID_INPUT',
}

export interface SlippageSliceState {
  input: string // User set value in the text box
}

const initialState: SlippageSliceState = {
  input: GLOBAL_DEFAULT_SLIPPAGE_STR,
}

export const slippageSlice = createSlice({
  name: 'slippage',
  initialState,
  reducers: {
    setSlippageInput: (state, action: PayloadAction<string>) => {
      state.input = action.payload
    },
    /* Takes a string like .3 and makes it 0.30 */
    formatSlippageInput: (state) => {
      const parsedInput = parseFloat(state.input)
      if (isNaN(parsedInput)) return
      state.input = parsedInput.toFixed(2)
    },
  },
})

export const { setSlippageInput, formatSlippageInput } = slippageSlice.actions

const parseSlippageInput = (input: string): number => Math.floor(Number.parseFloat(input) * 100)
const inputToPercent = (input: string) => new Percent(parseSlippageInput(input), 10_000)

const selectSlippageInputError = (state: AppState): SlippageError | false => {
  try {
    const parsedInput = parseSlippageInput(state.slippage.input)
    return !Number.isInteger(parsedInput) || parsedInput < 1 || (!state.user.userExpertMode && parsedInput > 5000)
      ? SlippageError.INVALID_INPUT
      : inputToPercent(state.slippage.input).lessThan(new Percent(5, 10_000))
      ? SlippageError.TOO_LOW
      : inputToPercent(state.slippage.input).greaterThan(new Percent(1, 100))
      ? SlippageError.TOO_HIGH
      : false
  } catch (e) {
    return SlippageError.INVALID_INPUT
  }
}

const selectSlippageInput = (state: AppState) => state.slippage.input

export const selectSlippage = createSelector([selectSlippageInput, selectSlippageInputError], (input, error) => {
  return error === SlippageError.INVALID_INPUT ? GLOBAL_DEFAULT_SLIPPAGE_PERCENT : inputToPercent(input)
})

const fallbackParam = (state: AppState, fallbackDefault: Percent) => fallbackDefault
const _composeSlippageWithDefault = createSelector(
  [selectSlippageInput, selectSlippageInputError, fallbackParam],
  (input, error, fallback) => {
    return error === SlippageError.INVALID_INPUT ? fallback : inputToPercent(input)
  }
)

export const selectSlippageWithDefault = (fallbackDefault: Percent) => (state: AppState) =>
  _composeSlippageWithDefault(state, fallbackDefault)

export const slippageSelectors = (state: AppState) => {
  return {
    input: selectSlippageInput(state),
    percent: selectSlippage(state),
    error: selectSlippageInputError(state),
  }
}

export default slippageSlice.reducer
