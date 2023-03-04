import { masterChefV1Abi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { Address, readContract, readContracts } from '@wagmi/core'
import { BigNumber } from 'ethers'

import { MASTERCHEF_ADDRESS } from '../../../config.js'

export async function getPoolLength() {
  const poolLengthCall = {
    address: MASTERCHEF_ADDRESS[ChainId.ETHEREUM] as Address,
    chainId: ChainId.ETHEREUM,
    abi: masterChefV1Abi,
    functionName: 'poolLength',
  } as const

  return readContract(poolLengthCall)
}

export async function getTotalAllocPoint() {
  const totalAllocPointCall = {
    address: MASTERCHEF_ADDRESS[ChainId.ETHEREUM] as Address,
    chainId: ChainId.ETHEREUM,
    abi: masterChefV1Abi,
    functionName: 'totalAllocPoint',
  } as const

  return readContract(totalAllocPointCall)
}

export async function getPoolInfos(poolLength: number) {
  const poolInfoCalls = [...Array(poolLength)].map(
    (_, i) =>
      ({
        address: MASTERCHEF_ADDRESS[ChainId.ETHEREUM] as Address,
        args: [BigNumber.from(i)],
        chainId: ChainId.ETHEREUM,
        abi: masterChefV1Abi,
        functionName: 'poolInfo',
      } as const)
  )

  return readContracts({
    allowFailure: true,
    contracts: poolInfoCalls,
  })
}
