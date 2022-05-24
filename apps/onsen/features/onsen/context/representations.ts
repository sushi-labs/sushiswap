export interface FarmRepresentation {
  id: string
  token: {
    id: string
    name: string
  }
  rewardToken: {
    id: string
  }
  endTime: string
  lastRewardTime: string
  rewardRemaining: string
  liquidityStaked: string
}

export interface IncentiveRepresentation {
  id: string
  token: TokenRepresentation
  rewardToken: TokenRepresentation
  endTime: string
  lastRewardTime: string
  rewardRemaining: string
  liquidityStaked: string
}

export interface TokenRepresentation {
  id: string
  name?: string
  symbol?: string
}

export interface TridentPoolRepresentation {
  id: string
  assets: { token: TokenRepresentation }[]
  kpi: {
    volume: string
    volumeUSD: string
  }
}
