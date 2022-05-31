import { createReducer } from '@reduxjs/toolkit'

import { setStrategy, setValues, setZapIn } from './actions'
import { tokenDefinitions } from './strategies/useStakeSushiToBentoStrategy'
import { InariState } from './types'

const initialState: InariState = {
  id: 'stakeSushiToBentoStrategy',
  zapIn: true,
  inputValue: '',
  outputValue: '',
  // @ts-ignore TYPE NEEDS FIXING
  general: null,
  tokens: tokenDefinitions,
}

export default createReducer<InariState>(initialState, (builder) =>
  builder
    .addCase(setStrategy, (state, { payload: strategy }) => {
      return {
        ...state,
        ...strategy,
        general: {
          ...strategy.general,
          inputSymbol: state.zapIn ? strategy.general.inputSymbol : strategy.general.outputSymbol,
          outputSymbol: state.zapIn ? strategy.general.outputSymbol : strategy.general.inputSymbol,
        },
        tokens: {
          ...strategy.tokenDefinitions,
          inputToken: state.zapIn ? strategy.tokenDefinitions.inputToken : strategy.tokenDefinitions.outputToken,
          outputToken: state.zapIn ? strategy.tokenDefinitions.outputToken : strategy.tokenDefinitions.inputToken,
        },
        inputValue: '',
        outputValue: '',
      }
    })
    .addCase(setZapIn, (state, { payload: zapIn }) => {
      return {
        ...state,
        zapIn,
        general: {
          ...state.general,
          inputSymbol: state.general.outputSymbol,
          outputSymbol: state.general.inputSymbol,
        },
        tokens: {
          ...state.tokens,
          inputToken: state.tokens.outputToken,
          outputToken: state.tokens.inputToken,
        },
        inputValue: state.outputValue,
        outputValue: state.inputValue,
      }
    })
    .addCase(setValues, (state, { payload: { inputValue, outputValue } }) => {
      return {
        ...state,
        inputValue,
        outputValue,
      }
    })
)
