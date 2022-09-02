import { ChainId } from '@sushiswap/chain'
import { MasterChefV2 } from '@sushiswap/core'
import MasterChefV2ABI from '@sushiswap/core/abi/MasterChefV2.json'
import { MASTERCHEF_V2_ADDRESS } from '@sushiswap/core-sdk'
import { SUSHI } from '@sushiswap/currency'
import { readContract, ReadContractConfig, readContracts, ReadContractsConfig } from '@wagmi/core'
import { daysInYear, secondsInDay } from 'date-fns'
import { BigNumber } from 'ethers'
import { Farm } from 'src/types'

import { divBigNumberToNumber, getAverageBlockTime, getPairs, getTokenBalancesOf, getTokens } from '../../common'

async function getPoolLength() {
  const poolLengthCall: ReadContractConfig = {
    addressOrName: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    contractInterface: MasterChefV2ABI,
    functionName: 'poolLength',
  }
  return readContract<MasterChefV2, Awaited<ReturnType<MasterChefV2['poolLength']>>>(poolLengthCall)
}

async function getTotalAllocPoint() {
  const totalAllocPointCall: ReadContractConfig = {
    addressOrName: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    contractInterface: MasterChefV2ABI,
    functionName: 'totalAllocPoint',
  }
  return readContract<MasterChefV2, Awaited<ReturnType<MasterChefV2['totalAllocPoint']>>>(totalAllocPointCall)
}

async function getSushiPerBlock() {
  const sushiPerBlockCall: ReadContractConfig = {
    addressOrName: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    contractInterface: MasterChefV2ABI,
    functionName: 'sushiPerBlock',
  }
  return readContract<MasterChefV2, Awaited<ReturnType<MasterChefV2['sushiPerBlock']>>>(sushiPerBlockCall)
}

async function getPoolInfos(poolLength: number) {
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

async function getLpTokens(poolLength: number) {
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

async function getRewarders(poolLength: number) {
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

async function getRewarderInfos() {
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

export async function getMasterChefV2(): Promise<{ chainId: ChainId; farms: Record<string, Farm> }> {
  const [poolLength, totalAllocPoint, sushiPerBlock, rewarderInfos, averageBlockTime] = await Promise.all([
    getPoolLength(),
    getTotalAllocPoint(),
    getSushiPerBlock(),
    getRewarderInfos(),
    getAverageBlockTime(ChainId.ETHEREUM),
  ])

  const [poolInfos, lpTokens, rewarders, tokens] = await Promise.all([
    getPoolInfos(poolLength.toNumber()),
    getLpTokens(poolLength.toNumber()),
    getRewarders(poolLength.toNumber()),
    getTokens(
      [...rewarderInfos.map((rewarder) => rewarder.rewardToken), SUSHI[ChainId.ETHEREUM].address],
      ChainId.ETHEREUM
    ),
  ])

  const [pairs, lpBalances] = await Promise.all([
    getPairs(lpTokens, ChainId.ETHEREUM),
    getTokenBalancesOf(lpTokens, MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM], ChainId.ETHEREUM),
  ])

  const pools = [...Array(poolLength.toNumber())].map((_, i) => ({
    id: i,
    poolInfo: poolInfos[i],
    lpBalance: lpBalances.find(({ token }) => token === lpTokens[i])?.balance,
    pair: pairs.find((pair) => pair.id === lpTokens[i].toLowerCase()),
    rewarder: rewarderInfos.find((rewarderInfo) => rewarderInfo.id === rewarders[i].toLowerCase()),
  }))

  const blocksPerDay = averageBlockTime ? secondsInDay / averageBlockTime : 0
  const sushiPerDay = divBigNumberToNumber(sushiPerBlock, SUSHI[ChainId.ETHEREUM].decimals) * blocksPerDay
  const sushiPriceUSD =
    tokens.find((tokenPrice) => tokenPrice.id === SUSHI[ChainId.ETHEREUM].address.toLowerCase())?.derivedUSD ?? 0

  return {
    chainId: ChainId.ETHEREUM,
    farms: pools.reduce<Record<string, Farm>>((acc, pool) => {
      if (!pool.pair || !pool.lpBalance) return acc

      const sushiRewardPerDay = sushiPerDay * (pool.poolInfo.allocPoint.toNumber() / totalAllocPoint.toNumber())
      const sushiRewardPerYearUSD = daysInYear * sushiRewardPerDay * sushiPriceUSD

      const stakedLiquidityUSD = (pool.pair.liquidityUSD * pool.lpBalance) / pool.pair.totalSupply

      const incentives: Farm['incentives'] = [
        {
          apr: sushiRewardPerYearUSD / stakedLiquidityUSD,
          rewardPerDay: sushiRewardPerDay,
          rewardToken: {
            address: SUSHI[ChainId.ETHEREUM].address,
            decimals: SUSHI[ChainId.ETHEREUM].decimals ?? 18,
            symbol: SUSHI[ChainId.ETHEREUM].symbol ?? '',
          },
          rewarder: {
            address: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM],
            type: 'Primary',
          },
        },
      ]

      if (pool.rewarder) {
        const token = tokens.find((token) => token.id === pool.rewarder?.rewardToken)
        if (token) {
          const rewardPerSecond = divBigNumberToNumber(pool.rewarder.rewardPerSecond, token.decimals)
          const rewardPerDay = secondsInDay * rewardPerSecond
          const rewardPerYearUSD = daysInYear * rewardPerDay * token.derivedUSD

          incentives.push({
            apr: rewardPerYearUSD / stakedLiquidityUSD,
            rewardPerDay: rewardPerDay,
            rewardToken: {
              address: pool.rewarder.rewardToken,
              decimals: token.decimals,
              symbol: token.symbol,
            },
            rewarder: {
              address: pool.rewarder.id,
              type: 'Secondary',
            },
          })
        }
      }

      acc[pool.pair.id] = {
        id: pool.id,
        feeApy: pool.pair.feeApy,
        incentives: incentives,
        chefType: 'MasterChefV2',
        poolType: pool.pair.type,
      }

      return acc
    }, {}),
  }
}
