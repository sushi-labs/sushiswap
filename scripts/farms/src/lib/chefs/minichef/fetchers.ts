import { ChainId } from '@sushiswap/chain'
import { ComplexRewarderTime, MiniChefV2 } from '@sushiswap/core'
import ComplexRewarderTimeABI from '@sushiswap/core/abi/ComplexRewarderTime.json'
import MiniChefV2ABI from '@sushiswap/core/abi/MiniChefV2.json'
import { GRAPH_HOST, MINICHEF_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { ReadContractConfig, readContracts, ReadContractsConfig } from '@wagmi/core'
import { readContract } from '@wagmi/core'
import { BigNumber } from 'ethers'
import { MINICHEF_ADDRESS } from 'src/config'

export async function getPoolLength(chainId: ChainId) {
  const poolLengthCall: ReadContractConfig = {
    addressOrName: MINICHEF_ADDRESS[chainId],
    chainId: chainId,
    contractInterface: MiniChefV2ABI,
    functionName: 'poolLength',
  }
  return readContract<MiniChefV2, Awaited<ReturnType<MiniChefV2['poolLength']>>>(poolLengthCall)
}

export async function getTotalAllocPoint(chainId: ChainId) {
  const totalAllocPointCall: ReadContractConfig = {
    addressOrName: MINICHEF_ADDRESS[chainId],
    chainId: chainId,
    contractInterface: MiniChefV2ABI,
    functionName: 'totalAllocPoint',
  }

  return readContract<MiniChefV2, Awaited<ReturnType<MiniChefV2['totalAllocPoint']>>>(totalAllocPointCall)
}

export async function getSushiPerSecond(chainId: ChainId) {
  const sushiPerSecondCall: ReadContractConfig = {
    addressOrName: MINICHEF_ADDRESS[chainId],
    chainId: chainId,
    contractInterface: MiniChefV2ABI,
    functionName: 'sushiPerSecond',
  }
  return readContract<MiniChefV2, Awaited<ReturnType<MiniChefV2['sushiPerSecond']>>>(sushiPerSecondCall)
}

export async function getPoolInfos(poolLength: number, chainId: ChainId) {
  const poolInfoCalls: ReadContractsConfig['contracts'] = [...Array(poolLength)].map((_, i) => ({
    addressOrName: MINICHEF_ADDRESS[chainId],
    args: [i],
    chainId: chainId,
    contractInterface: MiniChefV2ABI,
    functionName: 'poolInfo',
  }))
  return readContracts<Awaited<ReturnType<MiniChefV2['poolInfo']>>[]>({
    allowFailure: true,
    contracts: poolInfoCalls,
  })
}

export async function getLpTokens(poolLength: number, chainId: ChainId) {
  const lpTokenCalls: ReadContractsConfig['contracts'] = [...Array(poolLength)].map((_, i) => ({
    addressOrName: MINICHEF_ADDRESS[chainId],
    args: [i],
    chainId: chainId,
    contractInterface: MiniChefV2ABI,
    functionName: 'lpToken',
  }))
  return readContracts<Awaited<ReturnType<MiniChefV2['lpToken']>>[]>({
    allowFailure: true,
    contracts: lpTokenCalls,
  })
}

export async function getRewarders(poolLength: number, chainId: ChainId) {
  const rewarderCalls: ReadContractsConfig['contracts'] = [...Array(poolLength)].map((_, i) => ({
    addressOrName: MINICHEF_ADDRESS[chainId],
    args: [i],
    chainId: chainId,
    contractInterface: MiniChefV2ABI,
    functionName: 'rewarder',
  }))
  return readContracts<Awaited<ReturnType<MiniChefV2['rewarder']>>[]>({
    allowFailure: true,
    contracts: rewarderCalls,
  })
}

export async function getRewarderInfos(chainId: ChainId) {
  const { getBuiltGraphSDK } = await import('../../../../.graphclient')
  const subgraphName = MINICHEF_SUBGRAPH_NAME[chainId]
  const sdk = getBuiltGraphSDK({ host: GRAPH_HOST[chainId], name: subgraphName })

  const { rewarders } = await sdk.MiniChefRewarders({
    where: {
      id_not: '0x0000000000000000000000000000000000000000',
      rewardToken_not: '0x0000000000000000000000000000000000000000',
    },
  })
  console.log('get rewarder infos')

  return Promise.all(
    rewarders.map(async (rewarder) => {
      try {
        // const poolLengthCall: ReadContractConfig = {
        //   addressOrName: rewarder.id,
        //   chainId: chainId,
        //   contractInterface: ComplexRewarderTimeABI,
        //   functionName: 'poolLength',
        // }
        const poolLength = await getPoolLength(chainId)
        // const poolLength = await readContract<MiniChefV2, Awaited<ReturnType<MiniChefV2['poolLength']>>>(poolLengthCall)

        const poolIds = !poolLength?.isZero() ? [...Array(poolLength?.toNumber()).keys()] : []

        const poolInfoCalls: ReadContractsConfig['contracts'] = poolIds.map((_, i) => ({
          addressOrName: rewarder.id,
          args: [i],
          chainId: chainId,
          contractInterface: ComplexRewarderTimeABI,
          functionName: 'poolInfo',
        }))

        const poolInfos = await readContracts<Awaited<ReturnType<ComplexRewarderTime['poolInfo']>>[]>({
          allowFailure: true,
          contracts: poolInfoCalls,
        })

        return {
          id: rewarder.id,
          pools: poolIds.map((_, i) => ({
            // Minichef pool ID
            id: poolIds[i],
            allocPoint: Number(poolInfos[i].allocPoint),
          })),
          totalAllocPoint: poolInfos.reduce((acc, cur) => (acc += cur.allocPoint.toNumber()), 0),
          rewardToken: rewarder.rewardToken,
          rewardPerSecond: BigNumber.from(rewarder.rewardPerSecond),
        }
      } catch (error) {
        // console.log('error', error)
        return {
          id: rewarder.id,
          rewardToken: rewarder.rewardToken,
          rewardPerSecond: BigNumber.from(rewarder.rewardPerSecond),
        }
      }
    })
  )
}
