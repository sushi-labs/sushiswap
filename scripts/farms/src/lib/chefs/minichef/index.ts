import { ChainId } from '@sushiswap/chain'
import { MINICHEF_ADDRESS } from '@sushiswap/core-sdk'
import { SUSHI } from '@sushiswap/currency'
import { daysInYear, secondsInDay } from 'date-fns'
import { Farm } from 'src/types'

import { divBigNumberToNumber, getPairs, getTokenBalancesOf, getTokens } from '../../common'
import {
  getLpTokens,
  getPoolInfos,
  getPoolLength,
  getRewarderInfos,
  getRewarders,
  getSushiPerSecond,
  getTotalAllocPoint,
} from './fetchers'

export async function getMinichef(chainId: ChainId): Promise<{ chainId: ChainId; farms: Record<string, Farm> }> {
  const [poolLength, totalAllocPoint, sushiPerSecond, rewarderInfos, [{ derivedUSD: sushiPriceUSD }]] =
    await Promise.all([
      getPoolLength(chainId),
      getTotalAllocPoint(chainId),
      getSushiPerSecond(chainId),
      getRewarderInfos(chainId),
      getTokens([SUSHI[ChainId.ETHEREUM].address], ChainId.ETHEREUM),
    ])

  const [poolInfos, lpTokens, rewarders, tokens] = await Promise.all([
    getPoolInfos(poolLength.toNumber(), chainId),
    getLpTokens(poolLength.toNumber(), chainId),
    getRewarders(poolLength.toNumber(), chainId),
    getTokens(
      rewarderInfos.map((rewarder) => rewarder.rewardToken),
      chainId
    ),
  ])

  const [pairs, lpBalances] = await Promise.all([
    getPairs(lpTokens, chainId),
    getTokenBalancesOf(lpTokens, MINICHEF_ADDRESS[chainId], chainId),
  ])

  const pools = [...Array(poolLength.toNumber())].map((_, i) => ({
    id: i,
    poolInfo: poolInfos[i],
    lpBalance: lpBalances.find(({ token }) => token === lpTokens[i])?.balance,
    pair: pairs.find((pair) => pair.id === lpTokens[i].toLowerCase()),
    rewarder: rewarderInfos.find((rewarderInfo) => rewarderInfo.id === rewarders[i].toLowerCase()),
  }))

  const sushiPerDay = secondsInDay * divBigNumberToNumber(sushiPerSecond, SUSHI[chainId]?.decimals ?? 18)

  return {
    chainId,
    farms: pools.reduce<Record<string, Farm>>((acc, pool) => {
      if (!pool.pair || !pool.lpBalance) return acc

      const sushiRewardPerDay = sushiPerDay * (pool.poolInfo.allocPoint.toNumber() / totalAllocPoint.toNumber())
      const sushiRewardPerYearUSD = daysInYear * sushiRewardPerDay * sushiPriceUSD

      const stakedLiquidityUSD = (pool.pair.liquidityUSD * pool.lpBalance) / pool.pair.totalSupply

      const incentives: Farm['incentives'] = []

      if (sushiRewardPerDay && sushiRewardPerDay > 0) {
        incentives.push({
          apr: sushiRewardPerYearUSD / stakedLiquidityUSD,
          rewardPerDay: sushiRewardPerDay,
          rewardToken: {
            address: SUSHI[chainId]?.address ?? '',
            symbol: SUSHI[chainId]?.symbol ?? '',
            decimals: SUSHI[chainId]?.decimals ?? 18,
          },
        })
      }

      if (pool.pair.id === '0xf38c5b39f29600765849ca38712f302b1522c9b8') {
        console.log({ sushiPriceUSD, sushiRewardPerYearUSD, stakedLiquidityUSD, lusd: pool.pair.liquidityETH })
      }

      if (pool.rewarder) {
        const token = tokens.find((token) => token.id === pool.rewarder?.rewardToken)

        if (token) {
          let rewardPerSecond

          // if (pool.pair.id === '0xc704050a17af0caed763431b80e38e8d8ff15591') {
          //   console.log('RPS', pool)
          // }

          // Multipool rewarder
          if (pool.rewarder.pools) {
            const poolInfo = pool.rewarder.pools.find((rewaderPool) => rewaderPool.id === pool.id)
            if (poolInfo) {
              // poolInfo.allocPoint.div(masterChefV2.totalAllocPoint).times(masterChefV2.sushiPerDay)
              rewardPerSecond =
                (poolInfo.allocPoint / pool.rewarder.totalAllocPoint) *
                divBigNumberToNumber(pool.rewarder.rewardPerSecond, token.decimals)
            }

            // Singlepool rewarder
          } else {
            rewardPerSecond = divBigNumberToNumber(pool.rewarder.rewardPerSecond, token.decimals)
          }

          if (rewardPerSecond) {
            const rewardPerDay = secondsInDay * rewardPerSecond
            const rewardPerYearUSD = daysInYear * rewardPerDay * token.derivedUSD

            incentives.push({
              apr: rewardPerYearUSD / stakedLiquidityUSD,
              rewardPerDay: rewardPerDay,
              rewardToken: {
                address: pool.rewarder.rewardToken,
                symbol: token.symbol,
                decimals: token.decimals,
              },
            })
          }
        }
      }

      acc[pool.pair.id] = {
        feeApy: pool.pair.feeApy,
        incentives: incentives,
        chefType: 'MiniChef',
        poolType: pool.pair.type,
      }

      return acc
    }, {}),
  }
}
