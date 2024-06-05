import type {
  Address,
  SushiPoolBase,
  SushiPoolWithIncentiveApr,
  Token,
} from 'sushi/types'

export enum SushiRewarderType {
  Primary = 'Primary',
  Secondary = 'Secondary',
}

export enum SushiChefType {
  MasterChefV1 = 'MasterChefV1',
  MasterChefV2 = 'MasterChefV2',
  MiniChef = 'MiniChef',
  Merkl = 'Merkl',
}

export type SushiIncentive = {
  id: string
  chainId: number
  rewarderAddress: Address
  rewardPerDay: number
  rewardToken: Token
  pid: number
  rewarderType: SushiRewarderType
  chefType: SushiChefType
}

export type SushiPoolWithIncentives<T extends SushiPoolBase = SushiPoolBase> =
  T &
    SushiPoolWithIncentiveApr<T> & {
      incentives: SushiIncentive[]
    }
