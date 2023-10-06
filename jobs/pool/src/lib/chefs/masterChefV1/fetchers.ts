import { masterChefV1Abi } from 'sushi/abi'
import { ChainId } from 'sushi/chain'
import { Address, readContract, readContracts } from '@wagmi/core'

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

export async function getPoolInfos(poolLength: bigint) {
  const poolInfoCalls = [...Array(Number(poolLength))].map(
    (_, i) =>
      ({
        address: MASTERCHEF_ADDRESS[ChainId.ETHEREUM] as Address,
        args: [BigInt(i)],
        chainId: ChainId.ETHEREUM,
        abi: masterChefV1Abi,
        functionName: 'poolInfo',
      } as const)
  )

  return readContracts({
    allowFailure: true,
    contracts: poolInfoCalls,
  }).then((results) =>
    results
      .filter(({ result }) => !!result)
      .map(({ result }) => ({
        lpToken: result[0],
        allocPoint: result[1],
        lastRewardBlock: result[2],
        accSushiPerShare: result[3],
      }))
  )
}
