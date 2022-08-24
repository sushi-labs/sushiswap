export interface Farm {
  feeApy: number
  incentives: {
    apr: number
    rewardPerDay: number
    rewardToken: {
      address: string
      symbol: string
      decimals: number
    }
  }[]
  chefType: 'MasterChefV1' | 'MasterChefV2' | 'MiniChef'
  poolType: 'Legacy' | 'Trident' | 'Kashi' | 'Unknown'
}
