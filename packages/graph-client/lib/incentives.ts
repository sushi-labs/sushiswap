import { ChainId } from 'sushi/chain'

export interface Incentive {
  poolId: string
  type: 'MasterChefV1' | 'MasterChefV2' | 'MiniChef'
  pid: number
  chainId: ChainId
  apr: string
  rewardPerDay: string
  rewardToken: {
    address: string
    decimals: number
    symbol: string
  }
  rewarderAddress: string
  rewarderType: 'Primary' | 'Secondary'
}

export const getIncentives = async (): Promise<Incentive[]> =>
  fetch('https://incentives.sushi.com/v0').then((data: any) => data.json())

export const getIncentivesByPoolIds = async (
  poolIds: string[],
): Promise<Incentive[]> =>
  fetch(`https://incentives.sushi.com/v0?poolIds=${poolIds.join(',')}`).then(
    (data: any) => data.json(),
  )

export const getIncentivesByPoolId = async (
  chainId: ChainId,
  address: string,
): Promise<Incentive[]> =>
  fetch(`https://incentives.sushi.com/v0/${chainId}/${address}`).then(
    (data: any) => data.json(),
  )
