import { ChainId } from '@sushiswap/chain'
import { MasterChefV2 } from '@sushiswap/core'
import MasterChefV2ABI from '@sushiswap/core/abi/MasterChefV2.json'
import { readContract, ReadContractConfig, readContracts, ReadContractsConfig } from '@wagmi/core'
import { BigNumber } from 'ethers'

import { MASTERCHEF_V2_ADDRESS } from '../../../config'

export async function getPoolLength() {
  const poolLengthCall: ReadContractConfig = {
    addressOrName: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    contractInterface: MasterChefV2ABI,
    functionName: 'poolLength',
  }
  return readContract<MasterChefV2, Awaited<ReturnType<MasterChefV2['poolLength']>>>(poolLengthCall)
}

export async function getTotalAllocPoint() {
  const totalAllocPointCall: ReadContractConfig = {
    addressOrName: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    contractInterface: MasterChefV2ABI,
    functionName: 'totalAllocPoint',
  }
  return readContract<MasterChefV2, Awaited<ReturnType<MasterChefV2['totalAllocPoint']>>>(totalAllocPointCall)
}

export async function getSushiPerBlock() {
  const sushiPerBlockCall: ReadContractConfig = {
    addressOrName: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    contractInterface: MasterChefV2ABI,
    functionName: 'sushiPerBlock',
  }
  return readContract<MasterChefV2, Awaited<ReturnType<MasterChefV2['sushiPerBlock']>>>(sushiPerBlockCall)
}

export async function getPoolInfos(poolLength: number) {
  const poolInfoCalls: ReadContractsConfig['contracts'] = [...Array(poolLength)].map((_, i) => ({
    addressOrName: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM],
    args: [i],
    chainId: ChainId.ETHEREUM,
    contractInterface: MasterChefV2ABI,
    functionName: 'poolInfo',
  }))
  return readContracts<Awaited<ReturnType<MasterChefV2['poolInfo']>>[]>({
    allowFailure: true,
    contracts: poolInfoCalls,
  })
}

export async function getLpTokens(poolLength: number) {
  const lpTokenCalls: ReadContractsConfig['contracts'] = [...Array(poolLength)].map((_, i) => ({
    addressOrName: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM],
    args: [i],
    chainId: ChainId.ETHEREUM,
    contractInterface: MasterChefV2ABI,
    functionName: 'lpToken',
  }))
  return readContracts<Awaited<ReturnType<MasterChefV2['lpToken']>>[]>({
    allowFailure: true,
    contracts: lpTokenCalls,
  })
}

export async function getRewarders(poolLength: number) {
  const rewarderCalls: ReadContractsConfig['contracts'] = [...Array(poolLength)].map((_, i) => ({
    addressOrName: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM],
    args: [i],
    chainId: ChainId.ETHEREUM,
    contractInterface: MasterChefV2ABI,
    functionName: 'rewarder',
  }))
  return readContracts<Awaited<ReturnType<MasterChefV2['rewarder']>>[]>({
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
