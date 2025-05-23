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
  tokenAddress: string
  tokenSymbol: string
  tokenDecimals: number
  tokenImage?: string
  tokenName: string
  tokenInfo?: TokenInfo
  validated?: boolean
}

export type TokenWithBalance = KadenaToken & { balance: string }
