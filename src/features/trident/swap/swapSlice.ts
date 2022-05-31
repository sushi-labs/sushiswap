import { Signature } from '@ethersproject/bytes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from 'app/state'

export enum TypedField {
  A,
  B,
}

export interface SwapState {
  value: string
  typedField: TypedField
  spendFromWallet: boolean
  receiveToWallet: boolean
  recipient?: string
  attemptingTxn: boolean
  showReview: boolean
  error?: string
  bentoPermit?: Signature
}

const initialState: SwapState = {
  value: '',
  typedField: TypedField.A,
  spendFromWallet: true,
  receiveToWallet: true,
  recipient: undefined,
  attemptingTxn: false,
  showReview: false,
  error: undefined,
  bentoPermit: undefined,
}

export const swapSlice = createSlice({
  name: 'tridentSwap',
  initialState,
  reducers: {
    setSpendFromWallet: (state, action: PayloadAction<boolean>) => {
      state.spendFromWallet = action.payload
    },
    setReceiveToWallet: (state, action: PayloadAction<boolean>) => {
      state.receiveToWallet = action.payload
    },
    setTridentSwapState: (state, action: PayloadAction<SwapState>) => {
      state.value = action.payload.value
      state.typedField = action.payload.typedField
      state.attemptingTxn = action.payload.attemptingTxn
      state.showReview = action.payload.showReview
      state.error = action.payload.error
    },
    setRecipient: (state, action: PayloadAction<string | undefined>) => {
      state.recipient = action.payload
    },
    setAttemptingTxn: (state, action: PayloadAction<boolean>) => {
      state.attemptingTxn = action.payload
    },
    setShowReview: (state, action: PayloadAction<boolean>) => {
      state.showReview = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    setBentoPermit: (state, action: PayloadAction<Signature | undefined>) => {
      state.bentoPermit = action.payload
    },
  },
})

export const {
  setShowReview,
  setAttemptingTxn,
  setRecipient,
  setSpendFromWallet,
  setReceiveToWallet,
  setTridentSwapState,
  setBentoPermit,
} = swapSlice.actions

type selectTridentSwap = (state: AppState) => SwapState
export const selectTridentSwap: selectTridentSwap = (state: AppState) => state.tridentSwap

export default swapSlice.reducer
