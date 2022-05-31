import { Signature } from '@ethersproject/bytes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StandardSignatureData } from 'app/hooks/useERC20Permit'
import { AppState } from 'app/state'

import { LiquidityMode } from '../types'

export interface RemoveState {
  normalInput: (string | undefined)[]
  zapInput?: string
  liquidityMode: LiquidityMode
  fixedRatio: boolean
  showReview: boolean
  attemptingTxn: boolean
  txHash?: string
  bentoPermit?: Signature
  slpPermit?: StandardSignatureData
  outputToWallet: boolean
  receiveNative: boolean
  zapCurrency?: string
  percentageAmount: string
}

const initialState: RemoveState = {
  normalInput: [undefined, undefined],
  zapInput: undefined,
  liquidityMode: LiquidityMode.STANDARD,
  fixedRatio: true,
  showReview: false,
  attemptingTxn: false,
  outputToWallet: true,
  txHash: undefined,
  bentoPermit: undefined,
  slpPermit: undefined,
  receiveNative: true,
  zapCurrency: undefined,
  percentageAmount: '',
}

export const addSlice = createSlice({
  name: 'tridentRemove',
  initialState,
  reducers: {
    setRemoveState: (
      state,
      action: PayloadAction<{
        liquidityMode: LiquidityMode
        fixedRatio: boolean
      }>
    ) => {
      state.liquidityMode = action.payload.liquidityMode
      state.fixedRatio = action.payload.fixedRatio
    },
    setRemoveFixedRatio: (state, action: PayloadAction<boolean>) => {
      state.fixedRatio = action.payload
    },
    setRemoveShowReview: (state, action: PayloadAction<boolean>) => {
      state.showReview = action.payload
    },
    setRemoveOutputToWallet: (state, action: PayloadAction<boolean>) => {
      state.outputToWallet = action.payload
    },
    setRemoveZapInput: (state, action: PayloadAction<string>) => {
      state.zapInput = action.payload
    },
    setRemoveTxHash: (state, action: PayloadAction<string | undefined>) => {
      state.txHash = action.payload
      if (typeof action.payload === 'undefined') {
        state.showReview = false
      }
    },
    setRemoveAttemptingTxn: (state, action: PayloadAction<boolean>) => {
      state.attemptingTxn = action.payload
    },
    setRemoveNormalInput: (state, action: PayloadAction<[string, string]>) => {
      state.normalInput = action.payload
    },
    setRemoveBentoPermit: (state, action: PayloadAction<Signature | undefined>) => {
      state.bentoPermit = action.payload
    },
    setRemoveSLPPermit: (state, action: PayloadAction<StandardSignatureData | undefined>) => {
      state.slpPermit = action.payload
    },
    setRemoveDeletePermits: (state) => {
      state.bentoPermit = undefined
      state.slpPermit = undefined
    },
    setRemoveReceiveNative: (state, action: PayloadAction<boolean>) => {
      state.receiveNative = action.payload
    },
    setRemoveZapCurrency: (state, action: PayloadAction<string>) => {
      state.zapCurrency = action.payload
    },
    setRemovePercentageAmount: (state, action: PayloadAction<string>) => {
      state.percentageAmount = action.payload
    },
  },
})

export const {
  setRemoveState,
  setRemoveFixedRatio,
  setRemoveShowReview,
  setRemoveOutputToWallet,
  setRemoveZapInput,
  setRemoveTxHash,
  setRemoveAttemptingTxn,
  setRemoveNormalInput,
  setRemoveBentoPermit,
  setRemoveReceiveNative,
  setRemoveZapCurrency,
  setRemovePercentageAmount,
  setRemoveSLPPermit,
  setRemoveDeletePermits,
} = addSlice.actions

type selectTridentRemove = (state: AppState) => RemoveState
export const selectTridentRemove: selectTridentRemove = (state: AppState) => state.tridentRemove
export default addSlice.reducer

export const selectRemoveZapCurrency = (state: AppState) => state.tridentRemove.zapCurrency
export const selectRemovePercentageAmount = (state: AppState) => state.tridentRemove.percentageAmount
