import { ChainId } from '@sushiswap/chain'
import { IMasterChef, MasterChef } from '@sushiswap/core'
import MasterChefV1ABI from '@sushiswap/core/abi/MasterChef.json'
import { readContract, ReadContractConfig, readContracts, ReadContractsConfig } from '@wagmi/core'

import { MASTERCHEF_ADDRESS } from '../../../config'

export async function getPoolLength() {
  const poolLengthCall: ReadContractConfig = {
    addressOrName: MASTERCHEF_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    contractInterface: MasterChefV1ABI,
    functionName: 'poolLength',
  }
  return readContract<IMasterChef, Awaited<ReturnType<MasterChef['poolLength']>>>(poolLengthCall)
}

export async function getTotalAllocPoint() {
  const totalAllocPointCall: ReadContractConfig = {
    addressOrName: MASTERCHEF_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    contractInterface: MasterChefV1ABI,
    functionName: 'totalAllocPoint',
  }
  return readContract<IMasterChef, Awaited<ReturnType<MasterChef['totalAllocPoint']>>>(totalAllocPointCall)
}

export async function getPoolInfos(poolLength: number) {
  const poolInfoCalls: ReadContractsConfig['contracts'] = [...Array(poolLength)].map((_, i) => ({
    addressOrName: MASTERCHEF_ADDRESS[ChainId.ETHEREUM],
    args: [i],
    chainId: ChainId.ETHEREUM,
    contractInterface: MasterChefV1ABI,
    functionName: 'poolInfo',
  }))
  return readContracts<Awaited<ReturnType<MasterChef['poolInfo']>>[]>({
    allowFailure: true,
    contracts: poolInfoCalls,
  })
}
