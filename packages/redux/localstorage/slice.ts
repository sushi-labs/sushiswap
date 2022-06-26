import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'

import {
  AddCustomToken,
  GasPrice,
  RemoveCustomToken,
  StorageState,
  UpdateGasPrice,
  UpdateGasType,
  UpdateMaxFeePerGas,
  UpdateMaxPriorityFeePerGas,
  UpdateSlippageTolerancePayload,
} from './types'

const parsedState = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userPreferences') || '{}') : {}
const initialState: StorageState = {
  slippageTolerance: parsedState?.slippageTolerance || 1,
  gasPrice: parsedState?.gasPrice || GasPrice.HIGH,
  maxFeePerGas: parsedState?.maxFeePerGas || undefined,
  maxPriorityFeePerGas: parsedState?.maxPriorityFeePerGas || undefined,
  gasType: parsedState?.gasType || 'preset',
  customTokens: parsedState?.customTokens || {},
}

export function createStorageSlice(reducerPath: string): Slice<StorageState> {
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
        state.gasType = 'preset'
      },
      updateMaxFeePerGas: (state, action: PayloadAction<UpdateMaxFeePerGas>) => {
        const { maxFeePerGas } = action.payload
        state.maxFeePerGas = maxFeePerGas
        if (state.maxPriorityFeePerGas) {
          state.gasType = 'custom'
        }
      },
      updateMaxPriorityFeePerGas: (state, action: PayloadAction<UpdateMaxPriorityFeePerGas>) => {
        const { maxPriorityFeePerGas } = action.payload
        state.maxPriorityFeePerGas = maxPriorityFeePerGas
        if (state.maxFeePerGas) {
          state.gasType = 'custom'
        }
      },
      updateGasType: (state, action: PayloadAction<UpdateGasType>) => {
        const { gasType } = action.payload
        state.gasType = gasType
      },
      addCustomToken: (state, action: PayloadAction<AddCustomToken>) => {
        const { address, symbol, name, chainId, decimals } = action.payload

        if (!state.customTokens[chainId]) {
          state.customTokens[chainId] = {}
        }

        state.customTokens[chainId][address.toLowerCase()] = { address, symbol, name, chainId, decimals }
      },
      removeCustomToken: (state, action: PayloadAction<RemoveCustomToken>) => {
        const { address, chainId } = action.payload

        if (state.customTokens[chainId] && state.customTokens[chainId][address.toLowerCase()]) {
          delete state.customTokens[chainId][address.toLowerCase()]
        }
      },
    },
  })
}

export type StorageActions = ReturnType<typeof createStorageSlice>['actions']
