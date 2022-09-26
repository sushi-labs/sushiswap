import { ChainId } from '@sushiswap/chain'
import { SUSHI } from '@sushiswap/currency'
import { daysInYear, secondsInDay } from 'date-fns'
import { Farm } from 'src/types'

import { MASTERCHEF_ADDRESS } from '../../../config'
import { getAverageBlockTime, getPairs, getTokenBalancesOf, getTokens } from '../../common'
import { getPoolInfos, getPoolLength, getTotalAllocPoint } from './fetchers'

const SUSHI_PER_BLOCK = 100

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

      let incentives: Farm['incentives'] = [
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
      ]

      incentives = incentives.filter((incentive) => incentive.apr !== 0)

      acc[farm.lpToken.toLowerCase()] = {
        id: i,
        incentives: incentives,
        chefType: 'MasterChefV1',
        poolType: pair.type,
      }
      return acc
    }, {}),
  }
}
