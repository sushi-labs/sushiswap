import { ChainId } from '@sushiswap/chain'
import { SUSHI, SUSHI_ADDRESS } from '@sushiswap/currency'
import type { SushiSwapChainId, TridentChainId } from '@sushiswap/graph-config'
import type { Address } from '@wagmi/core'
import { daysInYear, secondsInDay } from 'date-fns'

import { MINICHEF_ADDRESS } from '../../../config.js'
import { divBigNumberToNumber, getPairs, getTokenBalancesOf, getTokens } from '../../common/index.js'
import type { ChefReturn, Farm } from '../../types.js'
import {
  getLpTokens,
  getPoolInfos,
  getPoolLength,
  getRewarderInfos,
  getRewarders,
  getSushiPerSecond,
  getTotalAllocPoint,
} from './fetchers.js'
export async function getMinichef(chainId: SushiSwapChainId | TridentChainId): Promise<ChefReturn> {
  try {
    if (!(chainId in SUSHI)) {
      return { chainId, farms: null }
    }

    // @ts-ignore
    const [poolLength, totalAllocPoint, sushiPerSecond, rewarderInfos, [{ derivedUSD: sushiPriceUSD }]] =
      await Promise.all([
        getPoolLength(chainId),
        getTotalAllocPoint(chainId),
        getSushiPerSecond(chainId),
        getRewarderInfos(chainId),
        getTokens([SUSHI_ADDRESS[ChainId.ETHEREUM]], ChainId.ETHEREUM),
      ])
    const sushiPerDay =
      secondsInDay * divBigNumberToNumber(sushiPerSecond, SUSHI[chainId as keyof typeof SUSHI]?.decimals ?? 18)

    console.log(
      `MiniChef ${chainId} - pools: ${poolLength}, sushiPerDay: ${sushiPerDay}, rewarderInfos: ${rewarderInfos.length}, totalAllocPoint: ${totalAllocPoint}`
    )

    const [poolInfos, lpTokens, rewarders, tokens] = await Promise.all([
      getPoolInfos(poolLength.toNumber(), chainId),
      getLpTokens(poolLength.toNumber(), chainId),
      getRewarders(poolLength.toNumber(), chainId),
      getTokens(
        rewarderInfos.map((rewarder) => rewarder?.rewardToken),
        chainId
      ),
    ])

    const [pairs, lpBalances] = await Promise.all([
      getPairs(lpTokens, chainId),
      getTokenBalancesOf(lpTokens, MINICHEF_ADDRESS[chainId] as Address, chainId),
    ])

    const pools = [...Array(poolLength.toNumber())].map((_, i) => ({
      id: i,
      poolInfo: poolInfos[i],
      lpBalance: lpBalances.find(({ token }) => token === lpTokens[i])?.balance,
      pair: pairs.find((pair) => pair.id === lpTokens?.[i]?.toLowerCase()),
      rewarder: rewarderInfos.find((rewarderInfo) => rewarderInfo.id === rewarders?.[i]?.toLowerCase()),
    }))

    return {
      chainId,
      farms: pools.reduce<Record<string, Farm>>((acc, pool) => {
        // console.log('this', pool.pair, pool.lpBalance)

        if (!pool.pair || typeof pool.lpBalance !== 'number' || !pool.poolInfo) return acc

        const sushiRewardPerDay = sushiPerDay * (pool.poolInfo.allocPoint.toNumber() / totalAllocPoint.toNumber())
        const sushiRewardPerYearUSD = daysInYear * sushiRewardPerDay * sushiPriceUSD

        const stakedLiquidityUSD = (pool.pair.liquidityUSD * pool.lpBalance) / pool.pair.totalSupply

        const incentives: Farm['incentives'] = []

        if (!isNaN(sushiRewardPerDay)) {
          incentives.push({
            apr: sushiRewardPerYearUSD / stakedLiquidityUSD,
            rewardPerDay: sushiRewardPerDay,
            rewardToken: {
              address: SUSHI[chainId as keyof typeof SUSHI]?.address ?? '',
              name: SUSHI[chainId as keyof typeof SUSHI]?.name ?? '',
              decimals: SUSHI[chainId as keyof typeof SUSHI]?.decimals ?? 18,
              symbol: SUSHI[chainId as keyof typeof SUSHI]?.symbol ?? '',
            },
            rewarder: {
              address: MINICHEF_ADDRESS[chainId] as Address,
              type: 'Primary',
            },
          })
        }

        if (pool.rewarder) {
          const token = tokens.find((token) => token.id === pool.rewarder?.rewardToken)

          if (token) {
            let rewardPerSecond = 0
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

            if (!isNaN(rewardPerSecond)) {
              const rewardPerDay = secondsInDay * rewardPerSecond
              const rewardPerYearUSD = daysInYear * rewardPerDay * token.derivedUSD

              incentives.push({
                apr: rewardPerYearUSD / stakedLiquidityUSD,
                rewardPerDay: rewardPerDay,
                rewardToken: {
                  address: pool.rewarder.rewardToken,
                  name: token.name,
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
    return { chainId, farms: null }
  }
}
