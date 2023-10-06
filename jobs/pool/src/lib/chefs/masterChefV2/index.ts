import { ChainId } from 'sushi/chain'
import { SUSHI } from 'sushi/currency'
import { SECONDS_BETWEEN_BLOCKS } from '@sushiswap/graph-config'
import type { Address } from '@wagmi/core'
import { daysInYear, secondsInDay } from 'date-fns'

import { MASTERCHEF_V2_ADDRESS } from '../../../config.js'
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
  getSushiPerBlock,
  getTotalAllocPoint,
} from './fetchers.js'

export async function getMasterChefV2(): Promise<ChefReturn> {
  const [
    poolLength,
    totalAllocPoint,
    sushiPerBlock,
    rewarderInfos,
    averageBlockTime,
  ] = await Promise.all([
    getPoolLength(),
    getTotalAllocPoint(),
    getSushiPerBlock(),
    getRewarderInfos(),
    SECONDS_BETWEEN_BLOCKS[ChainId.ETHEREUM],
  ])

  console.log(
    `MasterChefV2 - pools: ${poolLength}, sushiPerBlock: ${sushiPerBlock}, averageBlockTime: ${averageBlockTime}, rewarderInfos: ${rewarderInfos.length}, totalAllocPoint: ${totalAllocPoint}`,
  )

  const [poolInfos, lpTokens, rewarders, tokens] = await Promise.all([
    getPoolInfos(Number(poolLength)),
    getLpTokens(Number(poolLength)),
    getRewarders(Number(poolLength)),
    getTokens(
      [
        ...rewarderInfos.map((rewarder) => rewarder.rewardToken),
        SUSHI[ChainId.ETHEREUM].address,
      ],
      ChainId.ETHEREUM,
    ),
  ])

  const [pairs, lpBalances] = await Promise.all([
    getPairs(lpTokens, ChainId.ETHEREUM),
    getTokenBalancesOf(
      lpTokens,
      MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM] as Address,
      ChainId.ETHEREUM,
    ),
  ])

  const pools = [...Array(Number(poolLength)).keys()].map((_, i) => ({
    id: i,
    poolInfo: poolInfos[i],
    lpBalance: lpBalances.find(({ token }) => token === lpTokens[i])?.balance,
    pair: pairs.find((pair) => pair.id === lpTokens?.[i]?.toLowerCase()),
    rewarder: rewarderInfos.find(
      (rewarderInfo) => rewarderInfo.id === rewarders?.[i]?.toLowerCase(),
    ),
  }))

  const blocksPerDay = averageBlockTime ? secondsInDay / averageBlockTime : 0
  const sushiPerDay =
    divBigIntToNumber(sushiPerBlock, SUSHI[ChainId.ETHEREUM].decimals) *
    blocksPerDay
  const sushiPriceUSD =
    tokens.find(
      (tokenPrice) =>
        tokenPrice.id === SUSHI[ChainId.ETHEREUM].address.toLowerCase(),
    )?.derivedUSD ?? 0

  return {
    chainId: ChainId.ETHEREUM,
    farms: pools.reduce<Record<string, Farm>>((acc, pool) => {
      if (!pool.pair || !pool.lpBalance || !pool.poolInfo) return acc

      const sushiRewardPerDay =
        sushiPerDay *
        (Number(pool.poolInfo.allocPoint) / Number(totalAllocPoint))
      const sushiRewardPerYearUSD =
        daysInYear * sushiRewardPerDay * sushiPriceUSD

      const stakedLiquidityUSD =
        (pool.pair.liquidityUSD * pool.lpBalance) / pool.pair.totalSupply

      const incentives: Farm['incentives'] = [
        {
          apr: sushiRewardPerYearUSD / stakedLiquidityUSD,
          rewardPerDay: sushiRewardPerDay,
          rewardToken: {
            address: SUSHI[ChainId.ETHEREUM].address,
            name: SUSHI[ChainId.ETHEREUM].name ?? '',
            decimals: SUSHI[ChainId.ETHEREUM].decimals ?? 18,
            symbol: SUSHI[ChainId.ETHEREUM].symbol ?? '',
          },
          rewarder: {
            address: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM] as Address,
            type: 'Primary',
          },
        },
      ]

      if (pool.rewarder) {
        const token = tokens.find(
          (token) => token.id === pool.rewarder?.rewardToken,
        )
        if (token) {
          let rewardPerSecond = 0

          switch (pool.rewarder.id.toLowerCase()) {
            case '0x0000000000000000000000000000000000000000': {
              break
            }
            // LIDO rewarder (rewards have ended)
            case '0x75ff3dd673ef9fc459a52e1054db5df2a1101212': {
              break
            }
            // ALCX rewarder (second on subgraph = block irl)
            case '0xd101479ce045b903ae14ec6afa7a11171afb5dfa':
            case '0x7519c93fc5073e15d89131fd38118d73a72370f8': {
              rewardPerSecond = divBigIntToNumber(
                pool.rewarder.rewardPerSecond / 12n,
                token.decimals,
              )
              break
            }
            // Convex rewarder (rewards have ended)
            case '0x9e01aac4b3e8781a85b21d9d9f848e72af77b362':
            case '0x1fd97b5e5a257b0b9b9a42a96bb8870cbdd1eb79': {
              break
            }
            default: {
              rewardPerSecond = divBigIntToNumber(
                pool.rewarder.rewardPerSecond,
                token.decimals,
              )
            }
          }

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

      acc[pool.pair.id] = {
        id: pool.id,
        incentives: incentives,
        chefType: 'MasterChefV2',
        poolType: pool.pair.type,
      }

      return acc
    }, {}),
  }
}
