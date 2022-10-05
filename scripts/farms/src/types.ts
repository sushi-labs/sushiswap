export interface Farm {
  id: number
  incentives: {
    apr: number
    rewardPerDay: number
    rewardToken: {
      address: string
      decimals: number
      symbol: string
    }
    rewarder: {
      address: string
      type: 'Primary' | 'Secondary'
    }
  }[]
  chefType: 'MasterChefV1' | 'MasterChefV2' | 'MiniChef'
  poolType: 'Legacy' | 'Trident' | 'Kashi' | 'Unknown'
}
