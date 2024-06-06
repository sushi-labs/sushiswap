import { readContract, readContracts } from '@wagmi/core'
import zip from 'lodash.zip'
import { complexRewarderTimeAbi, miniChefAbi } from 'sushi/abi'
import { ChainId } from 'sushi/chain'

import { getMiniChefRewarders } from '@sushiswap/graph-client-new/mini-chef'
import { config } from 'src/lib/wagmi.js'
import { MiniChefChainId } from 'sushi/config'
import { Address } from 'viem'
import { MINICHEF_ADDRESS } from '../../../config.js'

export async function getPoolLength(chainId: ChainId) {
  const poolLengthCall = {
    address: MINICHEF_ADDRESS[chainId],
    chainId: chainId,
    abi: miniChefAbi,
    functionName: 'poolLength',
  } as const

  return readContract(config, poolLengthCall)
}

export async function getTotalAllocPoint(chainId: ChainId) {
  const totalAllocPointCall = {
    address: MINICHEF_ADDRESS[chainId],
    chainId: chainId,
    abi: miniChefAbi,
    functionName: 'totalAllocPoint',
  } as const

  return readContract(config, totalAllocPointCall)
}

export async function getSushiPerSecond(chainId: ChainId) {
  const sushiPerSecondCall = {
    address: MINICHEF_ADDRESS[chainId],
    chainId: chainId,
    abi: miniChefAbi,
    functionName: 'sushiPerSecond',
  } as const

  return readContract(config, sushiPerSecondCall)
}

export async function getPoolInfos(poolLength: bigint, chainId: ChainId) {
  const poolInfoCalls = [...Array(Number(poolLength))].map(
    (_, i) =>
      ({
        address: MINICHEF_ADDRESS[chainId],
        args: [BigInt(i)],
        chainId: chainId,
        abi: miniChefAbi,
        functionName: 'poolInfo',
      }) as const,
  )

  return readContracts(config, {
    allowFailure: true,
    contracts: poolInfoCalls,
  }).then((results) =>
    results.map(({ result }) =>
      result
        ? {
            accSushiPerShare: result[0],
            lastRewardTime: result[1],
            allocPoint: result[2],
          }
        : undefined,
    ),
  )
}

export async function getLpTokens(poolLength: bigint, chainId: ChainId) {
  const lpTokenCalls = [...Array(Number(poolLength))].map(
    (_, i) =>
      ({
        address: MINICHEF_ADDRESS[chainId],
        args: [BigInt(i)],
        chainId: chainId,
        abi: miniChefAbi,
        functionName: 'lpToken',
      }) as const,
  )

  return readContracts(config, {
    allowFailure: true,
    contracts: lpTokenCalls,
  }).then((results) => results.map(({ result }) => result))
}

export async function getRewarders(poolLength: bigint, chainId: ChainId) {
  const rewarderCalls = [...Array(Number(poolLength))].map(
    (_, i) =>
      ({
        address: MINICHEF_ADDRESS[chainId],
        args: [BigInt(i)],
        chainId: chainId,
        abi: miniChefAbi,
        functionName: 'rewarder',
      }) as const,
  )

  return readContracts(config, {
    allowFailure: true,
    contracts: rewarderCalls,
  }).then((results) => results.map(({ result }) => result))
}

export async function getRewarderInfos(chainId: MiniChefChainId) {
  const rewarders = await getMiniChefRewarders({ chainId })
  console.log(`Retrieved ${rewarders.length} rewarders from ${chainId}`)

  return Promise.all(
    rewarders.map(async (rewarder) => {
      try {
        // single-rewarders, no need to fetch anything for those, can just return
        const blacklist: Record<number, string[]> = {
          [ChainId.POLYGON]: [
            '0xb52b4b6779553a89e7f5f6f1d463595d88e88822',
            '0x0fc98e524095f7a0f09eb9786beba120060f8004',
            '0x9e21698426a29c32d7c0fdaeb7723c9856ba9ac7',
            '0x71581bf0ce397f50f87cc2490146d30a1e686461',
            '0x4db1c6364924b90310d68948fc7a3121fa9edf10',
            '0x99246001c6e458c63052fb4e3d04df6bd932a6a7',
            '0x4bb4c1b0745ef7b4642feeccd0740dec417ca0a0',
            '0x78b8abe9e6bf27d3ea68da096921b77efcfd389c',
          ],
          [ChainId.ARBITRUM]: [
            '0x9c37b0b498da78830284afdcb534c3350b52e744',
            '0x948bfbb7bdb7e74ec8ed0859c79502408bee4de1',
            '0xec932d20ba851ac26630835771476dc2d1a3ac8d',
            '0xf6348d37950c79b9f7b02b4d97e04db7dea855ae',
            '0x1a9c20e2b0ac11ebecbdca626bba566c4ce8e606',
            '0xae961a7d116bfd9b2534ad27fe4d178ed188c87a',
            '0x3c61b93b64f59b5091a11a071083598ee8b5cb64',
            '0x1a140bed2ec8ce72ee3723d18fd5d50851e455fd',
            '0xccc3760a0a315937877687bc99df4edb0f7315b4',
            '0x294eadcc534084c1333dc99e1afcf3e92c5c1297',
            '0xb873813f710093cbc17836297a6fefcfc6989faf',
            '0xa15a0789112d9aa7e40e76bfaa39ae36cc0aad3c',
          ],
          [ChainId.GNOSIS]: [
            '0xb291149e478dbdd2cd2528ad4088ee5c8376df1e',
            '0xc375411c6597f692add6a7a3ad5b3c38626b0f26',
          ],
          [ChainId.ARBITRUM_NOVA]: [
            '0x3f505b5cff05d04f468db65e27e72ec45a12645f',
            '0x840ecabcad4d6b8d25a9bb853ae32eac467e017b',
            '0x16ac10499ad2712a847641996e0aab97e90305fa',
            '0x948bfbb7bdb7e74ec8ed0859c79502408bee4de1',
            '0x3f505b5cff05d04f468db65e27e72ec45a12645f',
          ],
        }

        if (
          blacklist[chainId]?.includes(rewarder.id) ||
          rewarder.id === '0x0000000000000000000000000000000000000000'
        ) {
          return {
            id: rewarder.id as Address,
            rewardToken: rewarder.address,
            rewardPerSecond: BigInt(rewarder.rewardPerSecond),
          }
        }

        const poolLength = await getPoolLength(chainId)

        const poolIds =
          poolLength !== 0n ? [...Array(Number(poolLength)).keys()] : []

        const poolInfoCalls = poolIds.map(
          (_, i) =>
            ({
              address: rewarder.id as Address,
              args: [BigInt(i)],
              chainId: chainId,
              abi: complexRewarderTimeAbi,
              functionName: 'poolInfo',
            }) as const,
        )

        const poolInfos = await readContracts(config, {
          allowFailure: true,
          contracts: poolInfoCalls,
        })

        const zipped = zip(poolIds, poolInfos)
        const successful = zipped
          .filter(([, poolInfo]) => poolInfo?.result)
          .map(([poolId, poolInfo]) => [poolId, poolInfo!.result!] as const)

        return {
          id: rewarder.id,
          pools: successful.map(([id, [, , allocPoint]]) => ({
            // Minichef pool ID
            id,
            allocPoint: Number(allocPoint),
          })),
          totalAllocPoint: successful.reduce((acc, [, [, , allocPoint]]) => {
            acc += allocPoint
            return acc
          }, 0n),
          rewardToken: rewarder.address,
          rewardPerSecond: BigInt(rewarder.rewardPerSecond),
        }
      } catch (error) {
        console.log('error', chainId, rewarder.id, error)

        // so that the script doesn't fail on new should-be-blacklisted pools
        return {
          id: rewarder.id,
          rewardToken: rewarder.address,
          rewardPerSecond: BigInt(rewarder.rewardPerSecond),
        }
      }
    }),
  )
}
