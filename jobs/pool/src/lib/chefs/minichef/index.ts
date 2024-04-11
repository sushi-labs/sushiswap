import type { SushiSwapChainId, TridentChainId } from '@sushiswap/graph-config'
import { daysInYear, secondsInDay } from 'date-fns'
import { ChainId } from 'sushi/chain'
import { SUSHI, SUSHI_ADDRESS } from 'sushi/currency'

import { MINICHEF_ADDRESS } from '../../../config.js'
import {
  divBigIntToNumber,
  getPairs,
  getTokenBalancesOf,
  getTokens,
} from '../../common/index.js'
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
export async function getMinichef(
  chainId: SushiSwapChainId | TridentChainId,
): Promise<ChefReturn> {
  try {
    if (!(chainId in SUSHI)) {
      return { chainId, farms: null }
    }

    const [
      poolLength,
      totalAllocPoint,
      sushiPerSecond,
      rewarderInfos,
      [{ derivedUSD: sushiPriceUSD }],
    ] = await Promise.all([
      getPoolLength(chainId),
      getTotalAllocPoint(chainId),
      getSushiPerSecond(chainId),
      getRewarderInfos(chainId),
      getTokens([SUSHI_ADDRESS[ChainId.ETHEREUM]], ChainId.ETHEREUM),
    ])
    const sushiPerDay =
      secondsInDay *
      divBigIntToNumber(
        sushiPerSecond,
        SUSHI[chainId as keyof typeof SUSHI]?.decimals ?? 18,
      )

    console.log(
      `MiniChef ${chainId} - pools: ${poolLength}, sushiPerDay: ${sushiPerDay}, rewarderInfos: ${rewarderInfos.length}, totalAllocPoint: ${totalAllocPoint}`,
    )

    const [poolInfos, lpTokens, rewarders, tokens] = await Promise.all([
      getPoolInfos(poolLength, chainId),
      getLpTokens(poolLength, chainId),
      getRewarders(poolLength, chainId),
      getTokens(
        rewarderInfos.map((rewarder) => rewarder?.rewardToken),
        chainId,
      ),
    ])

    const [pairs, lpBalances] = await Promise.all([
      getPairs(lpTokens.filter(Boolean) as string[], chainId),
      getTokenBalancesOf(
        lpTokens.filter(Boolean) as string[],
        MINICHEF_ADDRESS[chainId],
        chainId,
      ),
    ])

    const pools = [...Array(Number(poolLength))].map((_, i) => {
      return {
        id: i,
        poolInfo: poolInfos[i],
        lpBalance: lpBalances.find(({ token }) => token === lpTokens[i])
          ?.balance,
        pair: pairs.find((pair) => pair.id === lpTokens?.[i]?.toLowerCase()),
        rewarder: rewarderInfos.find(
          (rewarderInfo) => rewarderInfo.id === rewarders?.[i]?.toLowerCase(),
        ),
      }
    })

    return {
      chainId,
      farms: pools.reduce<Record<string, Farm>>((acc, pool) => {
        if (!pool.pair || typeof pool.lpBalance !== 'number' || !pool.poolInfo)
          return acc

        let sushiRewardPerDay =
          sushiPerDay *
          (Number(pool.poolInfo.allocPoint) / Number(totalAllocPoint))

        // Edge case for virtually disabled rewards
        if (sushiRewardPerDay < 0.000001) sushiRewardPerDay = NaN

        const sushiRewardPerYearUSD =
          daysInYear * sushiRewardPerDay * sushiPriceUSD

        const stakedLiquidityUSD =
          (pool.pair.liquidityUSD * pool.lpBalance) / pool.pair.totalSupply

        const incentives: Farm['incentives'] = []

        if (!Number.isNaN(sushiRewardPerDay)) {
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
              address: MINICHEF_ADDRESS[chainId],
              type: 'Primary',
            },
          })
        }

        if (pool.rewarder) {
          const token = tokens.find(
            (token) => token.id === pool.rewarder?.rewardToken,
          )

          if (token) {
            let rewardPerSecond = 0
            // Multipool rewarder
            if (pool.rewarder.pools) {
              const poolInfo = pool.rewarder.pools.find(
                (rewaderPool) => rewaderPool.id === pool.id,
              )

              if (poolInfo) {
                // poolInfo.allocPoint.div(masterChefV2.totalAllocPoint).times(masterChefV2.sushiPerDay)
                rewardPerSecond =
                  (poolInfo.allocPoint /
                    Number(pool.rewarder.totalAllocPoint)) *
                  divBigIntToNumber(
                    pool.rewarder.rewardPerSecond,
                    token.decimals,
                  )
              }

              // Singlepool rewarder
            } else {
              rewardPerSecond = divBigIntToNumber(
                pool.rewarder.rewardPerSecond,
                token.decimals,
              )
            }

            // Edge case for virtually disabled rewards
            if (rewardPerSecond < 0.000001) sushiRewardPerDay = NaN

            if (!Number.isNaN(rewardPerSecond)) {
              const rewardPerDay = secondsInDay * rewardPerSecond
              const rewardPerYearUSD =
                daysInYear * rewardPerDay * token.derivedUSD

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
