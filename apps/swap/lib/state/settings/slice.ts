import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  GasPrice,
  SettingsState,
  UpdateGasPrice,
  UpdateMaxFeePerGas,
  UpdateMaxPriorityFeePerGas,
  UpdateSlippageTolerancePayload,
} from './types'

const parsedState = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('settings') || '') : {}
const initialState: SettingsState = {
  slippageTolerance: parsedState?.slippageTolerance || 1,
  gasPrice: parsedState?.gasPrice || GasPrice.HIGH,
  maxFeePerGas: parsedState?.maxFeePerGas || undefined,
  maxPriorityFeePerGas: parsedState?.maxPriorityFeePerGas || undefined,
}

export function createSettingsSlice(reducerPath: string) {
  return createSlice({
    name: reducerPath,
    initialState,
    reducers: {
      updateSlippageTolerance: (state, action: PayloadAction<UpdateSlippageTolerancePayload>) => {
        const { slippageTolerance } = action.payload
        state.slippageTolerance = slippageTolerance
      },
      updateGasPrice: (state, action: PayloadAction<UpdateGasPrice>) => {
        const { gasPrice } = action.payload
        state.gasPrice = gasPrice
      },
      updateMaxFeePerGas: (state, action: PayloadAction<UpdateMaxFeePerGas>) => {
        const { maxFeePerGas } = action.payload
        state.maxFeePerGas = maxFeePerGas
      },
      updateMaxPriorityFeePerGas: (state, action: PayloadAction<UpdateMaxPriorityFeePerGas>) => {
        const { maxPriorityFeePerGas } = action.payload
        state.maxPriorityFeePerGas = maxPriorityFeePerGas
      },
    },
  })
}

export type SettingsActions = ReturnType<typeof createSettingsSlice>['actions']
