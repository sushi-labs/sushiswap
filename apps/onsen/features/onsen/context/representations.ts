export interface IncentiveRepresentation {
  id: string
  stakeToken: TokenRepresentation
  rewardToken: TokenRepresentation
  startTime: string
  endTime: string
  lastRewardTime: string
  rewardRemaining: string
  liquidityStaked: string
  createdBy: UserRepresentation
  createdAtTimestamp: string
  createdAtBlock: string
  modifiedAtTimestamp: string
  modifiedAtBlock: string
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
