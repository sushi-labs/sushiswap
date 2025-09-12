import type { KvmTokenAddress } from 'sushi/kvm'

//@dev: going to overhaul to use KvmToken where this type is used
export interface KadenaToken {
  tokenAddress: string | KvmTokenAddress
  tokenSymbol: string
  tokenDecimals: number
  tokenImage?: string
  tokenName: string
  validated?: boolean
  isNative?: boolean
}

export type TokenWithBalance = KadenaToken & { balance: string }
