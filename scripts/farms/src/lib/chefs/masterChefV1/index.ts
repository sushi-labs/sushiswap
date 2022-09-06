import { ChainId } from '@sushiswap/chain'
import { IMasterChef, MasterChef } from '@sushiswap/core'
import MasterChefV1ABI from '@sushiswap/core/abi/MasterChef.json'
import { MASTERCHEF_ADDRESS } from '@sushiswap/core-sdk'
import { SUSHI } from '@sushiswap/currency'
import { readContract, ReadContractConfig, readContracts, ReadContractsConfig } from '@wagmi/core'
import { daysInYear, secondsInDay } from 'date-fns'
import { Farm } from 'src/types'

import { getAverageBlockTime, getPairs, getTokenBalancesOf, getTokens } from '../../common'

const SUSHI_PER_BLOCK = 100

async function getPoolLength() {
  const poolLengthCall: ReadContractConfig = {
    addressOrName: MASTERCHEF_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    contractInterface: MasterChefV1ABI,
    functionName: 'poolLength',
  }
  return readContract<IMasterChef, Awaited<ReturnType<MasterChef['poolLength']>>>(poolLengthCall)
}

async function getTotalAllocPoint() {
  const totalAllocPointCall: ReadContractConfig = {
    addressOrName: MASTERCHEF_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    contractInterface: MasterChefV1ABI,
    functionName: 'totalAllocPoint',
  }
  return readContract<IMasterChef, Awaited<ReturnType<MasterChef['totalAllocPoint']>>>(totalAllocPointCall)
}

async function getPoolInfos(poolLength: number) {
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

export async function getMasterChefV1(): Promise<{ chainId: ChainId; farms: Record<string, Farm> }> {
  const [poolLength, totalAllocPoint, [{ derivedUSD: sushiPriceUSD }], averageBlockTime] = await Promise.all([
    getPoolLength(),
    getTotalAllocPoint(),
    getTokens([SUSHI[ChainId.ETHEREUM].address], ChainId.ETHEREUM),
    getAverageBlockTime(ChainId.ETHEREUM),
  ])

  const poolInfos = await getPoolInfos(poolLength.toNumber())

  const [pairs, lpBalances] = await Promise.all([
    getPairs(
      poolInfos.map((pool) => pool.lpToken),
      ChainId.ETHEREUM
    ),
    getTokenBalancesOf(
      poolInfos.map((pool) => pool.lpToken),
      MASTERCHEF_ADDRESS[ChainId.ETHEREUM],
      ChainId.ETHEREUM
    ),
  ])

  const blocksPerDay = averageBlockTime ? secondsInDay / averageBlockTime : 0
  const sushiPerDay = SUSHI_PER_BLOCK * blocksPerDay

  return {
    chainId: ChainId.ETHEREUM,
    farms: poolInfos.reduce<Record<string, Farm>>((acc, farm, i) => {
      const pair = pairs.find((pair) => pair.id === farm.lpToken.toLowerCase())
      const lpBalance = lpBalances.find(({ token }) => token === farm.lpToken)?.balance
      if (!pair || !lpBalance) return acc

      const rewardPerDay = sushiPerDay * (farm.allocPoint.toNumber() / totalAllocPoint.toNumber())
      const rewardPerYearUSD = daysInYear * rewardPerDay * sushiPriceUSD

      acc[farm.lpToken.toLowerCase()] = {
        id: i,
        feeApy: pair.feeApy,
        incentives: [
          {
            apr: rewardPerYearUSD / ((pair.liquidityUSD * lpBalance) / pair.totalSupply),
            rewardPerDay: rewardPerDay,
            rewardToken: {
              address: SUSHI[ChainId.ETHEREUM].address,
              decimals: SUSHI[ChainId.ETHEREUM].decimals ?? 18,
              symbol: SUSHI[ChainId.ETHEREUM].symbol ?? '',
            },
            rewarder: {
              address: MASTERCHEF_ADDRESS[ChainId.ETHEREUM],
              type: 'Primary',
            },
          },
        ],
        chefType: 'MasterChefV1',
        poolType: pair.type,
      }
      return acc
    }, {}),
  }
}
