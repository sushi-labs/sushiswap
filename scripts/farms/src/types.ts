export interface Farm {
  id: number
  feeApy: number
  incentives: {
    apr: number
    rewardPerDay: number
    rewardToken: {
      address: string
      decimals: number
      symbol: string
      decimals: number
    }
    rewarder: {
      address: string
      type: 'Primary' | 'Secondary'
    }
  }[]
  chefType: 'MasterChefV1' | 'MasterChefV2' | 'MiniChef'
  poolType: 'Legacy' | 'Trident' | 'Kashi' | 'Unknown'
}
