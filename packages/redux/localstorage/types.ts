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

export type TokenAsObject = {
  address: string
  chainId: ChainId
  symbol?: string
  name?: string
  decimals: number
}

export type StorageState = {
  carbonOffset: boolean
  expertMode: boolean
  sushiGuard: boolean
  slippageTolerance: number
  slippageToleranceType: 'auto' | 'custom'
  gasPrice: GasPrice
  maxFeePerGas: undefined | number
  maxPriorityFeePerGas: undefined | number
  gasType: 'custom' | 'preset'
  customTokens: Record<number, Record<string, TokenAsObject>>
  transactionDeadline: number
  notifications: Record<string, Record<string, string[]>>
}

export interface UpdateCarbonOffsetPayload {
  carbonOffset: boolean
}

export interface UpdateSlippageTolerancePayload {
  slippageTolerance: number
}

export interface UpdateExpertMode {
  expertMode: boolean
}

export interface UpdateSushiGuard {
  sushiGuard: boolean
}

export interface UpdateSlippageToleranceTypePayload {
  slippageToleranceType: 'auto' | 'custom'
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

export interface UpdateTransactionDeadline {
  transactionDeadline: number
}

export interface createNotification {
  account: string
  notification: string
  timestamp: number
}

export interface ClearNotifications {
  account: string
}

export type AddCustomToken = TokenAsObject
export type AddCustomTokens = TokenAsObject[]
export type RemoveCustomToken = Pick<TokenAsObject, 'chainId' | 'address'>
