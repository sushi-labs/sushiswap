
export interface IncentiveRepresentation {
  id: string
  token: TokenRepresentation
  rewardToken: TokenRepresentation
  endTime: string
  lastRewardTime: string
  rewardRemaining: string
  liquidityStaked: string
  creator: UserRepresentation
  timestamp: string
  block: string
}

export interface UserRepresentation {
  id: string
}

export interface TokenRepresentation {
  id: string
  symbol: string
  name: string
  decimals: string
}

export interface TridentPoolRepresentation {
  id: string
  assets: { token: TokenRepresentation }[]
  kpi: {
    volume: string
    volumeUSD: string
  }
}
