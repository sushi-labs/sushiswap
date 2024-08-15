import { readContract, readContracts } from '@wagmi/core'
import { masterChefV1Abi } from 'sushi/abi'
import { ChainId } from 'sushi/chain'

import { config } from 'src/lib/wagmi.js'
import { MASTERCHEF_ADDRESS } from 'sushi/config'

export async function getPoolLength() {
  const poolLengthCall = {
    address: MASTERCHEF_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    abi: masterChefV1Abi,
    functionName: 'poolLength',
  } as const

  return readContract(config, poolLengthCall)
}

export async function getTotalAllocPoint() {
  const totalAllocPointCall = {
    address: MASTERCHEF_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    abi: masterChefV1Abi,
    functionName: 'totalAllocPoint',
  } as const

  return readContract(config, totalAllocPointCall)
}

export async function getPoolInfos(poolLength: bigint) {
  const poolInfoCalls = [...Array(Number(poolLength))].map(
    (_, i) =>
      ({
        address: MASTERCHEF_ADDRESS[ChainId.ETHEREUM],
        args: [BigInt(i)],
        chainId: ChainId.ETHEREUM,
        abi: masterChefV1Abi,
        functionName: 'poolInfo',
      }) as const,
  )

  return readContracts(config, {
    allowFailure: false,
    contracts: poolInfoCalls,
  }).then((results) =>
    results.flatMap((result) => ({
      lpToken: result[0],
      allocPoint: result[1],
      lastRewardBlock: result[2],
      accSushiPerShare: result[3],
    })),
  )
}
