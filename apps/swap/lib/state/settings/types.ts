export interface WithSettingsState {
  [path: string]: SettingsState
}

export enum GasPrice {
  INSTANT = 'Instant',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export type SettingsState = {
  slippageTolerance: number
  gasPrice: GasPrice
  maxFeePerGas: undefined | number
  maxPriorityFeePerGas: undefined | number
  gasType: 'custom' | 'preset'
}

export interface UpdateSlippageTolerancePayload {
  slippageTolerance: number
}

export interface UpdateGasPrice {
  gasPrice: GasPrice
}

export interface UpdateMaxPriorityFeePerGas {
  maxPriorityFeePerGas: number | undefined
}

export interface UpdateMaxFeePerGas {
  maxFeePerGas: number | undefined
}

export interface UpdateGasType {
  gasType: 'custom' | 'preset'
}
