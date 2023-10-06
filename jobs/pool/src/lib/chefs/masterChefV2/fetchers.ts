import { masterChefV2Abi } from 'sushi/abi'
import { ChainId } from 'sushi/chain'
import { Address, readContract, readContracts } from '@wagmi/core'

import { MASTERCHEF_V2_ADDRESS } from '../../../config.js'

export async function getPoolLength() {
  const poolLengthCall = {
    address: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM] as Address,
    chainId: ChainId.ETHEREUM,
    abi: masterChefV2Abi,
    functionName: 'poolLength',
  } as const

  return readContract(poolLengthCall)
}

export async function getTotalAllocPoint() {
  return readContract({
    address: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM] as Address,
    chainId: ChainId.ETHEREUM,
    abi: masterChefV2Abi,
    functionName: 'totalAllocPoint',
  } as const)
}

export async function getSushiPerBlock() {
  return readContract({
    address: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM] as Address,
    chainId: ChainId.ETHEREUM,
    abi: masterChefV2Abi,
    functionName: 'sushiPerBlock',
  } as const)
}

export async function getPoolInfos(poolLength: number) {
  const poolInfoCalls = [...Array(poolLength)].map(
    (_, i) =>
      ({
        address: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM] as Address,
        args: [BigInt(i)],
        chainId: ChainId.ETHEREUM,
        abi: masterChefV2Abi,
        functionName: 'poolInfo',
      } as const)
  )

  const poolInfos = await readContracts({
    allowFailure: false,
    contracts: poolInfoCalls,
  })

  return poolInfos.map((poolInfo) => ({
    accSushiPerShare: poolInfo[0],
    lastRewardBlock: poolInfo[1],
    allocPoint: poolInfo[2],
  }))
}

export async function getLpTokens(poolLength: number) {
  const lpTokenCalls = [...Array(poolLength)].map(
    (_, i) =>
      ({
        address: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM] as Address,
        args: [BigInt(i)],
        chainId: ChainId.ETHEREUM,
        abi: masterChefV2Abi,
        functionName: 'lpToken',
      } as const)
  )

  return readContracts({
    allowFailure: false,
    contracts: lpTokenCalls,
  })
}

export async function getRewarders(poolLength: number) {
  const rewarderCalls = [...Array(poolLength)].map(
    (_, i) =>
      ({
        address: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM] as Address,
        args: [BigInt(i)],
        chainId: ChainId.ETHEREUM,
        abi: masterChefV2Abi,
        functionName: 'rewarder',
      } as const)
  )

  return readContracts({
    allowFailure: false,
    contracts: rewarderCalls,
  })
}

export async function getRewarderInfos() {
  const { getBuiltGraphSDK } = await import('../../../../.graphclient/index.js')
  const sdk = getBuiltGraphSDK()

  const { rewarders } = await sdk.MasterChefV2Rewarders()

  return rewarders.map((rewarder) => ({
    id: rewarder.id,
    rewardToken: rewarder.rewardToken as string,
    rewardPerSecond: BigInt(rewarder.rewardPerSecond),
  }))
}
