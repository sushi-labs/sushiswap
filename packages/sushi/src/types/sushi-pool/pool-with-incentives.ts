import type {
  Address,
  PoolId,
  PoolIfIncentivized,
  PoolWithIncentiveApr,
  Token,
} from 'sushi/types'

export enum RewarderType {
  Primary = 'Primary',
  Secondary = 'Secondary',
}

export enum ChefType {
  MasterChefV1 = 'MasterChefV1',
  MasterChefV2 = 'MasterChefV2',
  MiniChef = 'MiniChef',
  Merkl = 'Merkl',
}

export type Incentive = {
  id: string
  chainId: number
  rewarderAddress: Address
  rewardPerDay: number
  rewardToken: Token
  pid: number
  rewarderType: RewarderType
  chefType: ChefType
}

export type PoolWithIncentives<T extends PoolId = PoolId> = T &
  PoolIfIncentivized<T> &
  PoolWithIncentiveApr<T> & {
    incentives: Incentive[]
  }
