import { ChainId } from '@sushiswap/chain'
import { SUSHI } from '@sushiswap/currency'
import { daysInYear, secondsInDay } from 'date-fns'
import { Farm } from 'src/types'

import { MINICHEF_ADDRESS } from '../../../config'
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
  try {
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
        // console.log('this', pool.pair, pool.lpBalance)

        if (!pool.pair || typeof pool.lpBalance !== 'number') return acc

        const sushiRewardPerDay = sushiPerDay * (pool.poolInfo.allocPoint.toNumber() / totalAllocPoint.toNumber())
        const sushiRewardPerYearUSD = daysInYear * sushiRewardPerDay * sushiPriceUSD

        const stakedLiquidityUSD = (pool.pair.liquidityUSD * pool.lpBalance) / pool.pair.totalSupply

        let incentives: Farm['incentives'] = []

        if (sushiRewardPerDay && sushiRewardPerDay > 0) {
          incentives.push({
            apr: sushiRewardPerYearUSD / stakedLiquidityUSD,
            rewardPerDay: sushiRewardPerDay,
            rewardToken: {
              address: SUSHI[chainId]?.address ?? '',
              decimals: SUSHI[chainId]?.decimals ?? 18,
              symbol: SUSHI[chainId]?.symbol ?? '',
            },
            rewarder: {
              address: MINICHEF_ADDRESS[chainId],
              type: 'Primary',
            },
          })
        }

        if (pool.rewarder) {
          const token = tokens.find((token) => token.id === pool.rewarder?.rewardToken)

          if (token) {
            let rewardPerSecond
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
        }

        incentives = incentives.filter((incentive) => incentive.apr !== 0)

        acc[pool.pair.id] = {
          id: pool.id,
          incentives: incentives,
          chefType: 'MiniChef',
          poolType: pool.pair.type,
        }

        return acc
      }, {}),
    }
  } catch (e) {
    console.log(chainId, e)
    return { chainId, farms: {} }
  }
}
