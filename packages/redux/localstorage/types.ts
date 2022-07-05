import { ChainId } from '@sushiswap/chain'

export interface WithStorageState {
  [path: string]: StorageState
}

export enum GasPrice {
  INSTANT = 'Instant',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export type TokenAsObject = { address: string; chainId: ChainId; symbol?: string; name?: string; decimals: number }

export type StorageState = {
  slippageTolerance: number
  gasPrice: GasPrice
  maxFeePerGas: undefined | number
  maxPriorityFeePerGas: undefined | number
  gasType: 'custom' | 'preset'
  customTokens: Record<number, Record<string, TokenAsObject>>
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

export type AddCustomToken = TokenAsObject
export type RemoveCustomToken = Pick<TokenAsObject, 'chainId' | 'address'>
