import { masterChefV2Abi } from '@sushiswap/abi/dist'
import { ChainId } from '@sushiswap/chain'
import { readContract, readContracts } from '@wagmi/core'
import { BigNumber } from 'ethers'

import { MASTERCHEF_V2_ADDRESS } from '../../../config'

export async function getPoolLength() {
  const poolLengthCall = {
    address: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    abi: masterChefV2Abi,
    functionName: 'poolLength',
  }
  return readContract(poolLengthCall)
}

export async function getTotalAllocPoint() {
  const totalAllocPointCall = {
    address: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    abi: masterChefV2Abi,
    functionName: 'totalAllocPoint',
  }
  return readContract(totalAllocPointCall)
}

export async function getSushiPerBlock() {
  const sushiPerBlockCall = {
    address: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    abi: masterChefV2Abi,
    functionName: 'sushiPerBlock',
  }
  return readContract(sushiPerBlockCall)
}

export async function getPoolInfos(poolLength: number) {
  const poolInfoCalls = [...Array(poolLength)].map((_, i) => ({
    address: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM],
    args: [i],
    chainId: ChainId.ETHEREUM,
    abi: masterChefV2Abi,
    functionName: 'poolInfo',
  }))
  return readContracts({
    allowFailure: true,
    contracts: poolInfoCalls,
  })
}

export async function getLpTokens(poolLength: number) {
  const lpTokenCalls = [...Array(poolLength)].map((_, i) => ({
    address: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM],
    args: [i],
    chainId: ChainId.ETHEREUM,
    abi: masterChefV2Abi,
    functionName: 'lpToken',
  }))
  return readContracts({
    allowFailure: true,
    contracts: lpTokenCalls,
  })
}

export async function getRewarders(poolLength: number) {
  const rewarderCalls = [...Array(poolLength)].map((_, i) => ({
    address: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM],
    args: [i],
    chainId: ChainId.ETHEREUM,
    abi: masterChefV2Abi,
    functionName: 'rewarder',
  }))
  return readContracts({
    allowFailure: true,
    contracts: rewarderCalls,
  })
}

export async function getRewarderInfos() {
  const { getBuiltGraphSDK } = await import('../../../../.graphclient')
  const sdk = getBuiltGraphSDK()

  const { rewarders } = await sdk.MasterChefV2Rewarders({
    where: {
      id_not: '0x0000000000000000000000000000000000000000',
      rewardToken_not: '0x0000000000000000000000000000000000000000',
    },
  })

  return rewarders.map((rewarder) => ({
    id: rewarder.id,
    rewardToken: rewarder.rewardToken as string,
    rewardPerSecond: BigNumber.from(rewarder.rewardPerSecond),
  }))
}
