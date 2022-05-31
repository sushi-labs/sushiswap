import { Signature } from '@ethersproject/bytes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from 'app/state'

import { LiquidityMode } from '../types'

export interface AddState {
  normalInput: (string | undefined)[]
  zapInput?: string
  liquidityMode: LiquidityMode
  fixedRatio: boolean
  showReview: boolean
  attemptingTxn: boolean
  txHash?: string
  bentoPermit?: Signature
  spendFromWallet: [boolean, boolean]
}

const initialState: AddState = {
  normalInput: [undefined, undefined],
  zapInput: undefined,
  liquidityMode: LiquidityMode.STANDARD,
  fixedRatio: true,
  showReview: false,
  attemptingTxn: false,
  spendFromWallet: [true, true],
  txHash: undefined,
  bentoPermit: undefined,
}

export const addSlice = createSlice({
  name: 'tridentAdd',
  initialState,
  reducers: {
    setAddState: (
      state,
      action: PayloadAction<{
        liquidityMode: LiquidityMode
        fixedRatio: boolean
      }>
    ) => {
      state.liquidityMode = action.payload.liquidityMode
      state.fixedRatio = action.payload.fixedRatio
    },
    setAddFixedRatio: (state, action: PayloadAction<boolean>) => {
      state.fixedRatio = action.payload
    },
    setAddShowReview: (state, action: PayloadAction<boolean>) => {
      state.showReview = action.payload
    },

    setAddSpendFromWallet: (state, action: PayloadAction<[boolean, boolean]>) => {
      state.spendFromWallet = action.payload
    },

    setAddZapInput: (state, action: PayloadAction<string>) => {
      state.zapInput = action.payload
    },
    setAddTxHash: (state, action: PayloadAction<string | undefined>) => {
      state.txHash = action.payload
      if (typeof action.payload === 'undefined') {
        state.showReview = false
      }
    },
    setAddAttemptingTxn: (state, action: PayloadAction<boolean>) => {
      state.attemptingTxn = action.payload
    },
    setAddNormalInput: (state, action: PayloadAction<[string, string]>) => {
      state.normalInput = action.payload
    },
    setAddBentoPermit: (state, action: PayloadAction<Signature | undefined>) => {
      state.bentoPermit = action.payload
    },
  },
})

export const {
  setAddState,
  setAddFixedRatio,
  setAddShowReview,
  setAddSpendFromWallet,
  setAddZapInput,
  setAddTxHash,
  setAddAttemptingTxn,
  setAddNormalInput,
  setAddBentoPermit,
} = addSlice.actions

type selectTridentAdd = (state: AppState) => AddState
export const selectTridentAdd: selectTridentAdd = (state: AppState) => state.tridentAdd
export default addSlice.reducer

export const selectAddNormalInput = (state: AppState) => state.tridentAdd.normalInput
export const selectAddSpendFromWallet = (state: AppState) => state.tridentAdd.spendFromWallet
