import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request'
import {
  ChainId,
  ChefType,
  RewarderType,
  SushiSwapProtocol,
  withoutScientificNotation,
  type PoolBase,
  type PoolHistory1D,
  type PoolV2,
  type PoolWithAprs,
  type PoolWithBuckets,
  type PoolWithIncentives,
} from 'sushi'
import { isSushiSwapV2ChainId, isSushiSwapV3ChainId } from 'sushi/config'
import type { Address } from 'viem'
import { graphql } from '../../graphql'
export const PoolQuery = graphql(
  `
    query Pool($address: String!, $chainId: Int!, $protocol: String!) {
      pool(address: $address, chainId: $chainId, protocol: $protocol) {
        id
        chainId
        name
        address
        createdAt
        swapFee
        protocol
        token0 {
          id
          address
          name
          symbol
          decimals
        }
        token1 {
          id
          address
          name
          symbol
          decimals
        }
        source
        reserve0
        reserve1
        liquidity
        volumeUSD
        liquidityUSD
        token0Price
        token1Price
        volumeUSD1d
        feeUSD1d
        txCount1d
        feeApr1d
        totalApr1d
        volumeUSD1dChange
        feeUSD1dChange
        txCount1dChange
        liquidityUSD1dChange
        incentiveApr
        hadSmartPool
        hasSmartPool
        isIncentivized
        wasIncentivized
        incentives {
          id
          chainId
          chefType
          apr
          rewardToken {
            id
            address
            name
            symbol
            decimals
          }
          rewardPerDay
          poolAddress
          pid
          rewarderAddress
          rewarderType
        }
        vaults
        hourBuckets {
          id
          date
          volumeUSD
          liquidityUSD
          txCount
          feesUSD
        }
        dayBuckets {
          id
          date
          volumeUSD
          liquidityUSD
          txCount
          feesUSD
        }
      }
    }
`,
)

export type GetPool = VariablesOf<typeof PoolQuery>

export async function getPool(variables: GetPool, options?: RequestOptions) {
  const url = `https://data-api-production-acb1.up.railway.app/graphql/`
  const chainId = Number(variables.chainId) as ChainId

  if (!isSushiSwapV2ChainId(chainId) && !isSushiSwapV3ChainId(chainId)) {
    throw new Error('Invalid chainId')
  }

  const result = await request({ url, document: PoolQuery, variables }, options)
  if (result.pool) {
    const pool = result.pool
    if (result.pool.protocol === SushiSwapProtocol.SUSHISWAP_V2) {
      return {
        id: pool.id as `${string}:0x${string}`,
        address: pool.address as Address,
        chainId,
        name: `${pool.token0.symbol}-${pool.token1.symbol}`,
        swapFee: pool.swapFee,
        protocol: SushiSwapProtocol.SUSHISWAP_V2,
        reserve0: BigInt(
          withoutScientificNotation(
            (
              Number(pool.reserve0) *
              10 ** Number(pool.token0.decimals)
            ).toFixed(),
          )!,
        ),
        reserve1: BigInt(
          withoutScientificNotation(
            (
              Number(pool.reserve1) *
              10 ** Number(pool.token1.decimals)
            ).toFixed(),
          )!,
        ),

        liquidity: BigInt(
          withoutScientificNotation(
            (Number(pool.liquidity) * 10 ** 18).toFixed(),
          )!,
        ),
        liquidityUSD: pool.liquidityUSD,

        volumeUSD: pool.volumeUSD,
        feesUSD: pool.volumeUSD * 0.003,

        token0: {
          id: pool.token0.id as `${string}:0x${string}`,
          address: pool.token0.address as Address,
          chainId,
          decimals: pool.token0.decimals,
          name: pool.token0.name,
          symbol: pool.token0.symbol,
        },
        token1: {
          id: pool.token1.id as `${string}:0x${string}`,
          address: pool.token1.address as Address,
          chainId,
          decimals: pool.token1.decimals,
          name: pool.token1.name,
          symbol: pool.token1.symbol,
        },
        token0Price: pool.token0Price,
        token1Price: pool.token1Price,
        txCount: pool.txCount1d,

        volumeUSD1d: pool.volumeUSD1d,
        feesUSD1d: pool.feeUSD1d,
        txCount1d: pool.txCount1d,
        liquidityUSD1dChange: pool.liquidityUSD1dChange,
        volumeUSD1dChange: pool.volumeUSD1dChange,
        feesUSD1dChange: pool.feeUSD1dChange,
        txCount1dChange: pool.txCount1dChange,

        feeApr1d: pool.feeApr1d,
        totalApr1d: pool.totalApr1d,
        incentiveApr: pool.incentiveApr,
        isIncentivized: pool.isIncentivized,
        wasIncentivized: pool.wasIncentivized,

        incentives: pool.incentives.map((incentive) => ({
          id: incentive.id as `${string}:0x${string}`,
          chainId,
          chefType: incentive.chefType as ChefType,
          apr: incentive.apr,
          rewardToken: {
            id: incentive.rewardToken.id as `${string}:0x${string}`,
            address: incentive.rewardToken.address as Address,
            chainId,
            decimals: incentive.rewardToken.decimals,
            name: incentive.rewardToken.name,
            symbol: incentive.rewardToken.symbol,
          },
          rewardPerDay: incentive.rewardPerDay,
          poolAddress: incentive.poolAddress as Address,
          pid: incentive.pid,
          rewarderAddress: incentive.rewarderAddress as Address,
          rewarderType: incentive.rewarderType as RewarderType,
        })),
        poolHourData: pool.hourBuckets,
        poolDayData: pool.dayBuckets,
      } satisfies PoolWithBuckets<
        PoolWithAprs<PoolWithIncentives<PoolHistory1D<PoolV2<PoolBase>>>>
      >
    }
  }

  throw new Error('No pool found')
}

export type PoolV1 = Awaited<ReturnType<typeof getPool>>
