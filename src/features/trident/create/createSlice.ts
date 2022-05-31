import { Signature } from '@ethersproject/bytes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Fee, PoolType } from '@sushiswap/trident-sdk'
import { AppState } from 'app/state'

import { SelectedAsset } from './SelectedAsset'

export type CreatePoolStep = 1 | 2

export interface CreateState {
  currentStep: CreatePoolStep
  selectedPoolType: PoolType
  selectedAssets: SelectedAsset[]
  selectedFeeTier?: Fee
  createAnOracle: boolean
  showReview: boolean
  attemptingTxn: boolean
  txHash?: string
  bentoPermit?: Signature
}

const initialState: CreateState = {
  currentStep: 1,
  selectedPoolType: PoolType.ConstantProduct,
  selectedAssets: [new SelectedAsset({}), new SelectedAsset({})],
  selectedFeeTier: undefined,
  createAnOracle: false,
  showReview: false,
  attemptingTxn: false,
  txHash: undefined,
  bentoPermit: undefined,
}

export const poolCreateSlice = createSlice({
  name: 'tridentCreate',
  initialState,
  reducers: {
    setCreateCurrentStep: (state, action: PayloadAction<CreatePoolStep>) => {
      state.currentStep = action.payload
    },
    setCreateSelectedPoolType: (state, action: PayloadAction<PoolType>) => {
      state.selectedPoolType = action.payload
    },
    setCreateSelectedFeeTier: (state, action: PayloadAction<Fee>) => {
      state.selectedFeeTier = action.payload
    },
    setCreateAnOracle: (state, action: PayloadAction<boolean>) => {
      state.createAnOracle = action.payload
    },
    setCreateTxHash: (state, action: PayloadAction<string | undefined>) => {
      state.txHash = action.payload
      if (typeof action.payload === 'undefined') {
        state.showReview = false
      }
    },
    setCreateAttemptingTxn: (state, action: PayloadAction<boolean>) => {
      state.attemptingTxn = action.payload
    },
    setCreateBentoPermit: (state, action: PayloadAction<Signature | undefined>) => {
      state.bentoPermit = action.payload
    },
    setCreateShowReview: (state, action: PayloadAction<boolean>) => {
      state.showReview = action.payload
    },
    setCreateSelectedAsset: (state, action: PayloadAction<{ asset: SelectedAsset; index: number }>) => {
      const assets = [...state.selectedAssets]
      assets[action.payload.index] = action.payload.asset
      state.selectedAssets = assets
    },
  },
})

export const {
  setCreateCurrentStep,
  setCreateSelectedPoolType,
  setCreateSelectedFeeTier,
  setCreateAnOracle,
  setCreateTxHash,
  setCreateShowReview,
  setCreateAttemptingTxn,
  setCreateBentoPermit,
  setCreateSelectedAsset,
} = poolCreateSlice.actions

type selectTridentCreate = (state: AppState) => CreateState
export const selectTridentCreate: selectTridentCreate = (state: AppState) => state.tridentCreate
export default poolCreateSlice.reducer

export const selectSelectedAssetIndex = (state: AppState, index: number) => state.tridentCreate.selectedAssets[index]
