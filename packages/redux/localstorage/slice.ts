import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'

import {
  AddCustomToken,
  AddNotification,
  ClearNotifications,
  GasPrice,
  RemoveCustomToken,
  StorageState,
  UpdateExpertMode,
  UpdateGasPrice,
  UpdateGasType,
  UpdateMaxFeePerGas,
  UpdateMaxPriorityFeePerGas,
  UpdateSlippageTolerancePayload,
  UpdateSlippageToleranceTypePayload,
  UpdateTransactionDeadline,
} from './types'

const parsedState = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userPreferences') || '{}') : {}
const initialState: StorageState = {
  slippageTolerance: parsedState?.slippageTolerance || 0.5,
  slippageToleranceType: parsedState?.slippageToleranceType || 'auto',
  gasPrice: parsedState?.gasPrice || GasPrice.HIGH,
  maxFeePerGas: parsedState?.maxFeePerGas || undefined,
  maxPriorityFeePerGas: parsedState?.maxPriorityFeePerGas || undefined,
  gasType: parsedState?.gasType || 'preset',
  customTokens: parsedState?.customTokens || {},
  expertMode: parsedState?.expertMode || false,
  transactionDeadline: 30,
  notifications: parsedState?.notifications || {},
}

const reducers = {
  updateExpertMode: (state: StorageState, action: PayloadAction<UpdateExpertMode>) => {
    const { expertMode } = action.payload
    state.expertMode = expertMode
  },
  updateSlippageTolerance: (state: StorageState, action: PayloadAction<UpdateSlippageTolerancePayload>) => {
    const { slippageTolerance } = action.payload
    state.slippageTolerance = slippageTolerance
  },
  updateSlippageToleranceType: (state: StorageState, action: PayloadAction<UpdateSlippageToleranceTypePayload>) => {
    const { slippageToleranceType } = action.payload
    state.slippageToleranceType = slippageToleranceType
  },
  updateGasPrice: (state: StorageState, action: PayloadAction<UpdateGasPrice>) => {
    const { gasPrice } = action.payload
    state.gasPrice = gasPrice
    state.gasType = 'preset'
  },
  updateMaxFeePerGas: (state: StorageState, action: PayloadAction<UpdateMaxFeePerGas>) => {
    const { maxFeePerGas } = action.payload
    state.maxFeePerGas = maxFeePerGas
    if (state.maxPriorityFeePerGas) {
      state.gasType = 'custom'
    }
  },
  updateMaxPriorityFeePerGas: (state: StorageState, action: PayloadAction<UpdateMaxPriorityFeePerGas>) => {
    const { maxPriorityFeePerGas } = action.payload
    state.maxPriorityFeePerGas = maxPriorityFeePerGas
    if (state.maxFeePerGas) {
      state.gasType = 'custom'
    }
  },
  updateGasType: (state: StorageState, action: PayloadAction<UpdateGasType>) => {
    const { gasType } = action.payload
    state.gasType = gasType
  },
  addCustomToken: (state: StorageState, action: PayloadAction<AddCustomToken>) => {
    const { address, symbol, name, chainId, decimals } = action.payload

    if (!state.customTokens[chainId]) {
      state.customTokens[chainId] = {}
    }

    state.customTokens[chainId][address.toLowerCase()] = { address, symbol, name, chainId, decimals }
  },
  removeCustomToken: (state: StorageState, action: PayloadAction<RemoveCustomToken>) => {
    const { address, chainId } = action.payload

    if (state.customTokens[chainId] && state.customTokens[chainId][address.toLowerCase()]) {
      delete state.customTokens[chainId][address.toLowerCase()]
    }
  },
  updateTransactionDeadline: (state: StorageState, action: PayloadAction<UpdateTransactionDeadline>) => {
    const { transactionDeadline } = action.payload
    state.transactionDeadline = transactionDeadline
  },
  addNotification: (state: StorageState, action: PayloadAction<AddNotification>) => {
    const { notification, account } = action.payload
    if (!state.notifications[account]) {
      state.notifications[account] = []
    }

    state.notifications[account].push(notification)
  },
  clearNotifications: (state: StorageState, action: PayloadAction<ClearNotifications>) => {
    const { account } = action.payload
    state.notifications[account] = []
  },
}

export function createStorageSlice(reducerPath: string): Slice<StorageState> {
  return createSlice<StorageState, typeof reducers>({
    name: reducerPath,
    initialState,
    reducers,
  })
}

export type StorageActions = ReturnType<typeof createStorageSlice>['actions']
