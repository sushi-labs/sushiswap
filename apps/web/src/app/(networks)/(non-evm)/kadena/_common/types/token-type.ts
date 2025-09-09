import type { KvmTokenAddress } from 'sushi/kvm'

export interface TokenInfo {
  decimalsToDisplay?: number
  description?: string
  discordUrl?: string
  websiteUrl?: string
  twitterUrl?: string
  themeColor?: string
  telegramUrl?: string
  mediumUrl?: string
}

export interface KadenaToken {
  tokenAddress: string | KvmTokenAddress
  tokenSymbol: string
  tokenDecimals: number
  tokenImage?: string
  tokenName: string
  tokenInfo?: TokenInfo
  validated?: boolean
  isNative?: boolean
}

export type TokenWithBalance = KadenaToken & { balance: string }
