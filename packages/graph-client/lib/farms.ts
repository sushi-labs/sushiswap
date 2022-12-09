import { ChainId } from '@sushiswap/chain'

// TODO: Move API to OpenAPI, use graph-mesh to fetch
export interface Farm {
  id: string
  incentives: {
    apr: string
    rewardPerDay: string
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

export interface FarmAPI {
  [key: string]: {
    chainId: ChainId
    farms: { [lpToken: string]: Farm }
  }
}

export const getFarms = async (): Promise<FarmAPI> => fetch('https://farm.sushi.com/v0').then((data) => data.json())
